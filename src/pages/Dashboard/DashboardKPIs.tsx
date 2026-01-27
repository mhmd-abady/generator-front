import { Paper, Typography, Stack, Skeleton } from "@mui/material";
import type { DashboardOverview } from "../../api/dashboard";
import Grid from '@material-ui/core/Grid';

const KPIBox = ({
  label,
  value,
  loading,
}: {
  label: string;
  value?: number;
  loading: boolean;
}) => (
  <Paper sx={{ p: 2 }}>
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {loading ? (
        <Skeleton width={80} />
      ) : (
        <Typography variant="h6">
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
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Total Collected"
          value={overview?.totalCollected}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Outstanding"
          value={overview?.totalOutstanding}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Subscribers"
          value={overview?.subscribersCount}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Meters"
          value={overview?.metersCount}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <KPIBox
          label="Boxes"
          value={overview?.boxesCount}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}
