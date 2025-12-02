import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
    CredentialError,
    CredentialLoading,
    CredentialsContainer,
    CredentialsList,
} from "@/features/credentials/components/credentials";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
    searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
    await requireAuth();

    const params = await credentialsParamsLoader(searchParams);

    prefetchCredentials(params);

    return (
        <CredentialsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<CredentialError />}>
                    <Suspense fallback={<CredentialLoading />}>
                    
                        <CredentialsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </CredentialsContainer>
    );
}
