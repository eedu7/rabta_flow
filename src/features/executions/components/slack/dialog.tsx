"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message:
                "Variable name must start with a letter or underscore and contains only letters, numbers and underscores",
        }),
    content: z.string().min(1, "Message content is required"),
    webhookUrl: z.string().min(1, "Webhook URL is required"),
});

export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<SlackFormValues>;
}

export const SlackDialog = ({ onOpenChange, open, onSubmit, defaultValues = {} }: Props) => {
    const form = useForm<SlackFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            content: defaultValues.content || "",
            webhookUrl: defaultValues.webhookUrl || "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                content: defaultValues.content || "",
                webhookUrl: defaultValues.webhookUrl || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchedVariableName = form.watch("variableName") || "mySlack";

    const handleSubmit = (values: SlackFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the <span className="font-bold">Slack</span> webhook settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="mySlack" />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes:{" "}
                                        {`{{${watchedVariableName}.text}}`}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Webhook URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="https://hooks.slack.com/services/..." />
                                    </FormControl>
                                    <FormDescription>
                                        Get this from Slack: Channel Settings &#8594; Workflows &#8594; Webhooks
                                    </FormDescription>
                                    <FormDescription>
                                        Make sure the <span className="font-bold italic">key</span> is{" "}
                                        <span className="font-bold italic">content</span>
                                    </FormDescription>
                                    <FormDescription>
                                        Make sure you have <span className="font-bold italic">content</span> variable
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field}
                                            placeholder="Summary: {{aiResponse}}"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The message to send. Use {"{{variables}}"} for simple values or{" "}
                                        {"{{json variables}}"} to stringify objects
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
