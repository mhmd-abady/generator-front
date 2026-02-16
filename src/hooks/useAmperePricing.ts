import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AmperePricing,
  createAmperePricing,
  deleteAmperePricing,
  fetchAmperePricing,
  updateAmperePricing,
} from "../api/ampere-pricing";

export function useAmperePricing(activeOnly?: boolean) {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["ampere-pricing", activeOnly ?? false],
    queryFn: () => fetchAmperePricing({ activeOnly }),
  });

  const createMutation = useMutation({
    mutationFn: createAmperePricing,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ampere-pricing"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Pick<AmperePricing, "ampere" | "price" | "isActive">>;
    }) =>
      updateAmperePricing(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ampere-pricing"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAmperePricing,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ampere-pricing"] }),
  });

  return {
    rows: listQuery.data,
    isLoading: listQuery.isLoading,
    createAmperePricing: createMutation,
    updateAmperePricing: updateMutation,
    deleteAmperePricing: deleteMutation,
  };
}
