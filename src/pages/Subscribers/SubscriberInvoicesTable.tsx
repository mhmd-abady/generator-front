// src/pages/Subscribers/SubscriberInvoicesTable.tsx
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
  Button,
} from "@mui/material";
import type { Invoice } from "../../api/invoices";
import {
  formatInvoiceStatus,
  invoiceStatusColor,
  invoiceStatusChipSx,
} from "../Invoices/invoiceStatus";

export default function SubscriberInvoicesTable({
  invoices,
  loading,
  onView,
}: {
  invoices?: Invoice[];
  loading: boolean;
  onView: (invoiceId: number) => void;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Invoices
      </Typography>

      {loading ? (
        <Skeleton height={160} />
      ) : !invoices || invoices.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No invoices
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Prev Balance</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Remaining</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoices.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  {i.month}/{i.year}
                </TableCell>
                <TableCell>{i.totalDue}</TableCell>
                <TableCell>{i.previousBalance ?? "�"}</TableCell>
                <TableCell>{i.amountPaid}</TableCell>
                <TableCell>{i.remainingBalance}</TableCell>
                <TableCell align="center">
                  <Chip
                    size="medium"
                    label={formatInvoiceStatus(i.status)}
                    color={invoiceStatusColor(i.status)}
                    sx={invoiceStatusChipSx}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => onView(i.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

