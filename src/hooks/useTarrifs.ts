import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTariffs,
  createTariff,
  updateTariff,
  deleteTariff,
} from "../api/tariffs";

export function useTariffs() {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["tariffs"],
    queryFn: fetchTariffs,
  });

  const createMutation = useMutation({
    mutationFn: createTariff,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tariffs"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateTariff(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tariffs"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTariff,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tariffs"] }),
  });

  return {
    tariffs: listQuery.data,
    isLoading: listQuery.isLoading,
    createTariff: createMutation,
    updateTariff: updateMutation,
    deleteTariff: deleteMutation,
  };
}
