import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import type { StatementRow } from "../../api/statements";

export default function SubscriberStatementTable({
  openingBalanceUsd,
  rows,
  finalUsd,
  finalLbp,
}: {
  openingBalanceUsd: number;
  rows: StatementRow[];
  finalUsd: number;
  finalLbp: number;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Opening Balance (USD): {openingBalanceUsd.toLocaleString()}
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell align="right">Prev Balance</TableCell>
            <TableCell align="right">Debit USD</TableCell>
            <TableCell align="right">Credit USD</TableCell>
            <TableCell align="right">Balance USD</TableCell>
            <TableCell align="right">Balance LBP</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>
              <TableCell>
                {new Date(r.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{r.reference}</TableCell>
              <TableCell align="right">
                {r.type === "INVOICE" && r.previousBalance != null
                  ? r.previousBalance
                  : "—"}
              </TableCell>
              <TableCell align="right">
                {r.debitUsd || "â€”"}
              </TableCell>
              <TableCell align="right">
                {r.creditUsd || "â€”"}
              </TableCell>
              <TableCell align="right">
                {r.balanceUsd.toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {r.balanceLbp.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography sx={{ mt: 2 }} fontWeight={600}>
        Final Balance: {finalUsd.toLocaleString()} USD /{" "}
        {finalLbp.toLocaleString()} LBP
      </Typography>
    </Paper>
  );
}
