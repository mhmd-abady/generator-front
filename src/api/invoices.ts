// src/api/invoices.ts
import { api } from "./axios";

export type Invoice = {
  id: number;
  month: number;
  year: number;
  totalDue: number;
  amountPaid: number;
  remainingBalance: number;
  previousBalance?: number;
  status:
    | "ISSUED"
    | "PARTIALLY_PAID"
    | "PAID"
    | "CANCELLED"
    | "REVERSED_PARTIAL"
    | "REVERSED_FULL";
  createdAt?: string;
  previousReading?: number;
  currentReading?: number;
  consumptionKwh?: number;
  fixesAmount?: number;
  fixesNote?: string;
  meter?: {
    number: string;
    subscriber?: {
      fullName: string;
      phone: string;
    };
    box?: {
      id: number;
      code?: string;
      neighborhood?: {
        id: number;
        name: string;
        region?: { id: number; name: string };
      };
      region?: { id: number; name: string };
    };
  };
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
  thisMonthDue?: number;
  totalDue: number;
  amountPaid: number;
  remainingBalance: number;
  previousBalance?: number;
  status: string;
  kwhRate?: number;
  ampereFee?: number;
  exchangeRate: number;
  createdAt?: string;
  previousReading?: number;
  currentReading?: number;
  consumptionKwh?: number;
  fixesAmount?: number;
  fixesNote?: string;
  reading?: {
    id: number;
    meterId: number;
    month: number;
    year: number;
    previousReading: number;
    currentReading: number;
    consumptionKwh: number;
    createdAt: string;
  };

  meter: {
    number: string;
    ampere?: number;
    subscriber: {
      id: number;
      fullName: string;
      phone: string;
    };
    box?: {
      code?: string;
      neighborhood?: {
        id: number;
        name: string;
        region?: { id: number; name: string };
      };
      region?: { id: number; name: string };
    };
  };

  payments: {
    id: number;
    amount: number;
    paidAt: string;
    receiver?: { username: string };
  }[];

  lbp?: {
    previousBalance?: number;
    thisMonthDue?: number;
    fixesAmount?: number;
    totalDue?: number;
    amountPaid?: number;
    remainingBalance?: number;
  };

  tariffDetails?: {
    id: number;
    scope: string;
    month: number;
    year: number;
    kwhRate: number;
  };
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







