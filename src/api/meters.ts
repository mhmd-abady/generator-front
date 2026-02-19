import { api } from "./axios";
import type { InvoiceSummary } from "./subscribers";

export type MeterStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "BROKEN"
  | "REPLACED"
  | "DISCONNECTED";

export type Meter = {
  id: number;
  number: string;
  ampere?: number;
  status: MeterStatus;

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

  invoices?: InvoiceSummary[];
};

export type CreateMeterDto = {
  number: string;
  boxId: number;
  subscriberId: number;
  ampere?: number;
};

export type UpdateMeterDto = Partial<CreateMeterDto> & {
  status?: MeterStatus;
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
  dto: UpdateMeterDto
) => {
  const res = await api.patch(`/meters/${meterId}`, dto);
  return res.data;
};

export const fetchMetersByBox = async (boxId: number) => {
  const res = await api.get(`/meters/by-box/${boxId}`);
  return res.data;
};

/*
 * GET /meters/by-subscriber/:subscriberId
 */
export const fetchMetersBySubscriber = async (
  subscriberId: number
): Promise<Meter[]> => {
  const res = await api.get<Meter[]>(
    `/meters/by-subscriber/${subscriberId}`
  );
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
