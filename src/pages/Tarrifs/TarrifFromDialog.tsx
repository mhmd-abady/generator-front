import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, MenuItem
} from "@mui/material";
import { useState } from "react";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useQuery } from "@tanstack/react-query";

export default function TariffFormDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [scope, setScope] = useState<"GLOBAL" | "REGION" | "NEIGHBORHOOD">("GLOBAL");
  const [regionId, setRegionId] = useState<number>();
  const [neighborhoodId, setNeighborhoodId] = useState<number>();
  const [kwhRate, setKwhRate] = useState(0);
  const [ampereRate, setAmpereRate] = useState(0);

  const regionsQuery = useQuery({ queryKey: ["regions"], queryFn: fetchRegions });
  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });

  const submit = () => {
    onSubmit({
      month,
      year,
      kwhRate,
      ampereRate,
      regionId: scope === "REGION" ? regionId : undefined,
      neighborhoodId: scope === "NEIGHBORHOOD" ? neighborhoodId : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create Tariff</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField select label="Month" value={month} onChange={(e) => setMonth(+e.target.value)}>
            {Array.from({ length: 12 }).map((_, i) => (
              <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
            ))}
          </TextField>

          <TextField label="Year" value={year} onChange={(e) => setYear(+e.target.value)} />

          <TextField select label="Scope" value={scope} onChange={(e) => setScope(e.target.value as any)}>
            <MenuItem value="GLOBAL">Global</MenuItem>
            <MenuItem value="REGION">Region</MenuItem>
            <MenuItem value="NEIGHBORHOOD">Neighborhood</MenuItem>
          </TextField>

          {scope !== "GLOBAL" && (
            <TextField select label="Region" onChange={(e) => setRegionId(+e.target.value)}>
              {regionsQuery.data?.map(r => (
                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
              ))}
            </TextField>
          )}

          {scope === "NEIGHBORHOOD" && (
            <TextField select label="Neighborhood" onChange={(e) => setNeighborhoodId(+e.target.value)}>
              {neighborhoodsQuery.data?.map(n => (
                <MenuItem key={n.id} value={n.id}>{n.name}</MenuItem>
              ))}
            </TextField>
          )}

          <TextField label="kWh Rate" type="number" value={kwhRate} onChange={(e) => setKwhRate(+e.target.value)} />
          <TextField label="Ampere Rate" type="number" value={ampereRate} onChange={(e) => setAmpereRate(+e.target.value)} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
