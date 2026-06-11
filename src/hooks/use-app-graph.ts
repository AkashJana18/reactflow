import { useQuery } from "@tanstack/react-query";
import { getAppGraph } from "@/mocks/api";

export function useAppGraph(
  appId: string | null,
  simulateApiError: boolean,
) {
  return useQuery({
    queryKey: ["apps", appId, "graph", { simulateApiError }],
    queryFn: () => getAppGraph(appId ?? "", { fail: simulateApiError }),
    enabled: Boolean(appId),
  });
}
