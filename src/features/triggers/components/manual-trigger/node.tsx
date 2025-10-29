import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";
import { BaseTriggerNode } from "@/features/triggers/components/base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
    return (
        <>
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking 'Execute worfklow'"
                // status={nodeStatus}
                // onSettings={handleOpenSettings}
                // onDoubleClick={handleOpenSettings}
            />
        </>
    );
});
