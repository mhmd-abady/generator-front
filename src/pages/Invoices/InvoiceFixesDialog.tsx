import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { addInvoiceFixes } from "../../api/invoices";

export default function InvoiceFixesDialog({
  open,
  onClose,
  invoiceId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  invoiceId: number;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);

    if (amount <= 0) {
      setError("Fixes amount must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      await addInvoiceFixes(invoiceId, {
        fixesAmount: amount,
        fixesNote: note || undefined,
      });
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to add fixes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Fixes</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Fixes Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={3}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? "Saving..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
