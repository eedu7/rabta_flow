"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { fetchGeminiRealtimeToken } from "@/features/executions/components/gemini/actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";
import { BaseExecutionNode } from "../base-execution-node";
import { AVAILABLE_MODELS, GeminiDialog, type GeminiFormValues } from "./dialog";

type GeminiNodeData = {
    variableName?: string;
    model?: "gemini-1.5-flash" | "gemini-1.5-flash-8b" | "gemini-1.5-pro" | "gemini-1.0-pro" | "gemini-pro";
    systemPrompt?: string;
    userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
    const [open, onOpenChange] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken,
    });

    const handleSubmit = (values: GeminiFormValues) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...values,
                        },
                    };
                }
                return node;
            }),
        );
    };

    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ? `${nodeData.model || AVAILABLE_MODELS[0]} : ${nodeData.userPrompt.slice(0, 50)}...`
        : "Not configured";
    const handleOpenSettings = () => onOpenChange(true);

    return (
        <>
            <GeminiDialog defaultValues={nodeData} onOpenChange={onOpenChange} onSubmit={handleSubmit} open={open} />
            <BaseExecutionNode
                {...props}
                description={description}
                icon="/logos/gemini.svg"
                id={props.id}
                name="Gemini"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});

GeminiNode.displayName = "GeminiNode";
