import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  Skeleton,
  Chip,
  Button,
  Alert,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useMeterReadings } from "../../hooks/useMeterReadings";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useQuery } from "@tanstack/react-query";
import MeterReadingsTable from "./MeterReadingsTable";
import { fetchPeriodStatus } from "../../api/dashboard";
import OwnerPasswordDialog from "../../components/OwnerPasswordDialog";
import { api } from "../../api/axios";
import { useBoxes } from "../../hooks/useBoxes";

export default function MeterReadingsPage() {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [boxId, setBoxId] = useState<number | undefined>();
  const [search, setSearch] = useState("");

  const [unlocked, setUnlocked] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
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

  const { boxes, isLoading: boxesLoading } = useBoxes(neighborhoodId, regionId);

  const readings = useMeterReadings({
    month,
    year,
    neighborhoodId,
    regionId,
    boxId,
  });

  const meters = readings.meters ?? [];
  const filteredMeters = meters.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const meterNumber = m.number?.toLowerCase() ?? "";
    const subscriber = m.subscriber?.fullName?.toLowerCase() ?? "";
    const box = m.box?.code?.toLowerCase() ?? "";
    const region =
      m.box?.region?.name?.toLowerCase() ??
      m.box?.neighborhood?.region?.name?.toLowerCase() ??
      "";

    return (
      meterNumber.includes(q) ||
      subscriber.includes(q) ||
      box.includes(q) ||
      region.includes(q)
    );
  });

  const periodStatusQuery = useQuery({
    queryKey: ["period-status", month, year],
    queryFn: () => fetchPeriodStatus({ month, year }),
  });

  const isPeriodClosed = periodStatusQuery.data?.isClosed;

  const autoCreateInvoice = async (readingId: number) => {
    await api.post(`/invoices/from-reading/${readingId}`);
  };

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Meter Readings
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, mx: 2 }}>
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
                setBoxId(undefined);
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

            <Autocomplete
              size="small"
              options={neighborhoodsQuery.data ?? []}
              value={
                neighborhoodsQuery.data?.find(
                  (n) => n.id === neighborhoodId
                ) ?? null
              }
              onChange={(_, value) => {
                setNeighborhoodId(value ? value.id : undefined);
                setBoxId(undefined);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              renderInput={(params) => (
                <TextField {...params} label="Neighborhood" />
              )}
              disabled={!regionId}
              sx={{ minWidth: 200 }}
            />

            <Autocomplete
              size="small"
              options={boxes}
              value={boxes.find((b) => b.id === boxId) ?? null}
              onChange={(_, value) =>
                setBoxId(value ? value.id : undefined)
              }
              getOptionLabel={(option) => option.code}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Box" />
              )}
              disabled={boxesLoading || (!regionId && !neighborhoodId)}
              sx={{ minWidth: 180 }}
            />

            <TextField
              size="small"
              label="Search"
              placeholder="Meter, subscriber, box, region"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 260 }}
            />

            {isPeriodClosed && (
              <Chip label="Period Closed" color="error" size="small" />
            )}
          </Stack>

          <Button
            variant="contained"
            color={unlocked ? "error" : "success"}
            onClick={() => {
              if (unlocked) setUnlocked(false);
              else setPasswordOpen(true);
            }}
          >
            {unlocked ? "Lock 🔒" : "Unlock 🔓"}
          </Button>
        </Stack>
      </Paper>

      {readings.isLoading ? (
        <Skeleton height={300} />
      ) : (
        <>
          {error && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Paper>
          )}
          <MeterReadingsTable
            meters={filteredMeters}
            month={month}
            year={year}
            isPeriodClosed={isPeriodClosed}
            unlocked={unlocked}
            onCreate={async (meterId, currentReading) => {
              setError(null);
              try {
                const res = await readings.createReading.mutateAsync({
                  meterId,
                  month,
                  year,
                  currentReading,
                });

                await autoCreateInvoice(res.id);
              } catch (err: any) {
                setError(
                  err?.response?.data?.message || "Failed to save reading"
                );
              }
            }}
            onUpdate={async (readingId, currentReading) => {
              setError(null);
              try {
                await readings.updateReading.mutateAsync({
                  id: readingId,
                  currentReading,
                });
              } catch (err: any) {
                setError(
                  err?.response?.data?.message || "Failed to update reading"
                );
              }
            }}
          />
        </>
      )}

      <OwnerPasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSuccess={() => setUnlocked(true)}
      />
    </DashboardLayout>
  );
}




