// src/hooks/useInvoices.ts
import { useQuery } from "@tanstack/react-query";
import { fetchAllInvoices, fetchInvoices, type Invoice } from "../api/invoices";

export function useUnpaidInvoices(subscriberId: number) {
  const query = useQuery<Invoice[]>({
    queryKey: ["invoices", subscriberId],
    queryFn: () =>
      fetchInvoices({
        subscriberId,
      }),
    enabled: !!subscriberId,
  });

  return {
    invoices:
      query.data?.filter(
        (i) => i.status === "ISSUED" || i.status === "PARTIALLY_PAID"
      ) ?? [],
    isLoading: query.isLoading,
  };
}


// src/hooks/useInvoices.ts
/*export function useInvoices(subscriberId: number) {
  return useQuery<Invoice[]>({
    queryKey: ["invoices", "all", subscriberId],
    queryFn: () =>
      fetchInvoices({
        subscriberId,
      }),
    enabled: !!subscriberId,
  });
}*/

import { fetchInvoiceById } from "../api/invoices";

export function useInvoice(invoiceId: number) {
  return useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => fetchInvoiceById(invoiceId),
    enabled: !!invoiceId,
  });
}

export function useAllInvoices(params?: {
  year?: number;
  month?: number;
  status?: string;
  subscriberId?: number;
  regionId?: number;
  neighborhoodId?: number;
}) {
  return useQuery<Invoice[]>({
    queryKey: ["invoices", params],
    queryFn: () => fetchAllInvoices(params),
  });
}