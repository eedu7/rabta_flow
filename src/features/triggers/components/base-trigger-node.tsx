"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    // status?: NodeStatus;
    onSettings?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
    ({ id, icon: Icon, name, description, children, onSettings, onDoubleClick }: BaseTriggerNodeProps) => {
        // TODO: Add delete
        const handleOnDelete = () => {};
        return (
            <WorkflowNode description={description} name={name} onDelete={handleOnDelete} onSettings={onSettings}>
                {/* TODO: Wrap within NodeStatusIndicator */}
                <BaseNode className="rounded-l-2xl relative group" onDoubleClick={onDoubleClick}>
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
            </WorkflowNode>
        );
    },
);

BaseTriggerNode.displayName = "BaseTriggerNode";
