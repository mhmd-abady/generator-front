import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBoxesByNeighborhood,
  fetchBoxesByRegion,
  createBox,
  updateBox,
  deleteBox,
} from "../api/boxes";

export function useBoxes(neighborhoodId?: number, regionId?: number) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["boxes", neighborhoodId, regionId],
    queryFn: () =>
      neighborhoodId
        ? fetchBoxesByNeighborhood(neighborhoodId)
        : fetchBoxesByRegion(regionId),
    enabled: !!neighborhoodId || !!regionId,
  });

  return {
    boxes: query.data ?? [],
    isLoading: query.isLoading,

    createBox: useMutation({
      mutationFn: createBox,
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ["boxes", neighborhoodId, regionId] }),
    }),

    updateBox: useMutation({
      mutationFn: ({ id, dto }: any) => updateBox(id, dto),
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ["boxes", neighborhoodId, regionId] }),
    }),

    deleteBox: useMutation({
      mutationFn: deleteBox,
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ["boxes", neighborhoodId, regionId] }),
    }),
  };
}
