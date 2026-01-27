import { api } from "./axios";

export type Tariff = {
  id: number;
  month: number;
  year: number;
  kwhRate: number;
  ampereRate: number;

  region?: { id: number; name: string } | null;
  neighborhood?: { id: number; name: string } | null;
};

export const fetchTariffs = async (): Promise<Tariff[]> => {
  const res = await api.get("/tariffs");
  return res.data;
};

export const createTariff = async (payload: {
  month: number;
  year: number;
  kwhRate: number;
  ampereRate: number;
  regionId?: number;
  neighborhoodId?: number;
}) => {
  const res = await api.post("/tariffs", payload);
  return res.data;
};

export const updateTariff = async (
  id: number,
  payload: Partial<{
    month: number;
    year: number;
    kwhRate: number;
    ampereRate: number;
    regionId?: number;
    neighborhoodId?: number;
  }>
) => {
  const res = await api.patch(`/tariffs/${id}`, payload);
  return res.data;
};

export const deleteTariff = async (id: number) => {
  await api.delete(`/tariffs/${id}`);
};
