import {
  Paper,
  Typography,
  Stack,
  Divider,
  Skeleton,
  Button,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useInvoice } from "../../hooks/useInvoices";
import { getInvoicePdfUrl } from "../../api/invoices";
import { useQueryClient } from "@tanstack/react-query";
import PayInvoiceDialog from "./PayInvoiceDialog";
import { useState } from "react";

import InvoiceFixesDialog from "./InvoiceFixesDialog";

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const invoiceId = Number(id);

  const { data, isLoading } = useInvoice(invoiceId);
const qc = useQueryClient();
const [payOpen, setPayOpen] = useState(false);

const [fixesOpen, setFixesOpen] = useState(false);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <Skeleton height={80} />
        ) : (
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight={600}>
              Invoice #{data!.id} — {data!.month}/{data!.year}
            </Typography>

            <Typography variant="body2">
              Subscriber: {data!.meter.subscriber.fullName}
            </Typography>

            <Typography variant="body2">
              Meter: {data!.meter.number}
            </Typography>

            <Button
              component={Link}
              to={`/subscribers/${data!.meter.subscriber.id}`}
              size="small"
            >
              ← Back to Subscriber
            </Button>
          </Stack>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <Skeleton height={120} />
        ) : (
          <Stack spacing={1}>
            <Typography>Total Due: {data!.totalDue}</Typography>
            <Typography>Paid: {data!.amountPaid}</Typography>
            <Typography>
              Remaining: {data!.remainingBalance}
            </Typography>
            <Typography>
              Fixes Amount: {data!.fixesAmount ?? "—"}
            </Typography>
            {data!.fixesNote && (
              <Typography>Fixes Note: {data!.fixesNote}</Typography>
            )}
            <Typography>Status: {data!.status}</Typography>

            <Divider />

<Button
  variant="contained"
  onClick={() => setPayOpen(true)}
  disabled={!data || data.remainingBalance <= 0 || data.status === "CANCELLED"}
>
  Pay
</Button>

<Button
  variant="outlined"
  color="warning"
  onClick={() => setFixesOpen(true)}
  disabled={
    data?.status === "PAID" ||
    data?.status === "CANCELLED"
  }
>
  Add Fixes
</Button>

            <Button
              variant="outlined"
              href={getInvoicePdfUrl(invoiceId)}
              target="_blank"
            >
              PDF
            </Button>
          </Stack>
        )}
      </Paper>
      {data && (
  <PayInvoiceDialog
    open={payOpen}
    onClose={() => setPayOpen(false)}
    invoiceId={data.id}
    subscriberId={data.meter.subscriber.id}
    remainingBalance={data.remainingBalance}
    onSuccess={() => {
      // refresh invoice + any invoice lists
      qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      qc.invalidateQueries({ queryKey: ["invoices"],exact: false });
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["subscriber-statement"] });
    }}
  />
)}

{data && (
  <InvoiceFixesDialog
    open={fixesOpen}
    onClose={() => setFixesOpen(false)}
    invoiceId={data.id}
    onSuccess={() => {
      qc.invalidateQueries({ queryKey: ["invoice", data.id] });
      qc.invalidateQueries({ queryKey: ["invoices"],exact: false });
      qc.invalidateQueries({ queryKey: ["subscriber-statement"] });
    }}
  />
)}

    </DashboardLayout>
  );
}
