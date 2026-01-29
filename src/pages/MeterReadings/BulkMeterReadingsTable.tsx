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
import { useTheme } from "../../context/ThemeContext";

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

    if (payload.length > 0) {
      onSubmit(payload);
    }
  };

  const { colors } = useTheme();

  return (
    <Paper sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, background: colors.darker }}>
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
                <TableCell sx={{ color: colors.text }}>{r.meter?.number}</TableCell>
                <TableCell sx={{ color: colors.text }}>{r.meter?.subscriber?.fullName}</TableCell>

                <TableCell align="right" sx={{ color: colors.text }}>{r.previousReading}</TableCell>

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
                    sx={{ width: { xs: 90, sm: 110 }, '& .MuiOutlinedInput-root': { background: colors.darker, borderRadius: '8px', border: `1px solid ${colors.border}` }, '& input': { color: colors.text } }}
                  />
                </TableCell>

                <TableCell align="right" sx={{ color: colors.text }}>
                  {consumption !== undefined ? consumption.toFixed(2) : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Button
        variant="contained"
        sx={{ mt: 2, background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`, color: 'white' }}
        disabled={submitting || Object.keys(values).length === 0}
        onClick={handleSubmit}
      >
        {submitting ? "Saving..." : "Save All Readings"}
      </Button>
    </Paper>
  );
}
