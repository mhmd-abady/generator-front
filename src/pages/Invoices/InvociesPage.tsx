import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import InvoicesTable from "./InvoicesTable";
import InvoiceKPIs from "./InvoiceKPIs";
import { useAllInvoices } from "../../hooks/useInvoices";
import { useQuery } from "@tanstack/react-query";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import {
  fetchSubscribers,
  fetchSubscribersByNeighborhood,
} from "../../api/subscribers";

export default function InvoicesPage() {
  const [year, setYear] = useState<number | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [subscriberId, setSubscriberId] = useState<number | undefined>();

  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });

  const subscribersQuery = useQuery({
    queryKey: ["subscribers", neighborhoodId],
    queryFn: () =>
      neighborhoodId
        ? fetchSubscribersByNeighborhood(neighborhoodId)
        : fetchSubscribers(),
  });

  const { data, isLoading } = useAllInvoices({
    year,
    month,
    status,
    subscriberId,
    regionId,
    neighborhoodId,
  });

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Invoices
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ flex: 1 }}>
          <TextField
            select
            size="small"
            label="Year"
            value={year ?? ""}
            onChange={(e) =>
              setYear(e.target.value ? Number(e.target.value) : undefined)
            }
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All Years</MenuItem>
            {Array.from({ length: 5 }).map((_, i) => {
              const y = new Date().getFullYear() - i;
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
            value={month ?? ""}
            onChange={(e) =>
              setMonth(e.target.value ? Number(e.target.value) : undefined)
            }
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All Months</MenuItem>
            {Array.from({ length: 12 }).map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Status"
            value={status ?? ""}
            onChange={(e) => setStatus(e.target.value || undefined)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="ISSUED">ISSUED</MenuItem>
            <MenuItem value="PARTIALLY_PAID">PARTIALLY_PAID</MenuItem>
            <MenuItem value="PAID">PAID</MenuItem>
            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Region"
            value={regionId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setRegionId(v ? Number(v) : undefined);
              setNeighborhoodId(undefined);
              setSubscriberId(undefined);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Regions</MenuItem>
            {regionsQuery.data?.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Neighborhood"
            disabled={!regionId}
            value={neighborhoodId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setNeighborhoodId(v ? Number(v) : undefined);
              setSubscriberId(undefined);
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Neighborhoods</MenuItem>
            {neighborhoodsQuery.data?.map((n) => (
              <MenuItem key={n.id} value={n.id}>
                {n.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Subscriber"
            value={subscriberId ?? ""}
            onChange={(e) =>
              setSubscriberId(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">All Subscribers</MenuItem>
            {subscribersQuery.data?.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.fullName} — {s.phone}
              </MenuItem>
            ))}
          </TextField>
          </Stack>
        </Stack>
      </Paper>

      {isLoading ? (
        <Skeleton height={120} />
      ) : (
        <InvoiceKPIs invoices={data ?? []} loading={isLoading} />
      )}

      {isLoading ? (
        <Skeleton height={300} />
      ) : (
        <InvoicesTable rows={data ?? []} />
      )}
    </DashboardLayout>
  );
}
