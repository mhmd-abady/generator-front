import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Skeleton,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useSubscriberStatement } from "../../hooks/useSubscriberStatement";
import SubscriberStatementTable from "./SubscriberStatementTable";
import { getSubscriberStatementPdfUrl } from "../../api/statements";

export default function SubscriberStatementPage() {
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

  const [from, setFrom] = useState<string>(defaultFrom);
  const [to, setTo] = useState<string>(defaultTo);

  const { data, isLoading } = useSubscriberStatement(subscriberId, {
    from: from || undefined,
    to: to || undefined,
  });

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            Statement — {data?.subscriber.fullName}
          </Typography>
          <Typography variant="body2">
            Phone: {data?.subscriber.phone}
          </Typography>

          <Button
            component={Link}
            to={`/subscribers/${subscriberId}`}
            size="small"
          >
            ← Back to Subscriber
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
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

      {isLoading ? (
  <Skeleton height={300} />
) : data ? (
  
  <SubscriberStatementTable
    openingBalanceUsd={data.openingBalanceUsd}
    rows={data.statement}
    finalUsd={data.finalBalanceUsd}
    finalLbp={data.finalBalanceLbp}
  />
) : (
  <Paper sx={{ p: 2 }}>
    <Typography variant="body2" color="text.secondary">
      No statement data available.
    </Typography>
  </Paper>
)}

    </DashboardLayout>
  );
}
