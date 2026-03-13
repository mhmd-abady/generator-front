import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useInvoice } from "../../hooks/useInvoices";
import { formatDisplayDate } from "../../utils/date";

export default function InvoiceViewDialog({
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

  const currentReading =
    data?.reading?.currentReading ?? data?.currentReading ?? null;
  const previousReading =
    data?.reading?.previousReading ?? data?.previousReading ?? null;
  const consumptionKwh =
    data?.reading?.consumptionKwh ?? data?.consumptionKwh ?? null;
  const kwhRate = data?.tariffDetails?.kwhRate ?? data?.kwhRate ?? null;
  const ampereFee = data?.ampereFee ?? null;
  const meterAmpere = data?.meter?.ampere ?? null;

  const calcConsumption = () => {
    if (currentReading != null && previousReading != null) {
      return Math.max(0, currentReading - previousReading);
    }
    if (consumptionKwh != null) return consumptionKwh;
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
              <Typography>
                Subscriber Name: {data.meter.subscriber.fullName} | Phone Number:{" "}
                {data.meter.subscriber.phone}
              </Typography>
              <Typography>
                Neighborhood: {data.meter.box?.neighborhood?.name ?? "—"} | Region:{" "}
                {data.meter.box?.neighborhood?.region?.name ?? data.meter.box?.region?.name ?? "—"}
              </Typography>
              <Typography>
                Meter Number: {data.meter.number} | Box Number:{" "}
                {data.meter.box?.code ?? "—"}
              </Typography>
              <Typography>
                Issue Date:{" "}
                {data.createdAt ? formatDisplayDate(data.createdAt) : "—"}
              </Typography>
              <Typography>
                Billing Month: {data.month}/{data.year}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={0.5}>
              <Typography>
                Previous Reading: {previousReading ?? "—"} | Now Reading:{" "}
                {currentReading ?? "—"}
              </Typography>
              <Typography>
                Energy Consumption: {consumption ?? "—"} kWh * kWh Rate:{" "}
                {kwhRate ?? "—"}
              </Typography>
              <Typography>
                Meter Ampere: {meterAmpere ?? "—"} | Ampere Fee: {ampereFee ?? "—"}
              </Typography>
              <Typography>Exchange Rate: {data.exchangeRate}</Typography>
            </Stack>

            <Divider />

            <Stack spacing={0.5}>
              <Typography>
                Previous Balance: {data.previousBalance ?? "�"}
              </Typography>
              <Typography>This Month Due: {data.thisMonthDue ?? "—"}</Typography>
              <Typography>Fixes Amount: {data.fixesAmount ?? "—"}</Typography>
              <Typography>-------------------------------------------------------</Typography>
              <Typography>Total Due: {data.totalDue}</Typography>
              <Typography>Amount Paid: {data.amountPaid}</Typography>
              <Typography>Remaining Balance: {data.remainingBalance}</Typography>
              {data.fixesNote && <Typography>Fixes Note: {data.fixesNote}</Typography>}
              <Typography>Status: {data.status}</Typography>
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
                        {formatDisplayDate(p.paidAt)}
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
