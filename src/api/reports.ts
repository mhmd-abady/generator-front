// src/api/reports.ts
import { api } from "./axios";

/* =========================
   TYPES
========================= */

export type InvoiceStatus =
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED"
  | "REVERSED_PARTIAL"
  | "REVERSED_FULL";

export type ReportsFilter = {
  month?: number;
  year?: number;
  regionId?: number;
  neighborhoodId?: number;
  receiverId?: number;
};

export type AgingBuckets = {
  "0_30": number;
  "31_60": number;
  "61_90": number;
  "90_plus": number;
};

export type AgingRow = {
  subscriber: { id: number; fullName: string; phone: string };
  region: { id: number; name: string };
  neighborhood: { id: number; name: string };
  totalPreviousBalance?: number;
  buckets: AgingBuckets;
  totalOwed: number;
  invoicesCount: number;
};

export type AgingReportResponse = {
  filters: ReportsFilter;
  totals: AgingBuckets & {
    totalOwed: number;
    subscribers: number;
    totalPreviousBalance?: number;
  };
  rows: AgingRow[];
};

export type PaymentsReportRow = {
  id: number;
  amount: number;
  paidAt: string | Date;
  subscriber: { id: number; fullName: string; phone: string };
  receiver: { id: number; username: string } | null;
  invoice: {
    id: number;
    month: number;
    year: number;
    meter: {
      box: {
        neighborhood: {
          id: number;
          name: string;
          region: { id: number; name: string };
        };
      };
    };
  } | null;
};

export type PaymentsReportResponse = {
  filters: ReportsFilter;
  totalReceived: number;
  count: number;
  rows: PaymentsReportRow[];
};

export type SummaryReportResponse = {
  filters: ReportsFilter;
  totals: {
    totalInvoiced: number;
    totalPaid: number;
    totalOutstanding: number;
  };
  counts: {
    invoices: number;
    payments: number;
  };
};

export type CollectionsSummaryRow = {
  receiverType: "COLLECTOR" | "EMPLOYEE" | "OWNER";
  receiverId: number;
  receiverName: string;
  role: "ADMIN" | "EMPLOYEE" | "COLLECTOR";
  totalCollected: number;
  paymentsCount: number;
};

export type CollectionsSummaryResponse = {
  filters: ReportsFilter;
  rows: CollectionsSummaryRow[];
};

/* =========================
   GET – REPORTS
========================= */

export const fetchAgingReport = async (
  params?: ReportsFilter
): Promise<AgingReportResponse> => {
  const res = await api.get("/reports/aging", { params });
  return res.data;
};

export const fetchPaymentsReport = async (
  params?: ReportsFilter
): Promise<PaymentsReportResponse> => {
  const res = await api.get("/reports/payments", { params });
  return res.data;
};

export const fetchSummaryReport = async (
  params?: ReportsFilter
): Promise<SummaryReportResponse> => {
  const res = await api.get("/reports/summary", { params });
  return res.data;
};

export const fetchCollectionsSummary = async (
  params?: ReportsFilter
): Promise<CollectionsSummaryResponse> => {
  const res = await api.get("/reports/collections-summary", { params });
  return res.data;
};

/* =========================
   EXPORT URLS
========================= */

export type ExportFormat = "pdf" | "excel";

export const getAgingExportUrl = (params: ReportsFilter & { format: ExportFormat }) => {
  const qs = new URLSearchParams(
  Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
    if (v === undefined || v === null) return acc;
    acc[k] = String(v);
    return acc;
  }, {})
).toString();

  return `${import.meta.env.VITE_API_URL}/reports/aging/export?${qs}`;
};

export const getPaymentsExportUrl = (
  params: ReportsFilter & { format: ExportFormat }
) => {
  const qs = new URLSearchParams(
  Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
    if (v === undefined || v === null) return acc;
    acc[k] = String(v);
    return acc;
  }, {})
).toString();

  return `${import.meta.env.VITE_API_URL}/reports/payments/export?${qs}`;
};

export const getSummaryExportUrl = (
  params: ReportsFilter & { format: ExportFormat }
) => {
  const qs = new URLSearchParams(
  Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
    if (v === undefined || v === null) return acc;
    acc[k] = String(v);
    return acc;
  }, {})
).toString();

  return `${import.meta.env.VITE_API_URL}/reports/summary/export?${qs}`;
};
