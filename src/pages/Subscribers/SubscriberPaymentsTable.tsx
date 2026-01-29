import {
  Chip,
  Box,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import type { Payment } from "../../api/payments";
import UndoIcon from "@mui/icons-material/Undo";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/DataTable";
import { useTheme } from "../../context/ThemeContext";

export default function SubscriberPaymentsTable({
  payments,
  loading,
  onReverse,
}: {
  payments?: Payment[];
  loading: boolean;
  onReverse: (paymentId: number) => void;
}) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const isAdmin = user?.role === "ADMIN";

  const columns = [
    {
      id: "date",
      label: "Date",
      align: "left" as const,
      width: "18%",
      hiddenOnMobile: false,
      render: (row: Payment) => (
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
      width: "16%",
      hiddenOnMobile: false,
      render: (row: Payment) => (
        <Box
          sx={{
            fontWeight: 700,
            color: row.amount >= 0 ? colors.accent : colors.error,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            background: `${row.amount >= 0 ? colors.accent : colors.error}22`,
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
            display: "inline-block",
            transition: "all 0.2s ease",
          }}
        >
          {row.amount >= 0 ? "+" : ""}
          ${Math.abs(row.amount).toLocaleString()}
        </Box>
      ),
    },
    {
      id: "invoice",
      label: "Invoice",
      align: "center" as const,
      width: "14%",
      hiddenOnMobile: true,
      render: (row: Payment) => (
        <Box sx={{ color: colors.textSubtle, fontWeight: 500 }}>
          {row.invoiceId ? `#${row.invoiceId}` : "—"}
        </Box>
      ),
    },
    {
      id: "receiver",
      label: "Receiver",
      align: "left" as const,
      width: "20%",
      hiddenOnMobile: true,
      render: (row: Payment) => (
        <Box sx={{ color: colors.text, fontWeight: 500 }}>
          {row.receiver?.username ?? "—"}
        </Box>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center" as const,
      width: "14%",
      render: (row: Payment) => (
        <Chip
          size="small"
          label={row.isReversed ? "REVERSED" : "OK"}
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
    {
      id: "actions",
      label: "Actions",
      align: "right" as const,
      width: "18%",
      render: (row: Payment) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          {isAdmin && !row.isReversed && (
            <Tooltip title="Reverse payment">
              <IconButton
                size="small"
                color="error"
                onClick={() => onReverse(row.id)}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: `${colors.error}22`,
                    transform: "scale(1.1)",
                  },
                }}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <DataTable<Payment>
      columns={columns}
      rows={payments ?? []}
      loading={loading}
      title="Payment History"
      density="normal"
      striped
      hoverable
      emptyMessage="No payments recorded yet"
    />
  );
}
