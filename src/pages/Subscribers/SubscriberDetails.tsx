import {
  Paper,
  Typography,
  Stack,
  Skeleton,
  Button,
  Grid,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useSubscriberDetails } from "../../hooks/useSubscriberDetails";
import SubscriberMeters from "./SubscriberMeters";
import { useMemo, useState, type ReactNode } from "react";
import SubscriberReassignMeterDialog from "./SubscriberReassignMeterDialog";
import { updateMeter, type MeterStatus } from "../../api/meters";
import SubscriberPaymentsTable from "./SubscriberPaymentsTable";
import { usePayments } from "../../hooks/usePayments";
import { useInvoice, useInvoices, useUnpaidInvoices } from "../../hooks/useInvoices";
import AddPaymentDialog from "./AddPaymentDialog";
import { useAuth } from "../../context/AuthContext";
import ReversePaymentDialog from "./ReversePaymentDialog";
import SubscriberInvoicesTable from "./SubscriberInvoicesTable";
import { useMetersBySubscriber } from "../../hooks/useMeters";
import {
  RequestQuote,
  Paid,
  WarningAmber,
  ReceiptLong,
} from "@mui/icons-material";
import SubscriberStatementTable from "./SubscriberStatementTable";
import { useSubscriberStatement } from "../../hooks/useSubscriberStatement";
import { getSubscriberStatementPdfUrl } from "../../api/statements";
import { useQueryClient } from "@tanstack/react-query";
import InvoiceViewDialog from "../Invoices/InvoiceViewDialog";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  loading: boolean;
}

