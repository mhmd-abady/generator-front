import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Tariff } from "../../api/tariffs";

export default function TariffsTable({
  rows,
  onDelete,
}: {
  rows: Tariff[];
  onDelete: (id: number) => void;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Period</TableCell>
            <TableCell>Scope</TableCell>
            <TableCell>kWh</TableCell>
            <TableCell>Ampere</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.month}/{t.year}</TableCell>
              <TableCell>
                {t.neighborhood
                  ? `Neighborhood: ${t.neighborhood.name}`
                  : t.region
                  ? `Region: ${t.region.name}`
                  : "Global"}
              </TableCell>
              <TableCell>{t.kwhRate}</TableCell>
              <TableCell>{t.ampereRate}</TableCell>

              <TableCell align="right">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(t.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
