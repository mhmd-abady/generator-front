import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Skeleton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useMeterReadings } from "../../hooks/useMeterReadings";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useQuery } from "@tanstack/react-query";
import MeterReadingsTable from "./MeterReadingsTable";
import { useTheme } from "../../context/ThemeContext";
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

  const { colors } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.dark,
      borderRadius: '10px',
      border: `1px solid ${colors.border}`,
      '& input, & .MuiSelect-select, & .MuiInputBase-input': { color: colors.text },
      '& input::placeholder': { color: colors.placeholder, opacity: 1 },
      '&:hover': { background: `${colors.primary}05` },
      '&.Mui-focused': { boxShadow: `0 0 0 2px ${colors.primary}22` },
    },
    '& .MuiInputLabel-root': { color: colors.labelText, fontWeight: 600 },
  };

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

  // Filter dialog state
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <DashboardLayout>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          background: `linear-gradient(135deg, ${colors.primary}11 0%, ${colors.secondary}11 100%)`,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={{ xs: 1, sm: 0 }}
        >
          <div>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: `linear-gradient(90deg, ${colors.accent} 90%, ${colors.primary} 50%, ${colors.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                mb: 0.5,
                letterSpacing: 0.3,
              }}
            >
              Meter Readings
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSubtle }}>
              Track and edit monthly meter readings
            </Typography>
          </div>

          <Stack direction="row" spacing={1} alignItems="center">
            {isMobile && (
              <Button
                variant="outlined"
                onClick={() => setFiltersOpen(true)}
                sx={{ color: colors.accent, borderColor: colors.border }}
              >
                Filters
              </Button>
            )}

            <Button
              variant="contained"
              onClick={() => (unlocked ? setUnlocked(false) : setPasswordOpen(true))}
              sx={{
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {unlocked ? 'Lock' : 'Unlock'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Inline filters for desktop/tablet; mobile uses dialog */}
      {!isMobile && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2, background: `linear-gradient(135deg, ${colors.primary}11 0%, ${colors.secondary}11 100%)`, border: `1px solid ${colors.border}`, borderRadius: '16px' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
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

            {isPeriodClosed && (
              <Chip label="Period Closed" color="error" size="small" />
            )}

            <Button variant="outlined" sx={{ ml: 'auto', borderColor: colors.border, color: colors.textSubtle, borderRadius: '10px' }} onClick={() => {
              setMonth(now.getMonth() + 1);
              setYear(now.getFullYear());
              setRegionId(undefined);
              setNeighborhoodId(undefined);
            }}>
              Reset
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Filters dialog (mobile) */}
      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : '16px',
            background: colors.darker,
            border: `1px solid ${colors.border}`,
          },
        }}
      >
        <DialogTitle sx={{ background: `linear-gradient(135deg, ${colors.primary}22 0%, ${colors.secondary}22 100%)`, borderBottom: `1px solid ${colors.border}` }}>
          Filters
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField select fullWidth label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))} sx={fieldSx}>
              {Array.from({ length: 12 }).map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </TextField>

            <TextField fullWidth label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} sx={fieldSx} />

            <TextField select fullWidth label="Region" value={regionId ?? 'all'} onChange={(e) => { const v = e.target.value; setRegionId(v === 'all' ? undefined : Number(v)); setNeighborhoodId(undefined); }} sx={fieldSx}>
              <MenuItem value="all">All Regions</MenuItem>
              {regionsQuery.data?.map((r) => (<MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>))}
            </TextField>

            <TextField select fullWidth label="Neighborhood" value={neighborhoodId ?? 'all'} onChange={(e) => { const v = e.target.value; setNeighborhoodId(v === 'all' ? undefined : Number(v)); }} disabled={!regionId} sx={fieldSx}>
              <MenuItem value="all">All Neighborhoods</MenuItem>
              {neighborhoodsQuery.data?.map((n) => (<MenuItem key={n.id} value={n.id}>{n.name}</MenuItem>))}
            </TextField>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="text" onClick={() => { setMonth(now.getMonth()+1); setYear(now.getFullYear()); setRegionId(undefined); setNeighborhoodId(undefined); }}>Reset</Button>
              <Button variant="contained" onClick={() => setFiltersOpen(false)} sx={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`, color: 'white' }}>Apply</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

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
