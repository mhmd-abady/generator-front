import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMeters,
  fetchMetersByFilters,
  fetchMetersByBox,
  createMeter,
  type CreateMeterDto,
} from "../api/meters";

export function useMeters(filters?: {
  neighborhoodId?: number;
  regionId?: number;
  boxId?: number;
}) {
  const qc = useQueryClient();

  const metersQuery = useQuery({
    queryKey: ["meters", filters],
    queryFn: () => {
      if (filters?.boxId) return fetchMetersByBox(filters.boxId);

      if (filters) {
        const { neighborhoodId, regionId } = filters;
        if (neighborhoodId || regionId) {
          return fetchMetersByFilters({ neighborhoodId, regionId });
        }
      }

      return fetchMeters();
    },
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateMeterDto) => createMeter(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meters"] });
      qc.invalidateQueries({ queryKey: ["subscribers"] });
    },
  });

  return {
    meters: metersQuery.data,
    isLoading: metersQuery.isLoading,
    createMeter: createMutation,
  };
}
