import { useQueryStates } from "nuqs";
import { workflowsParams } from "@/features/workflows/params";

export function useWorkflowsParams() {
    return useQueryStates(workflowsParams);
}
