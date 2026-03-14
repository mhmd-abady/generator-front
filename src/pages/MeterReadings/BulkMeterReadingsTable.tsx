import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import { useState } from "react";
import type { MeterReading } from "../../api/meter-readings";
import { meterStatusChipSx, meterStatusColor } from "../Meters/meterStatus";

export default function BulkMeterReadingsTable({
  rows,
  onSubmit,
  submitting,
}: {
  rows: MeterReading[];
  onSubmit: (rows: { meterId: number; currentReading: number }[]) => void;
  submitting: boolean;
}) {
  const [values, setValues] = useState<Record<number, number>>({});

  const handleSubmit = () => {
    const payload = rows
      .filter(
        (r) =>
          (!r.meter?.status || r.meter.status === "ACTIVE") &&
          values[r.meterId] !== undefined &&
          values[r.meterId] >= r.previousReading
      )
      .map((r) => ({
        meterId: r.meterId,
        currentReading: values[r.meterId],
      }));

    if (payload.length === 0) return;
    onSubmit(payload);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 760 }}>
        <TableHead>
          <TableRow>
            <TableCell>Meter</TableCell>
            <TableCell>Subscriber</TableCell>
            <TableCell align="right">Previous</TableCell>
            <TableCell align="right">Current</TableCell>
            <TableCell align="right">Consumption</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => {
            const current = values[r.meterId];
            const consumption =
              current !== undefined ? current - r.previousReading : undefined;
            const meterInactive =
              r.meter?.status && r.meter.status !== "ACTIVE";

            return (
              <TableRow
                key={r.id}
                sx={meterInactive ? { opacity: 0.6 } : undefined}
              >
                <TableCell>{r.meter?.number}</TableCell>
                <TableCell>{r.meter?.subscriber?.fullName}</TableCell>

                <TableCell align="right">{r.previousReading}</TableCell>

                <TableCell align="right">
                  <TextField
                    size="small"
                    type="number"
                    value={current ?? ""}
                    inputProps={{ min: r.previousReading }}
                    disabled={meterInactive}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [r.meterId]: Number(e.target.value),
                      }))
                    }
                    sx={{ width: 110 }}
                  />
                </TableCell>

                <TableCell align="right">
                  {consumption !== undefined ? consumption.toFixed(2) : "-"}
                </TableCell>

                <TableCell align="center">
                  {meterInactive ? (
                    <Chip
                      size="small"
                      label={r.meter?.status ?? "INACTIVE"}
                      color={meterStatusColor(r.meter?.status)}
                      sx={meterStatusChipSx}
                    />
                  ) : (
                    <Chip
                      size="small"
                      label="ACTIVE"
                      color="success"
                      sx={meterStatusChipSx}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        disabled={submitting || Object.keys(values).length === 0}
        onClick={handleSubmit}
      >
        {submitting ? "Saving..." : "Save All Readings"}
      </Button>
    </Paper>
  );
}
