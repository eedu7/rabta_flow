import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.credentials.getMany>;

/**
 * Prefetch all credentials
 */
export function prefetchCredentials(params: Input) {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
}

/**
 * Prefetch a single credential
 */
export function prefetchCredential(id: string) {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
}
