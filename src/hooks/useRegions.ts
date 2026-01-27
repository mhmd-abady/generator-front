import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRegions,
  fetchRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  type Region,
} from "../api/locations";

/* =========================
   LIST REGIONS
========================= */

export function useRegions() {
  const qc = useQueryClient();

  const list = useQuery<Region[]>({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const create = useMutation({
    mutationFn: (payload: { name: string }) => createRegion(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["regions"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string } }) =>
      updateRegion(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["regions"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteRegion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["regions"] });
    },
  });

  return {
    regions: list.data ?? [],
    isLoading: list.isLoading,
    isError: list.isError,
    createRegion: create,
    updateRegion: update,
    deleteRegion: remove,
  };
}

/* =========================
   SINGLE REGION
========================= */

export function useRegion(id: number) {
  return useQuery<Region>({
    queryKey: ["region", id],
    queryFn: () => fetchRegionById(id),
    enabled: !!id,
  });
}
