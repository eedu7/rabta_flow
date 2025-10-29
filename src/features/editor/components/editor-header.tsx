"use client";

import { useAtomValue } from "jotai";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { editorAtom } from "@/features/editor/store/atoms";
import {
    useSuspenseWorkflow,
    useUpdateWorkflow,
    useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";

export function EditorSaveButton({ workflowId }: { workflowId: string }) {
    const editor = useAtomValue(editorAtom);
    const saveWorkflow = useUpdateWorkflow();

    const handleSave = () => {
        if (!editor) return;

        const nodes = editor.getNodes();
        const edges = editor.getEdges();

        saveWorkflow.mutate({
            id: workflowId,
            nodes,
            edges,
        });
    };
    return (
        <div className="ml-auto">
            <Button disabled={saveWorkflow.isPending} onClick={handleSave} size="sm">
                <SaveIcon className="size-4" /> Save
            </Button>
        </div>
    );
}
export function EditorNameInput({ workflowId }: { workflowId: string }) {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const updateWorkflow = useUpdateWorkflowName();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(workflow.name);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (workflow.name) {
            setName(workflow.name);
        }
    }, [workflow.name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (name === workflow.name) {
            setIsEditing(false);
            return;
        }

        try {
            await updateWorkflow.mutateAsync({
                id: workflowId,
                name,
            });
        } catch {
            setName(workflow.name);
        } finally {
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setName(workflow.name);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <Input
                className="h-7 w-auto min-w-[100px] px-2"
                disabled={updateWorkflow.isPending}
                onBlur={handleSave}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                value={name}
            />
        );
    }

    return (
        <BreadcrumbItem
            className="cursor-pointer hover:text-foreground transition-colors"
            onClick={() => setIsEditing(true)}
        >
            {workflow.name}
        </BreadcrumbItem>
    );
}

export function EditorBreadcrumbs({ workflowId }: { workflowId: string }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/workflows" prefetch>
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export function EditorHeader({ workflowId }: { workflowId: string }) {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    );
}
