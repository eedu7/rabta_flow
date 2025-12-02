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
import { useRemoveCredential, useSuspenseCredentials } from "@/features/credentials/hooks/use-credentials";
import { useCredentialsParams } from "@/features/credentials/hooks/use-credentials-params";
import type { Credential } from "@/generated/prisma";
import { useEntitySearch } from "@/hooks/use-entity-search";

export function WorkflowsSearch() {
    const [params, setParams] = useCredentialsParams();
    const { onSearchChange, searchValue } = useEntitySearch({
        params,
        setParams,
    });
    return <EntitySearch onChange={onSearchChange} placeholder="Search workflows" value={searchValue} />;
}

export function CredentialsList() {
    const credentials = useSuspenseCredentials();

    return (
        <EntityList
            emptyView={<CredentialEmpty />}
            getKey={(credential) => credential.id}
            items={credentials.data.items}
            renderItem={(credential) => <CredentialItem data={credential} />}
        />
    );
}

export function CredentialHeader({ disabled }: { disabled?: boolean }) {
    return (
        <EntityHeader
            description="Create and manage your credentials"
            disabled={disabled}
            newButtonHref="/credentials/new"
            title="Credentials"
        />
    );
}

export function CredentialPagination() {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams();

    return (
        <EntityPagination
            disabled={credentials.isFetching}
            onPageChange={(page) => setParams({ ...params, page })}
            page={credentials.data.page}
            totalPages={credentials.data.totalPages}
        />
    );
}

export function CredentialsContainer({ children }: { children: React.ReactNode }) {
    return (
        <EntityContainer
            header={<CredentialHeader />}
            pagination={<CredentialPagination />}
            search={<WorkflowsSearch />}
        >
            {children}
        </EntityContainer>
    );
}

export function CredentialLoading() {
    return <LoadingView message="Loading credentials..." />;
}

export function CredentialError() {
    return <ErrorView message="Error loading credentials" />;
}

export function CredentialEmpty() {
    const router = useRouter();

    const handleCreate = () => {
        router.push(`/credentials/new`);
    };
    return (
        <EmptyView
            message="You haven't created any credential yet. Get started by creating your first credential"
            onNew={handleCreate}
        />
    );
}

export function CredentialItem({ data }: { data: Credential }) {
    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({
            id: data.id,
        });
    };

    return (
        <EntityItem
            href={`/credentials/${data.id}`}
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            isRemoving={removeCredential.isPending}
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
