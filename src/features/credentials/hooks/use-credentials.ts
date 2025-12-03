import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "@/features/credentials/hooks/use-credentials-params";
import type { CredentialType } from "@/generated/prisma";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to fetch all credentials using suspense
 * */
export function useSuspenseCredentials() {
    const trpc = useTRPC();
    const [params] = useCredentialsParams();

    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
}

/**
 * Hook to create a new credential
 */
export function useCreateCredential() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" created`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
            },
            onError: (error) => {
                toast.error(`Failed to create credential: ${error.message}`);
            },
        }),
    );
}

/**
 * Hook to remove a credential
 * */
export function useRemoveCredential() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryFilter({
                        id: data.id,
                    }),
                );
            },
        }),
    );
}

/**
 * Hook to fetch a single credential using suspense
 * */
export function useSuspenseCredential(id: string) {
    const trpc = useTRPC();

    return useSuspenseQuery(
        trpc.credentials.getOne.queryOptions({
            id,
        }),
    );
}

/**
 * Hook to update credential
 */
export function useUpdateCredential() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" updated`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryOptions({
                        id: data.id,
                    }),
                );
            },
            onError: (error) => {
                toast.error(`Failed to save credential: ${error.message}`);
            },
        }),
    );
}

/**
 * Hook to fetch credential by type
 */

export function useCredentialByType(type: CredentialType) {
    const trpc = useTRPC();
    return useQuery(trpc.credentials.getByType.queryOptions({ type }));
}
