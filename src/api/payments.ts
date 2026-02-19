// src/api/payments.ts
import { api } from "./axios";

export type Payment = {
  id: number;
  amount: number;
  paidAt: string;

  isReversed: boolean;
  reversedAt?: string;

  subscriberId: number;
  invoiceId?: number;

  subscriber?: {
    id: number;
    fullName: string;
    phone?: string;
  };

  receiverType: "COLLECTOR" | "EMPLOYEE" | "OWNER";
  receiver: {
    id: number;
    username: string;
    role: string;
  };

  invoice?: {
    id: number;
    month: number;
    year: number;
    totalDue: number;
    remainingBalance: number;
    status: string;
  };
};

export type CreatePaymentDto = {
  amount: number;
  subscriberId: number;
  invoiceId?: number;
  receiverType: "COLLECTOR" | "EMPLOYEE" | "OWNER";
  receiverId: number;
};

export type PaymentsQueryParams = {
  from?: string;
  to?: string;
};

/*
 * POST /payments
 */
export const createPayment = async (dto: CreatePaymentDto) => {
  const res = await api.post("/payments", dto);
  return res.data;
};

/*
 * GET /payments/by-subscriber/:subscriberId
 */
export const fetchPaymentsBySubscriber = async (
  subscriberId: number,
  params?: PaymentsQueryParams
): Promise<Payment[]> => {
  const res = await api.get(
    `/payments/by-subscriber/${subscriberId}`,
    { params }
  );
  return res.data;
};

/*
 * POST /payments/:id/reverse
 */
export const reversePayment = async (
  paymentId: number,
  reason: string
) => {
  const res = await api.post(
    `/payments/${paymentId}/reverse`,
    { reason }
  );
  return res.data;
};

export const fetchAllPayments = async (
  params?: PaymentsQueryParams
): Promise<Payment[]> => {
  const res = await api.get("/payments", { params });
  return res.data;
};
