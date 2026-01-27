import {
  Paper,
  Typography,
  Stack,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import {
  useActiveExchangeRate,
  useExchangeRateHistory,
  useSetExchangeRate,
} from "../../hooks/useExchangeRate";

export default function ExchangeRatePage() {
  const { data: active } = useActiveExchangeRate();
  const { data: history } = useExchangeRateHistory();
  const setRate = useSetExchangeRate();

  const [open, setOpen] = useState(false);
  const [rate, setRateValue] = useState<number>(0);
  const [note, setNote] = useState("");

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600}>
        Exchange Rate
      </Typography>

      <Stack spacing={2} mt={2}>
        <Typography>
          Active Rate:{" "}
          <b>{active?.usdToLbp?.toLocaleString() || "—"} LBP</b>
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Set New Rate
        </Button>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rate</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {history?.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.usdToLbp.toLocaleString()}</TableCell>
                <TableCell>{r.note || "-"}</TableCell>
                <TableCell>
                  {r.isActive ? (
                    <Chip label="ACTIVE" color="success" size="small" />
                  ) : (
                    <Chip label="OLD" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {new Date(r.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Set Exchange Rate</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="USD → LBP"
              type="number"
              value={rate}
              onChange={(e) => setRateValue(Number(e.target.value))}
            />

            <TextField
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              setRate.mutate({ usdToLbp: rate, note: note || undefined })
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
