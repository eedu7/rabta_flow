"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import type React from "react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma";

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodees: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger manually",
        description: "Runs the flow on clicking a button. Good for getting started quickly",
        icon: MousePointerIcon,
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form",
        description: "Runs the flow when a Google Form is submitted",
        icon: "/logos/googleform.svg",
    },
    {
        type: NodeType.STRIPE_TRIGGER,
        label: "Stripe Event",
        description: "Runs the flow when a Stripe Event is captured",
        icon: "/logos/stripe.svg",
    },
];

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Makes an HTTP request",
        icon: GlobeIcon,
    },
];
interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const NodeSelector = ({ children, onOpenChange, open }: NodeSelectorProps) => {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback(
        (selection: NodeTypeOption) => {
            // Check if typing to add a manual trigger when one already exists
            if (selection.type === NodeType.MANUAL_TRIGGER) {
                const nodes = getNodes();
                const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);

                if (hasManualTrigger) {
                    toast.error("Only one manual trigger is allowed per workflow");
                    return;
                }
            }

            setNodes((nodes) => {
                const hasInitialTrigger = nodes.some((node) => node.type === NodeType.INITIAL);
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                const flowPosition = screenToFlowPosition({
                    x: centerX + (Math.random() - 0.5) * 200,
                    y: centerY,
                });

                const newNode = {
                    id: createId(),
                    data: {},
                    position: flowPosition,
                    type: selection.type,
                };

                if (hasInitialTrigger) {
                    return [newNode];
                }
                return [...nodes, newNode];
            });
            onOpenChange(false);
        },
        [setNodes, getNodes, onOpenChange, screenToFlowPosition],
    );
    return (
        <Sheet onOpenChange={onOpenChange} open={open}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>What triggers this workflow?</SheetTitle>
                    <SheetDescription>A trigger is a step that starts your workflow.</SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodees.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <button
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary "
                                key={nodeType.type}
                                onClick={() => handleNodeSelect(nodeType)}
                                type="button"
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img
                                            alt={nodeType.label}
                                            className="size-5 object-contain rounded-sm"
                                            src={Icon}
                                        />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">{nodeType.label}</span>
                                        <span className="text-xs text-muted-foreground">{nodeType.description}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
                <Separator />
                <div>
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <button
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary "
                                key={nodeType.type}
                                onClick={() => handleNodeSelect(nodeType)}
                                type="button"
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img
                                            alt={nodeType.label}
                                            className="size-5 object-contain rounded-sm"
                                            src={Icon}
                                        />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">{nodeType.label}</span>
                                        <span className="text-xs text-muted-foreground">{nodeType.description}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
};
