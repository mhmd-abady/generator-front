import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PersonIcon from "@mui/icons-material/Person";
import { useMemo, useState, type ReactNode } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useAllPayments } from "../../hooks/usePayments";
import { useAllInvoices } from "../../hooks/useInvoices";
import { useRegions } from "../../hooks/useRegions";
import { useNeighborhoods } from "../../hooks/useNeighborhoods";
import { useStaff } from "../../hooks/useStaff";

type ReceiverCard = {
  id: number;
  name: string;
  totalCollected: number;
  role?: string;
};

type ReportRow = {
  invoiceId: number;
  invoiceMonth: number;
  invoiceYear: number;
  customerName: string;
  regionName: string;
  neighborhoodName: string;
  meter: string;
  box: string;
  total: number;
  collected: number;
  remaining: number;
  receiverNames: string[];
  receiverIds: number[];
};

const currency = (value: number) => value.toLocaleString();

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const isWithinDateRange = (value: string | undefined, from?: string, to?: string) => {
  if (!from && !to) return true;
  if (!value) return false;

  const current = new Date(value);
  if (Number.isNaN(current.getTime())) return false;

  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime()) && current < fromDate) {
      return false;
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!Number.isNaN(toDate.getTime())) {
      toDate.setHours(23, 59, 59, 999);
      if (current > toDate) {
        return false;
      }
    }
  }

  return true;
};

const stableStatus = (remaining: number, collected: number) => {
  if (remaining <= 0) return "Paid";
  if (collected <= 0) return "Not Paid";
  return "Remaining";
};

