import {
  Button,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import StaffTable from "./StaffTable";
import StaffFormDialog, { type StaffFormValues } from "./StaffFormDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useStaff } from "../../hooks/useStaff";
import { useAuth } from "../../context/AuthContext";
import type { User, UserRole } from "../../api/staff";

const ROLE_OPTIONS: UserRole[] = ["EMPLOYEE", "COLLECTOR", "ADMIN"];

export default function StaffPage() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN";

  const staff = useStaff(canManage);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [changePassOpen, setChangePassOpen] = useState(false);

  const filtered = useMemo(() => {
    const rows = staff.users ?? [];
    const q = search.trim().toLowerCase();

    return rows.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.username.toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [staff.users, search, roleFilter]);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Staff
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => setChangePassOpen(true)}
              disabled={!user}
            >
              Change My Password
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
              disabled={!canManage}
            >
              Add User
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {!canManage ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Only admins can view and manage staff.
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                size="small"
                label="Search"
                placeholder="Username, email, role"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 240 }}
              />

              <TextField
                select
                size="small"
                label="Role"
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as UserRole | "all")
                }
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                {ROLE_OPTIONS.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Paper>

          {staff.isLoading ? (
            <Skeleton height={300} />
          ) : staff.isError ? (
            <Paper sx={{ p: 3 }}>
              <Typography color="error">
                Unable to load staff users.
              </Typography>
            </Paper>
          ) : (
            <StaffTable
              rows={filtered}
              onEdit={(row) => {
                setEditing(row);
                setOpenForm(true);
              }}
            />
          )}
        </>
      )}

      <StaffFormDialog
        open={openForm}
        mode={editing ? "edit" : "create"}
        initialData={editing}
        onClose={() => setOpenForm(false)}
        onSubmit={(values: StaffFormValues) => {
          if (editing) {
            const dto: Record<string, any> = {};
            if (values.username && values.username !== editing.username) {
              dto.username = values.username;
            }
            if ((values.email ?? "") !== (editing.email ?? "")) {
              if (values.email) dto.email = values.email;
            }
            if (values.role && values.role !== editing.role) {
              dto.role = values.role;
            }
            if (values.password) {
              dto.password = values.password;
            }

            if (Object.keys(dto).length > 0) {
              staff.updateUser.mutate({ id: editing.id, dto });
            }
          } else {
            staff.createUser.mutate({
              username: values.username,
              email: values.email || undefined,
              password: values.password,
              role: values.role,
            });
          }

          setOpenForm(false);
        }}
      />

      <ChangePasswordDialog
        open={changePassOpen}
        onClose={() => setChangePassOpen(false)}
        onSubmit={(dto) => {
          staff.changePassword.mutate(dto, {
            onSuccess: () => setChangePassOpen(false),
          });
        }}
      />
    </DashboardLayout>
  );
}
