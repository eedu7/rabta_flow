"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    status?: NodeStatus;
    onSettings?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
    ({
        id,
        icon: Icon,
        name,
        description,
        children,
        onSettings,
        onDoubleClick,
        status = "initial",
    }: BaseTriggerNodeProps) => {
        const { setEdges, setNodes } = useReactFlow();
        const handleOnDelete = () => {
            setNodes((currentNodes) => {
                const updatedNodes = currentNodes.filter((node) => node.id !== id);
                return updatedNodes;
            });
            setEdges((currentEdges) => {
                const updatedEdges = currentEdges.filter((edge) => edge.source !== id && edge.target !== id);
                return updatedEdges;
            });
        };
        return (
            <WorkflowNode description={description} name={name} onDelete={handleOnDelete} onSettings={onSettings}>
                <NodeStatusIndicator className="rounded-l-2xl" status={status} variant="border">
                    <BaseNode className="rounded-l-2xl relative group" onDoubleClick={onDoubleClick}
                    status={status}
                    >
                        <BaseNodeContent>
                            {typeof Icon === "string" ? (
                                <Image alt={name} height={16} src={Icon} width={16} />
                            ) : (
                                <Icon className="size-4 text-muted-foreground" />
                            )}
                            {children}
                            <BaseHandle id="source-1" position={Position.Right} type="source" />
                        </BaseNodeContent>
                    </BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        );
    },
);

BaseTriggerNode.displayName = "BaseTriggerNode";
