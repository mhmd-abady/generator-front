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
import type { Invoice } from "../../api/invoices";

export default function AddPaymentDialog({
  open,
  onClose,
  invoices,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onSubmit: (data: { amount: number; invoiceId?: number }) => void;
}) {
  const [amount, setAmount] = useState("");
  const [invoiceId, setInvoiceId] = useState<number | "">("");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Payment</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Amount"
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <TextField
            select
            label="Invoice (optional)"
            value={invoiceId}
            onChange={(e) =>
              setInvoiceId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <MenuItem value="">No invoice</MenuItem>
            {invoices.map((inv) => (
              <MenuItem key={inv.id} value={inv.id}>
                #{inv.id} — {inv.month}/{inv.year} — Remaining{" "}
                {inv.remainingBalance}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSubmit({
              amount: Number(amount),
              invoiceId: invoiceId || undefined,
            });
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
