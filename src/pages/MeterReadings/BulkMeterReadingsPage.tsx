import {
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Skeleton,
} from "@mui/material";
import { useState, useMemo } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useMeterReadings } from "../../hooks/useMeterReadings";
import BulkMeterReadingsTable from "./BulkMeterReadingsTable";
import { fetchPeriodStatus } from "../../api/dashboard";

export default function BulkMeterReadingsPage() {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();

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

  // Only meters WITHOUT invoice (editable)
  const editableRows = useMemo(
    () =>
      (readings.readings ?? []).filter(
        (r) => !r.invoice
      ),
    [readings.readings]
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
  <BulkMeterReadingsTable
    rows={editableRows}
    onSubmit={(rows) =>
      readings.bulkCreateReadings.mutate({
        month,
        year,
        rows,
      })
    }
    submitting={readings.bulkCreateReadings.isPending}
  />
)}

    </DashboardLayout>
  );
}
