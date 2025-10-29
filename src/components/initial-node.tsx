"use client";
import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { NodeSelector } from "@/components/node-selector";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { WorkflowNode } from "@/components/workflow-node";

export const InitialNode = memo((props: NodeProps) => {
    const [selectorOpen, setSelectorOpen] = useState(false);
    return (
        <NodeSelector onOpenChange={setSelectorOpen} open={selectorOpen}>
            <WorkflowNode showToolbar={false}>
                <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
                    <div className="cursor-pointer flex items-center justify-center">
                        <PlusIcon />
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    );
});

InitialNode.displayName = "InitialNode";
