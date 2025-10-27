import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to fetch all workflows using suspense
 * */
export function useSuspenseWorkflows() {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

/**
 * Hook to create a new workflow
 */
export function useCreateWorkflow() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" created`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`);
            },
        }),
    );
}
