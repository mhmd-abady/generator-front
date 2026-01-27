import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import type { MeterReading } from "../../api/meter-readings";

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
          values[r.meterId] !== undefined &&
          values[r.meterId] >= r.previousReading
      )
      .map((r) => ({
        meterId: r.meterId,
        currentReading: values[r.meterId],
      }));
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Meter</TableCell>
            <TableCell>Subscriber</TableCell>
            <TableCell align="right">Previous</TableCell>
            <TableCell align="right">Current</TableCell>
            <TableCell align="right">Consumption</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => {
            const current = values[r.meterId];
            const consumption =
              current !== undefined ? current - r.previousReading : undefined;

            return (
              <TableRow key={r.id}>
                <TableCell>{r.meter?.number}</TableCell>
                <TableCell>{r.meter?.subscriber?.fullName}</TableCell>

                <TableCell align="right">{r.previousReading}</TableCell>

                <TableCell align="right">
                  <TextField
                    size="small"
                    type="number"
                    value={current ?? ""}
                    inputProps={{ min: r.previousReading }}
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
                  {consumption !== undefined ? consumption.toFixed(2) : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

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
