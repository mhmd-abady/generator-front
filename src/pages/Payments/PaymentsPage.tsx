import {
  Paper,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useAllPayments } from "../../hooks/usePayments";
import SubscriberPaymentsTable from "../Subscribers/SubscriberPaymentsTable";
import ReversePaymentDialog from "../Subscribers/ReversePaymentDialog";
import { usePayments } from "../../hooks/usePayments";

export default function PaymentsPage() {
  const { data, isLoading } = useAllPayments();

  const { reversePayment } = usePayments(0); // we only use reverse mutation
  const [reverseId, setReverseId] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Payments
        </Typography>
      </Paper>

      {isLoading ? (
        <Skeleton height={300} />
      ) : (
        <SubscriberPaymentsTable
          payments={data}
          loading={false}
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
