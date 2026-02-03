import { Paper, Typography, Stack, Skeleton, Box } from "@mui/material";
import Grid from "@material-ui/core/Grid";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import NumbersIcon from "@mui/icons-material/Numbers";
import type { Payment } from "../../api/payments";

const KPIBox = ({
  label,
  value,
  loading,
  icon: Icon,
}: {
  label: string;
  value?: number;
  loading: boolean;
  icon: React.ElementType;
}) => (
  <Paper
    sx={{
      p: 2.5,
      background: "linear-gradient(135deg, #fefefe 0%, #ffffff 100%)",
      border: "1px solid #f0f0f0",
      borderRadius: 2,
    }}
  >
    <Stack spacing={1.5}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1.5,
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ color: "#333333", fontSize: 24 }} />
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Box>
      {loading ? (
        <Skeleton width={100} height={32} />
      ) : (
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            color: "#333333",
            fontSize: "1.75rem",
          }}
        >
          {value?.toLocaleString() ?? "—"}
        </Typography>
      )}
    </Stack>
  </Paper>
);

export default function PaymentKPIs({
  payments,
  loading,
}: {
  payments: Payment[];
  loading: boolean;
}) {
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const reversedPayments = payments
    .filter((p) => p.isReversed)
    .reduce((sum, p) => sum + p.amount, 0);
  const activePayments = payments
    .filter((p) => !p.isReversed)
    .reduce((sum, p) => sum + p.amount, 0);
  const paymentsCount = payments.length;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <KPIBox
          label="Total Payments"
          value={totalPayments}
          loading={loading}
          icon={PaymentsIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPIBox
          label="Active Payments"
          value={activePayments}
          loading={loading}
          icon={CheckCircleIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPIBox
          label="Reversed Payments"
          value={reversedPayments}
          loading={loading}
          icon={BlockIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPIBox
          label="Payment Count"
          value={paymentsCount}
          loading={loading}
          icon={NumbersIcon}
        />
      </Grid>
    </Grid>
  );
}
