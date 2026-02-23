import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Autocomplete,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleIcon from "@mui/icons-material/People";
import PlaceIcon from "@mui/icons-material/Place";
import HistoryIcon from "@mui/icons-material/History";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useEffect, useMemo, useState, type ElementType } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useCollectorTasks } from "../../hooks/useCollectorTasks";
import {
  fetchNeighborhoodsByRegion,
  fetchRegions,
} from "../../api/locations";
import type {
  CollectorNeighborhoodTask,
  CollectorTaskSubscriber,
} from "../../api/collectors";
import PayInvoiceDialog from "../Invoices/PayInvoiceDialog";
import { useAuth } from "../../context/AuthContext";

type PayContext = {
  invoiceId: number;
  subscriberId: number;
  remainingBalance: number;
};

export default function CollectorTasksPage() {
  const now = new Date();

  const { user } = useAuth();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [collectorId, setCollectorId] = useState<number | undefined>(
    user?.role === "COLLECTOR" ? user.id : undefined
  );

  useEffect(() => {
    if (user?.role === "COLLECTOR") {
      setCollectorId(user.id);
    }
  }, [user]);

  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: Boolean(regionId),
  });

  const tasksQuery = useCollectorTasks({
    month,
    year,
    regionId,
    neighborhoodId,
    collectorId,
  });

  const stats = useMemo(() => {
    const rows = tasksQuery.data ?? [];

    const neighborhoods = rows.length;
    const subscribers = rows.reduce(
      (sum, n) => sum + n.subscribers.length,
      0
    );
    const totalToCollect = rows.reduce(
      (sum, n) => sum + (n.totalToCollect ?? 0),
      0
    );
    const totalPrevious = rows.reduce(
      (sum, n) => sum + (n.totalPreviousBalance ?? 0),
      0
    );

    return { neighborhoods, subscribers, totalToCollect, totalPrevious };
  }, [tasksQuery.data]);

  const [payContext, setPayContext] = useState<PayContext | null>(null);
  const qc = useQueryClient();

  const handlePaymentSuccess = () => {
    qc.invalidateQueries({ queryKey: ["collector-tasks"] });
    qc.invalidateQueries({ queryKey: ["payments"] });
    qc.invalidateQueries({ queryKey: ["invoices"] });
    tasksQuery.refetch();
  };

  const collectorLocked = user?.role === "COLLECTOR";

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={600}>
              Collector Tasks
            </Typography>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => tasksQuery.refetch()}
              disabled={tasksQuery.isLoading}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              Reload
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            flexWrap="wrap"
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              select
              size="small"
              label="Month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              sx={{ minWidth: { xs: "100%", md: 140 } }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              label="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              sx={{ minWidth: { xs: "100%", md: 120 } }}
              type="number"
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
              sx={{ minWidth: { xs: "100%", md: 180 } }}
            >
              <MenuItem value="all">All Regions</MenuItem>
              {regionsQuery.data?.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              size="small"
              options={neighborhoodsQuery.data ?? []}
              value={
                neighborhoodsQuery.data?.find(
                  (n) => n.id === neighborhoodId
                ) ?? null
              }
              onChange={(_, value) => {
                setNeighborhoodId(value ? value.id : undefined);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              renderInput={(params) => (
                <TextField {...params} label="Neighborhood" />
              )}
              disabled={!regionId}
              sx={{ minWidth: { xs: "100%", md: 200 } }}
            />

            <TextField
              size="small"
              label="Collector ID"
              value={collectorId ?? ""}
              disabled={collectorLocked}
              onChange={(e) =>
                setCollectorId(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              helperText={
                collectorLocked
                  ? "Locked to your account"
                  : "Optional filter"
              }
              sx={{ minWidth: { xs: "100%", md: 160 } }}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={PlaceIcon}
              label="Neighborhoods"
              value={stats.neighborhoods}
              loading={tasksQuery.isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={PeopleIcon}
              label="Subscribers"
              value={stats.subscribers}
              loading={tasksQuery.isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={AttachMoneyIcon}
              label="To Collect"
              value={stats.totalToCollect}
              loading={tasksQuery.isLoading}
              format="currency"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={HistoryIcon}
              label="Previous Balance"
              value={stats.totalPrevious}
              loading={tasksQuery.isLoading}
              format="currency"
            />
          </Grid>
        </Grid>
      </Paper>

      {tasksQuery.isLoading ? (
        <Skeleton height={320} />
      ) : tasksQuery.isError ? (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography color="error">
              Unable to load collector tasks.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => tasksQuery.refetch()}
            >
              Try again
            </Button>
          </Stack>
        </Paper>
      ) : tasksQuery.data.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No tasks found for the selected filters.</Typography>
        </Paper>
      ) : (
        tasksQuery.data.map((neighborhood) => (
          <NeighborhoodCard
            key={neighborhood.neighborhoodId}
            neighborhood={neighborhood}
            onPay={(subscriber) =>
              setPayContext({
                invoiceId: subscriber.invoice.id,
                subscriberId: subscriber.subscriberId,
                remainingBalance: subscriber.amountDue,
              })
            }
          />
        ))
      )}

      {payContext && (
        <PayInvoiceDialog
          open
          onClose={() => setPayContext(null)}
          invoiceId={payContext.invoiceId}
          subscriberId={payContext.subscriberId}
          remainingBalance={payContext.remainingBalance}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </DashboardLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  format,
}: {
  icon: ElementType;
  label: string;
  value?: number;
  loading: boolean;
  format?: "currency";
}) {
  const display = useMemo(() => {
    if (value === undefined || value === null) return "—";
    if (format === "currency") return value.toLocaleString();
    return value.toLocaleString();
  }, [format, value]);

  return (
    <Paper
      sx={{
        p: 2,
        height: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        background: "linear-gradient(135deg, #fbfdff 0%, #ffffff 100%)",
      }}
    >
      <Stack spacing={1.2}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1.5,
              background: "#f3f4f6",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {label}
          </Typography>
        </Box>
        {loading ? (
          <Skeleton width={120} height={32} />
        ) : (
          <Typography variant="h5" fontWeight={700}>
            {display}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

function NeighborhoodCard({
  neighborhood,
  onPay,
}: {
  neighborhood: CollectorNeighborhoodTask;
  onPay: (subscriber: CollectorTaskSubscriber) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { neighborhoodName, subscribers, totalToCollect, totalPreviousBalance } =
    neighborhood;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={700}>
            {neighborhoodName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subscribers.length} subscriber tasks
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={`To collect: ${totalToCollect.toLocaleString()}`}
            color="primary"
            size="small"
          />
          <Chip
            label={`Previous balance: ${
              (totalPreviousBalance ?? 0).toLocaleString()
            }`}
            color="default"
            size="small"
          />
        </Stack>
      </Stack>

      {isMobile ? (
        <Stack spacing={1.5}>
          {subscribers.map((s) => (
            <SubscriberMobileCard
              key={s.subscriberId}
              row={s}
              onPay={onPay}
            />
          ))}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Subscriber</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Amount Due</TableCell>
                <TableCell>Prev Balance</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Meter</TableCell>
                <TableCell>Consumption</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscribers.map((s) => (
                <SubscriberRow key={s.subscriberId} row={s} onPay={onPay} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

function SubscriberRow({
  row,
  onPay,
}: {
  row: CollectorTaskSubscriber;
  onPay: (subscriber: CollectorTaskSubscriber) => void;
}) {
  const invoice = row.invoice;
  const meterNumber =
    invoice.meterNumber ?? invoice.meter?.number ?? "—";
  const meterStatus = invoice.meter?.status;
  const consumption =
    invoice.consumptionKwh ??
    (invoice.currentReading != null &&
    invoice.previousReading != null
      ? Math.max(0, invoice.currentReading - invoice.previousReading)
      : null);

  return (
    <TableRow hover>
      <TableCell>
        <Stack spacing={0.3}>
          <Typography fontWeight={600}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {row.subscriberId}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.3}>
          <Typography variant="body2">{row.phone || "—"}</Typography>
          <Typography variant="caption" color="text.secondary">
            Meter: {meterNumber}
            {meterStatus && meterStatus !== "ACTIVE"
              ? ` • ${meterStatus}`
              : ""}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{row.address || "—"}</TableCell>
      <TableCell>{row.amountDue.toLocaleString()}</TableCell>
      <TableCell>
        {row.previousBalance != null
          ? row.previousBalance.toLocaleString()
          : "—"}
      </TableCell>
      <TableCell>
        <Stack spacing={0.3}>
          <Typography variant="body2">#{invoice.id}</Typography>
          <Typography variant="caption" color="text.secondary">
            {invoice.month}/{invoice.year} • {invoice.status}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.3}>
          <Typography variant="body2">
            Box {invoice.boxCode ?? "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {invoice.neighborhoodName} / {invoice.regionName}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        {consumption != null ? `${consumption} kWh` : "—"}
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Collect payment">
          <span>
            <IconButton
              size="small"
              onClick={() => onPay(row)}
              disabled={row.amountDue <= 0}
            >
              <PaymentIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

function SubscriberMobileCard({
  row,
  onPay,
}: {
  row: CollectorTaskSubscriber;
  onPay: (subscriber: CollectorTaskSubscriber) => void;
}) {
  const invoice = row.invoice;
  const meterNumber =
    invoice.meterNumber ?? invoice.meter?.number ?? "-";
  const meterStatus = invoice.meter?.status;
  const consumption =
    invoice.consumptionKwh ??
    (invoice.currentReading != null &&
    invoice.previousReading != null
      ? Math.max(0, invoice.currentReading - invoice.previousReading)
      : null);

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            <Typography fontWeight={700}>{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.subscriberId}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={() => onPay(row)}
            disabled={row.amountDue <= 0}
          >
            Collect
          </Button>
        </Stack>

        <Typography variant="body2">Phone: {row.phone || "-"}</Typography>
        <Typography variant="body2">Address: {row.address || "-"}</Typography>
        <Typography variant="body2">
          Amount Due: {row.amountDue.toLocaleString()}
        </Typography>
        <Typography variant="body2">
          Prev Balance:{" "}
          {row.previousBalance != null ? row.previousBalance.toLocaleString() : "-"}
        </Typography>
        <Typography variant="body2">
          Invoice: #{invoice.id} ({invoice.month}/{invoice.year} - {invoice.status})
        </Typography>
        <Typography variant="body2">
          Meter: {meterNumber}
          {meterStatus && meterStatus !== "ACTIVE"
            ? ` (${meterStatus})`
            : ""}{" "}
          | Box {invoice.boxCode ?? "-"}
        </Typography>
        <Typography variant="body2">
          Region: {invoice.regionName} / {invoice.neighborhoodName}
        </Typography>
        <Typography variant="body2">
          Consumption: {consumption != null ? `${consumption} kWh` : "-"}
        </Typography>
      </Stack>
    </Paper>
  );
}
