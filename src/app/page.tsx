"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LogoutButton from "@/app/logout-button";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

export default function Home() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data } = useQuery(trpc.getWorkflows.queryOptions());

    const testAi = useMutation(
        trpc.testAi.mutationOptions({
            onSuccess: () => {
                toast.success("AI job queued.");
            },
            onMutate: () => {
                toast.success("AI job queued.");
            },
        }),
    );

    const create = useMutation(
        trpc.createWorkflow.mutationOptions({
            onSuccess: () => {
                toast.success("Job queued.");
            },
        }),
    );

    return (
        <div className="h-screen max-w-7xl mx-auto flex justify-center items-center">
            <div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <div className="space-x-2">
                    <Button disabled={create.isPending} onClick={() => create.mutate()}>
                        Create Workflow
                    </Button>
                    <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
                        Test AI
                    </Button>
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}
