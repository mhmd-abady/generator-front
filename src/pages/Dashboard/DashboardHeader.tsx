import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import type { DashboardContext } from "./Index";
import type { PeriodStatus } from "../../api/dashboard";
import {
  fetchRegions,
  fetchNeighborhoodsByRegion,
} from "../../api/locations";
import type {Region, Neighborhood} from '../../api/locations';
import { useQuery } from '@tanstack/react-query';

type Props = {
  context: DashboardContext;
  onChange: (ctx: DashboardContext) => void;
  periodStatus?: PeriodStatus;
  loading: boolean;
};

export default function DashboardHeader({
  context,
  onChange,
  periodStatus,
  loading,
}: Props) {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

const regionsQuery = useQuery<Region[]>({
  queryKey: ["regions"],
  queryFn: fetchRegions,
});

const neighborhoodsQuery = useQuery<Neighborhood[]>({
  queryKey: ["neighborhoods", context.regionId],
  queryFn: () => fetchNeighborhoodsByRegion(context.regionId!),
  enabled: !!context.regionId,
});

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h6" fontWeight={600}>
          Dashboard
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            select
            size="small"
            label="Month"
            value={context.month}
            onChange={(e) =>
              onChange({ ...context, month: Number(e.target.value) })
            }
            disabled={loading}
          >
            {months.map((m, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Year"
            type="number"
            value={context.year}
            onChange={(e) =>
              onChange({ ...context, year: Number(e.target.value) })
            }
            sx={{ width: 100 }}
            disabled={loading}
          />

          <TextField
  size="small"
  label="Region"
  select
  value={context.regionId ?? "all"}
  onChange={(e) =>
    onChange({
      ...context,
      regionId:
        e.target.value === "all"
          ? undefined
          : Number(e.target.value),
      neighborhoodId: undefined,
    })
  }
  sx={{ minWidth: 160 }}
>
  <MenuItem value="all">All Regions</MenuItem>

  {regionsQuery.data?.map((r) => (
    <MenuItem key={r.id} value={r.id}>
      {r.name}
    </MenuItem>
  ))}
</TextField>


<TextField
  size="small"
  label="Neighborhood"
  select
  disabled={!context.regionId || neighborhoodsQuery.isLoading}
  value={context.neighborhoodId ?? "all"}
  onChange={(e) =>
    onChange({
      ...context,
      neighborhoodId:
        e.target.value === "all"
          ? undefined
          : Number(e.target.value),
    })
  }
  sx={{ minWidth: 180 }}
>
  <MenuItem value="all">All Neighborhoods</MenuItem>

  {neighborhoodsQuery.data?.map((n) => (
    <MenuItem key={n.id} value={n.id}>
      {n.name}
    </MenuItem>
  ))}
</TextField>


          <Chip
            label={
              periodStatus
                ? periodStatus.isClosed
                  ? "CLOSED"
                  : "OPEN"
                : "—"
            }
            color={periodStatus?.isClosed ? "default" : "success"}
            size="small"
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
