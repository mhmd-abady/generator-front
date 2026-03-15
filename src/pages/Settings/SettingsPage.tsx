import { Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import ExchangeRatePage from "./ExchangeRatePage";
import { TariffsContent } from "../Tarrifs/TarrifsPage";
import { AmperePricingContent } from "../AmperePricing/AmperePricingPage";

export default function SettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Settings
        </Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, next) => setTab(next)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Exchange Rate" />
          <Tab label="Tariffs" />
          <Tab label="Ampere Pricing" />
        </Tabs>
      </Paper>

      {tab === 0 && <ExchangeRatePage />}
      {tab === 1 && <TariffsContent />}
      {tab === 2 && <AmperePricingContent />}
    </DashboardLayout>
  );
}
