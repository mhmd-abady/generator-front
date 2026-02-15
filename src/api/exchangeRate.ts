import { api } from "./axios";

export type ExchangeRate = {
  id: number;
  usdToLbp: number;
  isActive: boolean;
  note?: string;
  createdAt: string;
};

export type SetExchangeRateDto = {
  usdToLbp: number;
  note?: string;
};

export type UpdateExchangeRateDto = {
  usdToLbp?: number;
  note?: string;
};

export const fetchActiveRate = async (): Promise<ExchangeRate> => {
  const res = await api.get("/exchange-rate/active");
  return res.data;
};

export const fetchRateHistory = async (): Promise<ExchangeRate[]> => {
  const res = await api.get("/exchange-rate/history");
  return res.data;
};

export const setExchangeRate = async (
  payload: SetExchangeRateDto
): Promise<ExchangeRate> => {
  const res = await api.post("/exchange-rate", payload);
  return res.data;
};

export const updateExchangeRate = async (
  id: number,
  payload: UpdateExchangeRateDto
): Promise<ExchangeRate> => {
  const res = await api.put(`/exchange-rate/${id}`, payload);
  return res.data;
};

export const deleteExchangeRate = async (id: number): Promise<ExchangeRate> => {
  const res = await api.delete(`/exchange-rate/${id}`);
  return res.data;
};
