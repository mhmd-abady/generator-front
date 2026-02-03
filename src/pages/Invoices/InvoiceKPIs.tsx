import { Paper, Typography, Stack, Skeleton, Box } from "@mui/material";
import Grid from "@material-ui/core/Grid";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import type { Invoice } from "../../api/invoices";

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
      background: "linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)",
      border: "1px solid #e0e0e0",
      borderRadius: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        transform: "translateY(-4px)",
        borderColor: "#bdbdbd",
      },
    }}
  >
    <Stack spacing={1.5}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1.5,
            background: "#e8e8e8",
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

export default function InvoiceKPIs({
  invoices,
  loading,
}: {
  invoices: Invoice[];
  loading: boolean;
}) {
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalDue, 0);
  const totalPaid = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalOutstanding = invoices.reduce(
    (sum, i) => sum + i.remainingBalance,
    0
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          label="Total Invoiced"
          value={totalInvoiced}
          loading={loading}
          icon={ReceiptIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          label="Total Paid"
          value={totalPaid}
          loading={loading}
          icon={CheckCircleIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          label="Total Outstanding"
          value={totalOutstanding}
          loading={loading}
          icon={PendingActionsIcon}
        />
      </Grid>
    </Grid>
  );
}
