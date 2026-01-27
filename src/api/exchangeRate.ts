import { api } from "./axios";

export type ExchangeRate = {
  id: number;
  usdToLbp: number;
  isActive: boolean;
  note?: string;
  createdAt: string;
};

export const fetchActiveRate = async (): Promise<ExchangeRate> => {
  const res = await api.get("/exchange-rate/active");
  return res.data;
};

export const fetchRateHistory = async (): Promise<ExchangeRate[]> => {
  const res = await api.get("/exchange-rate/history");
  return res.data;
};

export const setExchangeRate = async (payload: {
  usdToLbp: number;
  note?: string;
}) => {
  const res = await api.post("/exchange-rate", payload);
  return res.data;
};
