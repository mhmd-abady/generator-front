import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import type { DashboardContext } from "./Index";
import {
  fetchRegions,
  fetchNeighborhoodsByRegion,
} from "../../api/locations";
import type {Region, Neighborhood} from '../../api/locations';
import { useQuery } from '@tanstack/react-query';
import { useState } from "react";

type Props = {
  context: DashboardContext;
  onChange: (ctx: DashboardContext) => void;
  loading: boolean;
};

export default function DashboardHeader({
  context,
  onChange,
  loading,
}: Props) {
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const today = new Date();
  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const [useRange, setUseRange] = useState(false);
  const defaultFrom = formatDate(startOfMonth);
  const defaultTo = formatDate(today);

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
          {useRange ? (
            <>
              <TextField
                size="small"
                label="From"
                type="date"
                value={context.from ?? defaultFrom}
                onChange={(e) =>
                  onChange({ ...context, from: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                disabled={loading}
                sx={{ width: 150 }}
              />

              <TextField
                size="small"
                label="To"
                type="date"
                value={context.to ?? defaultTo}
                onChange={(e) =>
                  onChange({ ...context, to: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                disabled={loading}
                sx={{ width: 150 }}
              />
            </>
          ) : (
            <>
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
            </>
          )}

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


          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setUseRange((v) => {
                const next = !v;
                if (next) {
                  onChange({
                    ...context,
                    from: context.from ?? defaultFrom,
                    to: context.to ?? defaultTo,
                    month: undefined,
                    year: undefined,
                  });
                } else {
                  onChange({
                    ...context,
                    from: undefined,
                    to: undefined,
                    month: today.getMonth() + 1,
                    year: today.getFullYear(),
                  });
                }
                return next;
              });
            }}
            disabled={loading}
          >
            {useRange ? "Specific" : "From / To"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}


