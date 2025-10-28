"use client";

import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(() => {
    return (
        <Button className="bg-background" onClick={() => {}} size="icon" variant="outline">
            <PlusIcon />
        </Button>
    );
});
