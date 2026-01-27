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
import type { CollectionsSummaryResponse } from "../../../api/reports";

export default function CollectionsTable({
  data,
}: {
  data: CollectionsSummaryResponse;
}) {
  const totalAll = data.rows.reduce(
    (sum, r) => sum + r.totalCollected,
    0
  );

  return (
    <Paper sx={{ p: 2 }}>
      {/* SUMMARY */}
      <Stack direction="row" spacing={3} mb={2}>
        <Typography>
          Collectors: <b>{data.rows.length}</b>
        </Typography>
        <Typography>
          Total Collected: <b>{totalAll}</b>
        </Typography>
      </Stack>

      {/* TABLE */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Receiver</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Payments</TableCell>
            <TableCell align="right">Total Collected</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.rows.map((r) => (
            <TableRow key={`${r.receiverType}-${r.receiverId}`} hover>
              <TableCell>{r.receiverName}</TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={r.role}
                  color={
                    r.role === "ADMIN"
                      ? "primary"
                      : r.role === "COLLECTOR"
                      ? "success"
                      : "default"
                  }
                />
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={r.receiverType}
                  variant="outlined"
                />
              </TableCell>

              <TableCell align="right">
                {r.paymentsCount}
              </TableCell>

              <TableCell align="right">
                <b>{r.totalCollected}</b>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
