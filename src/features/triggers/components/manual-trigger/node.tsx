"use client";
import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { ManualTriggerDialog } from "@/features/triggers/components/manual-trigger/dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [open, onOpenChange] = useState(false);

    const nodeStatus: NodeStatus = "success";

    const handleOpenSettings = () => onOpenChange(true);
    return (
        <>
            <ManualTriggerDialog onOpenChange={onOpenChange} open={open} />
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking 'Execute worfklow'"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});
