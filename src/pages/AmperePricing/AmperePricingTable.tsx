import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AmperePricing } from "../../api/ampere-pricing";
import { formatDisplayDate } from "../../utils/date";

export default function AmperePricingTable({
  rows,
  onEdit,
  onDelete,
}: {
  rows: AmperePricing[];
  onEdit: (row: AmperePricing) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Ampere</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.ampere}A</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>
                {row.isActive ? (
                  <Chip size="small" label="ACTIVE" color="success" />
                ) : (
                  <Chip size="small" label="INACTIVE" />
                )}
              </TableCell>
              <TableCell>{formatDisplayDate(row.createdAt)}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(row)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(row.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
