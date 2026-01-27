import { api } from "./axios";

export type Meter = {
  id: number;
  number: string;
  ampere?: number;

  subscriberId: number;
  subscriber?: {
    id: number;
    fullName: string;
    phone: string;
  };

  box?: {
    id: number;
    code: string;
    neighborhoodId: number;
  };
};

export type CreateMeterDto = {
  number: string;
  boxId: number;
  subscriberId: number;
  ampere?: number;
};

/*
 * GET /meters
 */
export const fetchMeters = async (): Promise<Meter[]> => {
  const res = await api.get<Meter[]>("/meters");
  return res.data;
};

/*
 * POST /meters
 */
export const createMeter = async (
  dto: CreateMeterDto
): Promise<Meter> => {
  const res = await api.post<Meter>("/meters", dto);
  return res.data;
};

export const updateMeter = async (
  meterId: number,
  dto: { subscriberId: number }
) => {
  const res = await api.patch(`/meters/${meterId}`, dto);
  return res.data;
};

export const fetchMetersByBox = async (boxId: number) => {
  const res = await api.get(`/meters/by-box/${boxId}`);
  return res.data;
};
