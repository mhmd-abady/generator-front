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
  useMediaQuery,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import type { Meter } from "../../api/meters";
import { useTheme } from "../../context/ThemeContext";

export type MeterWithReadings = Meter & {
  readings: {
    id: number;
    previousReading: number;
    currentReading: number;
    invoice?: { id: number };
  }[];
};

type Props = {
  meters: MeterWithReadings[];
  isPeriodClosed?: boolean;
  unlocked: boolean;
  onCreate: (meterId: number, currentReading: number) => void;
  onUpdate: (readingId: number, currentReading: number) => void;
};

export default function MeterReadingsTable({
  meters,
  isPeriodClosed,
  unlocked,
  onCreate,
  onUpdate,
}: Props) {
  const { colors } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        background: colors.darker,
      }}
    >
      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: colors.labelText, fontWeight: 700 }}>Meter</TableCell>
            <TableCell sx={{ color: colors.labelText, fontWeight: 700 }}>Subscriber</TableCell>
            <TableCell align="right" sx={{ color: colors.labelText, fontWeight: 700 }}>Previous</TableCell>
            <TableCell align="right" sx={{ color: colors.labelText, fontWeight: 700 }}>Current</TableCell>
            <TableCell align="right" sx={{ color: colors.labelText, fontWeight: 700 }}>Consumption</TableCell>
            <TableCell sx={{ color: colors.labelText, fontWeight: 700 }}>Status</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {meters.map((meter) => (
            <MeterRow
              key={meter.id}
              meter={meter}
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
  isPeriodClosed,
  unlocked,
  onCreate,
  onUpdate,
}: {
  meter: MeterWithReadings;
  isPeriodClosed?: boolean;
  unlocked: boolean;
  onCreate: (meterId: number, currentReading: number) => void;
  onUpdate: (readingId: number, currentReading: number) => void;
}) {
  const reading = meter.readings[0] ?? null;

  const [rowLocked, setRowLocked] = useState<boolean>(false);
  const locked = Boolean(isPeriodClosed || reading?.invoice || !unlocked || rowLocked);

  const previous = reading?.previousReading ?? 0;
  const [value, setValue] = useState<number>(reading?.currentReading ?? previous);

  const changed = (reading && value !== reading.currentReading) || (!reading && value !== previous);

  const { colors } = useTheme();
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.darker,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      '& input': { color: colors.text },
      '&.Mui-focused': { boxShadow: `0 0 0 2px ${colors.primary}22` },
    },
  };

  return (
    <TableRow sx={locked ? { opacity: 0.6 } : undefined}>
      <TableCell sx={{ color: colors.text }}>{meter.number}</TableCell>
      <TableCell sx={{ color: colors.text }}>{meter.subscriber?.fullName ?? "-"}</TableCell>

      <TableCell align="right" sx={{ color: colors.text }}>{previous}</TableCell>

      <TableCell align="right">
        <TextField
          size="small"
          type="number"
          value={value}
          disabled={locked}
          onChange={(e) => setValue(Number(e.target.value))}
          inputProps={{ min: previous }}
          sx={{ width: { xs: 80, sm: 100 }, ...fieldSx }}
        />
      </TableCell>

      <TableCell align="right" sx={{ color: colors.text }}>
        {Math.max(0, value - previous)}
      </TableCell>

      <TableCell>
        {locked ? (
          <Chip size="small" label="LOCKED" sx={{ background: colors.error, color: '#fff' }} />
        ) : (
          <Chip size="small" label="Editable" sx={{ background: colors.accent, color: colors.dark }} />
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
      sx={{
        background: `${colors.accent}11`,
        '&:hover': { background: `${colors.accent}22`, transform: 'scale(1.05)' },
      }}
    >
      <SaveIcon fontSize="small" htmlColor={colors.primary} />
    </IconButton>
  )}

  {/* RE-EDIT BUTTON */}
  {locked && reading && unlocked && !isPeriodClosed && !reading.invoice && (
    <Button
      size="small"
      variant="outlined"
      sx={{ ml: 1, color: colors.accent, borderColor: colors.border }}
      onClick={() => setRowLocked(false)}
    >
      Re-edit
    </Button>
  )}
</TableCell>

    </TableRow>
  );
}
