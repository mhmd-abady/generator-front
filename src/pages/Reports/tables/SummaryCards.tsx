import { Paper, Typography, Stack, Grid, Chip, Box } from "@mui/material";
import type { SummaryReportResponse } from "../../../api/reports";
import PaidRounded from "@mui/icons-material/PaidRounded";
import ReceiptLongRounded from "@mui/icons-material/ReceiptLongRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import PercentRounded from "@mui/icons-material/PercentRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";

type Stat = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  helper?: string;
};

const Card = ({ stat }: { stat: Stat }) => (
  <Paper
    sx={{
      p: 1.75,
      borderRadius: 2,
      border: "1px solid #e6e8ec",
      boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
      height: "100%",
    }}
  >
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            backgroundColor: "#f5f7fb",
            display: "grid",
            placeItems: "center",
            color: "#0b6cff",
          }}
        >
          {stat.icon}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {stat.label}
        </Typography>
      </Stack>
      <Typography variant="h6" fontWeight={700}>
        {typeof stat.value === "number"
          ? stat.value.toLocaleString()
          : stat.value}
      </Typography>
      {stat.helper && (
        <Chip
          label={stat.helper}
          size="small"
          sx={{ alignSelf: "flex-start", backgroundColor: "#f1f5f9" }}
        />
      )}
    </Stack>
  </Paper>
);

export default function SummaryCards({ data }: { data: SummaryReportResponse }) {
  const collectionRate =
    data.totals.totalInvoiced > 0
      ? `${Math.round((data.totals.totalPaid / data.totals.totalInvoiced) * 100)}%`
      : "—";

  const avgPayment =
    data.counts.payments > 0
      ? Math.round(data.totals.totalPaid / data.counts.payments)
      : "—";

  const avgInvoice =
    data.counts.invoices > 0
      ? Math.round(data.totals.totalInvoiced / data.counts.invoices)
      : "—";

  const stats: Stat[] = [
    {
      label: "Total Invoiced",
      value: data.totals.totalInvoiced,
      icon: <ReceiptLongRounded fontSize="small" />,
    },
    {
      label: "Total Paid",
      value: data.totals.totalPaid,
      icon: <PaidRounded fontSize="small" />,
    },
    {
      label: "Outstanding",
      value: data.totals.totalOutstanding,
      icon: <WarningAmberRounded fontSize="small" />,
    },
    {
      label: "Collection Rate",
      value: collectionRate,
      icon: <PercentRounded fontSize="small" />,
      helper: "Paid / Invoiced",
    },
    {
      label: "Invoices",
      value: data.counts.invoices,
      icon: <ReceiptLongRounded fontSize="small" />,
      helper: avgInvoice !== "—" ? `Avg ${avgInvoice}` : undefined,
    },
    {
      label: "Payments",
      value: data.counts.payments,
      icon: <TrendingUpRounded fontSize="small" />,
      helper: avgPayment !== "—" ? `Avg ${avgPayment}` : undefined,
    },
    {
      label: "Reversed Payments",
      value: "—",
      icon: <HistoryRounded fontSize="small" />,
      helper: "Awaiting API support",
    },
  ];

  return (
    <Grid container columns={12} spacing={1.5}>
      {stats.map((stat, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Card stat={stat} />
        </Grid>
      ))}
    </Grid>
  );
}
