import { api } from "./axios";

export type DashboardOverview = {
  subscribersCount: number;
  metersCount: number;
  boxesCount: number;
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
};

export type MonthlyTrendRow = {
  month: number;
  invoiced: number;
  collected: number;
};

export type RegionBreakdownRow = {
  regionId: number;
  regionName: string;
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
};

export type PeriodStatus = {
  isClosed: boolean;
  closedAt?: string;
  closedBy?: {
    id: number;
    username: string;
  };
};

/*
 * GET /dashboard/overview
 */
export const fetchDashboardOverview = async (params?: {
  month?: number;
  year?: number;
  regionId?: number;
  neighborhoodId?: number;
}): Promise<DashboardOverview> => {
  const res = await api.get<DashboardOverview>(
    "/dashboard/overview",
    { params }
  );
  return res.data;
};

/*
 * GET /dashboard/trends/monthly
 */
export const fetchMonthlyTrend = async (params: {
  year: number;
  regionId?: number;
  neighborhoodId?: number;
}): Promise<MonthlyTrendRow[]> => {
  const res = await api.get<MonthlyTrendRow[]>(
    "/dashboard/trends/monthly",
    { params }
  );
  return res.data;
};

/*
 * GET /dashboard/breakdown/regions
 */
export const fetchRegionsBreakdown = async (params?: {
  month?: number;
  year?: number;
}): Promise<RegionBreakdownRow[]> => {
  const res = await api.get<RegionBreakdownRow[]>(
    "/dashboard/breakdown/regions",
    { params }
  );
  return res.data;
};

/*
 * GET /dashboard/period-status
 */
export const fetchPeriodStatus = async (params: {
  month: number;
  year: number;
}): Promise<PeriodStatus> => {
  const res = await api.get<PeriodStatus>(
    "/dashboard/period-status",
    { params }
  );
  return res.data;
};
