import {
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Skeleton,
  Alert,
} from "@mui/material";
import { useState, useMemo } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useMeterReadings } from "../../hooks/useMeterReadings";
import BulkMeterReadingsTable from "./BulkMeterReadingsTable";
import { fetchPeriodStatus } from "../../api/dashboard";
import type { MeterReading } from "../../api/meter-readings";

export default function BulkMeterReadingsPage() {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);

  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });

const periodStatusQuery = useQuery({
  queryKey: ["period-status", month, year],
  queryFn: () => fetchPeriodStatus({ month, year }),
});
const isPeriodClosed = periodStatusQuery.data?.isClosed;
  const readings = useMeterReadings({
    month,
    year,
    neighborhoodId,
  });

  const meters = readings.meters ?? [];

  const rows = useMemo(
    () =>
      meters
        .map((meter): MeterReading => {
          const latestReading = meter.readings?.[0];
          const reading =
            latestReading?.month === month && latestReading?.year === year
              ? latestReading
              : undefined;
          const previous = reading
            ? reading.previousReading
            : latestReading?.currentReading ?? 0;

          return {
            id: reading?.id ?? meter.id,
            meterId: meter.id,
            month,
            year,
            previousReading: previous,
            currentReading: reading?.currentReading ?? previous,
            consumptionKwh: reading
              ? Math.max(0, reading.currentReading - previous)
              : 0,
            createdAt: new Date().toISOString(),
            meter: {
              id: meter.id,
              number: meter.number,
              status: meter.status,
              subscriber: meter.subscriber
                ? {
                    id: meter.subscriber.id,
                    fullName: meter.subscriber.fullName,
                    phone: meter.subscriber.phone,
                  }
                : undefined,
            },
            invoice: reading?.invoice,
          };
        }),
    [meters, month, year]
  );

  const visibleRows = useMemo(
    () => rows.filter((row) => !row.invoice),
    [rows]
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Bulk Meter Readings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter monthly readings for all meters
        </Typography>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          <TextField
            select
            size="small"
            label="Region"
            value={regionId ?? "all"}
            onChange={(e) => {
              const v = e.target.value;
              setRegionId(v === "all" ? undefined : Number(v));
              setNeighborhoodId(undefined);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All Regions</MenuItem>
            {regionsQuery.data?.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Neighborhood"
            disabled={!regionId}
            value={neighborhoodId ?? "all"}
            onChange={(e) => {
              const v = e.target.value;
              setNeighborhoodId(v === "all" ? undefined : Number(v));
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Neighborhoods</MenuItem>
            {neighborhoodsQuery.data?.map((n) => (
              <MenuItem key={n.id} value={n.id}>
                {n.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {/* Table */}
     {/* Table */}
{isPeriodClosed ? (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" fontWeight={600} color="error">
      Period Closed
    </Typography>
    <Typography variant="body2">
      You cannot enter or modify meter readings for a closed period.
    </Typography>
  </Paper>
) : readings.isLoading ? (
  <Skeleton height={300} />
) : (
  <>
    {error && (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    )}
    <BulkMeterReadingsTable
      rows={visibleRows}
      onSubmit={async (rows) => {
        setError(null);
        try {
          await readings.bulkCreateReadings.mutateAsync({
            month,
            year,
            rows,
          });
        } catch (err: any) {
          setError(
            err?.response?.data?.message || "Failed to save bulk readings"
          );
        }
      }}
      submitting={readings.bulkCreateReadings.isPending}
    />
  </>
)}

    </DashboardLayout>
  );
}
