import {
  Box,
  Stack,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  IconButton, Paper, Typography, useMediaQuery, useTheme
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
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  if (isPhone) {
    return (
      <Stack spacing={1.25}>
        {rows.map((t) => (
          <Paper key={t.id} variant="outlined" sx={{ p: 1.25 }}>
            <Stack spacing={0.75}>
              <Typography fontWeight={700}>Period: {t.month}/{t.year}</Typography>
              <Typography variant="body2">
                Scope: {t.neighborhood
                  ? `Neighborhood: ${t.neighborhood.name}`
                  : t.region
                  ? `Region: ${t.region.name}`
                  : "Global"}
              </Typography>
              <Typography variant="body2">kWh Rate: {t.kwhRate}</Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton size="small" color="error" onClick={() => onDelete(t.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 520 }}>
        <TableHead>
          <TableRow>
            <TableCell>Period</TableCell>
            <TableCell>Scope</TableCell>
            <TableCell>kWh</TableCell>
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
      </TableContainer>
    </Paper>
  );
}
