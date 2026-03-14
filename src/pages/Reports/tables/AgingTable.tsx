import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
} from "@mui/material";
import type { AgingReportResponse } from "../../../api/reports";

export default function AgingTable({ data }: { data: AgingReportResponse }) {
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
          0â€“30: <b>{data.totals["0_30"]}</b>
        </Typography>
        <Typography>
          31â€“60: <b>{data.totals["31_60"]}</b>
        </Typography>
        <Typography>
          61â€“90: <b>{data.totals["61_90"]}</b>
        </Typography>
        <Typography>
          90+: <b>{data.totals["90_plus"]}</b>
        </Typography>
      </Stack>

      {/* TABLE */}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 980 }}>
          <TableHead>
            <TableRow>
              <TableCell>Subscriber</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Neighborhood</TableCell>
              <TableCell align="right">Prev Balance</TableCell>
              <TableCell align="right">0â€“30</TableCell>
              <TableCell align="right">31â€“60</TableCell>
              <TableCell align="right">61â€“90</TableCell>
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

                <TableCell align="right">
                  {r.buckets["0_30"]}
                </TableCell>
                <TableCell align="right">
                  {r.buckets["31_60"]}
                </TableCell>
                <TableCell align="right">
                  {r.buckets["61_90"]}
                </TableCell>
                <TableCell align="right">
                  {r.buckets["90_plus"]}
                </TableCell>

                <TableCell align="right">
                  <b>{r.totalOwed}</b>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
