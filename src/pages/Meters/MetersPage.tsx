import {
  Paper,
  Stack,
  Typography,
  Button,
  Skeleton,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useMeters } from "../../hooks/useMeters";
import MetersTable from "./MetersTable";
import MeterFormDialog from "./MeterFormDialog";
import { useRegions } from "../../hooks/useRegions";
import { useNeighborhoods } from "../../hooks/useNeighborhoods";
import { useBoxes } from "../../hooks/useBoxes";
import SearchIcon from "@mui/icons-material/Search";
import type { Meter } from "../../api/meters";

export default function MetersPage() {
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [boxId, setBoxId] = useState<number | undefined>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { regions } = useRegions();
  const { neighborhoods, isLoading: hoodsLoading } = useNeighborhoods(regionId);
  const { boxes, isLoading: boxesLoading } = useBoxes(
    neighborhoodId,
    regionId
  );

  const { meters, isLoading } = useMeters({
    regionId,
    neighborhoodId,
    boxId,
  });

  const filtered = (meters ?? []).filter((m: Meter) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const box = m.box?.code?.toLowerCase() ?? "";
    const meterNumber = m.number?.toLowerCase() ?? "";
    const subscriber = m.subscriber?.fullName?.toLowerCase() ?? "";
    const phone = m.subscriber?.phone?.toLowerCase() ?? "";
    const ampere = m.ampere !== undefined && m.ampere !== null ? String(m.ampere) : "";
    return (
      box.includes(q) ||
      meterNumber.includes(q) ||
      subscriber.includes(q) ||
      phone.includes(q) ||
      ampere.includes(q)
    );
  });

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Meters
          </Typography>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Meter
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
          <TextField
            select
            size="small"
            label="Region"
            sx={{ minWidth: 180 }}
            value={regionId ?? "all"}
            onChange={(e) => {
              const v = e.target.value;
              const nextRegion = v === "all" ? undefined : Number(v);
              setRegionId(nextRegion);
              setNeighborhoodId(undefined);
              setBoxId(undefined);
            }}
          >
            <MenuItem value="all">All Regions</MenuItem>
            {regions.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Neighborhood"
            sx={{ minWidth: 200 }}
            disabled={!regionId || hoodsLoading}
            value={neighborhoodId ?? "all"}
            onChange={(e) => {
              const v = e.target.value;
              const nextHood = v === "all" ? undefined : Number(v);
              setNeighborhoodId(nextHood);
              setBoxId(undefined);
            }}
          >
            <MenuItem value="all">All Neighborhoods</MenuItem>
            {neighborhoods.map((n) => (
              <MenuItem key={n.id} value={n.id}>
                {n.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Box"
            sx={{ minWidth: 160 }}
            disabled={boxesLoading || (!regionId && !neighborhoodId)}
            value={boxId ?? "all"}
            onChange={(e) => {
              const v = e.target.value;
              setBoxId(v === "all" ? undefined : Number(v));
            }}
          >
            <MenuItem value="all">All Boxes</MenuItem>
            {boxes.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.code}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Search"
            placeholder="Box, meter, subscriber, phone, ampere"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 260 }}
          />
        </Stack>
      </Paper>

      {isLoading ? (
        <Skeleton height={300} />
      ) : (
        <MetersTable rows={filtered} />
      )}

      <MeterFormDialog open={open} onClose={() => setOpen(false)} />
    </DashboardLayout>
  );
}
