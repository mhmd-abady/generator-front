import { useQuery } from "@tanstack/react-query";
import { fetchSubscriberStatement } from "../api/statements";

export function useSubscriberStatement(
  subscriberId: number,
  filters: { from?: string; to?: string }
) {
  return useQuery({
    queryKey: ["subscriber-statement", subscriberId, filters],
    queryFn: () => fetchSubscriberStatement(subscriberId, filters),
    enabled: !!subscriberId,
  });
}
