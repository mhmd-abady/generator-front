import { api } from "./axios";

export type AmperePricing = {
  id: number;
  ampere: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const fetchAmperePricing = async (params?: {
  activeOnly?: boolean;
}): Promise<AmperePricing[]> => {
  const res = await api.get<AmperePricing[]>("/ampere-pricing", { params });
  return res.data;
};

export const fetchAmperePricingByAmpere = async (
  ampere: number
): Promise<AmperePricing> => {
  const res = await api.get<AmperePricing>(`/ampere-pricing/by-ampere/${ampere}`);
  return res.data;
};

export const createAmperePricing = async (payload: {
  ampere: number;
  price: number;
  isActive?: boolean;
}): Promise<AmperePricing> => {
  const res = await api.post<AmperePricing>("/ampere-pricing", payload);
  return res.data;
};

export const updateAmperePricing = async (
  id: number,
  payload: Partial<{
    ampere: number;
    price: number;
    isActive: boolean;
  }>
): Promise<AmperePricing> => {
  const res = await api.patch<AmperePricing>(`/ampere-pricing/${id}`, payload);
  return res.data;
};

export const deleteAmperePricing = async (id: number): Promise<void> => {
  await api.delete(`/ampere-pricing/${id}`);
};

