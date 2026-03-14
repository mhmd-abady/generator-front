import {
  Paper,
  Table,
  TableContainer,
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
import { meterStatusChipSx, meterStatusColor } from "./meterStatus";

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

  const selectedMeter = selectedMeterId
    ? rows.find((m) => m.id === selectedMeterId)
    : null;

  const table = (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 760 }}>
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Subscriber</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Box</TableCell>
            <TableCell>Ampere</TableCell>
            <TableCell align="center">Status</TableCell>
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
              <TableCell align="center">
                <Chip
                  size="medium"
                  label={m.status ?? "UNKNOWN"}
                  color={meterStatusColor(m.status)}
                  sx={meterStatusChipSx}
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
    </TableContainer>
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
