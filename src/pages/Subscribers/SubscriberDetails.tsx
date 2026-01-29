import {
  Paper,
  Typography,
  Stack,
  Skeleton,
  Divider,
  Button,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useSubscriberDetails } from "../../hooks/useSubscriberDetails";
import SubscriberMeters from "./SubscriberMeters";
import SubscriberPayments from "./SubscriberPayments";
import { useState } from "react";
import SubscriberReassignMeterDialog from "./SubscriberReassignMeterDialog";
import { updateMeter } from "../../api/meters";
import SubscriberPaymentsTable from "./SubscriberPaymentsTable";
import { usePayments } from "../../hooks/usePayments";
import { useUnpaidInvoices } from "../../hooks/useInvoices";
import AddPaymentDialog from "./AddPaymentDialog";
import { useAuth } from "../../context/AuthContext";
import ReversePaymentDialog from "./ReversePaymentDialog";
import SubscriberInvoicesTable from "./SubscriberInvoicesTable";
import { useTheme } from "../../context/ThemeContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";

export default function SubscriberDetails() {
  const { id } = useParams();
  const subscriberId = Number(id);
  const navigate = useNavigate();
  const { colors } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const { subscriber, isLoading } = useSubscriberDetails(subscriberId);
  const [reassignMeterId, setReassignMeterId] = useState<number | null>(null);
  const payments = usePayments(subscriberId);
  const invoices = useUnpaidInvoices(subscriberId);
  const { user } = useAuth();

  const [openPayment, setOpenPayment] = useState(false);
  const [reversePaymentId, setReversePaymentId] = useState<number | null>(null);

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
          mb: 3,
        }}
      >
        {isLoading ? (
          <Stack spacing={1}>
            <Skeleton height={40} width="40%" />
            <Skeleton height={20} width="30%" />
          </Stack>
        ) : (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Stack spacing={1} flex={1}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/subscribers")}
                sx={{
                  color: colors.textSubtle,
                  justifyContent: "flex-start",
                  p: 0,
                  mb: 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: colors.accent,
                  },
                }}
              >
                Back to Subscribers
              </Button>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                {subscriber?.fullName}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.textSubtle,
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  }}
                >
                  📞 {subscriber?.phone}
                </Typography>
                {subscriber?.address && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.textSubtle,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    }}
                  >
                    📍 {subscriber.address}
                  </Typography>
                )}
              </Stack>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                onClick={() => navigate(`/subscribers/${subscriberId}/statement`)}
                sx={{
                  borderColor: colors.accent,
                  color: colors.accent,
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: `${colors.accent}22`,
                    borderColor: colors.secondary,
                    color: colors.secondary,
                  },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {!isMobile && "View Statement"}
                {isMobile && "Statement"}
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenPayment(true)}
                sx={{
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
                  color: colors.darker,
                  fontWeight: 700,
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 24px ${colors.accent}44`,
                  },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {!isMobile && "Add Payment"}
                {isMobile && "Payment"}
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>

      {/* Divider */}
      <Divider
        sx={{
          borderColor: colors.border,
          my: 3,
          opacity: 0.3,
        }}
      />

      {/* Meters Section */}
      <SubscriberMeters
        onReassign={(meterId) => setReassignMeterId(meterId)}
        meters={subscriber?.meters}
        loading={isLoading}
      />

      {/* Payments History Table */}
      <Box sx={{ my: 3 }}>
        <SubscriberPaymentsTable
          payments={payments.payments}
          loading={payments.isLoading}
          onReverse={(id) => setReversePaymentId(id)}
        />
      </Box>

      {/* Unpaid Invoices Table */}
      <Box sx={{ my: 3 }}>
        <SubscriberInvoicesTable
          invoices={invoices.invoices}
          loading={invoices.isLoading}
          onView={(invoiceId) => navigate(`/invoices/${invoiceId}`)}
        />
      </Box>

      {/* Legacy Payments Component (if needed) */}
      {subscriber?.payments && (
        <Box sx={{ my: 3 }}>
          <SubscriberPayments
            payments={subscriber.payments}
            loading={isLoading}
          />
        </Box>
      )}

      {/* Dialogs */}
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
