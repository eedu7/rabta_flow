"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { fetchHttpRequestRealtimeToken } from "@/features/executions/components/http-request/actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channels/http-request";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestDialog, type HttpRequestFormValues } from "./dialog";

type HttpRequestNodeData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const [open, onOpenChange] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeData = props.data;
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not configured";
    const handleOpenSettings = () => onOpenChange(true);

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: HTTP_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchHttpRequestRealtimeToken,
    });

    const handleSubmit = (values: HttpRequestFormValues) => {
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

    return (
        <>
            <HttpRequestDialog
                defaultValues={nodeData}
                onOpenChange={onOpenChange}
                onSubmit={handleSubmit}
                open={open}
            />
            <BaseExecutionNode
                {...props}
                description={description}
                icon={GlobeIcon}
                id={props.id}
                name="HTTP Request"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});

HttpRequestNode.displayName = "HttpRequestNode";
