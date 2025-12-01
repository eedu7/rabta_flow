"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { fetchAnthropicRealtimeToken } from "@/features/executions/components/anthropic/actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";
import { BaseExecutionNode } from "../base-execution-node";
import { AnthropicDialog, type AnthropicFormValues, AVAILABLE_MODELS } from "./dialog";

type AnthropicNodeData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
    const [open, onOpenChange] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: ANTHROPIC_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchAnthropicRealtimeToken,
    });

    const handleSubmit = (values: AnthropicFormValues) => {
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
            <AnthropicDialog defaultValues={nodeData} onOpenChange={onOpenChange} onSubmit={handleSubmit} open={open} />
            <BaseExecutionNode
                {...props}
                description={description}
                icon="/logos/anthropic.svg"
                id={props.id}
                name="Anthropic"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});

AnthropicNode.displayName = "AnthropicNode";
