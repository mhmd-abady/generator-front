import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  Skeleton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import InvoicesTable from "./InvoicesTable";
import InvoiceKPIs from "./InvoiceKPIs";
import { useAllInvoices } from "../../hooks/useInvoices";
import { useQuery } from "@tanstack/react-query";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useBoxes } from "../../hooks/useBoxes";
import { formatInvoiceStatus } from "./invoiceStatus";

export default function InvoicesPage() {
  const [year, setYear] = useState<number | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [boxId, setBoxId] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [onlyUnpaid, setOnlyUnpaid] = useState(false);
  const statusOptions = [
    "ISSUED",
    "PARTIALLY_PAID",
    "PAID",
    "CANCELLED",
    "REVERSED_PARTIAL",
    "REVERSED_FULL",
  ] as const;

  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });

  const { boxes, isLoading: boxesLoading } = useBoxes(
    neighborhoodId,
    regionId
  );

  const { data, isLoading } = useAllInvoices({
    year,
    month,
    status,
    regionId,
    neighborhoodId,
  });

  const filteredInvoices = (data ?? []).filter((invoice) => {
    if (onlyUnpaid) {
      if (invoice.remainingBalance <= 0) return false;
      if (invoice.status === "CANCELLED") return false;
    }

    if (boxId) {
      const invoiceBoxId = invoice.meter?.box?.id;
      if (invoiceBoxId !== boxId) return false;
    }

    const q = search.trim().toLowerCase();
    if (!q) return true;

    const subscriberName = invoice.meter?.subscriber?.fullName?.toLowerCase() ?? "";
    const invoiceId = String(invoice.id);
    const boxCode = invoice.meter?.box?.code?.toLowerCase() ?? "";

    return subscriberName.includes(q) || invoiceId.includes(q) || boxCode.includes(q);
  });

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          flexWrap="wrap"
          alignItems={{ xs: "stretch", lg: "center" }}
        >
          <Typography variant="h6" fontWeight={600}>
            Invoices
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexWrap="wrap"
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ flex: 1 }}
          >
          <TextField
            select
            size="small"
            label="Year"
            value={year ?? ""}
            onChange={(e) =>
              setYear(e.target.value ? Number(e.target.value) : undefined)
            }
            sx={{ minWidth: { sm: 140 }, width: { xs: "100%", sm: "auto" } }}
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
            sx={{ minWidth: { sm: 140 }, width: { xs: "100%", sm: "auto" } }}
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
            sx={{ minWidth: { sm: 180 }, width: { xs: "100%", sm: "auto" } }}
          >
            <MenuItem value="">All Status</MenuItem>
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {formatInvoiceStatus(s)}
              </MenuItem>
            ))}
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
              setBoxId(undefined);
            }}
            sx={{ minWidth: { sm: 180 }, width: { xs: "100%", sm: "auto" } }}
          >
            <MenuItem value="">All Regions</MenuItem>
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
              setBoxId(undefined);
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label="Neighborhood" />
            )}
            disabled={!regionId}
            sx={{ minWidth: { sm: 200 }, width: { xs: "100%", sm: "auto" } }}
          />

          <Autocomplete
            size="small"
            options={boxes}
            value={boxes.find((b) => b.id === boxId) ?? null}
            onChange={(_, value) =>
              setBoxId(value ? value.id : undefined)
            }
            getOptionLabel={(option) => option.code}
            isOptionEqualToValue={(option, value) =>
              option.id === value.id
            }
            renderInput={(params) => (
              <TextField {...params} label="Box" />
            )}
            disabled={boxesLoading || (!regionId && !neighborhoodId)}
            sx={{ minWidth: { sm: 180 }, width: { xs: "100%", sm: "auto" } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={onlyUnpaid}
                onChange={(e) => setOnlyUnpaid(e.target.checked)}
              />
            }
            label="Only unpaid"
            sx={{ ml: { sm: 1 }, width: { xs: "100%", sm: "auto" } }}
          />
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
        <>
          <Stack direction="row" sx={{ mt: 1, mb: 1 }}>
            <TextField
              size="small"
              label="Search"
              placeholder="Subscriber name or invoice ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { sm: 280 }, width: { xs: "100%", sm: "auto" } }}
            />
          </Stack>
          <InvoicesTable rows={filteredInvoices} />
        </>
      )}
    </DashboardLayout>
  );
}
