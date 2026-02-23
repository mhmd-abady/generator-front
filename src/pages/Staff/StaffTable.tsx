import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import type { User, UserRole } from "../../api/staff";
import { formatDisplayDate } from "../../utils/date";

const roleColor = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return "error";
    case "COLLECTOR":
      return "info";
    case "EMPLOYEE":
      return "success";
    default:
      return "default";
  }
};

const formatDate = (value?: string | null) =>
  formatDisplayDate(value ?? undefined);

export default function StaffTable({
  rows,
  onEdit,
}: {
  rows: User[];
  onEdit?: (row: User) => void;
}) {
  return (
    <Paper sx={{ p: 2, overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Locked Until</TableCell>
            <TableCell>Failed Attempts</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((u) => (
            <TableRow key={u.id} hover>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email ?? "—"}</TableCell>
              <TableCell>
                <Chip size="small" label={u.role} color={roleColor(u.role)} />
              </TableCell>
              <TableCell>{formatDate(u.createdAt)}</TableCell>
              <TableCell>{formatDate(u.lockedUntil)}</TableCell>
              <TableCell>{u.failedLoginAttempts ?? "—"}</TableCell>
              <TableCell align="right">
                {onEdit ? (
                  <Tooltip
                    title={
                      u.role === "ADMIN"
                        ? "Admins cannot be edited"
                        : "Edit user"
                    }
                  >
                    <span>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onEdit(u)}
                        disabled={u.role === "ADMIN"}
                      >
                        Edit
                      </Button>
                    </span>
                  </Tooltip>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

