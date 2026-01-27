// src/api/invoices.ts
import { api } from "./axios";

export type Invoice = {
  id: number;
  month: number;
  year: number;
  totalDue: number;
  amountPaid: number;
  remainingBalance: number;
  status: "ISSUED" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";
  meter?: {
    number: string;
    subscriber?: {
      fullName: string;
      phone: string;
    };};
};

export const fetchInvoices = async (params: {
  subscriberId: number;
  status?: string;
}): Promise<Invoice[]> => {
  const res = await api.get("/invoices", { params });
  return res.data;
};

export const fetchAllInvoices = async (params?: {
  year?: number;
  month?: number;
  status?: string;
  subscriberId?: number;
  regionId?: number;
  neighborhoodId?: number;
}): Promise<Invoice[]> => {
  const res = await api.get("/invoices", { params });
  return res.data;
};

export type InvoiceDetails = {
  id: number;
  month: number;
  year: number;
  totalDue: number;
  amountPaid: number;
  remainingBalance: number;
  status: string;
  exchangeRate: number;

  meter: {
    number: string;
    subscriber: {
      id: number;
      fullName: string;
      phone: string;
    };
  };

  payments: {
    id: number;
    amount: number;
    paidAt: string;
    receiver?: { username: string };
  }[];
};

export const fetchInvoiceById = async (
  id: number
): Promise<InvoiceDetails> => {
  const res = await api.get(`/invoices/${id}`);
  return res.data;
};

export const getInvoicePdfUrl = (id: number) =>
  `${import.meta.env.VITE_API_URL}/invoices/${id}/pdf`;



export const addInvoiceFixes = async (
  invoiceId: number,
  payload: {
    fixesAmount: number;
    fixesNote?: string;
  }
) => {
  const res = await api.post(`/invoices/${invoiceId}/fixes`, payload);
  return res.data;
};
