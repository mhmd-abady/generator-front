import {
  Paper,
  Typography,
  Skeleton,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useAllPayments } from "../../hooks/usePayments";
import SubscriberPaymentsTable from "../Subscribers/SubscriberPaymentsTable";
import ReversePaymentDialog from "../Subscribers/ReversePaymentDialog";
import { usePayments } from "../../hooks/usePayments";
import PaymentKPIs from "./PaymentKPIs";
import SearchIcon from "@mui/icons-material/Search";

export default function PaymentsPage() {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const { data, isLoading } = useAllPayments({
    from: from || undefined,
    to: to || undefined,
  });

  const { reversePayment } = usePayments(0); // we only use reverse mutation
  const [reverseId, setReverseId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = (data ?? []).filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const subscriberName = p.subscriber?.fullName?.toLowerCase() ?? "";
    const invoice = p.invoiceId ? String(p.invoiceId) : "";
    const amount = String(p.amount);
    const date = new Date(p.paidAt).toLocaleDateString().toLowerCase();

    return (
      subscriberName.includes(q) ||
      invoice.includes(q) ||
      amount.includes(q) ||
      date.includes(q)
    );
  });

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight={600}>
            Payments
          </Typography>

          <TextField
            size="small"
            placeholder="Search subscriber, invoice #, date, amount"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 280 }}
          />

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              type="date"
              size="small"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <TextField
              type="date"
              size="small"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </Stack>
        </Stack>
      </Paper>

      {isLoading ? (
        <Skeleton height={120} />
      ) : (
        <PaymentKPIs payments={data ?? []} loading={isLoading} />
      )}

      {isLoading ? (
        <Skeleton height={300} />
      ) : (
        <SubscriberPaymentsTable
          payments={filtered}
          loading={false}
          showSubscriberColumn
          onReverse={(id) => setReverseId(id)}
        />
      )}

      <ReversePaymentDialog
        open={!!reverseId}
        onClose={() => setReverseId(null)}
        onConfirm={(reason) => {
          reversePayment.mutate({
            paymentId: reverseId!,
            reason,
          });
          setReverseId(null);
        }}
      />
    </DashboardLayout>
  );
}
