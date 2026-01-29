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
import { useTheme } from "../../context/ThemeContext";

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
  const { colors } = useTheme();
  const [amount, setAmount] = useState("");
  const [invoiceId, setInvoiceId] = useState<number | "">("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx:{
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 12px 40px rgba(0, 0, 0, 0.3)`,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.primary}33 0%, ${colors.secondary}33 100%)`,
          borderBottom: `1px solid ${colors.border}33`,
          color: colors.accent,
          fontWeight: 700,
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          padding: { xs: "16px", sm: "20px" },
        }}
      >
        Add Payment
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Amount (USD)"
            type="number"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            variant="outlined"
            inputProps={{ step: "0.01", min: "0" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: colors.text,
                transition: "all 0.3s ease",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                  boxShadow: `0 0 8px ${colors.accent}33`,
                },
                "& fieldset": {
                  borderColor: colors.border,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.textSubtle,
                "&.Mui-focused": {
                  color: colors.accent,
                },
              },
              "& .MuiInputBase-input": {
                color: colors.text,
              },
            }}
          />

          <TextField
            fullWidth
            select
            label="Invoice (optional)"
            value={invoiceId}
            onChange={(e) =>
              setInvoiceId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: colors.text,
                transition: "all 0.3s ease",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                  boxShadow: `0 0 8px ${colors.accent}33`,
                },
                "& fieldset": {
                  borderColor: colors.border,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.textSubtle,
                "&.Mui-focused": {
                  color: colors.accent,
                },
              },
              "& .MuiInputBase-input": {
                color: colors.text,
              },
            }}
          >
            <MenuItem value="">No specific invoice</MenuItem>
            {invoices.map((inv) => (
              <MenuItem key={inv.id} value={inv.id}>
                Invoice #{inv.id} • {inv.month}/{inv.year} • Remaining: ${inv.remainingBalance.toLocaleString()}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${colors.border}33`,
          p: { xs: "12px", sm: "16px" },
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: colors.textSubtle,
            borderRadius: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
              background: `${colors.border}22`,
              color: colors.text,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onSubmit({
              amount: Number(amount),
              invoiceId: invoiceId || undefined,
            });
          }}
          sx={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
            color: colors.darker,
            fontWeight: 700,
            borderRadius: "6px",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 8px 16px ${colors.accent}44`,
            },
          }}
        >
          Submit Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}
