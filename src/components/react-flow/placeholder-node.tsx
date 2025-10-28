"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { forwardRef, type ReactNode } from "react";

import { BaseNode } from "./base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
    children?: ReactNode;
    onClick?: () => void;
};

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(({ children, onClick }, ref) => {
    return (
        <BaseNode
            className="w-auto h-auto border-dashed border-gray-400 bg-card p-4 text-center text-gray-400 shadow-none cursor-pointer hover:border-gray-500 hover:bg-gray-50"
            onClick={onClick}
            ref={ref}
        >
            {children}
            <Handle isConnectable={false} position={Position.Top} style={{ visibility: "hidden" }} type="target" />
            <Handle isConnectable={false} position={Position.Bottom} style={{ visibility: "hidden" }} type="source" />
        </BaseNode>
    );
});

PlaceholderNode.displayName = "PlaceholderNode";
