import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNeighborhoods,
  fetchNeighborhoodById,
  fetchNeighborhoodsByRegion,
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
  type Neighborhood,
} from "../api/locations";

/* =========================
   LIST NEIGHBORHOODS
========================= */

export function useNeighborhoods(regionId?: number) {
  const qc = useQueryClient();

  const list = useQuery<Neighborhood[]>({
    queryKey: ["neighborhoods", regionId],
    queryFn: () =>
      regionId
        ? fetchNeighborhoodsByRegion(regionId)
        : fetchNeighborhoods(),
  });

  const create = useMutation({
    mutationFn: (payload: { name: string; regionId: number }) =>
      createNeighborhood(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["neighborhoods"], exact: false });
      qc.invalidateQueries({ queryKey: ["regions"] });
    },
  });

  const update = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; regionId?: number };
    }) => updateNeighborhood(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["neighborhoods"], exact: false });
      qc.invalidateQueries({ queryKey: ["regions"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteNeighborhood(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["neighborhoods"], exact: false });
      qc.invalidateQueries({ queryKey: ["regions"] });
    },
  });

  return {
    neighborhoods: list.data ?? [],
    isLoading: list.isLoading,
    isError: list.isError,
    createNeighborhood: create,
    updateNeighborhood: update,
    deleteNeighborhood: remove,
  };
}

/* =========================
   SINGLE NEIGHBORHOOD
========================= */

export function useNeighborhood(id: number) {
  return useQuery<Neighborhood>({
    queryKey: ["neighborhood", id],
    queryFn: () => fetchNeighborhoodById(id),
    enabled: !!id,
  });
}
