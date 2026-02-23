import type { ChipProps } from "@mui/material";
import type { Invoice } from "../../api/invoices";

export type InvoiceStatus = Invoice["status"];

const statusLabels: Record<InvoiceStatus, string> = {
  ISSUED: "Issued",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
  CANCELLED: "Cancelled",
  REVERSED_PARTIAL: "Reversed Partial",
  REVERSED_FULL: "Reversed Full",
};

export const invoiceStatusChipSx = {
  justifyContent: "center",
  fontWeight: 600,
  borderRadius: "6px",
  "& .MuiChip-label": {
    fontWeight: 600,
  },
} as const;

export const formatInvoiceStatus = (status?: string) => {
  if (!status) return "Unknown";
  return (statusLabels as Record<string, string>)[status] ?? status;
};

export const invoiceStatusColor = (
  status?: string
): ChipProps["color"] => {
  switch (status) {
    case "PAID":
      return "success";
    case "PARTIALLY_PAID":
      return "warning";
    case "ISSUED":
      return "info";
    case "CANCELLED":
    case "REVERSED_FULL":
      return "error";
    case "REVERSED_PARTIAL":
      return "default";
    default:
      return "default";
  }
};
