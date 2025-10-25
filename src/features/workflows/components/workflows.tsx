"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "@/features/workflows/hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

export function WorkflowsList() {
    const workflows = useSuspenseWorkflows();
    return <pre>{JSON.stringify(workflows.data, null, 2)}</pre>;
}

export function WorkflowsHeader({ disabled }: { disabled?: boolean }) {
    const router = useRouter();

    const createWorkflow = useCreateWorkflow();

    const { handleError, modal: UpgradeModal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            },
        });
    };

    return (
        <>
            {UpgradeModal}
            <EntityHeader
                description="Create and manage your workflows"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
                newButtonLabel="New workflow"
                onNew={handleCreate}
                title="Workflows"
            />
        </>
    );
}

export function WorkflowsContainer({ children }: { children: React.ReactNode }) {
    return (
        <EntityContainer header={<WorkflowsHeader />} pagination={<></>} search={<></>}>
            {children}
        </EntityContainer>
    );
}
