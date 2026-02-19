import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import type { Subscriber } from "../../api/subscribers";

export default function SubscribersTable({
  rows,
  onDelete,
  onEdit,
  onViewDetails,
  onViewStatement,
}: {
  rows: Subscriber[];
  onDelete: (id: number) => void;
  onEdit: (row: Subscriber) => void;
  onViewDetails: (row: Subscriber) => void;
  onViewStatement: (row: Subscriber) => void;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Neighborhood</TableCell>
            <TableCell>Meter Nb</TableCell>
            <TableCell>Box Nb</TableCell>
            <TableCell align="right">Meters</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((s) => {
            // Prefer ACTIVE meter, else fall back to first available (for legacy payloads).
            const activeFromArray = s.meters?.find(
              (m: any) => m?.status === "ACTIVE"
            );
            const meterInfo = activeFromArray || s.meter || (s.meters && s.meters[0]);
            const meterNumber = meterInfo?.number || "-";
            const boxCode = meterInfo?.box?.code || "-";
            const neighborhood =
              meterInfo?.box?.neighborhood?.name ??
              (meterInfo?.box?.neighborhoodId
                ? String(meterInfo.box.neighborhoodId)
                : "-");
            const region =
              meterInfo?.box?.region?.name ??
              (meterInfo?.box?.regionId
                ? String(meterInfo.box.regionId)
                : "-");

            return (
              <TableRow key={s.id}>
                <TableCell
                  sx={{
                    cursor: "pointer",
                    color: "primary.main",
                    fontWeight: 500,
                  }}
                  onClick={() => onViewDetails(s)}
                >
                  {s.fullName}
                </TableCell>

                <TableCell>{s.phone}</TableCell>
                <TableCell>{region}</TableCell>
                <TableCell>{neighborhood}</TableCell>
                <TableCell>{meterNumber}</TableCell>
                <TableCell>{boxCode}</TableCell>
                <TableCell align="right">
                  {s.meters ? s.meters.length : s.meter ? 1 : 0}
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onViewStatement(s)}
                    title="View Statement"
                  >
                    <DescriptionIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => onEdit(s)}
                    title="Edit Subscriber"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => onDelete(s.id)}
                    title="Delete Subscriber"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
