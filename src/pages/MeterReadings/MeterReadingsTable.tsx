import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
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
  const isCompactView = useMediaQuery("(max-width:1024px)");

  return (
    <Paper sx={{ p: 2 }}>
      {isCompactView ? (
        <Stack spacing={1.5}>
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
              compact
            />
          ))}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 980 }}>
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
        </TableContainer>
      )}
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
  compact = false,
}: {
  meter: MeterWithReadings;
  month: number;
  year: number;
  isPeriodClosed?: boolean;
  unlocked: boolean;
  onCreate: (meterId: number, currentReading: number) => void;
  onUpdate: (readingId: number, currentReading: number) => void;
  compact?: boolean;
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
  const consumption = Math.max(0, value - previous);

  const handleSave = async () => {
    if (reading) {
      await onUpdate(reading.id, value);
    } else {
      await onCreate(meter.id, value);
    }

    setRowLocked(true);
  };

  const canReEdit =
    locked && reading && unlocked && !isPeriodClosed && !reading.invoice;

  const statusChip = meterInactive ? (
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
  );

  if (compact) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderRadius: 2,
          borderColor: "divider",
          ...(locked ? { opacity: 0.7 } : {}),
        }}
      >
        <Stack spacing={1.25}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
          >
            <Typography fontWeight={700}>{meter.number}</Typography>
            {statusChip}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {meter.subscriber?.fullName ?? "-"}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            }}
          >
            <Typography variant="body2">Region: {regionName}</Typography>
            <Typography variant="body2">Box: {boxCode}</Typography>
            <Typography variant="body2">Previous: {previous}</Typography>
            <Typography variant="body2" fontWeight={700}>
              Consumption: {consumption}
            </Typography>
            <Box
              sx={{
                gridColumn: "span 2",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography variant="body2">Current</Typography>
              <TextField
                size="small"
                type="number"
                value={value}
                disabled={locked}
                onChange={(e) => setValue(Number(e.target.value))}
                inputProps={{ min: previous }}
                sx={{ width: 130 }}
              />
            </Box>
          </Box>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {!locked && changed && (
              <IconButton size="small" onClick={handleSave}>
                <SaveIcon fontSize="small" />
              </IconButton>
            )}

            {canReEdit && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setRowLocked(false)}
              >
                Re-edit
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    );
  }

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
        {consumption}
      </TableCell>

      <TableCell align="center">
        {statusChip}
      </TableCell>

      <TableCell align="right">
        {!locked && changed && (
          <IconButton size="small" onClick={handleSave}>
            <SaveIcon fontSize="small" />
          </IconButton>
        )}

        {canReEdit && (
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