function StatCard({ label, value, icon, loading }: StatCardProps) {
  return (
    <Paper
      sx={{
        p: 2,
        background: "linear-gradient(135deg, #fefefe 0%, #ffffff 100%)",
        border: "1px solid #f0f0f0",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Stack spacing={1.2}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              p: 0.9,
              borderRadius: 1.5,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: "0.75rem" }}>
            {label}
          </Typography>
        </Box>
        {loading ? (
          <Skeleton width={90} height={32} />
        ) : (
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "#333333",
              fontSize: "1.5rem",
            }}
          >
            {value.toLocaleString()}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default function SubscriberDetails() {
  const { id } = useParams();
  const subscriberId = Number(id);
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
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { subscriber, isLoading } = useSubscriberDetails(subscriberId);
  const metersQuery = useMetersBySubscriber(subscriberId);
  const meters =
    metersQuery.meters ??
    subscriber?.meters ??
    (subscriber?.meter ? [subscriber.meter] : undefined);
  const metersLoading = isLoading || metersQuery.isLoading;
  const activeMeter = useMemo(() => {
    if (!meters?.length) return undefined;
    const fromArray = meters.find((m: any) => m?.status === "ACTIVE");
    return fromArray ?? meters[0];
  }, [meters]);
  const latestInvoice = useMemo(() => activeMeter?.invoices?.[0], [activeMeter]);
  const [reassignMeterId, setReassignMeterId] = useState<number | null>(null);
  const [paymentFrom, setPaymentFrom] = useState<string>(defaultFrom);
  const [paymentTo, setPaymentTo] = useState<string>(defaultTo);
  const payments = usePayments(subscriberId, {
    from: paymentFrom || undefined,
    to: paymentTo || undefined,
  });
  const invoices = useUnpaidInvoices(subscriberId);
  const allInvoices = useInvoices(subscriberId);
  const { user } = useAuth();

  const [openPayment, setOpenPayment] = useState(false);
  const [reversePaymentId, setReversePaymentId] = useState<number | null>(null);
  const [viewInvoiceId, setViewInvoiceId] = useState<number | null>(null);
  const viewInvoiceQuery = useInvoice(viewInvoiceId ?? 0);
  const statsLoading = allInvoices.isLoading || payments.isLoading;
  const [tab, setTab] = useState(0);
  const [from, setFrom] = useState<string>(defaultFrom);
  const [to, setTo] = useState<string>(defaultTo);
  const [invoiceStatus, setInvoiceStatus] = useState<string>("");
  const [invoiceFrom, setInvoiceFrom] = useState<string>(defaultFrom);
  const [invoiceTo, setInvoiceTo] = useState<string>(defaultTo);

const statement = useSubscriberStatement(subscriberId, {
  from: from || undefined,
  to: to || undefined,
});

  const filteredSubscriberInvoices = useMemo(() => {
    const status = invoiceStatus || undefined;
    const fromDate = invoiceFrom ? new Date(invoiceFrom) : undefined;
    const toDate = invoiceTo ? new Date(invoiceTo) : undefined;

    return allInvoices.invoices.filter((inv) => {
      if (status && inv.status !== status) return false;

      if (fromDate || toDate) {
        if (!inv.createdAt) return false;
        const created = new Date(inv.createdAt);
        if (fromDate && created < fromDate) return false;
        if (toDate) {
          const end = new Date(toDate);
          end.setHours(23, 59, 59, 999);
          if (created > end) return false;
        }
      }

      return true;
    });
  }, [allInvoices.invoices, invoiceStatus, invoiceFrom, invoiceTo]);

  const filteredSubscriberPayments = useMemo(
    () => payments.payments ?? [],
    [payments.payments]
  );

  const updateMeterStatus = async (
    meterId: number,
    status: MeterStatus
  ) => {
    await updateMeter(meterId, { status });
    qc.invalidateQueries({ queryKey: ["meters", "by-subscriber", subscriberId] });
    qc.invalidateQueries({ queryKey: ["subscriber", subscriberId] });
  };

  const stats = useMemo(() => {
    const totalDue = allInvoices.invoices.reduce(
      (sum, inv) => sum + (inv.totalDue ?? 0),
      0
    );

    const totalPaid = (payments.payments ?? [])
      .filter((p) => !p.isReversed)
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);

    const outstanding = allInvoices.invoices.reduce((sum, inv) => {
      if (inv.status === "ISSUED" || inv.status === "PARTIALLY_PAID") {
        return sum + (inv.remainingBalance ?? 0);
      }
      return sum;
    }, 0);

    const invoicesCount = allInvoices.invoices.length;

    return { totalDue, totalPaid, outstanding, invoicesCount };
  }, [allInvoices.invoices, payments.payments]);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2, mb: 2, minHeight: 140 }}>
        {isLoading ? (
          <Skeleton height={80} />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: { xs: "stretch", lg: "center" },
              gap: 2,
            }}
          >
            <Box sx={{ minWidth: { lg: 200 } }}>
              <Stack spacing={0.5} alignItems="flex-start">
                <Typography variant="h6" fontWeight={600}>
                  {subscriber?.fullName}
                </Typography>
                <Typography variant="body2">
                  Phone: {subscriber?.phone}
                </Typography>
                {activeMeter && (
                  <Typography variant="body2">
                    Current Meter: {activeMeter.number} ({activeMeter.status})
                  </Typography>
                )}
                {latestInvoice?.previousBalance != null && (
                  <Typography variant="body2">
                    Prev Balance (latest invoice):{" "}
                    {latestInvoice.previousBalance}
                  </Typography>
                )}
                {subscriber?.address && (
                  <Typography variant="body2">
                    Address: {subscriber.address}
                  </Typography>
                )}
              </Stack>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
              <Grid
                container
                spacing={1.5}
                justifyContent="center"
                alignItems="center"
                sx={{ width: "100%", maxWidth: 800 }}
                wrap="wrap"
              >
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard
                    label="Total Invoiced"
                    value={stats.totalDue}
                    icon={<RequestQuote />}
                    loading={statsLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard
                    label="Total Paid"
                    value={stats.totalPaid}
                    icon={<Paid />}
                    loading={statsLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard
                    label="Outstanding"
                    value={stats.outstanding}
                    icon={<WarningAmber />}
                    loading={statsLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard
                    label="Invoices Count"
                    value={stats.invoicesCount}
                    icon={<ReceiptLong />}
                    loading={statsLoading}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Paper>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Statement" />
          <Tab label="Meters" />
          <Tab label="Payments" />
          <Tab label="Invoices" />
          <Tab label="Invoices History" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Stack spacing={2}>
          <Paper sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <TextField
                type="date"
                size="small"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
              <Button
                variant="outlined"
                href={getSubscriberStatementPdfUrl(subscriberId)}
                target="_blank"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                PDF
              </Button>
            </Stack>
          </Paper>

          {statement.isLoading ? (
            <Skeleton height={300} />
          ) : statement.data ? (
            <SubscriberStatementTable
              openingBalanceUsd={statement.data.openingBalanceUsd}
              rows={statement.data.statement}
              finalUsd={statement.data.finalBalanceUsd}
              finalLbp={statement.data.finalBalanceLbp}
            />
          ) : (
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No statement data available.
              </Typography>
            </Paper>
          )}
        </Stack>
      )}

      {tab === 1 && (
        <SubscriberMeters
          onReassign={(meterId) => setReassignMeterId(meterId)}
          meters={meters}
          loading={metersLoading}
          onUpdateStatus={updateMeterStatus}
        />
      )}

      {tab === 2 && (
        <Stack spacing={2}>
          <Paper sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <TextField
                type="date"
                size="small"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={paymentFrom}
                onChange={(e) => setPaymentFrom(e.target.value)}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={paymentTo}
                onChange={(e) => setPaymentTo(e.target.value)}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
            </Stack>
          </Paper>
          <SubscriberPaymentsTable
            payments={filteredSubscriberPayments}
            loading={payments.isLoading}
            onReverse={(id) => setReversePaymentId(id)}
            onAddPayment={() => setOpenPayment(true)}
          />
        </Stack>
      )}

      {tab === 3 && (
        <Stack spacing={2}>
          <Paper sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <TextField
                select
                size="small"
                label="Status"
                value={invoiceStatus}
                onChange={(e) => setInvoiceStatus(e.target.value)}
                sx={{ minWidth: { sm: 200 }, width: { xs: "100%", sm: "auto" } }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="ISSUED">ISSUED</MenuItem>
                <MenuItem value="PARTIALLY_PAID">PARTIALLY_PAID</MenuItem>
                <MenuItem value="PAID">PAID</MenuItem>
                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                <MenuItem value="REVERSED_PARTIAL">REVERSED_PARTIAL</MenuItem>
                <MenuItem value="REVERSED_FULL">REVERSED_FULL</MenuItem>
              </TextField>
              <TextField
                type="date"
                size="small"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={invoiceFrom}
                onChange={(e) => setInvoiceFrom(e.target.value)}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={invoiceTo}
                onChange={(e) => setInvoiceTo(e.target.value)}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
            </Stack>
          </Paper>
          <SubscriberInvoicesTable
            invoices={filteredSubscriberInvoices}
            loading={allInvoices.isLoading}
            onView={(invoiceId) => setViewInvoiceId(invoiceId)}
          />
        </Stack>
      )}

      {tab === 4 && (
        <Paper sx={{ p: 2 }}>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Received</TableCell>
                  <TableCell align="right">Remaining</TableCell>
                  <TableCell>Receiver</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data yet — waiting for backend fields (date, receiver, history).
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <SubscriberReassignMeterDialog
        open={!!reassignMeterId}
        meterId={reassignMeterId!}
        currentSubscriberId={subscriberId}
        onClose={() => setReassignMeterId(null)}
        onConfirm={async (newSubscriberId) => {
          await updateMeter(reassignMeterId!, {
            subscriberId: newSubscriberId,
          });
          qc.invalidateQueries({ queryKey: ["meters", "by-subscriber", subscriberId] });
          qc.invalidateQueries({ queryKey: ["subscriber", subscriberId] });
          setReassignMeterId(null);
        }}
      />
      <AddPaymentDialog
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        invoices={invoices.invoices}
        onSubmit={({ amount, invoiceId, isPrepayment }) => {
          payments.createPayment.mutate({
            amount,
            subscriberId,
            invoiceId,
            isPrepayment,
            receiverId: user!.id,
            receiverType:
              user!.role === "ADMIN"
                ? "OWNER"
                : user!.role === "EMPLOYEE"
                ? "EMPLOYEE"
                : "COLLECTOR",
          });
          setOpenPayment(false);
        }}
      />
      <ReversePaymentDialog
        open={!!reversePaymentId}
        onClose={() => setReversePaymentId(null)}
        onConfirm={(reason) => {
          payments.reversePayment.mutate({
            paymentId: reversePaymentId!,
            reason,
          });
          setReversePaymentId(null);
        }}
      />

      {viewInvoiceId !== null && (
        <InvoiceViewDialog
          open
          invoiceId={viewInvoiceId}
          onClose={() => setViewInvoiceId(null)}
          query={viewInvoiceQuery}
        />
      )}

    </DashboardLayout>
  );
}
