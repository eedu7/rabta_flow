"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { fetchStripeTriggerRealtimeToken } from "@/features/triggers/components/stripe-trigger/actions";
import { StripeTriggerDialog } from "@/features/triggers/components/stripe-trigger/dialog";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";

export const StripeTriggerNode = memo((props: NodeProps) => {
    const [open, onOpenChange] = useState(false);

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: STRIPE_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchStripeTriggerRealtimeToken,
    });

    const handleOpenSettings = () => onOpenChange(true);
    return (
        <>
            <StripeTriggerDialog onOpenChange={onOpenChange} open={open} />
            <BaseTriggerNode
                {...props}
                description="When stripe event is captured"
                icon="/logos/stripe.svg"
                name="STRIPE"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});
