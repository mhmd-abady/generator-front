import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { MeterStatus } from "../../api/meters";

const statusOptions: MeterStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "BROKEN",
  "REPLACED",
  "DISCONNECTED",
];

export default function ChangeStatusDialog({
  open,
  currentStatus,
  onClose,
  onConfirm,
}: {
  open: boolean;
  currentStatus?: MeterStatus;
  onClose: () => void;
  onConfirm: (newStatus: MeterStatus) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<MeterStatus>(
    currentStatus ?? "ACTIVE"
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSelectStatus = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    onConfirm(selectedStatus);
    setConfirmOpen(false);
    onClose();
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  if (confirmOpen) {
    return (
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body1">
              Are you sure you want to change the meter status to <strong>{selectedStatus}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current status: <strong>{currentStatus ?? "UNKNOWN"}</strong>
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>No</Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Meter Status</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Current status: <strong>{currentStatus ?? "UNKNOWN"}</strong>
          </Typography>
          <Typography variant="subtitle2">Select new status:</Typography>
          <RadioGroup
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as MeterStatus)}
          >
            {statusOptions.map((status) => (
              <FormControlLabel
                key={status}
                value={status}
                control={<Radio />}
                label={status}
              />
            ))}
          </RadioGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSelectStatus}
          disabled={selectedStatus === currentStatus}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
