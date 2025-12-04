"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { fetchDiscordRealtimeToken } from "@/features/executions/components/discord/actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscorddDialog, type DiscordFormValues } from "./dialog";

type DiscordNodeData = {
    webhookUrl?: string;
    content?: string;
    username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
    const [open, onOpenChange] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken,
    });

    const handleSubmit = (values: DiscordFormValues) => {
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
    const description = nodeData.content ? `Send: ${nodeData.content.slice(0, 50)}...` : "Not configured";
    const handleOpenSettings = () => onOpenChange(true);

    return (
        <>
            <DiscorddDialog defaultValues={nodeData} onOpenChange={onOpenChange} onSubmit={handleSubmit} open={open} />
            <BaseExecutionNode
                {...props}
                description={description}
                icon="/logos/discord.svg"
                id={props.id}
                name="Discord"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});

DiscordNode.displayName = "DiscordNode";
