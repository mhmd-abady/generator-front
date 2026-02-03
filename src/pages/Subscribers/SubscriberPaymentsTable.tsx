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
  Box,
  IconButton,
} from "@mui/material";
import type { Payment } from "../../api/payments";
import UndoIcon from "@mui/icons-material/Undo";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";

export default function SubscriberPaymentsTable({
  payments,
  loading,
  onReverse,
  onAddPayment,
}: {
  payments?: Payment[];
  loading: boolean;
  onReverse: (paymentId: number) => void;
  onAddPayment?: () => void;
}) {
    const { user } = useAuth();
const isAdmin = user?.role === "ADMIN";
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Payments
        </Typography>
        {onAddPayment && (
          <IconButton
            onClick={onAddPayment}
            sx={{
              ml: '25px',
              border: "2px solid #055205d7",
              borderRadius: 1,
              width: 32,
              height: 32,
              "&:hover": {
                background: "#055205d7",
                borderColor: "#02b90b",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

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
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>Receiver</TableCell>
              <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((p) => (
             <TableRow key={p.id}>
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
</TableRow>

            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
