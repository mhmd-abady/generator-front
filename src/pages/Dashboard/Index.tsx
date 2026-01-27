import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import DashboardHeader from "./DashboardHeader";
import DashboardKPIs from "./DashboardKPIs";
import DashboardTrend from "./DashboardTrend";
import DashboardRegions from "./DashboardRegions";
import DashboardInsights from "./DashboardInsights";
import { useDashboard } from "../../hooks/useDashboard";
import { generateDashboardInsights } from "../../utils/dashboardInsights";

export type DashboardContext = {
  month: number;
  year: number;
  regionId?: number;
  neighborhoodId?: number;
};

export default function Dashboard() {
  const now = new Date();

  const [context, setContext] = useState<DashboardContext>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const dashboard = useDashboard(context);
  
  const insights = generateDashboardInsights({
  overview: dashboard.overview,
  trend: dashboard.trend,
  regions: dashboard.regions,
  month: context.month,
});

  return (
    <DashboardLayout>
      <DashboardHeader
        context={context}
        onChange={setContext}
        periodStatus={dashboard.periodStatus}
        loading={dashboard.isLoading}
      />
      <DashboardKPIs
        overview={dashboard.overview}
        loading={dashboard.isLoading}
      />

      <DashboardTrend data={dashboard.trend} loading={dashboard.isLoading} />
      <DashboardRegions
        data={dashboard.regions}
        loading={dashboard.isLoading}
        neighborhoodSelected={!!context.neighborhoodId}
      />
      <DashboardInsights insights={insights} />
    </DashboardLayout>
  );
}
