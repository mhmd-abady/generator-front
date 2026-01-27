import { Paper, Typography, Stack } from "@mui/material";
import DashboardLayout from "../Dashboard/DashboardLayout";
import ExchangeRatePage from "./ExchangeRatePage";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Settings
        </Typography>
      </Paper>

      <ExchangeRatePage />
    </DashboardLayout>
  );
}
