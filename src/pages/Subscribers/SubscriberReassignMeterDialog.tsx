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
import { useQuery } from "@tanstack/react-query";
import { fetchSubscribers } from "../../api/subscribers";
import type { Subscriber } from "../../api/subscribers";
import { useState } from "react";

export default function SubscriberReassignMeterDialog({
  open,
  meterId,
  currentSubscriberId,
  onClose,
  onConfirm,
}: {
  open: boolean;
  meterId: number;
  currentSubscriberId: number;
  onClose: () => void;
  onConfirm: (newSubscriberId: number) => void;
}) {
  const [targetId, setTargetId] = useState<number | undefined>();

  const subsQuery = useQuery<Subscriber[]>({
    queryKey: ["subscribers"],
    queryFn: fetchSubscribers,
    enabled: open,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reassign Meter</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="New Subscriber"
            value={targetId ?? ""}
            onChange={(e) => setTargetId(Number(e.target.value))}
            fullWidth
          >
            {subsQuery.data
              ?.filter((s) => s.id !== currentSubscriberId)
              .map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.fullName} — {s.phone}
                </MenuItem>
              ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!targetId}
          onClick={() => targetId && onConfirm(targetId)}
        >
          Reassign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
