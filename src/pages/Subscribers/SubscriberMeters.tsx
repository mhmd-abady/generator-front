import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Button,
  Chip,
  Stack,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { MeterStatus } from "../../api/meters";

type MeterRow = {
  id: number;
  number: string;
  status?: MeterStatus;
  box?: {
    code?: string;
    neighborhood?: { name?: string };
  };
};

const statusOptions: MeterStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "BROKEN",
  "REPLACED",
  "DISCONNECTED",
];

const statusColor = (status?: MeterStatus) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
      return "warning";
    case "BROKEN":
    case "REPLACED":
    case "DISCONNECTED":
      return "error";
    default:
      return "default";
  }
};

export default function SubscriberMeters({
  meters,
  loading,
  onReassign,
  onUpdateStatus,
}: {
  meters?: MeterRow[];
  loading: boolean;
  onReassign: (meterId: number) => void;
  onUpdateStatus: (meterId: number, status: MeterStatus) => void;
}) {
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const visibleMeters = useMemo(() => {
    if (!meters) return meters;
    if (!showActiveOnly) return meters;
    return meters.filter((m) => m.status === "ACTIVE");
  }, [meters, showActiveOnly]);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Meters
        </Typography>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
            />
          }
          label="Show active only"
        />
      </Stack>

      {loading ? (
        <Skeleton height={160} />
      ) : !visibleMeters || visibleMeters.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {showActiveOnly ? "No active meters" : "No meters assigned"}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Meter Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Box</TableCell>
              <TableCell>Neighborhood</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleMeters.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.number}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={m.status ?? "UNKNOWN"}
                    color={statusColor(m.status)}
                  />
                </TableCell>
                <TableCell>{m.box?.code}</TableCell>
                <TableCell>{m.box?.neighborhood?.name}</TableCell>
                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <TextField
                      select
                      size="small"
                      label="Status"
                      value={m.status ?? "ACTIVE"}
                      onChange={(e) =>
                        e.target.value !== m.status &&
                        onUpdateStatus(
                          m.id,
                          e.target.value as MeterStatus
                        )
                      }
                      sx={{ minWidth: 140 }}
                    >
                      {statusOptions.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button size="small" onClick={() => onReassign(m.id)}>
                      Reassign
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
