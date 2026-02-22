import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { ChangePasswordDto } from "../../api/staff";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (dto: ChangePasswordDto) => void;
};

export default function ChangePasswordDialog({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open]);

  const mismatch = useMemo(() => {
    if (!confirmPassword) return false;
    return newPassword !== confirmPassword;
  }, [newPassword, confirmPassword]);

  const canSubmit =
    !!currentPassword && !!newPassword && !!confirmPassword && !mismatch;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={mismatch}
            helperText={mismatch ? "Passwords do not match." : ""}
          />
          <Typography variant="caption" color="text.secondary">
            You will be signed out if your token becomes invalid.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() =>
            onSubmit({
              currentPassword,
              newPassword,
            })
          }
          disabled={!canSubmit}
        >
          Update Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
