import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { mapRoleToReceiverType } from "../../utils/paymentReceiver";
import { createPayment } from "../../api/payments";
import { useTheme } from "../../context/ThemeContext";

const PayInvoiceDialog = (props: {
  open: boolean;
  onClose: () => void;
  invoiceId: number;
  subscriberId: number;
  remainingBalance: number;
  onSuccess: () => void;
}) => {
  const { open, onClose, invoiceId, subscriberId, remainingBalance, onSuccess } = props;
  const { colors } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
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

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.darker,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      '& input': { color: colors.text },
      '&.Mui-focused': { boxShadow: `0 0 0 2px ${colors.primary}22` },
    },
    '& .MuiInputLabel-root': { color: colors.labelText },
  };

  const buttonSx = {
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none',
    px: 3,
    py: 1.5,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${colors.primary}33`,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '12px',
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: '#fff',
          fontWeight: 700,
          textAlign: 'center',
          py: 2,
        }}
      >
        Pay Invoice #{invoiceId}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: '8px',
                background: `${colors.error}22`,
                color: colors.error,
                border: `1px solid ${colors.error}44`,
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="Remaining Balance"
            value={`$${remainingBalance.toFixed(2)}`}
            disabled
            fullWidth
            sx={fieldSx}
          />

          <TextField
            label="Payment Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{ min: 0, max: remainingBalance, step: 0.01 }}
            fullWidth
            sx={fieldSx}
            helperText={`Maximum: $${remainingBalance.toFixed(2)}`}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 2, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            ...buttonSx,
            color: colors.textSubtle,
            borderColor: colors.border,
            '&:hover': {
              ...buttonSx['&:hover'],
              background: `${colors.textSubtle}11`,
            },
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={loading}
          sx={{
            ...buttonSx,
            background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
            color: '#fff',
            '&:hover': {
              ...buttonSx['&:hover'],
              background: `linear-gradient(135deg, ${colors.secondary}cc 0%, ${colors.primary}cc 100%)`,
            },
            '&:disabled': {
              background: colors.textSubtle,
              color: colors.text,
            },
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayInvoiceDialog;
