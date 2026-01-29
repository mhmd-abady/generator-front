
import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import InvoicesTable from "./InvoicesTable";
import { useAllInvoices } from "../../hooks/useInvoices";
import { useQuery } from "@tanstack/react-query";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import {
  fetchSubscribers,
  fetchSubscribersByNeighborhood,
} from "../../api/subscribers";
import { useTheme } from "../../context/ThemeContext";

const InvoicesPage = () => {


  const { colors } = useTheme();
  const [year, setYear] = useState<number | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [subscriberId, setSubscriberId] = useState<number | undefined>();

  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });

  const subscribersQuery = useQuery({
    queryKey: ["subscribers", neighborhoodId],
    queryFn: () =>
      neighborhoodId
        ? fetchSubscribersByNeighborhood(neighborhoodId)
        : fetchSubscribers(),
  });

  const { data, isLoading } = useAllInvoices({
    year,
    month,
    status,
    subscriberId,
    regionId,
    neighborhoodId,
  });

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.darker,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      '& input, & .MuiSelect-select': { color: colors.text },
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      '&.Mui-focused': { boxShadow: `0 0 0 2px ${colors.primary}22` },
    },
    '& .MuiInputLabel-root': { color: colors.labelText },
    '& .MuiSelect-icon': { color: colors.textSubtle },
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          Invoices Management
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSubtle,
            mt: 1,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          View and manage all invoices with advanced filtering options
        </Typography>
      </Paper>

      {/* Filters */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: colors.accent,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          Filters
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            flexWrap: 'wrap',
            alignItems: { xs: 'stretch', sm: 'flex-start' },
            gap: 2,
            '& > *': {
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 140 },
            },
          }}
        >
          <Stack spacing={0.5} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Billing Year
            </Typography>
            <TextField
              select
              size="small"
              value={year ?? ""}
              onChange={(e) =>
                setYear(e.target.value ? Number(e.target.value) : undefined)
              }
              sx={fieldSx}
            >
              <MenuItem value="">Remove</MenuItem>
              {Array.from({ length: 5 }).map((_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                );
              })}
            </TextField>
          </Stack>

          <Stack spacing={0.5} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Billing Month
            </Typography>
            <TextField
              select
              size="small"
              value={month ?? ""}
              onChange={(e) =>
                setMonth(e.target.value ? Number(e.target.value) : undefined)
              }
              sx={fieldSx}
            >
              <MenuItem value="">Remove</MenuItem>
              {Array.from({ length: 12 }).map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={0.5} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Invoice Status
            </Typography>
            <TextField
              select
              size="small"
              value={status ?? ""}
              onChange={(e) => setStatus(e.target.value || undefined)}
              sx={fieldSx}
            >
              <MenuItem value="">Remove</MenuItem>
              <MenuItem value="ISSUED">ISSUED</MenuItem>
              <MenuItem value="PARTIALLY_PAID">PARTIALLY_PAID</MenuItem>
              <MenuItem value="PAID">PAID</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </TextField>
          </Stack>

          <Stack spacing={0.5} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Service Region
            </Typography>
            <TextField
              select
              size="small"
              value={regionId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setRegionId(v ? Number(v) : undefined);
                setNeighborhoodId(undefined);
                setSubscriberId(undefined);
              }}
              sx={fieldSx}
            >
              <MenuItem value="">Remove</MenuItem>
              {regionsQuery.data?.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={0.5} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Neighborhood / Locality
            </Typography>
            <TextField
              select
              size="small"
              disabled={!regionId}
              value={neighborhoodId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setNeighborhoodId(v ? Number(v) : undefined);
                setSubscriberId(undefined);
              }}
              sx={fieldSx}
            >
              <MenuItem value="">Remove</MenuItem>
              {neighborhoodsQuery.data?.map((n) => (
                <MenuItem key={n.id} value={n.id}>
                  {n.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={0.5} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 } }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Subscriber Name
            </Typography>
            <TextField
              select
              size="small"
              value={subscriberId ?? ""}
              onChange={(e) =>
                setSubscriberId(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              sx={fieldSx}
            >
              <MenuItem value="">Remove</MenuItem>
              {subscribersQuery.data?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.fullName} — {s.phone}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
      {isLoading ? (
        <Paper
          sx={{
            p: 2,
            borderRadius: '12px',
            background: colors.darker,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
        </Paper>
      ) : (
        <InvoicesTable rows={data ?? []} />
      )}
    </DashboardLayout>
  );
};

export default InvoicesPage;
