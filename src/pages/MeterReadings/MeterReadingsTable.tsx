import DataTable from "../../components/DataTable";
import {
  TextField,
  IconButton,
  Chip,
  Button,
  Box,
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

  const [values, setValues] = useState<Record<number, number>>({});
  const [lockedRows, setLockedRows] = useState<Record<number, boolean>>({});

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.darker,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      '& input': { color: colors.text },
      '&.Mui-focused': { boxShadow: `0 0 0 2px ${colors.primary}22` },
    },
  };

  const columns = [
    {
      id: "meter",
      label: "Meter",
      align: "left" as const,
      width: "15%",
      render: (meter: MeterWithReadings) => (
        <Box sx={{ fontWeight: 700, color: colors.accent }}>
          #{meter.number}
        </Box>
      ),
    },
    {
      id: "subscriber",
      label: "Subscriber",
      align: "left" as const,
      width: "25%",
      hiddenOnMobile: true,
      render: (meter: MeterWithReadings) => meter.subscriber?.fullName ?? "-",
    },
    {
      id: "previous",
      label: "Previous",
      align: "right" as const,
      width: "15%",
      render: (meter: MeterWithReadings) => {
        const reading = meter.readings[0] ?? null;
        return reading?.previousReading ?? 0;
      },
    },
    {
      id: "current",
      label: "Current",
      align: "right" as const,
      width: "15%",
      render: (meter: MeterWithReadings) => {
        const reading = meter.readings[0] ?? null;
        const previous = reading?.previousReading ?? 0;
        const currentValue = values[meter.id] ?? reading?.currentReading ?? previous;
        const locked = Boolean(isPeriodClosed || reading?.invoice || !unlocked || lockedRows[meter.id]);

        return (
          <TextField
            size="small"
            type="number"
            value={currentValue}
            disabled={locked}
            onChange={(e) => setValues(prev => ({ ...prev, [meter.id]: Number(e.target.value) }))}
            inputProps={{ min: previous }}
            sx={{ width: { xs: 80, sm: 100 }, ...fieldSx }}
          />
        );
      },
    },
    {
      id: "consumption",
      label: "Consumption",
      align: "right" as const,
      width: "15%",
      render: (meter: MeterWithReadings) => {
        const reading = meter.readings[0] ?? null;
        const previous = reading?.previousReading ?? 0;
        const currentValue = values[meter.id] ?? reading?.currentReading ?? previous;
        return Math.max(0, currentValue - previous);
      },
    },
    {
      id: "status",
      label: "Status",
      align: "center" as const,
      width: "15%",
      render: (meter: MeterWithReadings) => {
        const reading = meter.readings[0] ?? null;
        const locked = Boolean(isPeriodClosed || reading?.invoice || !unlocked || lockedRows[meter.id]);

        return locked ? (
          <Chip size="small" label="LOCKED" sx={{ background: colors.error, color: '#fff' }} />
        ) : (
          <Chip size="small" label="Editable" sx={{ background: colors.accent, color: colors.dark }} />
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      align: "right" as const,
      width: "10%",
      render: (meter: MeterWithReadings) => {
        const reading = meter.readings[0] ?? null;
        const previous = reading?.previousReading ?? 0;
        const currentValue = values[meter.id] ?? reading?.currentReading ?? previous;
        const changed = (reading && currentValue !== reading.currentReading) || (!reading && currentValue !== previous);
        const locked = Boolean(isPeriodClosed || reading?.invoice || !unlocked || lockedRows[meter.id]);

        return (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {!locked && changed && (
              <IconButton
                size="small"
                onClick={async () => {
                  if (reading) {
                    await onUpdate(reading.id, currentValue);
                  } else {
                    await onCreate(meter.id, currentValue);
                  }
                  setLockedRows(prev => ({ ...prev, [meter.id]: true }));
                }}
                sx={{
                  background: `${colors.accent}11`,
                  '&:hover': { background: `${colors.accent}22`, transform: 'scale(1.05)' },
                }}
              >
                <SaveIcon fontSize="small" htmlColor={colors.primary} />
              </IconButton>
            )}
            {locked && reading && unlocked && !isPeriodClosed && !reading.invoice && (
              <Button
                size="small"
                variant="outlined"
                sx={{ color: colors.accent, borderColor: colors.border }}
                onClick={() => setLockedRows(prev => ({ ...prev, [meter.id]: false }))}
              >
                Re-edit
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={meters}
      density="compact"
      striped
      hoverable
      sx={{
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        background: colors.darker,
      }}
    />
  );
}


