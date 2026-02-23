import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
} from "@mui/material";
import { formatDisplayDate } from "../../utils/date";

export default function SubscriberPayments({
  payments,
  loading,
}: {
  payments?: any[];
  loading: boolean;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Payments
      </Typography>

      {loading ? (
        <Skeleton height={180} />
      ) : !payments || payments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No payments recorded
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {formatDisplayDate(p.paidAt)}
                </TableCell>
                <TableCell align="right">
                  {p.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {p.isReversed ? "Reversed" : "Paid"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
