import { useQuery } from "@tanstack/react-query";
import { fetchSubscriberById } from "../api/subscribers";
import type { Subscriber } from "../api/subscribers";

export function useSubscriberDetails(id: number) {
  const query = useQuery<Subscriber>({
    queryKey: ["subscriber", id],
    queryFn: () => fetchSubscriberById(id),
    enabled: !!id,
  });

  return {
    subscriber: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
