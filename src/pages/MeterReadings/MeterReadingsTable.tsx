import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Paper,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import type { Meter } from "../../api/meters";
import { meterStatusChipSx, meterStatusColor } from "../Meters/meterStatus";

export type MeterWithReadings = Meter & {
  readings: {
    id: number;
    previousReading: number;
    currentReading: number;
    month: number;
    year: number;
    invoice?: { id: number };
  }[];
};

type Props = {
  meters: MeterWithReadings[];
  month: number;
  year: number;
  isPeriodClosed?: boolean;
  unlocked: boolean;
  onCreate: (meterId: number, currentReading: number) => void;
  onUpdate: (readingId: number, currentReading: number) => void;
};

export default function MeterReadingsTable({
  meters,
  month,
  year,
  isPeriodClosed,
  unlocked,
  onCreate,
  onUpdate,
}: Props) {
  return (
    <Paper sx={{ p: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Meter</TableCell>
            <TableCell>Subscriber</TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Box</TableCell>
            <TableCell align="right">Previous</TableCell>
            <TableCell align="right">Current</TableCell>
            <TableCell align="right">Consumption</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {meters.map((meter) => (
            <MeterRow
              key={`${meter.id}-${month}-${year}`}
              meter={meter}
              month={month}
              year={year}
              isPeriodClosed={isPeriodClosed}
              unlocked={unlocked}
              onCreate={onCreate}
              onUpdate={onUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

function MeterRow({
  meter,
  month,
  year,
  isPeriodClosed,
  unlocked,
  onCreate,
  onUpdate,
}: {
  meter: MeterWithReadings;
  month: number;
  year: number;
  isPeriodClosed?: boolean;
  unlocked: boolean;
  onCreate: (meterId: number, currentReading: number) => void;
  onUpdate: (readingId: number, currentReading: number) => void;
}) {
  const latestReading = meter.readings[0] ?? null;
  const hasRealReading =
    latestReading &&
    latestReading.month === month &&
    latestReading.year === year &&
    latestReading.id !== 0;
  const reading = hasRealReading ? latestReading : null;

  const [rowLocked, setRowLocked] = useState<boolean>(false);
  const meterInactive = meter.status !== "ACTIVE";
  const locked = Boolean(
    isPeriodClosed ||
      reading?.invoice ||
      meterInactive ||
      !unlocked ||
      rowLocked
  );

  const previous = reading
    ? reading.previousReading
    : latestReading?.currentReading ?? 0;
  const [value, setValue] = useState<number>(
    reading?.currentReading ?? previous
  );

  const changed =
    (reading && value !== reading.currentReading) ||
    (!reading && value !== previous);
  const regionName =
    meter.box?.region?.name ??
    meter.box?.neighborhood?.region?.name ??
    "-";
  const boxCode = meter.box?.code ?? "-";

  return (
    <TableRow sx={locked ? { opacity: 0.6 } : undefined}>
      <TableCell>{meter.number}</TableCell>
      <TableCell>{meter.subscriber?.fullName ?? "-"}</TableCell>
      <TableCell>{regionName}</TableCell>
      <TableCell>{boxCode}</TableCell>

      <TableCell align="right">{previous}</TableCell>

      <TableCell align="right">
        <TextField
          size="small"
          type="number"
          value={value}
          disabled={locked}
          onChange={(e) => setValue(Number(e.target.value))}
          inputProps={{ min: previous }}
          sx={{ width: 100 }}
        />
      </TableCell>

      <TableCell align="right">
        {Math.max(0, value - previous)}
      </TableCell>

      <TableCell align="center">
        {meterInactive ? (
          <Chip
            size="small"
            label={meter.status ?? "INACTIVE"}
            color={meterStatusColor(meter.status)}
            sx={meterStatusChipSx}
          />
        ) : locked ? (
          <Chip
            size="small"
            label="LOCKED"
            color="error"
            sx={meterStatusChipSx}
          />
        ) : (
          <Chip
            size="small"
            label="Editable"
            color="success"
            sx={meterStatusChipSx}
          />
        )}
      </TableCell>

      <TableCell align="right">
  {/* SAVE BUTTON */}
  {!locked && changed && (
    <IconButton
      size="small"
      onClick={async () => {
        if (reading) {
          await onUpdate(reading.id, value);
        } else {
          await onCreate(meter.id, value);
        }

        setRowLocked(true); // 🔒 lock only this row
      }}
    >
      <SaveIcon fontSize="small" />
    </IconButton>
  )}

  {/* RE-EDIT BUTTON */}
  {locked && reading && unlocked && !isPeriodClosed && !reading.invoice && (
    <Button
      size="small"
      variant="outlined"
      sx={{ ml: 1 }}
      onClick={() => setRowLocked(false)}
    >
      Re-edit
    </Button>
  )}
</TableCell>

    </TableRow>
  );
}
