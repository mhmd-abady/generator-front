import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMeters, createMeter, type CreateMeterDto } from "../api/meters";

export function useMeters() {
  const qc = useQueryClient();

  const metersQuery = useQuery({
    queryKey: ["meters"],
    queryFn: fetchMeters,
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
