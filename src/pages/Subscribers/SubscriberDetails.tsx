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
  Box,
  Table,
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
import { updateMeter } from "../../api/meters";
import SubscriberPaymentsTable from "./SubscriberPaymentsTable";
import { usePayments } from "../../hooks/usePayments";
import { useInvoices, useUnpaidInvoices } from "../../hooks/useInvoices";
import AddPaymentDialog from "./AddPaymentDialog";
import { useAuth } from "../../context/AuthContext";
import ReversePaymentDialog from "./ReversePaymentDialog";
import SubscriberInvoicesTable from "./SubscriberInvoicesTable";
import {
  RequestQuote,
  Paid,
  WarningAmber,
  ReceiptLong,
} from "@mui/icons-material";
import SubscriberStatementTable from "./SubscriberStatementTable";
import { useSubscriberStatement } from "../../hooks/useSubscriberStatement";
import { getSubscriberStatementPdfUrl } from "../../api/statements";

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
        p: 2.5,
        background: "linear-gradient(135deg, #fefefe 0%, #ffffff 100%)",
        border: "1px solid #f0f0f0",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Stack spacing={1.5}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1.5,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
        </Box>
        {loading ? (
          <Skeleton width={100} height={32} />
        ) : (
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "#333333",
              fontSize: "1.75rem",
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
  const navigate = useNavigate();
  const { subscriber, isLoading } = useSubscriberDetails(subscriberId);
  const meters =
    subscriber?.meters ??
    (subscriber?.meter ? [subscriber.meter] : undefined);
  const [reassignMeterId, setReassignMeterId] = useState<number | null>(null);
const payments = usePayments(subscriberId);
const invoices = useUnpaidInvoices(subscriberId);
const allInvoices = useInvoices(subscriberId);
const { user } = useAuth();

const [openPayment, setOpenPayment] = useState(false);
const [reversePaymentId, setReversePaymentId] = useState<number | null>(null);
const statsLoading = allInvoices.isLoading || payments.isLoading;
const [tab, setTab] = useState(0);
const [from, setFrom] = useState<string>();
const [to, setTo] = useState<string>();

const statement = useSubscriberStatement(subscriberId, { from, to });

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
      <Paper sx={{ p: 2, mb: 2, minHeight: 180 }}>
        {isLoading ? (
          <Skeleton height={80} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ minWidth: 240 }}>
              <Stack spacing={0.5} alignItems="flex-start">
                <Typography variant="h6" fontWeight={600}>
                  {subscriber?.fullName}
                </Typography>
                <Typography variant="body2">
                  Phone: {subscriber?.phone}
                </Typography>
                {subscriber?.address && (
                  <Typography variant="body2">
                    Address: {subscriber.address}
                  </Typography>
                )}
              </Stack>
            </Box>

            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ maxWidth: 900 }}
              >
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                  <StatCard
                    label="Total Invoiced"
                    value={stats.totalDue}
                    icon={<RequestQuote />}
                    loading={statsLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                  <StatCard
                    label="Total Paid"
                    value={stats.totalPaid}
                    icon={<Paid />}
                    loading={statsLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                  <StatCard
                    label="Outstanding"
                    value={stats.outstanding}
                    icon={<WarningAmber />}
                    loading={statsLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
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
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                type="date"
                size="small"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={from ?? ""}
                onChange={(e) => setFrom(e.target.value || undefined)}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={to ?? ""}
                onChange={(e) => setTo(e.target.value || undefined)}
              />
              <Button
                variant="outlined"
                href={getSubscriberStatementPdfUrl(subscriberId)}
                target="_blank"
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
          loading={isLoading}
        />
      )}

      {tab === 2 && (
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={() => setOpenPayment(true)}>
              Add Payment
            </Button>
          </Stack>
          <SubscriberPaymentsTable
            payments={payments.payments}
            loading={payments.isLoading}
            onReverse={(id) => setReversePaymentId(id)}
          />
        </Stack>
      )}

      {tab === 3 && (
        <SubscriberInvoicesTable
          invoices={invoices.invoices}
          loading={invoices.isLoading}
          onView={(invoiceId) => navigate(`/invoices/${invoiceId}`)}
        />
      )}

      {tab === 4 && (
        <Paper sx={{ p: 2 }}>
          <Table size="small">
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
        </Paper>
      )}
      <SubscriberReassignMeterDialog
        open={!!reassignMeterId}
        meterId={reassignMeterId!}
        currentSubscriberId={subscriberId}
        onClose={() => setReassignMeterId(null)}
        onConfirm={(newSubscriberId) => {
          updateMeter(reassignMeterId!, {
            subscriberId: newSubscriberId,
          });
          setReassignMeterId(null);
        }}
      />
      <AddPaymentDialog
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        invoices={invoices.invoices}
        onSubmit={({ amount, invoiceId }) => {
          payments.createPayment.mutate({
            amount,
            subscriberId,
            invoiceId,
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

    </DashboardLayout>
  );
}
