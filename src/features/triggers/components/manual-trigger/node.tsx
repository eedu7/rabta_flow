"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { fetchManualTriggerRealtimeToken } from "@/features/triggers/components/manual-trigger/actions";
import { ManualTriggerDialog } from "@/features/triggers/components/manual-trigger/dialog";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [open, onOpenChange] = useState(false);

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: MANUAL_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchManualTriggerRealtimeToken,
    });

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
