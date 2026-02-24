import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  Tabs,
  Tab,
  Skeleton,
  Button,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
//import { fetchCollectors } from "../../api/users";

import {
  useAgingReport,
  usePaymentsReport,
  useSummaryReport,
  useCollectionsSummary,
} from "../../hooks/useReports";

import AgingTable from "./tables/AgingTable";
import PaymentsTable from "./tables/PaymentsTable";
import SummaryCards from "./tables/SummaryCards";
import CollectionsTable from "./tables/CollectionsTable";

export default function ReportsPage() {
  const [tab, setTab] = useState(0);

  const today = new Date();
  const [year, setYear] = useState<number | undefined>(
    today.getFullYear()
  );
  const [month, setMonth] = useState<number | undefined>(
    today.getMonth() + 1
  );
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();
  const [receiverId, setReceiverId] = useState<number | undefined>();

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const defaultFrom = formatDate(startOfMonth);
  const defaultTo = formatDate(today);
  const [useRange, setUseRange] = useState(false);

  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });

 /* const collectorsQuery = useQuery({
    queryKey: ["collectors"],
    queryFn: fetchCollectors,
  });
*/
  const filters = {
    year,
    month,
    from,
    to,
    regionId,
    neighborhoodId,
    receiverId,
  };

  const aging = useAgingReport(filters);
  const payments = usePaymentsReport(filters);
  const summary = useSummaryReport(filters);
  const collections = useCollectionsSummary(filters);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Reports
        </Typography>
      </Paper>

      {/* FILTERS */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {useRange ? (
            <>
              <TextField
                size="small"
                label="From"
                type="date"
                value={from ?? defaultFrom}
                onChange={(e) => setFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              />
              <TextField
                size="small"
                label="To"
                type="date"
                value={to ?? defaultTo}
                onChange={(e) => setTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              />
            </>
          ) : (
            <>
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
            </>
          )}

          <TextField
            select
            size="small"
            label="Region"
            value={regionId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setRegionId(v ? Number(v) : undefined);
              setNeighborhoodId(undefined);
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

          <Autocomplete
            size="small"
            options={neighborhoodsQuery.data ?? []}
            value={
              neighborhoodsQuery.data?.find(
                (n) => n.id === neighborhoodId
              ) ?? null
            }
            onChange={(_, value) =>
              setNeighborhoodId(value ? value.id : undefined)
            }
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

          <TextField
            select
            size="small"
            label="Collector"
            value={receiverId ?? ""}
            onChange={(e) =>
              setReceiverId(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Collectors</MenuItem>
           {/* {collectorsQuery.data?.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.username}
              </MenuItem>
            ))}*/}
          </TextField>

          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setUseRange((v) => {
                const next = !v;
                if (next) {
                  setFrom(from ?? defaultFrom);
                  setTo(to ?? defaultTo);
                  setMonth(undefined);
                  setYear(undefined);
                } else {
                  setFrom(undefined);
                  setTo(undefined);
                  setMonth(today.getMonth() + 1);
                  setYear(today.getFullYear());
                }
                return next;
              });
            }}
          >
            {useRange ? "Specific" : "From / To"}
          </Button>
        </Stack>
      </Paper>

      {/* TABS */}
      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Aging" />
          <Tab label="Payments" />
          <Tab label="Summary" />
          <Tab label="Collections" />
        </Tabs>
      </Paper>

      {/* CONTENT */}
      {tab === 0 &&
        (aging.isLoading ? (
          <Skeleton height={300} />
        ) : (
          <AgingTable data={aging.data!} />
        ))}

      {tab === 1 &&
        (payments.isLoading ? (
          <Skeleton height={300} />
        ) : (
          <PaymentsTable data={payments.data!} />
        ))}

      {tab === 2 &&
        (summary.isLoading ? (
          <Skeleton height={200} />
        ) : (
          <SummaryCards data={summary.data!} />
        ))}

      {tab === 3 &&
        (collections.isLoading ? (
          <Skeleton height={300} />
        ) : (
          <CollectionsTable data={collections.data!} />
        ))}
    </DashboardLayout>
  );
}
