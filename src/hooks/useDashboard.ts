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
    queryFn: () =>
      fetchDashboardOverview({
        month:
          context.month != null && context.year != null
            ? context.month
            : undefined,
        year:
          context.month != null && context.year != null
            ? context.year
            : undefined,
        from: context.from,
        to: context.to,
        regionId: context.regionId,
        neighborhoodId: context.neighborhoodId,
      }),
  });

  const regionsQuery = useQuery<RegionBreakdownRow[]>({
    queryKey: ["dashboard-regions", context.month, context.year, context.from, context.to],
    queryFn: () =>
      fetchRegionsBreakdown({
        month:
          context.month != null && context.year != null
            ? context.month
            : undefined,
        year:
          context.month != null && context.year != null
            ? context.year
            : undefined,
        from: context.from,
        to: context.to,
      }),
  });
  const periodStatusQuery = useQuery<PeriodStatus>({
    queryKey: ["dashboard-period-status", context.month, context.year],
    queryFn: () =>
      fetchPeriodStatus({
        month: context.month!,
        year: context.year!,
      }),
    enabled:
      context.month != null &&
      context.year != null &&
      !context.from &&
      !context.to,
  });

  const trendQuery = useQuery<MonthlyTrendRow[]>({
    queryKey: [
      "dashboard-trend",
      context.year,
      context.from,
      context.to,
      context.regionId,
      context.neighborhoodId,
    ],
    queryFn: () =>
      fetchMonthlyTrend({
        year: context.year,
        from: context.from,
        to: context.to,
        regionId: context.regionId,
        neighborhoodId: context.neighborhoodId,
      }),
    enabled: context.year != null || !!context.from || !!context.to,
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
