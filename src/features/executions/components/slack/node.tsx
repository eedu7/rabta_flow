"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { fetchSlackRealtimeToken } from "@/features/executions/components/slack/actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";
import { BaseExecutionNode } from "../base-execution-node";
import { SlackDialog, type SlackFormValues } from "./dialog";

type SlackNodeData = {
    webhookUrl?: string;
    content?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
    const [open, onOpenChange] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: SLACK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken,
    });

    const handleSubmit = (values: SlackFormValues) => {
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
            <SlackDialog defaultValues={nodeData} onOpenChange={onOpenChange} onSubmit={handleSubmit} open={open} />
            <BaseExecutionNode
                {...props}
                description={description}
                icon="/logos/slack.svg"
                id={props.id}
                name="Slack"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});

SlackNode.displayName = "SlackNode";