export function CollectorReportsContent() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const defaultFrom = formatDate(startOfMonth);
  const defaultTo = formatDate(today);
  const theme = useTheme();
  const compactView = useMediaQuery(theme.breakpoints.down("lg"));

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [receiverId, setReceiverId] = useState<number | undefined>();
  const [boxFilter, setBoxFilter] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(0);
  const [useRange, setUseRange] = useState(false);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const invoicesQuery = useAllInvoices({
    year: useRange ? undefined : year,
    month: useRange ? undefined : month,
    regionId,
    neighborhoodId,
  });
  const paymentsQuery = useAllPayments({
    regionId,
    neighborhoodId,
  });
  const { regions } = useRegions();
  const { neighborhoods, isLoading: hoodsLoading } = useNeighborhoods(regionId);
  const { users } = useStaff();

  const receivers = useMemo(() => {
    const fromUsers = (users ?? [])
      .map((u) => ({ id: u.id, name: u.username, role: u.role }));

    const fromPayments = (paymentsQuery.data ?? [])
      .map((p) => ({
        id: p.receiver.id,
        name: p.receiver.username,
        role: p.receiver.role,
      }));

    const map = new Map<number, { name: string; role?: string }>();
    [...fromUsers, ...fromPayments].forEach((receiver) => {
      if (!map.has(receiver.id)) {
        map.set(receiver.id, {
          name: receiver.name,
          role: receiver.role,
        });
      }
    });

    return Array.from(map.entries())
      .map(([id, value]) => ({ id, name: value.name, role: value.role }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [paymentsQuery.data, users]);

  const invoiceIds = useMemo(
    () =>
      new Set(
        (invoicesQuery.data ?? [])
          .filter((invoice) =>
            useRange ? isWithinDateRange(invoice.createdAt, from, to) : true
          )
          .map((invoice) => invoice.id)
      ),
    [from, invoicesQuery.data, to, useRange]
  );

  const paymentsByInvoice = useMemo(() => {
    const buckets = new Map<
      number,
      { totalCollected: number; receiverNames: Set<string>; receiverIds: Set<number> }
    >();

    (paymentsQuery.data ?? []).forEach((payment) => {
      if (payment.isReversed) return;
      if (!payment.invoiceId) return;
      if (!invoiceIds.has(payment.invoiceId)) return;

      const existing = buckets.get(payment.invoiceId) ?? {
        totalCollected: 0,
        receiverNames: new Set<string>(),
        receiverIds: new Set<number>(),
      };

      existing.totalCollected += payment.amount ?? 0;
      existing.receiverNames.add(payment.receiver.username);
      existing.receiverIds.add(payment.receiver.id);

      buckets.set(payment.invoiceId, existing);
    });

    return buckets;
  }, [invoiceIds, paymentsQuery.data]);

  const baseRows = useMemo<ReportRow[]>(() => {
    const rows = (invoicesQuery.data ?? [])
      .filter((invoice) =>
        useRange ? isWithinDateRange(invoice.createdAt, from, to) : true
      )
      .map((invoice) => {
        const meter = invoice.meter?.number ?? "-";
        const box = invoice.meter?.box?.code ? String(invoice.meter.box.code) : "-";
        const regionName =
          invoice.meter?.box?.neighborhood?.region?.name ??
          invoice.meter?.box?.region?.name ??
          "-";
        const neighborhoodName = invoice.meter?.box?.neighborhood?.name ?? "-";
        const collectedFromPayments =
          invoice.amountPaid ?? paymentsByInvoice.get(invoice.id)?.totalCollected ?? 0;
        const remaining = Math.max(invoice.remainingBalance ?? 0, 0);

        return {
          invoiceId: invoice.id,
          invoiceMonth: invoice.month,
          invoiceYear: invoice.year,
          customerName: invoice.meter?.subscriber?.fullName ?? "-",
          regionName,
          neighborhoodName,
          meter,
          box,
          total: invoice.totalDue ?? 0,
          collected: collectedFromPayments,
          remaining,
          receiverNames: Array.from(
            paymentsByInvoice.get(invoice.id)?.receiverNames ?? []
          ),
          receiverIds: Array.from(
            paymentsByInvoice.get(invoice.id)?.receiverIds ?? []
          ),
        };
      });

    return rows.sort((a, b) => b.remaining - a.remaining || b.invoiceId - a.invoiceId);
  }, [from, invoicesQuery.data, paymentsByInvoice, to, useRange]);

  const boxOptions = useMemo(() => {
    const values = new Set<string>();
    baseRows.forEach((row) => {
      if (row.box && row.box !== "-") {
        values.add(row.box);
      }
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [baseRows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const boxQ = boxFilter.trim().toLowerCase();

    return baseRows.filter((row) => {
      if (receiverId && !row.receiverIds.includes(receiverId)) {
        return false;
      }

      if (boxQ) {
        const boxText = row.box.toLowerCase();
        if (!boxText.includes(boxQ)) {
          return false;
        }
      }

      if (tab === 1 && row.remaining <= 0) {
        return false;
      }

      if (tab === 2 && !(row.remaining > 0 && row.collected <= 0)) {
        return false;
      }

      if (!q) {
        return true;
      }

      const invoiceText = String(row.invoiceId);
      const invoiceMonthText = `${row.invoiceMonth}/${row.invoiceYear}`;
      const totalText = String(row.total);
      const collectedText = String(row.collected);
      const remainingText = String(row.remaining);
      const receiverText = row.receiverNames.join(" ").toLowerCase();
      const statusText = stableStatus(row.remaining, row.collected).toLowerCase();

      return (
        invoiceText.includes(q) ||
        invoiceMonthText.includes(q) ||
        row.customerName.toLowerCase().includes(q) ||
        row.regionName.toLowerCase().includes(q) ||
        row.neighborhoodName.toLowerCase().includes(q) ||
        row.meter.toLowerCase().includes(q) ||
        row.box.toLowerCase().includes(q) ||
        receiverText.includes(q) ||
        statusText.includes(q) ||
        totalText.includes(q) ||
        collectedText.includes(q) ||
        remainingText.includes(q)
      );
    });
  }, [baseRows, boxFilter, receiverId, search, tab]);

  const summary = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => {
        acc.totalToCollect += row.total;
        acc.totalCollected += row.collected;
        acc.totalRemaining += row.remaining;
        return acc;
      },
      { totalToCollect: 0, totalCollected: 0, totalRemaining: 0 }
    );
  }, [filteredRows]);

  const receiverCards = useMemo<ReceiverCard[]>(() => {
    const visibleIds = new Set(filteredRows.map((r) => r.invoiceId));
    const totals = new Map<number, ReceiverCard>();

    (paymentsQuery.data ?? []).forEach((payment) => {
      if (payment.isReversed) return;
      if (!payment.invoiceId || !visibleIds.has(payment.invoiceId)) return;

      if (receiverId && payment.receiver.id !== receiverId) {
        return;
      }

      const current = totals.get(payment.receiver.id) ?? {
        id: payment.receiver.id,
        name: payment.receiver.username,
        totalCollected: 0,
        role: payment.receiver.role,
      };

      current.totalCollected += payment.amount ?? 0;
      totals.set(payment.receiver.id, current);
    });

    return Array.from(totals.values()).sort(
      (a, b) => b.totalCollected - a.totalCollected
    );
  }, [filteredRows, paymentsQuery.data, receiverId]);

  const loading = invoicesQuery.isLoading || paymentsQuery.isLoading;
  const hasError = invoicesQuery.isError || paymentsQuery.isError;

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Typography variant="h6" fontWeight={600}>
            Collection Reports
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: { xs: "grid", lg: "flex" },
            alignItems: { lg: "center" },
            flexWrap: { lg: "wrap" },
            gap: 1.5,
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {useRange ? (
            <>
              <TextField
                type="date"
                size="small"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                sx={{ minWidth: { lg: 160 } }}
              />

              <TextField
                type="date"
                size="small"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                sx={{ minWidth: { lg: 160 } }}
              />
            </>
          ) : (
            <>
              <TextField
                select
                size="small"
                label="Year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                sx={{ minWidth: { lg: 140 } }}
              >
                {Array.from({ length: 6 }).map((_, i) => {
                  const y = today.getFullYear() - i;
                  return (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  );
                })}
              </TextField>

              <TextField
                select
                size="small"
                label="Month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                sx={{ minWidth: { lg: 130 } }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

          <TextField
            select
            size="small"
            label="Collected By"
            value={receiverId ?? "all"}
            onChange={(e) => {
              const value = e.target.value;
              setReceiverId(value === "all" ? undefined : Number(value));
            }}
            sx={{ minWidth: { lg: 180 } }}
          >
            <MenuItem value="all">All Receivers</MenuItem>
            {receivers.map((receiver) => (
              <MenuItem key={receiver.id} value={receiver.id}>
                {receiver.name}
                {receiver.role ? ` (${receiver.role})` : ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Region"
            value={regionId ?? "all"}
            onChange={(e) => {
              const value = e.target.value;
              setRegionId(value === "all" ? undefined : Number(value));
              setNeighborhoodId(undefined);
            }}
            sx={{ minWidth: { lg: 170 } }}
          >
            <MenuItem value="all">All Regions</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            size="small"
            options={neighborhoods}
            value={neighborhoods.find((n) => n.id === neighborhoodId) ?? null}
            onChange={(_, value) =>
              setNeighborhoodId(value ? value.id : undefined)
            }
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Neighborhood" />
            )}
            disabled={!regionId || hoodsLoading}
            sx={{ minWidth: { lg: 210 } }}
          />

          <Autocomplete
            size="small"
            freeSolo
            options={boxOptions}
            value={boxFilter}
            onInputChange={(_, value) => setBoxFilter(value)}
            renderInput={(params) => (
              <TextField {...params} label="Box" placeholder="Search box" />
            )}
            sx={{ minWidth: { lg: 160 } }}
          />

          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setUseRange((current) => {
                const next = !current;
                if (next) {
                  setFrom(from || defaultFrom);
                  setTo(to || defaultTo);
                } else {
                  setMonth(today.getMonth() + 1);
                  setYear(today.getFullYear());
                }
                return next;
              });
            }}
            sx={{ minHeight: 40 }}
          >
            {useRange ? "Month / Year" : "From / To"}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab label="All" />
          <Tab label="Has Remaining" />
          <Tab label="Not Paid" />
        </Tabs>
      </Paper>

      {loading ? (
        <Skeleton height={180} />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          <SummaryCard
            title="Total To Collect"
            value={currency(summary.totalToCollect)}
            icon={<AccountBalanceWalletIcon fontSize="small" />}
          />
          <SummaryCard
            title="Total Collected"
            value={currency(summary.totalCollected)}
            icon={<PaidIcon fontSize="small" />}
          />
          <SummaryCard
            title="Still To Collect"
            value={currency(summary.totalRemaining)}
            icon={<HourglassTopIcon fontSize="small" />}
          />
        </Box>
      )}

      {!loading && receiverCards.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.25,
          }}
        >
          {receiverCards.map((receiver) => (
            <SummaryCard
              key={receiver.id}
              title={receiver.name}
              subtitle={receiver.role ? `${receiver.role} Total` : "Collected Total"}
              value={currency(receiver.totalCollected)}
              icon={<PersonIcon fontSize="small" />}
            />
          ))}
        </Box>
      )}

      <Paper sx={{ p: 2 }}>
        <TextField
          size="small"
          label="Search"
          placeholder="Invoice, customer, region, meter, receiver"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", lg: 360 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {hasError ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="error">
            Unable to load collector reports. Please try again.
          </Typography>
        </Paper>
      ) : loading ? (
        <Skeleton height={320} />
      ) : filteredRows.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No rows match the selected filters.</Typography>
        </Paper>
      ) : compactView ? (
        <Stack spacing={1.25}>
          {filteredRows.map((row) => (
            <Card key={row.invoiceId} variant="outlined">
              <CardContent>
                <Stack spacing={0.8}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={700}>Invoice #{row.invoiceId}</Typography>
                    <Chip
                      size="small"
                      color={row.remaining > 0 ? "warning" : "success"}
                      label={stableStatus(row.remaining, row.collected)}
                    />
                  </Stack>
                  <Typography variant="body2">Customer: {row.customerName}</Typography>
                  <Typography variant="body2">
                    Invoice Month: {row.invoiceMonth}/{row.invoiceYear}
                  </Typography>
                  <Typography variant="body2">Region: {row.regionName}</Typography>
                  <Typography variant="body2">Neighborhood: {row.neighborhoodName}</Typography>
                  <Typography variant="body2">Meter: {row.meter}</Typography>
                  <Typography variant="body2">Box: {row.box}</Typography>
                  <Typography variant="body2">Total: {currency(row.total)}</Typography>
                  <Typography variant="body2">Collected: {currency(row.collected)}</Typography>
                  <Typography variant="body2">Remaining: {currency(row.remaining)}</Typography>
                  <Typography variant="body2">
                    Collected By: {row.receiverNames.length ? row.receiverNames.join(", ") : "-"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Paper sx={{ p: 2 }}>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 1120 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Inv Nb</TableCell>
                  <TableCell>Invoice Month</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Neighborhood</TableCell>
                  <TableCell>Meter</TableCell>
                  <TableCell>Box</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Collected</TableCell>
                  <TableCell align="right">Remaining</TableCell>
                  <TableCell>Collected By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.invoiceId} hover>
                    <TableCell>{row.invoiceId}</TableCell>
                    <TableCell>{`${row.invoiceMonth}/${row.invoiceYear}`}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.regionName}</TableCell>
                    <TableCell>{row.neighborhoodName}</TableCell>
                    <TableCell>{row.meter}</TableCell>
                    <TableCell>{row.box}</TableCell>
                    <TableCell align="right">{currency(row.total)}</TableCell>
                    <TableCell align="right">{currency(row.collected)}</TableCell>
                    <TableCell align="right">{currency(row.remaining)}</TableCell>
                    <TableCell>
                      {row.receiverNames.length ? row.receiverNames.join(", ") : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
}

export default function CollectorReportsPage() {
  return (
    <DashboardLayout>
      <CollectorReportsContent />
    </DashboardLayout>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  subtitle?: string;
}) {
  return (
    <Paper
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={1.25}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          <Typography variant="h6" fontWeight={700}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            bgcolor: "action.hover",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}
