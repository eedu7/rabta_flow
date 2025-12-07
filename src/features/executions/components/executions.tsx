"use client";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import type React from "react";
import {
    EmptyView,
    EntityContainer,
    EntityHeader,
    EntityItem,
    EntityList,
    EntityPagination,
    ErrorView,
    LoadingView,
} from "@/components/entity-components";
import { useSuspenseExecutions } from "@/features/executions/hooks/use-executions";
import { useExecutionsParams } from "@/features/executions/hooks/use-executions-params";
import { type Execution, ExecutionStatus } from "@/generated/prisma";

export function ExecutionsList() {
    const executions = useSuspenseExecutions();

    return (
        <EntityList
            emptyView={<ExecutionEmpty />}
            getKey={(execution) => execution.id}
            items={executions.data.items}
            renderItem={(execution) => <ExecutionItem data={execution} />}
        />
    );
}

export function ExecutionHeader() {
    return <EntityHeader description="View your workflow execution history" title="Executions" />;
}

export function ExecutionPagination() {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();

    return (
        <EntityPagination
            disabled={executions.isFetching}
            onPageChange={(page) => setParams({ ...params, page })}
            page={executions.data.page}
            totalPages={executions.data.totalPages}
        />
    );
}

export function ExecutionsContainer({ children }: { children: React.ReactNode }) {
    return (
        <EntityContainer header={<ExecutionHeader />} pagination={<ExecutionPagination />}>
            {children}
        </EntityContainer>
    );
}

export function ExecutionLoading() {
    return <LoadingView message="Loading executions..." />;
}

export function ExecutionError() {
    return <ErrorView message="Error loading executions" />;
}

export function ExecutionEmpty() {
    return <EmptyView message="You haven't created any execution yet. Get started by running your first workflow." />;
}

const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600" />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
        default:
            return <ClockIcon className="size-5 text-muted-foreground" />;
    }
};

const formatStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
};

export function ExecutionItem({
    data,
}: {
    data: Execution & {
        workflow: {
            id: string;
            name: string;
        };
    };
}) {
    const duration =
        data.completedAt &&
        Math.round((new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000);

    const subtitle = (
        <>
            {data.workflow.name} &bull: Started {formatDistanceToNow(data.startedAt, { addSuffix: true })}
            {duration !== null && <> &bull; Took {duration}s</>}
        </>
    );
    return (
        <EntityItem
            href={`/executions/${data.id}`}
            image={<div className="size-8 flex items-center justify-center">{getStatusIcon(data.status)}</div>}
            subtitle={subtitle}
            title={formatStatus(data.status)}
        />
    );
}
