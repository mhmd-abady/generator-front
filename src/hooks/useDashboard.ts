import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardOverview,
  fetchPeriodStatus,
  fetchMonthlyTrend,
  fetchRegionsBreakdown,
} from "../api/dashboard";
import type {
  RegionBreakdownRow,
  DashboardOverview,
  PeriodStatus,
  MonthlyTrendRow,
} from "../api/dashboard";
import type { DashboardContext } from "../pages/Dashboard/Index";

export function useDashboard(context: DashboardContext) {
  const overviewQuery = useQuery<DashboardOverview>({
    queryKey: ["dashboard-overview", context],
    queryFn: () => fetchDashboardOverview(context),
  });

  const regionsQuery = useQuery<RegionBreakdownRow[]>({
    queryKey: ["dashboard-regions", context.month, context.year],
    queryFn: () =>
      fetchRegionsBreakdown({
        month: context.month,
        year: context.year,
      }),
  });
  const periodStatusQuery = useQuery<PeriodStatus>({
    queryKey: ["dashboard-period-status", context.month, context.year],
    queryFn: () =>
      fetchPeriodStatus({
        month: context.month,
        year: context.year,
      }),
  });

  const trendQuery = useQuery<MonthlyTrendRow[]>({
    queryKey: [
      "dashboard-trend",
      context.year,
      context.regionId,
      context.neighborhoodId,
    ],
    queryFn: () =>
      fetchMonthlyTrend({
        year: context.year,
        regionId: context.regionId,
        neighborhoodId: context.neighborhoodId,
      }),
  });

  return {
    overview: overviewQuery.data,
    periodStatus: periodStatusQuery.data,
    trend: trendQuery.data,
    regions: regionsQuery.data,
    isLoading:
      overviewQuery.isLoading ||
      periodStatusQuery.isLoading ||
      trendQuery.isLoading ||
      regionsQuery.isLoading,
    isError:
      overviewQuery.isError ||
      periodStatusQuery.isError ||
      trendQuery.isError ||
      regionsQuery.isError,
  };
}
