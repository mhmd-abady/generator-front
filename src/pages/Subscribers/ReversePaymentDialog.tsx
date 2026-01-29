import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import WarningIcon from "@mui/icons-material/Warning";

export default function ReversePaymentDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const { colors } = useTheme();
  const [reason, setReason] = useState("");

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
          border: `1px solid ${colors.error}33`,
          boxShadow: `0 12px 40px rgba(0, 0, 0, 0.3)`,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.error}33 0%, ${colors.error}22 100%)`,
          borderBottom: `1px solid ${colors.error}33`,
          color: colors.error,
          fontWeight: 700,
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          padding: { xs: "16px", sm: "20px" },
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <WarningIcon /> Reverse Payment
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 2 }}>
          <Alert
            severity="warning"
            variant="outlined"
            sx={{
              background: `${colors.error}11`,
              borderColor: colors.error,
              color: colors.error,
            }}
          >
            This action will reverse the payment and credit the amount back to the subscriber's account.
          </Alert>

          <TextField
            fullWidth
            label="Reason for Reversal"
            multiline
            minRows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please explain the reason for reversing this payment..."
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: colors.text,
                transition: "all 0.3s ease",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.error,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.error,
                  boxShadow: `0 0 8px ${colors.error}33`,
                },
                "& fieldset": {
                  borderColor: colors.border,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.textSubtle,
                "&.Mui-focused": {
                  color: colors.error,
                },
              },
              "& .MuiInputBase-input": {
                color: colors.text,
              },
            }}
          />
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
          color="error"
          variant="contained"
          disabled={reason.trim().length < 5}
          onClick={() => onConfirm(reason.trim())}
          sx={{
            background: colors.error,
            fontWeight: 700,
            borderRadius: "6px",
            transition: "all 0.3s ease",
            "&:hover:not(:disabled)": {
              transform: "translateY(-2px)",
              boxShadow: `0 8px 16px ${colors.error}44`,
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Reverse Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}
