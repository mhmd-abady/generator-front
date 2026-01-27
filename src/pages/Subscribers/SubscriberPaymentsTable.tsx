import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Typography,
  Skeleton,
} from "@mui/material";
import type { Payment } from "../../api/payments";
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useAuth } from "../../context/AuthContext";

export default function SubscriberPaymentsTable({
  payments,
  loading,
  onReverse,
}: {
  payments?: Payment[];
  loading: boolean;
  onReverse: (paymentId: number) => void;
}) {
    const { user } = useAuth();
const isAdmin = user?.role === "ADMIN";
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Payments
      </Typography>

      {loading ? (
        <Skeleton height={160} />
      ) : !payments || payments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No payments yet
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
                <TableCell align="right">Actions</TableCell>

              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>Receiver</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((p) => (
             <TableRow key={p.id}>
  <TableCell align="right">
    {isAdmin && !p.isReversed && (
      <IconButton
        size="small"
        color="error"
        title="Reverse payment"
        onClick={() => onReverse(p.id)}
      >
        <UndoIcon fontSize="small" />
      </IconButton>
    )}
  </TableCell>

  <TableCell>
    {new Date(p.paidAt).toLocaleDateString()}
  </TableCell>

  <TableCell
    sx={{
      color: p.amount >= 0 ? "success.main" : "error.main",
      fontWeight: 500,
    }}
  >
    {p.amount >= 0 ? "+" : ""}
    {p.amount}
  </TableCell>

  <TableCell>
    {p.invoiceId ? `#${p.invoiceId}` : "—"}
  </TableCell>

  <TableCell>
    {p.receiver?.username ?? "—"}
  </TableCell>

  <TableCell>
    {p.isReversed ? (
      <Chip size="small" label="REVERSED" color="error" />
    ) : (
      <Chip size="small" label="OK" color="success" />
    )}
  </TableCell>
</TableRow>

            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
