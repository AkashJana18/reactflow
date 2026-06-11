import { useQuery } from "@tanstack/react-query";
import { getApps } from "@/mocks/api";

export function useApps(simulateApiError: boolean) {
  return useQuery({
    queryKey: ["apps", { simulateApiError }],
    queryFn: () => getApps({ fail: simulateApiError }),
  });
}
