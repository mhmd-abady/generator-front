import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";

export default function ReversePaymentDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reverse Payment</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Reason"
            multiline
            minRows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this payment is reversed"
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          disabled={reason.trim().length < 3}
          onClick={() => onConfirm(reason.trim())}
        >
          Reverse
        </Button>
      </DialogActions>
    </Dialog>
  );
}
