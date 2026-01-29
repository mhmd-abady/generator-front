import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useMeters } from "../../hooks/useMeters";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscribers } from "../../api/subscribers";
import { fetchBoxes } from "../../api/boxes";
import { useTheme } from "../../context/ThemeContext";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

export default function MeterFormDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { createMeter } = useMeters();
  const { colors } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [form, setForm] = useState({
    number: "",
    subscriberId: 0,
    boxId: 0,
    ampere: undefined as number | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setForm({
        number: "",
        subscriberId: 0,
        boxId: 0,
        ampere: undefined,
      });
      setErrors({});
    }
  }, [open]);

  const subsQuery = useQuery({
    queryKey: ["subscribers"],
    queryFn: fetchSubscribers,
  });

  const boxesQuery = useQuery({
    queryKey: ["boxes"],
    queryFn: fetchBoxes,
  });

  // Shared field styles for consistent label placement and colors
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.dark,
      borderRadius: '12px',
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
      transition: 'all 0.2s',
      border: `1.5px solid ${colors.border}`,
      '& input': {
        color: colors.text,
        '::placeholder': { color: colors.placeholder, opacity: 1 },
      },
      '&:hover': {
        background: `${colors.primary}08`,
        borderColor: colors.accent,
      },
      '&.Mui-focused': {
        background: `${colors.primary}11`,
        borderColor: colors.accent,
        boxShadow: `0 0 0 2px ${colors.accent}44`,
      },
    },
    '& .MuiInputLabel-root': {
      color: colors.labelText,
      fontWeight: 600,
      letterSpacing: 0.3,
      fontSize: '0.85rem',
      textTransform: 'none',
      transition: 'color 0.15s ease, transform 0.15s ease',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: colors.accent,
    },
    '& .MuiFormHelperText-root': {
      color: colors.textSubtle,
      fontWeight: 400,
      letterSpacing: 0.2,
    },
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.number.trim()) {
      newErrors.number = "Meter number is required";
    }

    if (!form.subscriberId) {
      newErrors.subscriberId = "Please select a subscriber";
    }

    if (!form.boxId) {
      newErrors.boxId = "Please select a box";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validateForm()) return;

    createMeter.mutate(form, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isLoading = createMeter.isPending;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: isMobile ? 0 : "20px",
        background: colors.darker,
          border: `1px solid ${colors.border}`,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.primary}22 0%, ${colors.secondary}22 100%)`,
          borderBottom: `1px solid ${colors.border}`,
          p: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ElectricBoltIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: colors.text }}>
              Add New Meter
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSubtle, mt: 0.5 }}>
              Create a new electrical meter entry
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: colors.textSubtle,
            "&:hover": {
              background: `${colors.error}22`,
              color: colors.error,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Meter Number */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.labelText, fontWeight: 700, mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
            >
              Meter number
            </Typography>

            <TextField
              fullWidth
              id="meter-number"
              aria-label="Meter number"
              placeholder="Enter meter number (e.g., M001)"
              value={form.number}
              onChange={(e) => {
                setForm({ ...form, number: e.target.value });
                if (errors.number) setErrors({ ...errors, number: "" });
              }}
              error={!!errors.number}
              helperText={errors.number}
              sx={fieldSx}
              FormHelperTextProps={{ sx: { color: errors.number ? colors.error : colors.textSubtle } }}
              InputProps={{
                startAdornment: (
                  <ElectricBoltIcon sx={{ color: colors.textSubtle, mr: 1 }} />
                ),
                inputProps: { style: { color: colors.text, caretColor: colors.accent } },
              }}
            />
          </Box>

          {/* Subscriber Selection */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.labelText, fontWeight: 700, mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
            >
              Subscriber
            </Typography>

            <TextField
              select
              fullWidth
              id="subscriber"
              aria-label="Subscriber"
              value={form.subscriberId || ""}
              onChange={(e) => {
                setForm({ ...form, subscriberId: Number(e.target.value) });
                if (errors.subscriberId) setErrors({ ...errors, subscriberId: "" });
              }}
              error={!!errors.subscriberId}
              helperText={errors.subscriberId}
              disabled={subsQuery.isLoading}
              sx={fieldSx}
              FormHelperTextProps={{ sx: { color: errors.subscriberId ? colors.error : colors.textSubtle } }}
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ color: colors.textSubtle, mr: 1 }} />
                ),
                inputProps: { style: { color: colors.text, caretColor: colors.accent } },
              }}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: colors.textSubtle }}>
                  Select a subscriber
                </Typography>
              </MenuItem>
              {subsQuery.data?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Box>
                    <Typography fontWeight={600}>{s.fullName}</Typography>
                    <Typography variant="body2" sx={{ color: colors.textSubtle }}>
                      {s.phone}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box> 

          {/* Box Selection */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.labelText, fontWeight: 700, mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
            >
              Box
            </Typography>

            <TextField
              select
              fullWidth
              id="box"
              aria-label="Box"
              value={form.boxId || ""}
              onChange={(e) => {
                setForm({ ...form, boxId: Number(e.target.value) });
                if (errors.boxId) setErrors({ ...errors, boxId: "" });
              }}
              error={!!errors.boxId}
              helperText={errors.boxId}
              disabled={boxesQuery.isLoading}
              sx={fieldSx}
              FormHelperTextProps={{ sx: { color: errors.boxId ? colors.error : colors.textSubtle } }}
              InputProps={{
                startAdornment: (
                  <BusinessIcon sx={{ color: colors.textSubtle, mr: 1 }} />
                ),
                inputProps: { style: { color: colors.text, caretColor: colors.accent } },
              }}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: colors.textSubtle }}>
                  Select a box
                </Typography>
              </MenuItem>
              {boxesQuery.data?.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  <Typography fontWeight={600}>{b.code}</Typography>
                </MenuItem>
              ))}
            </TextField>
          </Box> 

          {/* Ampere (Optional) */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.labelText, fontWeight: 700, mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
            >
              Ampere (optional)
            </Typography>

            <TextField
              fullWidth
              id="ampere"
              aria-label="Ampere"
              placeholder="Enter ampere rating"
              type="number"
              value={form.ampere ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  ampere: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              sx={fieldSx}
              FormHelperTextProps={{ sx: { color: colors.textSubtle } }}
              InputProps={{
                startAdornment: (
                  <ElectricBoltIcon sx={{ color: colors.textSubtle, mr: 1 }} />
                ),
                inputProps: { style: { color: colors.text, caretColor: colors.accent } },
              }}
            />
            <Typography variant="caption" sx={{ color: colors.textSubtle, mt: 1, display: "block" }}>
              Leave empty if ampere rating is not specified
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          borderTop: `1px solid ${colors.border}`,
          background: colors.dark,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            color: colors.textSubtle,
            "&:hover": {
              background: `${colors.textSubtle}22`,
            },
            minWidth: { xs: "80px", sm: "100px" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={isLoading || hasErrors}
          startIcon={isLoading ? undefined : <AddIcon />}
          sx={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
            color: "white",
            px: { xs: 3, sm: 4 },
            py: 1.5,
            borderRadius: "10px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: `0 4px 16px ${colors.accent}44`,
            transition: "all 0.3s ease",
            "&:hover": {
              background: `linear-gradient(135deg, ${colors.accent}dd 0%, ${colors.primary}dd 100%)`,
              transform: "translateY(-1px)",
              boxShadow: `0 6px 20px ${colors.accent}66`,
            },
            "&:disabled": {
              background: colors.textSubtle,
              color: colors.dark,
              transform: "none",
            },
            minWidth: { xs: "120px", sm: "140px" },
          }}
        >
          {isLoading ? "Creating..." : "Create Meter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
