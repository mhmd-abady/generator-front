import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useMeters } from "../../hooks/useMeters";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscribers } from "../../api/subscribers";
import { fetchBoxes } from "../../api/boxes"; // if exists

export default function MeterFormDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { createMeter } = useMeters();

  const [form, setForm] = useState({
    number: "",
    subscriberId: 0,
    boxId: 0,
    ampere: undefined as number | undefined,
  });

  const subsQuery = useQuery({
    queryKey: ["subscribers"],
    queryFn: fetchSubscribers,
  });

  const boxesQuery = useQuery({
    queryKey: ["boxes"],
    queryFn: fetchBoxes, // must exist or be added
  });

  const submit = () => {
    createMeter.mutate(form, {
      onSuccess: onClose,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Meter</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Meter Number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />

          <TextField
            select
            label="Subscriber"
            value={form.subscriberId}
            onChange={(e) =>
              setForm({ ...form, subscriberId: Number(e.target.value) })
            }
          >
            {subsQuery.data?.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.fullName} — {s.phone}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Box"
            value={form.boxId}
            onChange={(e) =>
              setForm({ ...form, boxId: Number(e.target.value) })
            }
          >
            {boxesQuery.data?.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.code}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Ampere (optional)"
            type="number"
            value={form.ampere ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                ampere: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
