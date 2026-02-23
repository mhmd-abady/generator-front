import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import type { PaymentsReportResponse } from "../../../api/reports";
import { receiverChipSx } from "../../Payments/receiverChips";

export default function PaymentsTable({
  data,
}: {
  data: PaymentsReportResponse;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      {/* SUMMARY */}
      <Stack direction="row" spacing={3} mb={2}>
        <Typography>
          Payments Count: <b>{data.count}</b>
        </Typography>
        <Typography>
          Total Received: <b>{data.totalReceived}</b>
        </Typography>
      </Stack>

      {/* TABLE */}
      <Table size="small">
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
                  sx={receiverChipSx}
                />
              </TableCell>
              <TableCell align="right">{p.amount}</TableCell>
              <TableCell>
                {new Date(p.paidAt).toISOString().split("T")[0]}
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
    </Paper>
  );
}
