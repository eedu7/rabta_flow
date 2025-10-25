import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { UpgradeModal } from "@/components/upgrade-modal";

export function useUpgradeModal() {
    const [open, setOpen] = useState(false);

    const handleError = (error: unknown) => {
        if (error instanceof TRPCClientError) {
            if (error.data?.code === "FORBIDDEN") {
                setOpen(true);
                return true;
            }
        }
        return false;
    };

    const modal = <UpgradeModal onOpenChange={setOpen} open={open} />;

    return {
        handleError,
        modal,
    };
}
