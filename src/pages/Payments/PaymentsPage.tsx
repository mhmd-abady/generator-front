import {
  Paper,
  Typography,
  Skeleton,
  Stack,
  TextField,
  InputAdornment,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useAllPayments } from "../../hooks/usePayments";
import SubscriberPaymentsTable from "../Subscribers/SubscriberPaymentsTable";
import ReversePaymentDialog from "../Subscribers/ReversePaymentDialog";
import { usePayments } from "../../hooks/usePayments";
import PaymentKPIs from "./PaymentKPIs";
import SearchIcon from "@mui/icons-material/Search";
import { formatDisplayDate } from "../../utils/date";
import { useRegions } from "../../hooks/useRegions";
import { useNeighborhoods } from "../../hooks/useNeighborhoods";

export default function PaymentsPage() {
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const today = new Date();
  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const defaultFrom = formatDate(startOfMonth);
  const defaultTo = formatDate(today);

  const [from, setFrom] = useState<string>(defaultFrom);
  const [to, setTo] = useState<string>(defaultTo);
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const { regions } = useRegions();
  const { neighborhoods, isLoading: hoodsLoading } =
    useNeighborhoods(regionId);
  const { data, isLoading } = useAllPayments({
    from: from || undefined,
    to: to || undefined,
    regionId,
    neighborhoodId,
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
    const date = formatDisplayDate(p.paidAt).toLowerCase();

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
              select
              size="small"
              label="Region"
              sx={{ minWidth: 160 }}
              value={regionId ?? "all"}
              onChange={(e) => {
                const v = e.target.value;
                setRegionId(v === "all" ? undefined : Number(v));
                setNeighborhoodId(undefined);
              }}
            >
              <MenuItem value="all">All Regions</MenuItem>
              {regions.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              size="small"
              options={neighborhoods}
              value={
                neighborhoods.find((n) => n.id === neighborhoodId) ??
                null
              }
              onChange={(_, value) =>
                setNeighborhoodId(value ? value.id : undefined)
              }
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              renderInput={(params) => (
                <TextField {...params} label="Neighborhood" />
              )}
              disabled={!regionId || hoodsLoading}
              sx={{ minWidth: 200 }}
            />
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
          showLocationColumns
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
