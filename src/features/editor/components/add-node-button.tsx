"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false);
    return (
        <NodeSelector onOpenChange={setSelectorOpen} open={selectorOpen}>
            <Button className="bg-background" onClick={() => setSelectorOpen(true)} size="icon" variant="outline">
                <PlusIcon />
            </Button>
        </NodeSelector>
    );
});

AddNodeButton.displayName = "AddNodeButton";
