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
import type { CollectionsSummaryResponse } from "../../../api/reports";
import { receiverChipSx, receiverRoleColor } from "../../Payments/receiverChips";

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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        flexWrap="wrap"
        mb={2}
      >
        <Typography>
          Collectors: <b>{data.rows.length}</b>
        </Typography>
        <Typography>
          Total Collected: <b>{totalAll}</b>
        </Typography>
      </Stack>

      {/* TABLE */}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 620 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Receiver</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="right">Payments</TableCell>
              <TableCell align="right">Total Collected</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.rows.map((r) => (
              <TableRow key={`${r.receiverType}-${r.receiverId}`} hover>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={r.receiverName}
                    sx={receiverChipSx}
                  />
                </TableCell>

                <TableCell align="center">
                  <Chip
                    size="small"
                    label={r.role}
                    color={receiverRoleColor(r.role)}
                    sx={receiverChipSx}
                  />
                </TableCell>

                <TableCell align="center">
                  <Chip
                    size="small"
                    label={r.receiverType}
                    variant="outlined"
                    sx={receiverChipSx}
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
      </TableContainer>
    </Paper>
  );
}
