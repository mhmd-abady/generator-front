import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Skeleton,
  Chip,
  Button,
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

export default function MeterReadingsPage() {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();

  const [unlocked, setUnlocked] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });

  const readings = useMeterReadings({
    month,
    year,
    neighborhoodId,
    regionId,
  });

  const meters = readings.meters ?? [];

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
        <MeterReadingsTable
          meters={meters}
          isPeriodClosed={isPeriodClosed}
          unlocked={unlocked}
          onCreate={async (meterId, currentReading) => {
            const res = await readings.createReading.mutateAsync({
              meterId,
              month,
              year,
              currentReading,
            });

            await autoCreateInvoice(res.id);
          }}
          onUpdate={async (readingId, currentReading) => {
            await readings.updateReading.mutateAsync({
              id: readingId,
              currentReading,
            });

          }}
        />
      )}

      <OwnerPasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSuccess={() => setUnlocked(true)}
      />
    </DashboardLayout>
  );
}
