import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CredentialView } from "@/features/credentials/components/credential";
import { CredentialError, CredentialLoading } from "@/features/credentials/components/credentials";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
    params: Promise<{
        credentialId: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    await requireAuth();

    const { credentialId } = await params;

    prefetchCredential(credentialId);

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-3xl w-full flex flex-col gapy-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<CredentialError />}>
                        <Suspense fallback={<CredentialLoading />}>
                            <CredentialView credentialId={credentialId} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>
    );
}
