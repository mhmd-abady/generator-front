// src/hooks/useMeterReadings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMeterReading,
  updateMeterReading,
  bulkCreateMeterReadings,
  type CreateMeterReadingDto,
  type BulkMeterReadingDto,
} from "../api/meter-readings";
import { api } from "../api/axios";
import type { Meter } from "../api/meters";

type MeterWithReadings = Meter & {
  readings: {
    id: number;
    previousReading: number;
    currentReading: number;
    month: number;
    year: number;
    invoice?: { id: number };
  }[];
};

async function fetchMetersWithReadings(params: {
  month: number;
  year: number;
  neighborhoodId?: number;
  boxId?: number;
  regionId?: number;
}) {
  const res = await api.get<MeterWithReadings[]>(
    "/readings/by-period",
    { params }
  );
  return res.data;
}

export function useMeterReadings(params: {
  month: number;
  year: number;
  neighborhoodId?: number;
  boxId?: number;
  regionId?: number;
}) {
  const queryClient = useQueryClient();

  const listQuery = useQuery<MeterWithReadings[]>({
    queryKey: ["meter-readings", params],
    queryFn: () => fetchMetersWithReadings(params),
    enabled: !!params.month && !!params.year,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateMeterReadingDto) =>
      createMeterReading(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-readings"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      currentReading,
    }: {
      id: number;
      currentReading: number;
    }) => updateMeterReading(id, { currentReading }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-readings"] });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: (dto: BulkMeterReadingDto) =>
      bulkCreateMeterReadings(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-readings"] });
    },
  });

  return {
    meters: listQuery.data,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,

    createReading: createMutation,
    updateReading: updateMutation,
    bulkCreateReadings: bulkMutation,
  };
}
