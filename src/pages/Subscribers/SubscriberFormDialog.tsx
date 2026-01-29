import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import type {
  CreateSubscriberDto,
  Subscriber,
} from "../../api/subscribers";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Subscriber | null;
  onClose: () => void;
  onSubmit: (dto: CreateSubscriberDto) => void;
};

export default function SubscriberFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const { colors } = useTheme();
  const [form, setForm] = useState<CreateSubscriberDto>({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        fullName: initialData.fullName,
        phone: initialData.phone,
        address: initialData.address ?? "",
      });
    }

    if (mode === "create") {
      setForm({ fullName: "", phone: "", address: "" });
    }
  }, [mode, initialData, open]);

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
        {mode === "create" ? "Add New Subscriber" : "Edit Subscriber"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            required
            placeholder="Enter subscriber's full name"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
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
          />

          <TextField
            fullWidth
            label="Phone Number"
            required
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
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
          />

          <TextField
            fullWidth
            label="Address"
            placeholder="Enter address (optional)"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            variant="outlined"
            multiline
            rows={3}
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
          onClick={() => onSubmit(form)}
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
          {mode === "create" ? "Create Subscriber" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
