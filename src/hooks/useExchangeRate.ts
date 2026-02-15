import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteExchangeRate,
  fetchActiveRate,
  fetchRateHistory,
  setExchangeRate,
  updateExchangeRate,
  type UpdateExchangeRateDto,
} from "../api/exchangeRate";

export function useActiveExchangeRate() {
  return useQuery({
    queryKey: ["exchange-rate", "active"],
    queryFn: fetchActiveRate,
  });
}

export function useExchangeRateHistory() {
  return useQuery({
    queryKey: ["exchange-rate", "history"],
    queryFn: fetchRateHistory,
  });
}

export function useSetExchangeRate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: setExchangeRate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exchange-rate"] });
    },
  });
}

export function useUpdateExchangeRate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateExchangeRateDto;
    }) => updateExchangeRate(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exchange-rate"] });
    },
  });
}

export function useDeleteExchangeRate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteExchangeRate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exchange-rate"] });
    },
  });
}
