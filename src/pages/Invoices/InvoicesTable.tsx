import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Invoice } from "../../api/invoices";

export default function InvoicesTable({ rows }: { rows: Invoice[] }) {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Subscriber</TableCell>
            <TableCell>Month</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Remaining</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((i) => (
            <TableRow
              key={i.id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/invoices/${i.id}`)}
            >
              <TableCell>{i.id}</TableCell>
               <TableCell>{i.meter?.subscriber?.fullName ?? "-"}</TableCell>
              <TableCell>{i.month}</TableCell>
              <TableCell>{i.year}</TableCell>
              <TableCell>{i.status}</TableCell>
              <TableCell>{i.totalDue}</TableCell>
              <TableCell>{i.remainingBalance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
