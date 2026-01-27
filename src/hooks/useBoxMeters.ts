import { useQuery } from "@tanstack/react-query";
import { fetchMetersByBox } from "../api/meters";

export function useBoxMeters(boxId?: number) {
  return useQuery({
    queryKey: ["box-meters", boxId],
    queryFn: () => fetchMetersByBox(boxId!),
    enabled: !!boxId,
  });
}
