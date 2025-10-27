"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

export function WorkflowsSearch() {
    const [params, setParams] = useWorkflowsParams();
    const { onSearchChange, searchValue } = useEntitySearch({
        params,
        setParams,
    });
    return <EntitySearch onChange={onSearchChange} placeholder="Search workflows" value={searchValue} />;
}

export function WorkflowsList() {
    const workflows = useSuspenseWorkflows();
    return <p>{JSON.stringify(workflows.data, null, 2)}</p>;
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

export function WorkflowsPagination() {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

    return (
        <EntityPagination
            disabled={workflows.isFetching}
            onPageChange={(page) => setParams({ ...params, page })}
            page={workflows.data.page}
            totalPages={workflows.data.totalPages}
        />
    );
}

export function WorkflowsContainer({ children }: { children: React.ReactNode }) {
    return (
        <EntityContainer header={<WorkflowsHeader />} pagination={<WorkflowsPagination />} search={<WorkflowsSearch />}>
            {children}
        </EntityContainer>
    );
}
