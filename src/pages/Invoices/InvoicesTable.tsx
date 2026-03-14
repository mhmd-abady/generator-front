import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";
import BuildIcon from "@mui/icons-material/Build";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Invoice } from "../../api/invoices";
import { useInvoice } from "../../hooks/useInvoices";
import PayInvoiceDialog from "./PayInvoiceDialog";
import InvoiceFixesDialog from "./InvoiceFixesDialog";
import InvoiceViewDialog from "./InvoiceViewDialog";
import {
  formatInvoiceStatus,
  invoiceStatusColor,
  invoiceStatusChipSx,
} from "./invoiceStatus";

export default function InvoicesTable({ rows }: { rows: Invoice[] }) {
  const [viewId, setViewId] = useState<number | null>(null);
  const [payId, setPayId] = useState<number | null>(null);
  const [fixesId, setFixesId] = useState<number | null>(null);

  const viewQuery = useInvoice(viewId ?? 0);
  const payQuery = useInvoice(payId ?? 0);

  const qc = useQueryClient();

  const invalidateInvoice = (invoiceId: number) => {
    qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    qc.invalidateQueries({ queryKey: ["invoices"], exact: false });
    qc.invalidateQueries({ queryKey: ["payments"], exact: false });
    qc.invalidateQueries({ queryKey: ["subscriber-statement"], exact: false });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 1040 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Subscriber</TableCell>
            <TableCell>Month</TableCell>
            <TableCell>Year</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell>Prev Balance</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Fixes</TableCell>
            <TableCell>Remaining</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((i) => {
            const canPay = i.remainingBalance > 0 && i.status !== "CANCELLED";
            const canFix = i.status !== "PAID" && i.status !== "CANCELLED";

            return (
              <TableRow key={i.id} hover>
                <TableCell>{i.id}</TableCell>
                <TableCell>{i.meter?.subscriber?.fullName ?? "-"}</TableCell>
                <TableCell>{i.month}</TableCell>
                <TableCell>{i.year}</TableCell>
                <TableCell align="center">
                  <Chip
                    size="medium"
                    label={formatInvoiceStatus(i.status)}
                    color={invoiceStatusColor(i.status)}
                    sx={invoiceStatusChipSx}
                  />
                </TableCell>
                <TableCell>{i.previousBalance ?? "�"}</TableCell>
                <TableCell>{i.totalDue}</TableCell>
                <TableCell>{i.amountPaid}</TableCell>
                <TableCell>{i.fixesAmount ?? "—"}</TableCell>
                <TableCell>{i.remainingBalance}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => setViewId(i.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Pay">
                      <span>
                        <IconButton
                          size="small"
                          disabled={!canPay}
                          onClick={() => setPayId(i.id)}
                        >
                          <PaymentIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Add Fixes">
                      <span>
                        <IconButton
                          size="small"
                          disabled={!canFix}
                          onClick={() => setFixesId(i.id)}
                        >
                          <BuildIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </TableContainer>

      {/* View dialog */}
      {viewId !== null && (
        <InvoiceViewDialog
          open
          invoiceId={viewId}
          onClose={() => setViewId(null)}
          query={viewQuery}
        />
      )}

      {/* Pay dialog */}
      {payId !== null && (
        <>
          {payQuery.isLoading && (
            <Dialog open onClose={() => setPayId(null)}>
              <DialogTitle>Loading invoice...</DialogTitle>
              <DialogContent sx={{ py: 3 }}>
                <Stack alignItems="center">
                  <CircularProgress size={24} />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPayId(null)}>Close</Button>
              </DialogActions>
            </Dialog>
          )}

          {payQuery.data && (
            <PayInvoiceDialog
              open
              onClose={() => setPayId(null)}
              invoiceId={payQuery.data.id}
              subscriberId={payQuery.data.meter.subscriber.id}
              remainingBalance={payQuery.data.remainingBalance}
              onSuccess={() => {
                invalidateInvoice(payQuery.data.id);
                setPayId(null);
              }}
            />
          )}
        </>
      )}

      {/* Fixes dialog */}
      {fixesId !== null && (
        <InvoiceFixesDialog
          open
          onClose={() => setFixesId(null)}
          invoiceId={fixesId}
          onSuccess={() => {
            invalidateInvoice(fixesId);
            setFixesId(null);
          }}
        />
      )}
    </Paper>
  );
}


