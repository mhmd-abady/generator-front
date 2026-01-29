// src/pages/Subscribers/SubscriberInvoicesTable.tsx
import {
  Chip,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import type { Invoice } from "../../api/invoices";
import DataTable from "../../components/DataTable";
import { useTheme } from "../../context/ThemeContext";

export default function SubscriberInvoicesTable({
  invoices,
  loading,
  onView,
}: {
  invoices?: Invoice[];
  loading: boolean;
  onView: (invoiceId: number) => void;
}) {
  const { colors } = useTheme();

  const columns = [
    {
      id: "period",
      label: "Period",
      align: "left" as const,
      width: "15%",
      hiddenOnMobile: false,
      render: (row: Invoice) => (
        <Box sx={{ fontWeight: 600, color: colors.accent }}>
          {row.month}/{row.year}
        </Box>
      ),
    },
    {
      id: "total",
      label: "Total Due",
      align: "right" as const,
      width: "18%",
      render: (row: Invoice) => (
        <Box sx={{ fontWeight: 600, color: colors.text }}>
          ${row.totalDue.toLocaleString()}
        </Box>
      ),
    },
    {
      id: "paid",
      label: "Paid",
      align: "right" as const,
      width: "15%",
      hiddenOnMobile: true,
      render: (row: Invoice) => (
        <Box sx={{ color: colors.accent, fontWeight: 500 }}>
          ${row.amountPaid.toLocaleString()}
        </Box>
      ),
    },
    {
      id: "remaining",
      label: "Remaining",
      align: "right" as const,
      width: "18%",
      render: (row: Invoice) => (
        <Box
          sx={{
            fontWeight: 600,
            color:
              row.remainingBalance === 0 ? colors.accent : colors.error,
            transition: "all 0.2s ease",
          }}
        >
          ${row.remainingBalance.toLocaleString()}
        </Box>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center" as const,
      width: "15%",
      hiddenOnMobile: true,
      render: (row: Invoice) => (
        <Chip
          size="small"
          label={row.status}
          color={
            row.status === "PAID"
              ? "success"
              : row.status === "PARTIALLY_PAID"
              ? "warning"
              : "default"
          }
          sx={{
            fontWeight: 600,
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`,
            },
          }}
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right" as const,
      width: "19%",
      render: (row: Invoice) => (
        <Tooltip title="View invoice details">
          <Button
            size="small"
            variant="outlined"
            onClick={() => onView(row.id)}
            sx={{
              color: colors.secondary,
              borderColor: colors.secondary,
              transition: "all 0.2s ease",
              "&:hover": {
                background: `${colors.secondary}22`,
                borderColor: colors.accent,
                color: colors.accent,
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${colors.secondary}33`,
              },
            }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <DataTable<Invoice>
      columns={columns}
      rows={invoices ?? []}
      loading={loading}
      title="Unpaid Invoices"
      density="normal"
      striped
      hoverable
      emptyMessage="No invoices to display"
    />
  );
}
