"use client";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import {
    EmptyView,
    EntityContainer,
    EntityHeader,
    EntityItem,
    EntityList,
    EntityPagination,
    EntitySearch,
    ErrorView,
    LoadingView,
} from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import type { Workflow } from "@/generated/prisma";
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

    return (
        <EntityList
            emptyView={<WorkflowsEmpty />}
            getKey={(workflow) => workflow.id}
            items={workflows.data.items}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
        />
    );
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

export function WorkflowsLoading() {
    return <LoadingView message="Loading workflows" />;
}

export function WorkflowsError() {
    return <ErrorView message="Error loading workflows" />;
}

export function WorkflowsEmpty() {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();

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
            {modal}
            <EmptyView
                message="You haven't created any workflows yet. Get started by creating your first workflow"
                onNew={handleCreate}
            />
        </>
    );
}

export function WorkflowItem({ data }: { data: Workflow }) {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({
            id: data.id,
        });
    };

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            isRemoving={removeWorkflow.isPending}
            onRemove={handleRemove}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })} &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            title={data.name}
        />
    );
}
