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
    regionId?: number;
    neighborhood?: {
      id: number;
      name: string;
      regionId?: number;
      region?: {
        id: number;
        name: string;
      };
    };
    region?: {
      id: number;
      name: string;
    };
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

export const fetchMetersByFilters = async (params: {
  neighborhoodId?: number;
  regionId?: number;
}): Promise<Meter[]> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  );
  const res = await api.get<Meter[]>(`/meters/by-filters`, { params: cleanParams });
  return res.data;
};
