// src/api/collectors.ts
import { api } from "./axios";

export type CollectorTaskInvoice = {
  id: number;
  month: number;
  year: number;
  status: string;
  totalDue: number;
  amountPaid: number;
  remainingBalance: number;
  previousBalance?: number;
  fixesAmount?: number;
  ampereFee?: number;
  kwhRate?: number;
  exchangeRate?: number;
  consumptionKwh?: number | null;
  previousReading?: number | null;
  currentReading?: number | null;
  meterNumber: string;
  meterAmpere?: number | null;
  boxCode?: string | null;
  neighborhoodId: number;
  neighborhoodName: string;
  regionId: number;
  regionName: string;
};

export type CollectorTaskSubscriber = {
  subscriberId: number;
  name: string;
  phone: string;
  address: string;
  amountDue: number;
  previousBalance?: number | null;
  invoice: CollectorTaskInvoice;
};

export type CollectorNeighborhoodTask = {
  neighborhoodId: number;
  neighborhoodName: string;
  subscribers: CollectorTaskSubscriber[];
  totalToCollect: number;
  totalPreviousBalance?: number | null;
};

export type CollectorTasksFilters = {
  month: number;
  year: number;
  regionId?: number;
  neighborhoodId?: number;
  collectorId?: number;
};

export const fetchCollectorTasks = async (
  params: CollectorTasksFilters
): Promise<CollectorNeighborhoodTask[]> => {
  const res = await api.get("/collectors/tasks", { params });
  return res.data;
};
