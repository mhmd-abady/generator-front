import {
  Chip,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Invoice } from "../../api/invoices";
import DataTable from "../../components/DataTable";
import { useTheme } from "../../context/ThemeContext";

export default function InvoicesTable({ rows }: { rows: Invoice[] }) {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return { bg: colors.secondary, text: '#fff' };
      case 'pending':
        return { bg: colors.accent, text: colors.dark };
      case 'overdue':
        return { bg: colors.error, text: '#fff' };
      default:
        return { bg: colors.textSubtle, text: colors.text };
    }
  };

  const columns = [
    {
      id: "id",
      label: "ID",
      align: "left" as const,
      width: "8%",
      render: (row: Invoice) => (
        <Box
          sx={{
            fontWeight: 700,
            color: colors.accent,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          #{row.id}
        </Box>
      ),
    },
    {
      id: "subscriber",
      label: "Subscriber",
      align: "left" as const,
      width: "25%",
      hiddenOnMobile: false,
      render: (row: Invoice) => (
        <Box
          onClick={() => navigate(`/invoices/${row.id}`)}
          sx={{
            cursor: "pointer",
            color: colors.primary,
            fontWeight: 600,
            transition: "all 0.2s ease",
            "&:hover": {
              textDecoration: "underline",
              color: colors.secondary,
              textShadow: `0 0 8px ${colors.primary}44`,
            },
          }}
        >
          {row.meter?.subscriber?.fullName ?? "—"}
        </Box>
      ),
    },
    {
      id: "period",
      label: "Period",
      align: "center" as const,
      width: "15%",
      hiddenOnMobile: true,
      render: (row: Invoice) => (
        <Box sx={{ fontWeight: 600, color: colors.accent }}>
          {row.month}/{row.year}
        </Box>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center" as const,
      width: "15%",
      render: (row: Invoice) => {
        const statusColors = getStatusColor(row.status);
        return (
          <Chip
            label={row.status}
            size="small"
            sx={{
              background: statusColors.bg,
              color: statusColors.text,
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              minWidth: "80px",
            }}
          />
        );
      },
    },
    {
      id: "total",
      label: "Total",
      align: "right" as const,
      width: "15%",
      render: (row: Invoice) => (
        <Box
          sx={{
            fontWeight: 700,
            color: colors.secondary,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          ${row.totalDue?.toFixed(2) ?? "0.00"}
        </Box>
      ),
    },
    {
      id: "remaining",
      label: "Remaining",
      align: "right" as const,
      width: "15%",
      render: (row: Invoice) => (
        <Box
          sx={{
            fontWeight: 600,
            color: row.remainingBalance > 0 ? colors.error : colors.secondary,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          ${row.remainingBalance?.toFixed(2) ?? "0.00"}
        </Box>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      density="compact"
      striped
      hoverable
      sx={{
        cursor: "pointer",
        "& .MuiTableRow-root": {
          "&:hover": {
            background: `${colors.primary}11 !important`,
          },
        },
      }}
    />
  );
}
