import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { User, UserRole } from "../../api/staff";

export type StaffFormValues = {
  username: string;
  email: string;
  role: UserRole;
  password: string;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: User | null;
  onClose: () => void;
  onSubmit: (values: StaffFormValues) => void;
};

const ROLE_OPTIONS: UserRole[] = ["EMPLOYEE", "COLLECTOR"];

export default function StaffFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<StaffFormValues>({
    username: "",
    email: "",
    role: "EMPLOYEE",
    password: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        username: initialData.username,
        email: initialData.email ?? "",
        role: initialData.role,
        password: "",
      });
      return;
    }

    if (mode === "create") {
      setForm({
        username: "",
        email: "",
        role: "EMPLOYEE",
        password: "",
      });
    }
  }, [mode, initialData]);

  const hasChanges = useMemo(() => {
    if (!initialData) return false;
    return (
      form.username !== initialData.username ||
      (form.email ?? "") !== (initialData.email ?? "") ||
      form.role !== initialData.role ||
      !!form.password
    );
  }, [form, initialData]);

  const canSubmit =
    mode === "create"
      ? !!form.username && !!form.password && !!form.role
      : hasChanges;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Add User" : "Edit User"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Username"
            required
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as UserRole })
            }
          >
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={mode === "create" ? "Password" : "New Password"}
            type="password"
            required={mode === "create"}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            helperText={
              mode === "edit" ? "Leave blank to keep current password." : ""
            }
          />

          {mode === "edit" && !hasChanges && (
            <Typography variant="caption" color="text.secondary">
              Make a change to enable save.
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(form)}
          disabled={!canSubmit}
        >
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
