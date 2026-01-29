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
import { useState } from "react";
import { addInvoiceFixes } from "../../api/invoices";
import { useTheme } from "../../context/ThemeContext";


const InvoiceFixesDialog = (props: {
  open: boolean;
  onClose: () => void;
  invoiceId: number;
  onSuccess: () => void;
}) => {
  const { open, onClose, invoiceId, onSuccess } = props;
  const { colors } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
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

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.darker,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      '& input, & textarea': { color: colors.text },
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
          background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.error} 100%)`,
          color: '#fff',
          fontWeight: 700,
          textAlign: 'center',
          py: 2,
        }}
      >
        Add Invoice Fixes
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
            label="Adjustment Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{ min: 0, step: 0.01 }}
            fullWidth
            sx={fieldSx}
            helperText="Enter the monetary value to adjust the invoice balance"
          />

          <TextField
            label="Adjustment Note (Optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={fieldSx}
            placeholder="Describe the reason for this invoice adjustment"
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
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.error} 100%)`,
            color: '#fff',
            '&:hover': {
              ...buttonSx['&:hover'],
              background: `linear-gradient(135deg, ${colors.accent}cc 0%, ${colors.error}cc 100%)`,
            },
            '&:disabled': {
              background: colors.textSubtle,
              color: colors.text,
            },
          }}
        >
          {loading ? "Saving..." : "Add Fixes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceFixesDialog;
