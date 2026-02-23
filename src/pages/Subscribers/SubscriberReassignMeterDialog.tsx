import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Stack,
  Typography,
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
          <Typography variant="body2" color="text.secondary">
            Meter ID: {meterId}
          </Typography>
          <Autocomplete
            options={
              subsQuery.data?.filter((s) => s.id !== currentSubscriberId) ??
              []
            }
            value={
              subsQuery.data?.find((s) => s.id === targetId) ??
              null
            }
            onChange={(_, value) => setTargetId(value?.id)}
            getOptionLabel={(option) =>
              `${option.fullName} - ${option.phone}`
            }
            isOptionEqualToValue={(option, value) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label="New Subscriber" />
            )}
            fullWidth
          />
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






