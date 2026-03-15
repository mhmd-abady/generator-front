import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
  type CreateExpenseDto,
  type Expense,
  type UpdateExpenseDto,
} from "../api/expenses";

export function useExpenses() {
  const qc = useQueryClient();

  const listQuery = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateExpenseDto) => createExpense(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateExpenseDto }) =>
      updateExpense(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  return {
    rows: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    createExpense: createMutation,
    updateExpense: updateMutation,
    deleteExpense: deleteMutation,
  };
}
