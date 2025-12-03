import { credentialsParams } from "@/features/credentials/params";
import { useQueryStates } from "nuqs";

export function useCredentialsParams() {
  return useQueryStates(credentialsParams);
}
