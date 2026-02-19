// src/hooks/usePayments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPaymentsBySubscriber,
  createPayment,
  reversePayment,
  type CreatePaymentDto,
  type Payment,
  fetchAllPayments,
  type PaymentsQueryParams,
} from "../api/payments";

export function usePayments(
  subscriberId: number,
  params?: PaymentsQueryParams
) {
  const queryClient = useQueryClient();

  // LIST PAYMENTS
  const listQuery = useQuery<Payment[]>({
    queryKey: ["payments", subscriberId, params],
    queryFn: () => fetchPaymentsBySubscriber(subscriberId, params),
    enabled: !!subscriberId,
  });

  // CREATE PAYMENT
  const createMutation = useMutation({
    mutationFn: (dto: CreatePaymentDto) => createPayment(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["subscriber-statement"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  // REVERSE PAYMENT (ADMIN)
  const reverseMutation = useMutation({
    mutationFn: ({
      paymentId,
      reason,
    }: {
      paymentId: number;
      reason: string;
    }) => reversePayment(paymentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["subscriber-statement"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return {
    payments: listQuery.data,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,

    createPayment: createMutation,
    reversePayment: reverseMutation,
  };
}

export function useAllPayments(params?: PaymentsQueryParams) {
  return useQuery<Payment[]>({
    queryKey: ["payments", "all", params],
    queryFn: () => fetchAllPayments(params),
  });
}
