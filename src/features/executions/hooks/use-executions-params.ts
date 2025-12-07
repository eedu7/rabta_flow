import { useQueryStates } from "nuqs";
import { executionsParams } from "@/features/executions/params";

export function useExecutionsParams() {
    return useQueryStates(executionsParams);
}
