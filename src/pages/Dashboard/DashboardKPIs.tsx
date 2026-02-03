import { Paper, Typography, Stack, Skeleton, Box } from "@mui/material";
import type { DashboardOverview } from "../../api/dashboard";
import Grid from "@material-ui/core/Grid";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonIcon from "@mui/icons-material/Person";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import GridOnIcon from "@mui/icons-material/GridOn";

interface KPIProps {
  label: string;
  value?: number;
  loading: boolean;
  icon: React.ElementType;
}

const KPIBox = ({ label, value, loading, icon: Icon }: KPIProps) => (
  <Paper
    sx={{
      p: 2.5,
      background: "linear-gradient(135deg, #fefefe 0%, #ffffff 100%)",
      border: "1px solid #f0f0f0",
      borderRadius: 2,
      transition: "all 0.3s ease",
      height: "100%",
      "&:hover": {
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        transform: "translateY(-4px)",
        borderColor: "#e0e0e0",
      },
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

export default function DashboardKPIs({
  overview,
  loading,
}: {
  overview?: DashboardOverview;
  loading: boolean;
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Total Invoiced"
          value={overview?.totalInvoiced}
          loading={loading}
          icon={ReceiptIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Total Collected"
          value={overview?.totalCollected}
          loading={loading}
          icon={MonetizationOnIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Outstanding"
          value={overview?.totalOutstanding}
          loading={loading}
          icon={PendingActionsIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Subscribers"
          value={overview?.subscribersCount}
          loading={loading}
          icon={PersonIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Meters"
          value={overview?.metersCount}
          loading={loading}
          icon={EnergySavingsLeafIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Boxes"
          value={overview?.boxesCount}
          loading={loading}
          icon={GridOnIcon}
        />
      </Grid>
    </Grid>
  );
}
