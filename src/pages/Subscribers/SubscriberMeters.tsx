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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { MeterStatus } from "../../api/meters";
import { meterStatusChipSx, meterStatusColor } from "../Meters/meterStatus";
import ChangeStatusDialog from "../Meters/ChangeStatusDialog";

type MeterRow = {
  id: number;
  number: string;
  status?: MeterStatus;
  box?: {
    code?: string;
    neighborhood?: { name?: string };
  };
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
  const [selectedMeterId, setSelectedMeterId] = useState<number | null>(null);
  const visibleMeters = useMemo(() => {
    if (!meters) return meters;
    if (!showActiveOnly) return meters;
    return meters.filter((m) => m.status === "ACTIVE");
  }, [meters, showActiveOnly]);
  const selectedMeter = selectedMeterId
    ? visibleMeters?.find((m) => m.id === selectedMeterId) ?? null
    : null;

  return (
    <>
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
                <TableCell align="center">Status</TableCell>
                <TableCell>Box</TableCell>
                <TableCell>Neighborhood</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleMeters.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.number}</TableCell>
                  <TableCell align="center">
                    <Chip
                      size="medium"
                      label={m.status ?? "UNKNOWN"}
                      color={meterStatusColor(m.status)}
                      sx={meterStatusChipSx}
                    />
                  </TableCell>
                  <TableCell>{m.box?.code}</TableCell>
                  <TableCell>{m.box?.neighborhood?.name}</TableCell>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedMeterId(m.id)}
                      >
                        Change Status
                      </Button>
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

      {selectedMeter && (
        <ChangeStatusDialog
          open={!!selectedMeterId}
          currentStatus={selectedMeter.status}
          onClose={() => setSelectedMeterId(null)}
          onConfirm={(newStatus) => {
            onUpdateStatus(selectedMeter.id, newStatus);
            setSelectedMeterId(null);
          }}
        />
      )}
    </>
  );
}
