import { Paper, Typography, Stack, Grid } from "@mui/material";
import type { SummaryReportResponse } from "../../../api/reports";

export default function SummaryCards({
  data,
}: {
  data: SummaryReportResponse;
}) {
  return (
    <Grid columns={12} spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Total Invoiced</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.totals.totalInvoiced}
            </Typography>
          </Stack>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Total Paid</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.totals.totalPaid}
            </Typography>
          </Stack>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Outstanding</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.totals.totalOutstanding}
            </Typography>
          </Stack>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Invoices Count</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.counts.invoices}
            </Typography>
          </Stack>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Payments Count</Typography>
            <Typography variant="h6" fontWeight={600}>
              {data.counts.payments}
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
