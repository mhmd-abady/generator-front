import { useQuery } from "@tanstack/react-query";
import {
  fetchAgingReport,
  fetchPaymentsReport,
  fetchSummaryReport,
  fetchCollectionsSummary,
  type ReportsFilter,
  type AgingReportResponse,
  type PaymentsReportResponse,
  type SummaryReportResponse,
  type CollectionsSummaryResponse,
} from "../api/reports";

/* =========================
   AGING
========================= */
export function useAgingReport(params?: ReportsFilter) {
  return useQuery<AgingReportResponse>({
    queryKey: ["reports", "aging", params],
    queryFn: () => fetchAgingReport(params),
  });
}

/* =========================
   PAYMENTS
========================= */
export function usePaymentsReport(params?: ReportsFilter) {
  return useQuery<PaymentsReportResponse>({
    queryKey: ["reports", "payments", params],
    queryFn: () => fetchPaymentsReport(params),
  });
}

/* =========================
   SUMMARY
========================= */
export function useSummaryReport(params?: ReportsFilter) {
  return useQuery<SummaryReportResponse>({
    queryKey: ["reports", "summary", params],
    queryFn: () => fetchSummaryReport(params),
  });
}

/* =========================
   COLLECTIONS
========================= */
export function useCollectionsSummary(params?: ReportsFilter) {
  return useQuery<CollectionsSummaryResponse>({
    queryKey: ["reports", "collections-summary", params],
    queryFn: () => fetchCollectionsSummary(params),
  });
}
