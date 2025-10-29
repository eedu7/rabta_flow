"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { BaseExecutionNode } from "../base-execution-node";
import { type FormSchema, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const [open, onOpenChange] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeData = props.data;
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not configured";
    const handleOpenSettings = () => onOpenChange(true);
    const nodeStatus: NodeStatus = "loading";

    const handleSubmit = (values: FormSchema) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            endpoint: values.endpoint,
                            method: values.method,
                            body: values.body,
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
                defaultBody={nodeData.body}
                defaultEndpoint={nodeData.endpoint} // TODO: check if it can be improved
                defaultMethod={nodeData.method}
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
