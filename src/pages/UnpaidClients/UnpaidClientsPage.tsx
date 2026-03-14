import {
  Alert,
  Autocomplete,
  Box,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useAllInvoices } from "../../hooks/useInvoices";
import { useRegions } from "../../hooks/useRegions";
import { useNeighborhoods } from "../../hooks/useNeighborhoods";
import { formatDisplayDate } from "../../utils/date";
import UnpaidClientsTable, {
  type UnpaidInvoiceRow,
} from "./UnpaidClientsTable";

type OverdueBucket = "ALL" | "0_30" | "31_60" | "61_90" | "90_plus";

const msPerDay = 24 * 60 * 60 * 1000;

const getDaysOverdue = (createdAt?: string) => {
  if (!createdAt) return 0;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return 0;

  const today = new Date();
  const diff = today.getTime() - created.getTime();
  return Math.max(0, Math.floor(diff / msPerDay));
};

const getBucket = (days: number): OverdueBucket => {
  if (days >= 91) return "90_plus";
  if (days >= 61) return "61_90";
  if (days >= 31) return "31_60";
  return "0_30";
};

export default function UnpaidClientsPage() {
  const navigate = useNavigate();
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [bucket, setBucket] = useState<OverdueBucket>("ALL");
  const [snack, setSnack] = useState<string | null>(null);

  const { regions } = useRegions();
  const { neighborhoods, isLoading: hoodsLoading } = useNeighborhoods(regionId);

  const invoicesQuery = useAllInvoices({
    regionId,
    neighborhoodId,
  });

  const rows = useMemo<UnpaidInvoiceRow[]>(() => {
    const q = search.trim().toLowerCase();
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    return (invoicesQuery.data ?? [])
      .filter(
        (invoice) =>
          (invoice.status === "ISSUED" || invoice.status === "PARTIALLY_PAID") &&
          (invoice.remainingBalance ?? 0) > 0
      )
      .filter((invoice) => {
        if (!fromDate && !toDate) return true;
        if (!invoice.createdAt) return false;

        const created = new Date(invoice.createdAt);
        if (Number.isNaN(created.getTime())) return false;
        if (fromDate && created < fromDate) return false;
        if (toDate) {
          const toEnd = new Date(toDate);
          toEnd.setHours(23, 59, 59, 999);
          if (created > toEnd) return false;
        }
        return true;
      })
      .map((invoice) => {
        const regionName =
          invoice.meter?.box?.neighborhood?.region?.name ??
          invoice.meter?.box?.region?.name ??
          "-";
        const neighborhoodName = invoice.meter?.box?.neighborhood?.name ?? "-";
        const row: UnpaidInvoiceRow = {
          id: invoice.id,
          invoiceDate: formatDisplayDate(invoice.createdAt),
          subscriberName: invoice.meter?.subscriber?.fullName ?? "-",
          phone: invoice.meter?.subscriber?.phone ?? "",
          regionName,
          neighborhoodName,
          boxCode: invoice.meter?.box?.code ?? "-",
          meterNumber: invoice.meter?.number ?? "-",
          totalDue: invoice.totalDue ?? 0,
          remainingBalance: invoice.remainingBalance ?? 0,
          daysOverdue: getDaysOverdue(invoice.createdAt),
          status: invoice.status,
        };
        return row;
      })
      .filter((row) => (bucket === "ALL" ? true : getBucket(row.daysOverdue) === bucket))
      .filter((row) => {
        if (!q) return true;
        return (
          row.subscriberName.toLowerCase().includes(q) ||
          row.phone.toLowerCase().includes(q) ||
          String(row.id).includes(q) ||
          row.meterNumber.toLowerCase().includes(q) ||
          row.boxCode.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (b.remainingBalance !== a.remainingBalance) {
          return b.remainingBalance - a.remainingBalance;
        }
        return b.daysOverdue - a.daysOverdue;
      });
  }, [bucket, from, invoicesQuery.data, search, to]);

  const kpis = useMemo(() => {
    const totalRemaining = rows.reduce((sum, row) => sum + row.remainingBalance, 0);
    const totalDue = rows.reduce((sum, row) => sum + row.totalDue, 0);
    const uniqueClients = new Set(rows.map((r) => `${r.subscriberName}|${r.phone}`)).size;

    return {
      invoices: rows.length,
      uniqueClients,
      totalRemaining,
      totalDue,
    };
  }, [rows]);

  const handleNotify = (row: UnpaidInvoiceRow) => {
    if (!row.phone) {
      setSnack("No mobile number for this client.");
      return;
    }

    const text = `Dear ${row.subscriberName}, invoice #${row.id} has remaining balance ${row.remainingBalance}. Please settle your payment. Thank you.`;
    const smsUrl = `sms:${row.phone}?body=${encodeURIComponent(text)}`;
    window.open(smsUrl, "_blank", "noopener,noreferrer");
    setSnack("Notification intent opened.");
  };

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Unpaid Clients
        </Typography>
      </Paper>

      <Box
        sx={{
          mt: 2,
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Open Invoices
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {kpis.invoices}
          </Typography>
        </Paper>
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Clients
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {kpis.uniqueClients}
          </Typography>
        </Paper>
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Total Due
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {kpis.totalDue}
          </Typography>
        </Paper>
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Total Remaining
          </Typography>
          <Typography variant="h6" fontWeight={700} color="error.main">
            {kpis.totalRemaining}
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Box
          sx={{
            display: { xs: "grid", lg: "flex" },
            gap: 1.5,
            alignItems: "center",
            flexWrap: "wrap",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "none",
            },
          }}
        >
          <TextField
            size="small"
            label="Search"
            placeholder="Name, mobile, invoice #, meter, box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", lg: "auto" }, minWidth: { lg: 270 } }}
          />

          <TextField
            select
            size="small"
            label="Region"
            value={regionId ?? "all"}
            onChange={(e) => {
              const v = e.target.value;
              setRegionId(v === "all" ? undefined : Number(v));
              setNeighborhoodId(undefined);
            }}
            sx={{ width: { xs: "100%", lg: "auto" }, minWidth: { lg: 170 } }}
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
            value={neighborhoods.find((n) => n.id === neighborhoodId) ?? null}
            onChange={(_, value) => setNeighborhoodId(value ? value.id : undefined)}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Neighborhood" />}
            disabled={!regionId || hoodsLoading}
            sx={{ width: { xs: "100%", lg: "auto" }, minWidth: { lg: 200 } }}
          />

          <TextField
            type="date"
            size="small"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            sx={{ width: { xs: "100%", lg: "auto" }, minWidth: { lg: 150 } }}
          />

          <TextField
            type="date"
            size="small"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            sx={{ width: { xs: "100%", lg: "auto" }, minWidth: { lg: 150 } }}
          />

          <TextField
            select
            size="small"
            label="Overdue"
            value={bucket}
            onChange={(e) => setBucket(e.target.value as OverdueBucket)}
            sx={{ width: { xs: "100%", lg: "auto" }, minWidth: { lg: 150 } }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="0_30">0-30 days</MenuItem>
            <MenuItem value="31_60">31-60 days</MenuItem>
            <MenuItem value="61_90">61-90 days</MenuItem>
            <MenuItem value="90_plus">90+ days</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <UnpaidClientsTable
          rows={rows}
          loading={invoicesQuery.isLoading}
          onView={(invoiceId) => navigate(`/invoices/${invoiceId}`)}
          onNotify={handleNotify}
        />
      </Box>

      <Snackbar
        open={!!snack}
        autoHideDuration={2200}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnack(null)} severity="info" variant="filled">
          {snack}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
