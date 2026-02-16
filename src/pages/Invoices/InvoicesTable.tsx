import {
  Paper,
  Table,
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
  Typography,
  Divider,
  CircularProgress,
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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Subscriber</TableCell>
            <TableCell>Month</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Prev Balance</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Remaining</TableCell>
            <TableCell>Fixes</TableCell>
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
                <TableCell>{i.status}</TableCell>
                <TableCell>{i.previousBalance ?? "�"}</TableCell>
                <TableCell>{i.totalDue}</TableCell>
                <TableCell>{i.amountPaid}</TableCell>
                <TableCell>{i.remainingBalance}</TableCell>
                <TableCell>{i.fixesAmount ?? "—"}</TableCell>
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

function InvoiceViewDialog({
  open,
  invoiceId,
  onClose,
  query,
}: {
  open: boolean;
  invoiceId: number;
  onClose: () => void;
  query: ReturnType<typeof useInvoice>;
}) {
  const { data, isLoading } = query;

  const calcConsumption = () => {
    if (data?.currentReading != null && data?.previousReading != null) {
      return Math.max(0, data.currentReading - data.previousReading);
    }
    if (data?.consumptionKwh != null) return data.consumptionKwh;
    return null;
  };

  const consumption = calcConsumption();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Invoice #{invoiceId}</DialogTitle>
      <DialogContent dividers>
        {isLoading || !data ? (
          <Stack alignItems="center" py={3}>
            <CircularProgress size={24} />
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600}>
              Electric Generator Subscription Invoice
            </Typography>

            <Stack spacing={0.5}>
              <Typography>Subscriber Name: {data.meter.subscriber.fullName}</Typography>
              <Typography>Phone Number: {data.meter.subscriber.phone}</Typography>
              <Typography>
                Neighborhood: {data.meter.box?.neighborhood?.name ?? "—"} | Region:{" "}
                {data.meter.box?.region?.name ?? "—"}
              </Typography>
              <Typography>Meter Number: {data.meter.number}</Typography>
              <Typography>
                Issue Date:{" "}
                {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "—"}
              </Typography>
              <Typography>
                Billing Month: {data.month}/{data.year}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={0.5}>
              <Typography>
                Now Reading: {data.currentReading ?? "—"}
              </Typography>
              <Typography>
                Previous Reading: {data.previousReading ?? "—"}
              </Typography>
              <Typography>
                Energy Consumption: {consumption ?? "—"} kWh
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={0.5}>
              <Typography>
                Previous Balance: {data.previousBalance ?? "�"}
              </Typography>
              <Typography>Total Due: {data.totalDue}</Typography>
              <Typography>Amount Paid: {data.amountPaid}</Typography>
              <Typography>Remaining Balance: {data.remainingBalance}</Typography>
              <Typography>Status: {data.status}</Typography>
              <Typography>Exchange Rate: {data.exchangeRate}</Typography>
              <Typography>Fixes Amount: {data.fixesAmount ?? "—"}</Typography>
              {data.fixesNote && <Typography>Fixes Note: {data.fixesNote}</Typography>}
            </Stack>

            {data.payments?.length > 0 && (
              <>
                <Divider />
                <Typography variant="subtitle2">Payments</Typography>
                <Stack spacing={0.5}>
                  {data.payments.map((p) => (
                    <Stack
                      key={p.id}
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Typography variant="body2">#{p.id}</Typography>
                      <Typography variant="body2">{p.amount}</Typography>
                      <Typography variant="body2">
                        {new Date(p.paidAt).toLocaleString()}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}


