"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { fetchOpenAiRealtimeToken } from "@/features/executions/components/openai/actions";
import { AVAILABLE_MODELS, OpenAiDialog, OpenAiFormValues } from "@/features/executions/components/openai/dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { BaseExecutionNode } from "../base-execution-node";

type OpenAiNodeData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
    const [open, onOpenChange] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken,
    });

    const handleSubmit = (values: OpenAiFormValues) => {
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
            <OpenAiDialog defaultValues={nodeData} onOpenChange={onOpenChange} onSubmit={handleSubmit} open={open} />
            <BaseExecutionNode
                {...props}
                description={description}
                icon="/logos/openai.svg"
                id={props.id}
                name="OpenAI"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});

OpenAiNode.displayName = "OpenAiNode";
