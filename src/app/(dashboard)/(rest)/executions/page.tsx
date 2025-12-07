import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
    ExecutionError,
    ExecutionLoading,
    ExecutionsContainer,
    ExecutionsList,
} from "@/features/executions/components/executions";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
    searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
    await requireAuth();

    const params = await executionsParamsLoader(searchParams);

    prefetchExecutions(params);

    return (
        <ExecutionsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<ExecutionError />}>
                    <Suspense fallback={<ExecutionLoading />}>
                        <ExecutionsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </ExecutionsContainer>
    );
}
