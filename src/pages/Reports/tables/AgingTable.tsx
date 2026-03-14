import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { AgingReportResponse } from "../../../api/reports";

export default function AgingTable({ data }: { data: AgingReportResponse }) {
  const isCompactView = useMediaQuery("(max-width:1024px)");

  const totalPrevBalance =
    data.totals.totalPreviousBalance ??
    data.rows.reduce(
      (sum, row) => sum + (row.totalPreviousBalance ?? 0),
      0
    );

  return (
    <Paper sx={{ p: 2 }}>
      {/* SUMMARY */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        flexWrap="wrap"
        mb={2}
      >
        <Typography>
          Subscribers: <b>{data.totals.subscribers}</b>
        </Typography>
        <Typography>
          Total Owed: <b>{data.totals.totalOwed}</b>
        </Typography>
        <Typography>
          Prev Balance: <b>{totalPrevBalance}</b>
        </Typography>
        <Typography>
          0-30: <b>{data.totals["0_30"]}</b>
        </Typography>
        <Typography>
          31-60: <b>{data.totals["31_60"]}</b>
        </Typography>
        <Typography>
          61-90: <b>{data.totals["61_90"]}</b>
        </Typography>
        <Typography>
          90+: <b>{data.totals["90_plus"]}</b>
        </Typography>
      </Stack>

      {isCompactView ? (
        <Stack spacing={1.5}>
          {data.rows.map((r) => (
            <Paper
              key={r.subscriber.id}
              variant="outlined"
              sx={{ p: 1.5, borderRadius: 2, borderColor: "divider" }}
            >
              <Stack spacing={1.1}>
                <Typography fontWeight={700}>{r.subscriber.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {r.subscriber.phone}
                </Typography>

                <Typography variant="body2">
                  {r.region.name} / {r.neighborhood.name}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gap: 0.75,
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  }}
                >
                  <Typography variant="body2">
                    Prev: {r.totalPreviousBalance ?? "-"}
                  </Typography>
                  <Typography variant="body2">0-30: {r.buckets["0_30"]}</Typography>
                  <Typography variant="body2">31-60: {r.buckets["31_60"]}</Typography>
                  <Typography variant="body2">61-90: {r.buckets["61_90"]}</Typography>
                  <Typography variant="body2">90+: {r.buckets["90_plus"]}</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    Total: {r.totalOwed}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                <TableCell>Subscriber</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Neighborhood</TableCell>
                <TableCell align="right">Prev Balance</TableCell>
                <TableCell align="right">0-30</TableCell>
                <TableCell align="right">31-60</TableCell>
                <TableCell align="right">61-90</TableCell>
                <TableCell align="right">90+</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.rows.map((r) => (
                <TableRow key={r.subscriber.id} hover>
                  <TableCell>{r.subscriber.fullName}</TableCell>
                  <TableCell>{r.subscriber.phone}</TableCell>
                  <TableCell>{r.region.name}</TableCell>
                  <TableCell>{r.neighborhood.name}</TableCell>
                  <TableCell align="right">
                    {r.totalPreviousBalance ?? "—"}
                  </TableCell>

                  <TableCell align="right">{r.buckets["0_30"]}</TableCell>
                  <TableCell align="right">{r.buckets["31_60"]}</TableCell>
                  <TableCell align="right">{r.buckets["61_90"]}</TableCell>
                  <TableCell align="right">{r.buckets["90_plus"]}</TableCell>

                  <TableCell align="right">
                    <b>{r.totalOwed}</b>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
