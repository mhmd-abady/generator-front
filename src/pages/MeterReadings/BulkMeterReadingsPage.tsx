import {
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
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

  const { colors } = useTheme();
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.dark,
      borderRadius: '10px',
      border: `1px solid ${colors.border}`,
      '& input': { color: colors.text },
      '&:hover': { background: `${colors.primary}05` },
      '&.Mui-focused': { boxShadow: `0 0 0 2px ${colors.primary}22` },
    },
    '& .MuiInputLabel-root': { color: colors.labelText, fontWeight: 600 },
  };

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

  // Convert meters + readings into flat list of MeterReading objects and filter editable ones (no invoice)
  const editableRows = useMemo(() => {
    const rows: any[] = [];
    (readings.meters ?? []).forEach((m) => {
      (m.readings ?? []).forEach((r) => {
        rows.push({ ...r, meter: { id: m.id, number: m.number, subscriber: m.subscriber } });
      });
    });
    return rows.filter((r) => !r.invoice);
  }, [readings.meters]);

  return (
    <DashboardLayout>
      {/* Header */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          background: `linear-gradient(135deg, ${colors.primary}11 0%, ${colors.secondary}11 100%)`,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.primary} 60%, ${colors.secondary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
          }}
        >
          Bulk Meter Readings
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textSubtle }}>
          Enter monthly readings for all meters
        </Typography>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            sx={{ minWidth: 120, ...fieldSx }}
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
            sx={{ minWidth: 100, ...fieldSx }}
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
            sx={{ minWidth: 180, ...fieldSx }}
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
            sx={{ minWidth: 200, ...fieldSx }}
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
