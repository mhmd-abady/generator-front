// src/hooks/useCollectorTasks.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchCollectorTasks,
  type CollectorNeighborhoodTask,
  type CollectorTasksFilters,
} from "../api/collectors";

export function useCollectorTasks(params: CollectorTasksFilters) {
  const query = useQuery<CollectorNeighborhoodTask[]>({
    queryKey: ["collector-tasks", params],
    queryFn: () => fetchCollectorTasks(params),
    enabled: Boolean(params.month && params.year),
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
