import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveRate,
  fetchRateHistory,
  setExchangeRate,
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
