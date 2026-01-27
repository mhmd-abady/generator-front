import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import type { Meter } from "../../api/meters";

export default function MetersTable({ rows }: { rows: Meter[] }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Subscriber</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Box</TableCell>
            <TableCell>Ampere</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.number}</TableCell>
              <TableCell>{m.subscriber?.fullName}</TableCell>
              <TableCell>{m.subscriber?.phone}</TableCell>
              <TableCell>{m.box?.code}</TableCell>
              <TableCell>{m.ampere ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
