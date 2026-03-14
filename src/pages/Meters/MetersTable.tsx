import {
  Box,
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import type { Meter, MeterStatus } from "../../api/meters";
import ChangeStatusDialog from "./ChangeStatusDialog";
import { meterStatusChipSx, meterStatusColor } from "./meterStatus";

export default function MetersTable({
  rows,
  disablePaper = false,
  onUpdateStatus,
  compactOnSmallScreens = false,
}: {
  rows: Meter[];
  disablePaper?: boolean;
  onUpdateStatus?: (meterId: number, status: MeterStatus) => void;
  compactOnSmallScreens?: boolean;
}) {
  const [selectedMeterId, setSelectedMeterId] = useState<number | null>(null);
  const isCompactView = compactOnSmallScreens && useMediaQuery("(max-width:1024px)");

  const selectedMeter = selectedMeterId
    ? rows.find((m) => m.id === selectedMeterId)
    : null;

  const cards = (
    <Stack spacing={1.25}>
      {rows.map((m) => (
        <Paper
          key={m.id}
          variant="outlined"
          sx={{ p: 1.5, borderRadius: 2, borderColor: "divider" }}
        >
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
            >
              <Typography fontWeight={700}>{m.number}</Typography>
              <Chip
                size="small"
                label={m.status ?? "UNKNOWN"}
                color={meterStatusColor(m.status)}
                sx={meterStatusChipSx}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {m.subscriber?.fullName ?? "-"}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 0.75,
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              <Typography variant="body2">Phone: {m.subscriber?.phone ?? "-"}</Typography>
              <Typography variant="body2">Box: {m.box?.code ?? "-"}</Typography>
              <Typography variant="body2">Ampere: {m.ampere ?? "-"}</Typography>
            </Box>

            {onUpdateStatus && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedMeterId(m.id)}
                >
                  Change Status
                </Button>
              </Box>
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );

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

  const content = isCompactView ? cards : table;

  if (disablePaper) return content;

  return (
    <>
      <Paper sx={{ p: 2 }}>{content}</Paper>
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
