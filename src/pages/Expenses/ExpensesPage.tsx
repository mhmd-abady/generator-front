import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useStaff } from "../../hooks/useStaff";
import { useExpenses } from "../../hooks/useExpenses";
import type {
  CreateExpenseDto,
  Expense,
  ExpenseType,
  SalaryExpenseRole,
} from "../../api/expenses";
import { EXPENSE_TYPE_OPTIONS } from "../../api/expenses";
import { formatDisplayDate } from "../../utils/date";

type ExpenseFormValues = {
  amount: string;
  description: string;
  type: ExpenseType | "";
  salaryRole: SalaryExpenseRole | "";
  userId: string;
  incurredAt: string;
};

const getTodayInputDate = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const createDefaultForm = (): ExpenseFormValues => ({
  amount: "",
  description: "",
  type: "OTHER",
  salaryRole: "",
  userId: "",
  incurredAt: getTodayInputDate(),
});

export default function ExpensesPage() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN";

  const expenses = useExpenses();
  const staff = useStaff(canManage);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ExpenseType>("all");
  const [salaryRoleFilter, setSalaryRoleFilter] = useState<"all" | SalaryExpenseRole>(
    "all"
  );
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (expenses.rows ?? []).filter((row) => {
      if (typeFilter !== "all" && row.type !== typeFilter) {
        return false;
      }

      if (salaryRoleFilter !== "all" && row.salaryRole !== salaryRoleFilter) {
        return false;
      }

      if (!q) return true;

      const idText = String(row.id);
      const amountText = String(row.amount);
      const userText = row.user?.username?.toLowerCase() ?? "";

      return (
        idText.includes(q) ||
        amountText.includes(q) ||
        (row.description ?? "").toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
        (row.salaryRole ?? "").toLowerCase().includes(q) ||
        userText.includes(q)
      );
    });
  }, [expenses.rows, salaryRoleFilter, search, typeFilter]);

  const typeOptions = EXPENSE_TYPE_OPTIONS;

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.total += row.amount ?? 0;
        acc.count += 1;
        return acc;
      },
      { total: 0, count: 0 }
    );
  }, [rows]);

  const handleDelete = (id: number) => {
    if (!canManage) return;
    const confirmed = window.confirm("Delete this expense?");
    if (!confirmed) return;
    expenses.deleteExpense.mutate(id);
  };

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight={600}>
            Expenses
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Paper variant="outlined" sx={{ px: 1.5, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Expenses Count
              </Typography>
              <Typography fontWeight={700}>{summary.count}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ px: 1.5, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Total Amount
              </Typography>
              <Typography fontWeight={700}>{summary.total.toLocaleString()}</Typography>
            </Paper>
            <Button
              variant="contained"
              disabled={!canManage}
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
            >
              Add Expense
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {!canManage && (
        <Alert severity="info">
          Only admins can create, edit, or delete expenses. You can still view the list.
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", lg: "center" }}
          flexWrap="wrap"
        >
          <TextField
            size="small"
            label="Search"
            placeholder="ID, amount, description, type, user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: { lg: 300 } }}
          />

          <TextField
            select
            size="small"
            label="Type"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | ExpenseType)
            }
            sx={{ minWidth: { lg: 180 } }}
          >
            <MenuItem value="all">All Types</MenuItem>
            {typeOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Salary Role"
            value={salaryRoleFilter}
            onChange={(e) =>
              setSalaryRoleFilter(e.target.value as "all" | SalaryExpenseRole)
            }
            sx={{ minWidth: { lg: 180 } }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="COLLECTOR">COLLECTOR</MenuItem>
            <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {expenses.isLoading ? (
        <Skeleton height={320} />
      ) : expenses.isError ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="error">Unable to load expenses.</Typography>
        </Paper>
      ) : rows.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No expenses found.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Salary Role</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Incurred At</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.description ?? "-"}</TableCell>
                    <TableCell>{row.salaryRole ?? "-"}</TableCell>
                    <TableCell>{row.user?.username ?? "-"}</TableCell>
                    <TableCell align="right">{row.amount.toLocaleString()}</TableCell>
                    <TableCell>{formatDisplayDate(row.incurredAt)}</TableCell>
                    <TableCell>{formatDisplayDate(row.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={!canManage}
                          onClick={() => {
                            setEditing(row);
                            setOpenForm(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          disabled={!canManage}
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <ExpenseFormDialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        editing={editing}
        users={staff.users ?? []}
        loading={expenses.createExpense.isPending || expenses.updateExpense.isPending}
        onSubmit={(dto) => {
          if (editing) {
            expenses.updateExpense.mutate(
              { id: editing.id, dto },
              {
                onSuccess: () => {
                  setOpenForm(false);
                  setEditing(null);
                },
              }
            );
            return;
          }

          expenses.createExpense.mutate(dto, {
            onSuccess: () => {
              setOpenForm(false);
            },
          });
        }}
      />
    </DashboardLayout>
  );
}

function ExpenseFormDialog({
  open,
  onClose,
  onSubmit,
  editing,
  users,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateExpenseDto) => void;
  editing: Expense | null;
  users: Array<{ id: number; username: string; role: string }>;
  loading: boolean;
}) {
  const [values, setValues] = useState<ExpenseFormValues>(createDefaultForm);

  const isSalary = values.type === "SALARY";

  const roleUsers = useMemo(() => {
    if (values.salaryRole === "COLLECTOR") {
      return users.filter((u) => u.role === "COLLECTOR");
    }
    if (values.salaryRole === "EMPLOYEE") {
      return users.filter((u) => u.role === "EMPLOYEE");
    }
    return [] as Array<{ id: number; username: string; role: string }>;
  }, [users, values.salaryRole]);

  const selectedUser = useMemo(
    () => roleUsers.find((u) => String(u.id) === values.userId) ?? null,
    [roleUsers, values.userId]
  );

  const resetFromEditing = () => {
    if (!editing) {
      setValues(createDefaultForm());
      return;
    }

    setValues({
      amount: editing.amount ? String(editing.amount) : "",
      description: editing.description ?? "",
      type: editing.type ?? "OTHER",
      salaryRole: (editing.salaryRole as SalaryExpenseRole | null) ?? "",
      userId: editing.userId ? String(editing.userId) : "",
      incurredAt: editing.incurredAt
        ? editing.incurredAt.slice(0, 10)
        : getTodayInputDate(),
    });
  };

  const handleSave = () => {
    const amount = Number(values.amount);
    if (!values.type) {
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const dto: CreateExpenseDto = {
      amount,
      description: values.description.trim() || undefined,
      type: values.type,
      incurredAt: values.incurredAt || undefined,
    };

    if (isSalary) {
      if (!values.salaryRole || !values.userId) {
        return;
      }
      dto.salaryRole = values.salaryRole;
      dto.userId = Number(values.userId);
    }

    onSubmit(dto);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setValues(createDefaultForm());
      }}
      fullWidth
      maxWidth="sm"
      TransitionProps={{
        onEntered: resetFromEditing,
      }}
    >
      <DialogTitle>{editing ? "Edit Expense" : "Add Expense"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              fullWidth
              required
              size="small"
              label="Amount"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={values.amount}
              onChange={(e) =>
                setValues((v) => ({ ...v, amount: e.target.value }))
              }
            />

            <TextField
              fullWidth
              required
              select
              size="small"
              label="Type"
              value={values.type}
              onChange={(e) => {
                const next = e.target.value as ExpenseType;
                setValues((v) => ({
                  ...v,
                  type: next,
                  salaryRole: next === "SALARY" ? v.salaryRole : "",
                  userId: next === "SALARY" ? v.userId : "",
                }));
              }}
            >
              {EXPENSE_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {isSalary && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                fullWidth
                required
                select
                size="small"
                label="Salary Role"
                value={values.salaryRole}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    salaryRole: e.target.value as SalaryExpenseRole,
                    userId: "",
                  }))
                }
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="COLLECTOR">COLLECTOR</MenuItem>
                <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
              </TextField>

              <Autocomplete
                fullWidth
                size="small"
                options={roleUsers}
                value={selectedUser}
                onChange={(_, value) =>
                  setValues((v) => ({
                    ...v,
                    userId: value ? String(value.id) : "",
                  }))
                }
                getOptionLabel={(option) => option.username}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} required label="User" />
                )}
              />
            </Stack>
          )}

          <TextField
            size="small"
            label="Incurred At"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={values.incurredAt}
            onChange={(e) =>
              setValues((v) => ({ ...v, incurredAt: e.target.value }))
            }
          />

          <TextField
            size="small"
            label="Description"
            multiline
            minRows={3}
            placeholder="Optional notes about this expense"
            value={values.description}
            onChange={(e) =>
              setValues((v) => ({ ...v, description: e.target.value }))
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setValues(createDefaultForm());
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {editing ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
