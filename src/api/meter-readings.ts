// src/api/meter-readings.ts
import { api } from "./axios";
import type { MeterStatus } from "./meters";

/* =======================
   Types
======================= */

export type MeterReading = {
  id: number;
  meterId: number;

  month: number;
  year: number;

  previousReading: number;
  currentReading: number;
  consumptionKwh: number;

  createdAt: string;

  meter?: {
    id: number;
    number: string;
    status?: MeterStatus;
    subscriber?: {
      id: number;
      fullName: string;
      phone: string;
    };
  };

  invoice?: {
    id: number;
  };
};

export type CreateMeterReadingDto = {
  meterId: number;
  month: number;
  year: number;
  currentReading: number;
};

export type BulkMeterReadingRow = {
  meterId: number;
  currentReading: number;
};

export type BulkMeterReadingDto = {
  month: number;
  year: number;
  rows: BulkMeterReadingRow[];
};

/* =======================
   API calls
======================= */

/*
 * GET /readings
 */
export const fetchMeterReadings = async (params: {
  month: number;
  year: number;
  neighborhoodId?: number;
  boxId?: number;
}): Promise<MeterReading[]> => {
  const res = await api.get<MeterReading[]>(
    "/readings",
    { params }
  );
  return res.data;
};

/*
 * POST /readings
 */
export const createMeterReading = async (
  dto: CreateMeterReadingDto
): Promise<MeterReading> => {
  const res = await api.post<MeterReading>(
    "/readings",
    dto
  );
  return res.data;
};

/*
 * PATCH /readings/:id
 */
export const updateMeterReading = async (
  id: number,
  dto: { currentReading: number }
): Promise<MeterReading> => {
  const res = await api.patch<MeterReading>(
    `/readings/${id}`,
    dto
  );
  return res.data;
};

/*
 * POST /readings/bulk
 */
export const bulkCreateMeterReadings = async (
  dto: BulkMeterReadingDto
): Promise<void> => {
  await api.post("/readings/bulk", dto);
};
