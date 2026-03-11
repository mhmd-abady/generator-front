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
import RefreshIcon from "@mui/icons-material/Refresh";
import PaymentIcon from "@mui/icons-material/Payment";
import PlaceIcon from "@mui/icons-material/Place";
import HistoryIcon from "@mui/icons-material/History";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GridOnIcon from "@mui/icons-material/GridOn";
import BuildIcon from "@mui/icons-material/Build";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import InvoiceFixesDialog from "../Invoices/InvoiceFixesDialog";
import InvoiceViewDialog from "../Invoices/InvoiceViewDialog";
import { useAuth } from "../../context/AuthContext";
import { formatInvoiceStatus } from "../Invoices/invoiceStatus";
import { Link } from "react-router-dom";
import { useInvoice } from "../../hooks/useInvoices";

type PayContext = {
  invoiceId: number;
  subscriberId: number;
  remainingBalance: number;
};

export default function CollectorTasksPage() {
  const now = new Date();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { user } = useAuth();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [collectorId, setCollectorId] = useState<number | undefined>(
    user?.role === "COLLECTOR" ? user.id : undefined
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [boxSearch, setBoxSearch] = useState("");

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

  const filteredTasks = useMemo(() => {
    const rows = tasksQuery.data ?? [];
    const q = search.trim().toLowerCase();
    const boxQ = boxSearch.trim().toLowerCase();

    return rows
      .map((n) => {
        const filteredSubscribers = n.subscribers.filter((s) => {
          if (statusFilter !== "all" && s.invoice.status !== statusFilter) {
            return false;
          }

          if (boxQ) {
            const box = (s.invoice.boxCode ?? "").toString().toLowerCase();
            if (!box.includes(boxQ)) {
              return false;
            }
          }

          if (!q) return true;

          const invoiceId = String(s.invoice.id ?? "");
          const statusText = formatInvoiceStatus(s.invoice.status).toLowerCase();
          const rawStatus = (s.invoice.status ?? "").toLowerCase();
          const neighborhoodName = (s.invoice.neighborhoodName ?? "").toLowerCase();
          const regionName = (s.invoice.regionName ?? "").toLowerCase();
          const meterText =
            (s.invoice.meterNumber ?? s.invoice.meter?.number ?? "").toString().toLowerCase();
          const boxText = (s.invoice.boxCode ?? "").toString().toLowerCase();

          return (
            s.name.toLowerCase().includes(q) ||
            s.phone.toLowerCase().includes(q) ||
            invoiceId.includes(q) ||
            statusText.includes(q) ||
            rawStatus.includes(q) ||
            neighborhoodName.includes(q) ||
            regionName.includes(q) ||
            meterText.includes(q) ||
            boxText.includes(q)
          );
        });

        return { ...n, subscribers: filteredSubscribers };
      })
      .filter((n) => n.subscribers.length > 0);
  }, [tasksQuery.data, search, statusFilter, boxSearch]);

  const boxOptions = useMemo(() => {
    const rows = tasksQuery.data ?? [];
    const values = new Set<string>();
    rows.forEach((n) => {
      n.subscribers.forEach((s) => {
        const box = s.invoice.boxCode;
        if (box != null && String(box).trim()) {
          values.add(String(box));
        }
      });
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [tasksQuery.data]);

  const stats = useMemo(() => {
    const rows = filteredTasks ?? [];
    const subscribers = rows.flatMap((n) => n.subscribers);
    const neighborhoods = rows.length;
    const regions = new Set(
      subscribers.map((s) => s.invoice.regionId)
    ).size;
    const totalToCollect = rows.reduce(
      (sum, n) => sum + (n.totalToCollect ?? 0),
      0
    );
    const totalPrevious = rows.reduce(
      (sum, n) => sum + (n.totalPreviousBalance ?? 0),
      0
    );

    const pendingPayments = subscribers.filter((s) => {
      const status = s.invoice.status;
      return status === "ISSUED" || status === "PARTIALLY_PAID";
    }).length;

    const stillUnpaid = subscribers.reduce((sum, s) => {
      const status = s.invoice.status;
      if (
        status === "PAID" ||
        status === "CANCELLED" ||
        status === "REVERSED_FULL"
      ) {
        return sum;
      }
      const remaining = s.invoice.remainingBalance ?? s.amountDue ?? 0;
      return sum + remaining;
    }, 0);

    return {
      neighborhoods,
      regions,
      totalToCollect,
      totalPrevious,
      pendingPayments,
      stillUnpaid,
    };
  }, [filteredTasks]);

  const [payContext, setPayContext] = useState<PayContext | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  const [fixesId, setFixesId] = useState<number | null>(null);
  const viewQuery = useInvoice(viewId ?? 0);
  const qc = useQueryClient();

  const handlePaymentSuccess = () => {
    qc.invalidateQueries({ queryKey: ["collector-tasks"] });
    qc.invalidateQueries({ queryKey: ["payments"] });
    qc.invalidateQueries({ queryKey: ["invoices"] });
    tasksQuery.refetch();
  };

  const handleFixesSuccess = (invoiceId: number) => {
    qc.invalidateQueries({ queryKey: ["collector-tasks"] });
    qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    qc.invalidateQueries({ queryKey: ["invoices"], exact: false });
    tasksQuery.refetch();
  };

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack
            direction={isDesktop ? "row" : "column"}
            spacing={2}
            alignItems={isDesktop ? "center" : "stretch"}
            justifyContent="space-between"
          >
            {isDesktop ? (
              <>
                <Typography variant="h6" fontWeight={600}>
                  Collector Tasks
                </Typography>

                <Stack direction="row" spacing={1.5}>
                  <TextField
                    select
                    size="small"
                    label="Month"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    sx={{ minWidth: 140 }}
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
                    sx={{ minWidth: 120 }}
                    type="number"
                  />
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => tasksQuery.refetch()}
                  disabled={tasksQuery.isLoading}
                >
                  Reload
                </Button>
              </>
            ) : (
              <>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
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
                  >
                    Reload
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <TextField
                    size="small"
                    label="Year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    sx={{ minWidth: "50%" }}
                    type="number"
                  />
                  <TextField
                    select
                    size="small"
                    label="Month"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    sx={{ minWidth: "50%" }}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(6, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <StatCard
            icon={AttachMoneyIcon}
            label="To Collect"
            value={stats.totalToCollect}
            loading={tasksQuery.isLoading}
            format="currency"
            square
          />
          <StatCard
            icon={PaymentIcon}
            label="Pending Payments"
            value={stats.pendingPayments}
            loading={tasksQuery.isLoading}
            square
          />
          <StatCard
            icon={HistoryIcon}
            label="Still Unpaid"
            value={stats.stillUnpaid}
            loading={tasksQuery.isLoading}
            format="currency"
            square
          />
          <StatCard
            icon={PlaceIcon}
            label="Regions"
            value={stats.regions}
            loading={tasksQuery.isLoading}
            square
          />
          <StatCard
            icon={GridOnIcon}
            label="Neighborhoods"
            value={stats.neighborhoods}
            loading={tasksQuery.isLoading}
            square
          />
          <StatCard
            icon={HistoryIcon}
            label="Prev Balance"
            value={stats.totalPrevious}
            loading={tasksQuery.isLoading}
            format="currency"
            square
          />
        </Box>
      </Paper>

      {isDesktop ? (
        <Paper sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            alignItems="center"
          >
            <TextField
              size="small"
              label="Search"
              placeholder="Subscriber, phone, invoice #, status, neighborhood"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 260 }}
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
              sx={{ minWidth: 180 }}
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
              sx={{ minWidth: 200 }}
            />

            <Autocomplete
              size="small"
              freeSolo
              options={boxOptions}
              value={boxSearch}
              onInputChange={(_, value) => setBoxSearch(value)}
              renderInput={(params) => (
                <TextField {...params} label="Box" placeholder="Search box" />
              )}
              sx={{ minWidth: 180 }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="ISSUED">Issued</MenuItem>
              <MenuItem value="PARTIALLY_PAID">Partially Paid</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
              <MenuItem value="REVERSED_PARTIAL">Reversed Partial</MenuItem>
              <MenuItem value="REVERSED_FULL">Reversed Full</MenuItem>
            </TextField>

            <Button
              component={Link}
              to="/reports"
              variant="outlined"
              sx={{ height: 40 }}
            >
              View Reports
            </Button>
          </Stack>
        </Paper>
      ) : (
        <>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 2,
              }}
            >
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
              />

              <Autocomplete
                size="small"
                freeSolo
                options={boxOptions}
                value={boxSearch}
                onInputChange={(_, value) => setBoxSearch(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Box"
                    placeholder="Search box"
                  />
                )}
              />

              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="ISSUED">Issued</MenuItem>
                <MenuItem value="PARTIALLY_PAID">
                  Partially Paid
                </MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="REVERSED_PARTIAL">
                  Reversed Partial
                </MenuItem>
                <MenuItem value="REVERSED_FULL">
                  Reversed Full
                </MenuItem>
              </TextField>

              <Button
                component={Link}
                to="/reports"
                variant="outlined"
                sx={{ height: 40, width: "100%", gridColumn: "span 2" }}
              >
                View Reports
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <TextField
              size="small"
              label="Search"
              placeholder="Subscriber, phone, invoice #, status, neighborhood"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: "100%" }}
            />
          </Paper>
        </>
      )}

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
      ) : filteredTasks.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No tasks found for the selected filters.</Typography>
        </Paper>
      ) : (
        filteredTasks.map((neighborhood) => (
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
            onView={(invoiceId) => setViewId(invoiceId)}
            onFixes={(invoiceId) => setFixesId(invoiceId)}
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

      {viewId !== null && (
        <InvoiceViewDialog
          open
          invoiceId={viewId}
          onClose={() => setViewId(null)}
          query={viewQuery}
        />
      )}

      {fixesId !== null && (
        <InvoiceFixesDialog
          open
          onClose={() => setFixesId(null)}
          invoiceId={fixesId}
          onSuccess={() => {
            handleFixesSuccess(fixesId);
            setFixesId(null);
          }}
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
  square,
}: {
  icon: ElementType;
  label: string;
  value?: number;
  loading: boolean;
  format?: "currency";
  square?: boolean;
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
        ...(square
          ? {
              aspectRatio: { xs: "auto", md: "auto" },
              minHeight: { xs: 84, md: 120 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }
          : null),
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
  onView,
  onFixes,
}: {
  neighborhood: CollectorNeighborhoodTask;
  onPay: (subscriber: CollectorTaskSubscriber) => void;
  onView: (invoiceId: number) => void;
  onFixes: (invoiceId: number) => void;
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
              onView={onView}
              onFixes={onFixes}
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
                <TableCell>Invoice</TableCell>
                <TableCell>Box</TableCell>
                <TableCell>Consumption</TableCell>
                <TableCell>Prev Balance</TableCell>
                <TableCell>Total Balance</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Fixes</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscribers.map((s) => (
                <SubscriberRow
                  key={s.subscriberId}
                  row={s}
                  onPay={onPay}
                  onView={onView}
                  onFixes={onFixes}
                />
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
  onView,
  onFixes,
}: {
  row: CollectorTaskSubscriber;
  onPay: (subscriber: CollectorTaskSubscriber) => void;
  onView: (invoiceId: number) => void;
  onFixes: (invoiceId: number) => void;
}) {
  const invoice = row.invoice;
  const meterNumber =
    invoice.meterNumber ?? invoice.meter?.number ?? "—";
  const meterStatus = invoice.meter?.status;
  const canFix =
    invoice.status !== "PAID" && invoice.status !== "CANCELLED";
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
            Status: {meterStatus ?? "—"}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{row.address || "—"}</TableCell>
      <TableCell>
        <Stack spacing={0.3}>
          <Typography variant="body2">#{invoice.id}</Typography>
          <Typography variant="caption" color="text.secondary">
            {invoice.month}/{invoice.year} • {formatInvoiceStatus(invoice.status)}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.3}>
          <Typography variant="body2">
            Box {invoice.boxCode ?? "—"} | Meter {meterNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {invoice.neighborhoodName} / {invoice.regionName}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        {consumption != null ? `${consumption} kWh` : "—"}
      </TableCell>
      <TableCell>
        {row.previousBalance != null
          ? row.previousBalance.toLocaleString()
          : "—"}
      </TableCell>
      <TableCell>
        {invoice.totalDue != null ? invoice.totalDue.toLocaleString() : "—"}
      </TableCell>
      <TableCell>
        {invoice.amountPaid != null ? invoice.amountPaid.toLocaleString() : "—"}
      </TableCell>
      <TableCell>
        {invoice.fixesAmount != null
          ? invoice.fixesAmount.toLocaleString()
          : "—"}
      </TableCell>
      <TableCell>
        {invoice.remainingBalance != null
          ? invoice.remainingBalance.toLocaleString()
          : "—"}
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => onView(invoice.id)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Pay">
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

          <Tooltip title="Add Fixes">
            <span>
              <IconButton
                size="small"
                disabled={!canFix}
                onClick={() => onFixes(invoice.id)}
              >
                <BuildIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

function SubscriberMobileCard({
  row,
  onPay,
  onView,
  onFixes,
}: {
  row: CollectorTaskSubscriber;
  onPay: (subscriber: CollectorTaskSubscriber) => void;
  onView: (invoiceId: number) => void;
  onFixes: (invoiceId: number) => void;
}) {
  const invoice = row.invoice;
  const meterNumber =
    invoice.meterNumber ?? invoice.meter?.number ?? "-";
  const meterStatus = invoice.meter?.status;
  const canFix =
    invoice.status !== "PAID" && invoice.status !== "CANCELLED";
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
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="View">
              <IconButton size="small" onClick={() => onView(invoice.id)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Fixes">
              <span>
                <IconButton
                  size="small"
                  disabled={!canFix}
                  onClick={() => onFixes(invoice.id)}
                >
                  <BuildIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
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
          Fixes Balance:{" "}
          {invoice.fixesAmount != null
            ? invoice.fixesAmount.toLocaleString()
            : "-"}
        </Typography>
        <Typography variant="body2">
          Remaining:{" "}
          {invoice.remainingBalance != null
            ? invoice.remainingBalance.toLocaleString()
            : "-"}
        </Typography>
        <Typography variant="body2">
          Invoice: #{invoice.id} ({invoice.month}/{invoice.year} - {formatInvoiceStatus(invoice.status)})
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
