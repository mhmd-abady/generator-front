import { Paper, Typography, Stack } from "@mui/material";
import type { DashboardInsight } from "../../utils/dashboardInsights";

export default function DashboardInsights({
  insights,
}: {
  insights: DashboardInsight[];
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Insights
      </Typography>

      <Stack spacing={1}>
        {insights.map((i) => (
          <Typography key={i.id} variant="body2">
            • {i.message}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}
