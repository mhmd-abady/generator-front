import { api } from "./axios";

export type StatementRow = {
  date: string;
  type: "INVOICE" | "PAYMENT";
  reference: string;

  debitUsd: number;
  creditUsd: number;
  debitLbp: number;
  creditLbp: number;

  balanceUsd: number;
  balanceLbp: number;
};

export type SubscriberStatementResponse = {
  subscriber: {
    id: number;
    fullName: string;
    phone: string;
  };

  openingBalanceUsd: number;
  statement: StatementRow[];
  finalBalanceUsd: number;
  finalBalanceLbp: number;
};

export const fetchSubscriberStatement = async (
  subscriberId: number,
  params?: { from?: string; to?: string }
): Promise<SubscriberStatementResponse> => {
  const res = await api.get<SubscriberStatementResponse>(
    `/statements/subscriber/${subscriberId}`,
    { params }
  );
  return res.data;
};

export const getSubscriberStatementPdfUrl = (subscriberId: number) =>
  `${import.meta.env.VITE_API_URL}/statements/subscriber/${subscriberId}/pdf`;
