import type  {
  DashboardOverview,
  MonthlyTrendRow,
  RegionBreakdownRow,
} from "../api/dashboard";

export type DashboardInsight = {
  id: string;
  title: string;
  message: string;
  type: 'positive' | 'negative' | 'warning' | 'neutral';
  priority?: 'high' | 'medium' | 'low';
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
      title: "Low Collection Rate",
      message: "Collection rate is below 70% for the selected period.",
      type: "warning",
      priority: "high",
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
        title: "Outstanding Concentration",
        message: `${top.regionName} accounts for a large share of outstanding balance.`,
        type: "warning",
        priority: "medium",
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
        title: "Collection Drop",
        message: "Collections decreased compared to the previous month.",
        type: "negative",
        priority: "high",
      });
    }
  }

  // Insight D — Healthy fallback
  if (insights.length === 0) {
    insights.push({
      id: "healthy",
      title: "All Good",
      message: "No critical issues detected for this period.",
      type: "positive",
      priority: "low",
    });
  }

  return insights;
}
