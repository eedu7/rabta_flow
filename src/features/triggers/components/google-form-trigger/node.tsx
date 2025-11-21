"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";
import { fetchGoogleFormTriggerRealtimeToken } from "@/features/triggers/components/google-form-trigger/actions";
import { GoogleFormTriggerDialog } from "@/features/triggers/components/google-form-trigger/dialog";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
    const [open, onOpenChange] = useState(false);

    const nodeStatus: NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGoogleFormTriggerRealtimeToken,
    });

    const handleOpenSettings = () => onOpenChange(true);
    return (
        <>
            <GoogleFormTriggerDialog onOpenChange={onOpenChange} open={open} />
            <BaseTriggerNode
                {...props}
                description="When form is submitted"
                icon="/logos/googleform.svg"
                name="Google Form"
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    );
});
