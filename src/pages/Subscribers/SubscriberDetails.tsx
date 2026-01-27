import {
  Paper,
  Typography,
  Stack,
  Skeleton,
  Divider,
  Button,
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

export default function SubscriberDetails() {
  const { id } = useParams();
  const subscriberId = Number(id);
  const navigate = useNavigate();
  const { subscriber, isLoading } = useSubscriberDetails(subscriberId);
  const [reassignMeterId, setReassignMeterId] = useState<number | null>(null);
const payments = usePayments(subscriberId);
const invoices = useUnpaidInvoices(subscriberId);
const { user } = useAuth();

const [openPayment, setOpenPayment] = useState(false);
const [reversePaymentId, setReversePaymentId] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <Skeleton height={40} />
        ) : (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack spacing={0.5}>
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

            <Button
              variant="outlined"
              onClick={() => navigate(`/subscribers/${subscriberId}/statement`)}
            >
              View Statement
            </Button>
          </Stack>
        )}
      </Paper>

      <Divider />

      <SubscriberMeters
        onReassign={(meterId) => setReassignMeterId(meterId)}
        meters={subscriber?.meters}
        loading={isLoading}
      />
      <SubscriberPaymentsTable
  payments={payments.payments}
  loading={payments.isLoading}
  onReverse={(id) => setReversePaymentId(id)}
/>


      {<SubscriberPayments payments={subscriber?.payments} loading={isLoading} />}
      <SubscriberInvoicesTable
  invoices={invoices.invoices}
  loading={invoices.isLoading}
  onView={(invoiceId) => navigate(`/invoices/${invoiceId}`)}
/>
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
      <Button variant="contained" onClick={() => setOpenPayment(true)}>
  Add Payment
</Button>
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
