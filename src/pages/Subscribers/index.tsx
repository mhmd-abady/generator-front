import { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Skeleton,
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useQuery } from "@tanstack/react-query";
import type { Region, Neighborhood } from "../../api/locations";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useSubscribers } from "../../hooks/useSubscribers";
import { useBoxes } from "../../hooks/useBoxes";
import SubscribersTable from "./SubscribersTable";
import SubscriberFormDialog from "./SubscriberFormDialog";
import type { Subscriber } from "../../api/subscribers";
import { useNavigate } from "react-router-dom";
export default function SubscribersPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Subscriber | null>(null);
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [boxId, setBoxId] = useState<number | undefined>();

  const regionsQuery = useQuery<Region[]>({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery<Neighborhood[]>({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });
  const { boxes, isLoading: boxesLoading } = useBoxes(
    neighborhoodId,
    regionId
  );
  const subscribers = useSubscribers(neighborhoodId);
  const [search, setSearch] = useState("");
  const filteredSubscribers =
    subscribers.subscribers?.filter((s) => {
      const activeFromArray = s.meters?.find((m: any) => m?.status === "ACTIVE");
      const meterInfo = activeFromArray || s.meter || (s.meters && s.meters[0]);

      if (boxId) {
        const meterBoxId = meterInfo?.box?.id;
        if (meterBoxId !== boxId) return false;
      }

      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const region =
        meterInfo?.box?.region?.name?.toLowerCase() ??
        meterInfo?.box?.neighborhood?.region?.name?.toLowerCase() ??
        "";
      const box = meterInfo?.box?.code?.toLowerCase() ?? "";

      return (
        s.fullName.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        region.includes(q) ||
        box.includes(q)
      );
    }) ?? [];
  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={600}>
            Subscribers
          </Typography>

          <Button
            variant="contained"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add Subscriber
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            size="small"
            label="Region"
            value={regionId ?? "all"}
            onChange={(e) => {
              const value = e.target.value;
              setRegionId(value === "all" ? undefined : Number(value));
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

          <TextField
            select
            size="small"
            label="Neighborhood"
            disabled={!regionId}
            value={neighborhoodId ?? "all"}
            onChange={(e) => {
              const value = e.target.value;
              setNeighborhoodId(value === "all" ? undefined : Number(value));
              setBoxId(undefined);
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
            label="Search (Name, Phone, Region, Box)"
            placeholder="Type name, phone, region, or box..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260 }}
          />
        </Stack>
      </Paper>

      {subscribers.isLoading ? (
        <Skeleton height={300} />
      ) : (
        <SubscribersTable
          rows={filteredSubscribers}
          onDelete={(id) => subscribers.deleteSubscriber.mutate(id)}
          onEdit={(row) => {
            setEditing(row);
            setOpen(true);
          }}
          onViewDetails={(row) => navigate(`/subscribers/${row.id}`)}
          onViewStatement={(row) => navigate(`/subscribers/${row.id}/statement`)}
        />
      )}

      <SubscriberFormDialog
        open={open}
        mode={editing ? "edit" : "create"}
        initialData={editing}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          if (editing) {
            subscribers.updateSubscriber.mutate({
              id: editing.id,
              dto: data,
            });
          } else {
            subscribers.createSubscriber.mutate(data);
          }
          setOpen(false);
        }}
      />
    </DashboardLayout>
  );
}

