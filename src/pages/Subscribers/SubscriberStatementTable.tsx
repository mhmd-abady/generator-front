import {
  Box,
  Typography,
} from "@mui/material";
import type { StatementRow } from "../../api/statements";
import DataTable from "../../components/DataTable";
import { useTheme } from "../../context/ThemeContext";

export default function SubscriberStatementTable({
  openingBalanceUsd,
  rows,
  finalUsd,
  finalLbp,
}: {
  openingBalanceUsd: number;
  rows: StatementRow[];
  finalUsd: number;
  finalLbp: number;
}) {
  const { colors } = useTheme();

  const columns = [
    {
      id: "date",
      label: "Date",
      align: "left" as const,
      width: "18%",
      hiddenOnMobile: false,
      render: (row: StatementRow) => (
        <Box sx={{ fontWeight: 600, color: colors.accent }}>
          {new Date(row.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Box>
      ),
    },
    {
      id: "reference",
      label: "Reference",
      align: "left" as const,
      width: "22%",
      hiddenOnMobile: true,
      render: (row: StatementRow) => (
        <Box sx={{ color: colors.text, fontWeight: 500 }}>
          {row.reference}
        </Box>
      ),
    },
    {
      id: "debit",
      label: "Debit USD",
      align: "right" as const,
      width: "15%",
      render: (row: StatementRow) => (
        <Box
          sx={{
            color: row.debitUsd ? colors.error : colors.textSubtle,
            fontWeight: 600,
          }}
        >
          {row.debitUsd ? `$${row.debitUsd.toLocaleString()}` : "—"}
        </Box>
      ),
    },
    {
      id: "credit",
      label: "Credit USD",
      align: "right" as const,
      width: "15%",
      render: (row: StatementRow) => (
        <Box
          sx={{
            color: row.creditUsd ? colors.accent : colors.textSubtle,
            fontWeight: 600,
          }}
        >
          {row.creditUsd ? `$${row.creditUsd.toLocaleString()}` : "—"}
        </Box>
      ),
    },
    {
      id: "balanceUsd",
      label: "Balance USD",
      align: "right" as const,
      width: "15%",
      hiddenOnMobile: true,
      render: (row: StatementRow) => (
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
          ${row.balanceUsd.toLocaleString()}
        </Box>
      ),
    },
    {
      id: "balanceLbp",
      label: "Balance LBP",
      align: "right" as const,
      width: "15%",
      hiddenOnMobile: true,
      render: (row: StatementRow) => (
        <Box
          sx={{
            fontWeight: 700,
            color: colors.secondary,
            background: `${colors.secondary}22`,
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
            display: "inline-block",
          }}
        >
          ₺{row.balanceLbp.toLocaleString()}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Opening Balance */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${colors.primary}22 0%, ${colors.secondary}22 100%)`,
          border: `1px solid ${colors.border}44`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: colors.textSubtle,
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            mb: 1,
          }}
        >
          Opening Balance
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          ${openingBalanceUsd.toLocaleString()} USD
        </Typography>
      </Box>

      {/* Statement Table */}
      <DataTable<StatementRow>
        columns={columns}
        rows={rows}
        title="Statement Details"
        density="normal"
        striped
        hoverable
        emptyMessage="No statement entries available"
      />

      {/* Final Balance */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${colors.accent}22 0%, ${colors.primary}22 100%)`,
            border: `1px solid ${colors.accent}44`,
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: `0 12px 24px ${colors.accent}22`,
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.textSubtle,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              mb: 1,
            }}
          >
            Final Balance (USD)
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.accent,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            ${finalUsd.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${colors.secondary}22 0%, ${colors.primary}22 100%)`,
            border: `1px solid ${colors.secondary}44`,
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: `0 12px 24px ${colors.secondary}22`,
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.textSubtle,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              mb: 1,
            }}
          >
            Final Balance (LBP)
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.secondary,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            ₺{finalLbp.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
