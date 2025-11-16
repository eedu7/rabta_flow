"use client";

import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateGoogleFormScript } from "@/features/triggers/components/google-form-trigger/utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ onOpenChange, open }: Props) => {
    const params = useParams();
    const workflowId = params.workflowId as string;

    // Construct the webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");
        } catch {
            toast.error("Failed to copy URL");
        }
    };

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form's Apps script to trigger this workflow when a form is
                        submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input className="font-mono text-sm" id="webhook-url" readOnly value={webhookUrl} />
                            <Button onClick={copyToClipboard} size="icon" type="button" variant="outline">
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup instructions</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Open your Google Form</li>
                            <li>Click the three dots menu &#8594; Apps Script</li>
                            <li>Copy and paste the script below</li>
                            <li>Replace WEBHOOK_URL with your webhook URL above</li>
                            <li>Save and click "Trigger"s &#8594; Add Trigger</li>
                            <li>Choose. From form &#8594; On form submit &#8594; Save</li>
                        </ol>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">Google Apps Scipt:</h4>
                        <Button
                            onClick={async () => {
                                const script = generateGoogleFormScript(webhookUrl);
                                try {
                                    await navigator.clipboard.writeText(script);
                                    toast.success("Script copied to clipboard");
                                } catch {
                                    toast.error("Failed to copy Script to clipboard");
                                }
                            }}
                            type="button"
                            variant="outline"
                        >
                            <CopyIcon className="size-4 mr-2" />
                            Copy Google Apps Script
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            This script includes your webhook URL and handles form submissions
                        </p>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Variables</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li className="bg-background px-1 py-0.5 rounded">
                                <code>{"{{googleForm.respondentEmail}}"}</code> - Respondent's email
                            </li>
                            <li className="bg-background px-1 py-0.5 rounded">
                                <code>{'{{googleForm.responses["Question Name"]}}'}</code> - Specific answer
                            </li>
                            <li className="bg-background px-1 py-0.5 rounded">
                                <code>{"{{googleForm.responses}}"}</code> - All responses as JSON
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
