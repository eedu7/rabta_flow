import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useSubscription() {
    return useQuery({
        queryKey: ["subscription"],
        queryFn: async () => {
            const { data } = await authClient.customer.state();
            return data;
        },
    });
}

export function useHasActiveSubscription() {
    const { data: customerState, isLoading, ...rest } = useSubscription();

    const hasActiveSubscription = customerState?.activeSubscriptions && customerState.activeSubscriptions.length > 0;

    return {
        hasActiveSubscription,
        subscription: customerState?.activeSubscriptions?.[0],
        isLoading,
        ...rest,
    };
}
