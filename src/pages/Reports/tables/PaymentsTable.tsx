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
  Chip,
} from "@mui/material";
import type { PaymentsReportResponse } from "../../../api/reports";
import { receiverChipSx, receiverRoleColor } from "../../Payments/receiverChips";
import { formatDisplayDate } from "../../../utils/date";

export default function PaymentsTable({
  data,
}: {
  data: PaymentsReportResponse;
}) {
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
          Payments Count: <b>{data.count}</b>
        </Typography>
        <Typography>
          Total Received: <b>{data.totalReceived}</b>
        </Typography>
      </Stack>

      {/* TABLE */}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Subscriber</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="center">Receiver</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Paid At</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Neighborhood</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.rows.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.subscriber.fullName}</TableCell>
                <TableCell>{p.subscriber.phone}</TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={p.receiver?.username ?? "-"}
                    color={receiverRoleColor(undefined)}
                    sx={receiverChipSx}
                  />
                </TableCell>
                <TableCell align="right">{p.amount}</TableCell>
                <TableCell>
                  {formatDisplayDate(p.paidAt)}
                </TableCell>
                <TableCell>
                  {p.invoice?.meter.box.neighborhood.region.name ?? "-"}
                </TableCell>
                <TableCell>
                  {p.invoice?.meter.box.neighborhood.name ?? "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
