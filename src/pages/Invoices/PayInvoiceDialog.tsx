import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Alert,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { mapRoleToReceiverType } from "../../utils/paymentReceiver";

// use your existing payments API
import { createPayment } from "../../api/payments";

export default function PayInvoiceDialog({
  open,
  onClose,
  invoiceId,
  subscriberId,
  remainingBalance,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  invoiceId: number;
  subscriberId: number;
  remainingBalance: number;
  onSuccess: () => void;
}) {
  const { user } = useAuth();

  const receiverType = useMemo(() => {
    return user ? mapRoleToReceiverType(user.role) : "EMPLOYEE";
  }, [user]);

  const [amount, setAmount] = useState<number>(remainingBalance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);

    if (!user?.id) {
      setError("Missing user id in session. Please login again.");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (amount > remainingBalance) {
      setError(`Amount exceeds remaining balance (${remainingBalance})`);
      return;
    }

    try {
      setLoading(true);

      await createPayment({
        amount,
        subscriberId,
        invoiceId,
        receiverId: user.id,
        receiverType,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Pay Invoice #{invoiceId}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Remaining Balance"
            value={remainingBalance}
            disabled
          />

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{ min: 0, max: remainingBalance }}
          />
          <Typography variant="caption" color="text.secondary">
            Payments are applied FIFO to oldest unpaid invoices.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? "Paying..." : "Pay"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
