import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBoxesByNeighborhood,
  createBox,
  updateBox,
  deleteBox,
} from "../api/boxes";

export function useBoxes(neighborhoodId?: number) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["boxes", neighborhoodId],
    queryFn: () => fetchBoxesByNeighborhood(neighborhoodId!),
    enabled: !!neighborhoodId,
  });

  return {
    boxes: query.data ?? [],
    isLoading: query.isLoading,

    createBox: useMutation({
      mutationFn: createBox,
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ["boxes", neighborhoodId] }),
    }),

    updateBox: useMutation({
      mutationFn: ({ id, dto }: any) => updateBox(id, dto),
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ["boxes", neighborhoodId] }),
    }),

    deleteBox: useMutation({
      mutationFn: deleteBox,
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ["boxes", neighborhoodId] }),
    }),
  };
}
