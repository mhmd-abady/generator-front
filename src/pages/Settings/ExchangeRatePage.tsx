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
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState } from "react";
import {
  useDeleteExchangeRate,
  useActiveExchangeRate,
  useExchangeRateHistory,
  useSetExchangeRate,
  useUpdateExchangeRate,
} from "../../hooks/useExchangeRate";
import { formatDisplayDate } from "../../utils/date";

export default function ExchangeRatePage() {
  const { data: active } = useActiveExchangeRate();
  const { data: history } = useExchangeRateHistory();
  const setRate = useSetExchangeRate();
  const updateRate = useUpdateExchangeRate();
  const deleteRate = useDeleteExchangeRate();

  const [open, setOpen] = useState(false);
  const [rate, setRateValue] = useState<number>(0);
  const [note, setNote] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRateValue, setEditRateValue] = useState<number>(0);
  const [editNote, setEditNote] = useState("");

  const submitNewRate = () => {
    setRate.mutate(
      { usdToLbp: rate, note: note || undefined },
      {
        onSuccess: () => {
          setOpen(false);
          setRateValue(0);
          setNote("");
        },
      }
    );
  };

  const openEditDialog = (id: number, usdToLbp: number, existingNote?: string) => {
    setEditingId(id);
    setEditRateValue(usdToLbp);
    setEditNote(existingNote ?? "");
    setEditOpen(true);
  };

  const submitEditRate = () => {
    if (!editingId) return;

    updateRate.mutate(
      {
        id: editingId,
        payload: { usdToLbp: editRateValue, note: editNote || undefined },
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setEditingId(null);
          setEditRateValue(0);
          setEditNote("");
        },
      }
    );
  };

  const handleDeleteRate = (id: number) => {
    const confirmed = window.confirm("Delete this exchange rate?");
    if (!confirmed) return;
    deleteRate.mutate(id);
  };

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
              <TableCell align="right">Actions</TableCell>
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
                  {formatDisplayDate(r.createdAt)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => openEditDialog(r.id, r.usdToLbp, r.note)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={r.isActive}
                    onClick={() => handleDeleteRate(r.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
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
            onClick={submitNewRate}
            disabled={setRate.isPending || rate <= 0}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Exchange Rate</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="USD to LBP"
              type="number"
              value={editRateValue}
              onChange={(e) => setEditRateValue(Number(e.target.value))}
            />

            <TextField
              label="Note"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={submitEditRate}
            disabled={updateRate.isPending || editRateValue <= 0 || !editingId}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
