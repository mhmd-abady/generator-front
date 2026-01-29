import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscribers } from "../../api/subscribers";
import type { Subscriber } from "../../api/subscribers";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function SubscriberReassignMeterDialog({
  open,
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
  const { colors } = useTheme();
  const [targetId, setTargetId] = useState<number | undefined>();

  const subsQuery = useQuery<Subscriber[]>({
    queryKey: ["subscribers"],
    queryFn: fetchSubscribers,
    enabled: open,
  });

  const currentSubscriber = subsQuery.data?.find(
    (s) => s.id === currentSubscriberId
  );
  const targetSubscriber = subsQuery.data?.find((s) => s.id === targetId);

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
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <SwapHorizIcon /> Reassign Meter
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 2 }}>
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              background: `${colors.primary}11`,
              borderColor: colors.primary,
              color: colors.text,
            }}
          >
            Move this meter from {currentSubscriber?.fullName} to another subscriber.
          </Alert>

          {subsQuery.isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100px",
              }}
            >
              <CircularProgress size={40} />
            </Box>
          ) : (
            <TextField
              select
              label="Select New Subscriber"
              value={targetId ?? ""}
              onChange={(e) => setTargetId(Number(e.target.value))}
              fullWidth
              placeholder="Choose a subscriber..."
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
              <MenuItem value="" disabled>
                Choose a subscriber...
              </MenuItem>
              {subsQuery.data
                ?.filter((s) => s.id !== currentSubscriberId)
                .map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.fullName} • {s.phone}
                  </MenuItem>
                ))}
            </TextField>
          )}

          {targetSubscriber && (
            <Alert
              severity="success"
              variant="outlined"
              sx={{
                background: `${colors.accent}11`,
                borderColor: colors.accent,
                color: colors.accent,
                fontWeight: 600,
              }}
            >
              ✓ Ready to reassign to {targetSubscriber.fullName}
            </Alert>
          )}
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
          disabled={!targetId || subsQuery.isLoading}
          onClick={() => targetId && onConfirm(targetId)}
          sx={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
            color: colors.darker,
            fontWeight: 700,
            borderRadius: "6px",
            transition: "all 0.3s ease",
            "&:hover:not(:disabled)": {
              transform: "translateY(-2px)",
              boxShadow: `0 8px 16px ${colors.accent}44`,
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Confirm Reassignment
        </Button>
      </DialogActions>
    </Dialog>
  );
}
