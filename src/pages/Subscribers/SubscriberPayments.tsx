import {
  Box,
  Chip,
} from "@mui/material";
import DataTable from "../../components/DataTable";
import { useTheme } from "../../context/ThemeContext";
import type { SubscriberPayment } from "../../api/subscribers";

export default function SubscriberPayments({
  payments,
  loading,
}: {
  payments?: SubscriberPayment[];
  loading: boolean;
}) {
  const { colors } = useTheme();

  const columns = [
    {
      id: "date",
      label: "Date",
      align: "left" as const,
      width: "30%",
      render: (row: SubscriberPayment) => (
        <Box sx={{ fontWeight: 600, color: colors.accent }}>
          {new Date(row.paidAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Box>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      align: "right" as const,
      width: "30%",
      render: (row: SubscriberPayment) => (
        <Box
          sx={{
            fontWeight: 700,
            color: colors.accent,
            background: `${colors.accent}22`,
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
            display: "inline-block",
          }}
        >
          ${row.amount.toLocaleString()}
        </Box>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center" as const,
      width: "40%",
      render: (row: SubscriberPayment) => (
        <Chip
          size="small"
          label={row.isReversed ? "REVERSED" : "PAID"}
          color={row.isReversed ? "error" : "success"}
          variant="outlined"
          sx={{
            fontWeight: 600,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
      ),
    },
  ];

  return (
    <DataTable<SubscriberPayment>
      columns={columns}
      rows={payments ?? []}
      loading={loading}
      title="Payment Records"
      density="normal"
      striped
      hoverable
      emptyMessage="No payment records available"
    />
  );
}
