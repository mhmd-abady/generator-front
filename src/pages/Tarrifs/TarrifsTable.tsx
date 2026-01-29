import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Tariff } from "../../api/tariffs";
import { useTheme } from "../../context/ThemeContext";

export default function TariffsTable({
  rows,
  onDelete,
}: {
  rows: Tariff[];
  onDelete: (id: number) => void;
}) {
  const { colors } = useTheme();

  return (
    <Paper sx={{ p: 2, mt: 2, borderRadius: '12px', background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`, border: `1px solid ${colors.border}33` }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: colors.textSubtle, fontWeight: 700 }}>Period</TableCell>
            <TableCell sx={{ color: colors.textSubtle, fontWeight: 700 }}>Scope</TableCell>
            <TableCell sx={{ color: colors.textSubtle, fontWeight: 700 }}>Energy (kWh)</TableCell>
            <TableCell sx={{ color: colors.textSubtle, fontWeight: 700 }}>Capacity (A)</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((t) => (
            <TableRow key={t.id} sx={{ '&:hover': { background: `${colors.accent}11` } }}>
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
