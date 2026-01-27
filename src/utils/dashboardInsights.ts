import type  {
  DashboardOverview,
  MonthlyTrendRow,
  RegionBreakdownRow,
} from "../api/dashboard";

export type DashboardInsight = {
  id: string;
  message: string;
};

export function generateDashboardInsights(params: {
  overview?: DashboardOverview;
  trend?: MonthlyTrendRow[];
  regions?: RegionBreakdownRow[];
  month: number;
}): DashboardInsight[] {
  const insights: DashboardInsight[] = [];

  const { overview, trend, regions, month } = params;

  // Insight A — Low collection rate
  if (
    overview &&
    overview.totalInvoiced > 0 &&
    overview.totalCollected / overview.totalInvoiced < 0.7
  ) {
    insights.push({
      id: "low-collection",
      message: "Collection rate is below 70% for the selected period.",
    });
  }

  // Insight B — Outstanding concentration
  if (regions && overview?.totalOutstanding) {
    const top = regions.reduce((a, b) =>
      b.totalOutstanding > a.totalOutstanding ? b : a
    );

    if (
      top.totalOutstanding / overview.totalOutstanding >= 0.4
    ) {
      insights.push({
        id: "outstanding-concentration",
        message: `${top.regionName} accounts for a large share of outstanding balance.`,
      });
    }
  }

  // Insight C — Month-over-month drop
  if (trend && trend.length >= 2) {
    const current = trend.find((t) => t.month === month);
    const prev = trend.find((t) => t.month === month - 1);

    if (current && prev && current.collected < prev.collected) {
      insights.push({
        id: "collection-drop",
        message: "Collections decreased compared to the previous month.",
      });
    }
  }

  // Insight D — Healthy fallback
  if (insights.length === 0) {
    insights.push({
      id: "healthy",
      message: "No critical issues detected for this period.",
    });
  }

  return insights;
}
