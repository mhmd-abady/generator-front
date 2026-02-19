import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import type { Meter, MeterStatus } from "../../api/meters";
import ChangeStatusDialog from "./ChangeStatusDialog";

export default function MetersTable({
  rows,
  disablePaper = false,
  onUpdateStatus,
}: {
  rows: Meter[];
  disablePaper?: boolean;
  onUpdateStatus?: (meterId: number, status: MeterStatus) => void;
}) {
  const [selectedMeterId, setSelectedMeterId] = useState<number | null>(null);

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

  const selectedMeter = selectedMeterId
    ? rows.find((m) => m.id === selectedMeterId)
    : null;

  const table = (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Number</TableCell>
          <TableCell>Subscriber</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Box</TableCell>
          <TableCell>Ampere</TableCell>
          <TableCell>Status</TableCell>
          {onUpdateStatus && <TableCell align="right">Actions</TableCell>}
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((m) => (
          <TableRow key={m.id}>
            <TableCell>{m.number}</TableCell>
            <TableCell>{m.subscriber?.fullName}</TableCell>
            <TableCell>{m.subscriber?.phone}</TableCell>
            <TableCell>{m.box?.code}</TableCell>
            <TableCell>{m.ampere ?? "-"}</TableCell>
            <TableCell>
              <Chip
                size="small"
                label={m.status ?? "UNKNOWN"}
                color={statusColor(m.status)}
              />
            </TableCell>
            {onUpdateStatus && (
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedMeterId(m.id)}
                >
                  Change Status
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (disablePaper) return table;

  return (
    <>
      <Paper sx={{ p: 2 }}>{table}</Paper>
      {selectedMeter && (
        <ChangeStatusDialog
          open={!!selectedMeterId}
          currentStatus={selectedMeter.status}
          onClose={() => setSelectedMeterId(null)}
          onConfirm={(newStatus) => {
            if (onUpdateStatus) {
              onUpdateStatus(selectedMeter.id, newStatus);
            }
            setSelectedMeterId(null);
          }}
        />
      )}
    </>
  );
}
