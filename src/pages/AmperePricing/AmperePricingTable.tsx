import {
  Box,
  Paper,
  Stack,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  if (isPhone) {
    return (
      <Stack spacing={1.25}>
        {rows.map((row) => (
          <Paper key={row.id} variant="outlined" sx={{ p: 1.25 }}>
            <Stack spacing={0.75}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700}>#{row.id}</Typography>
                {row.isActive ? (
                  <Chip size="small" label="ACTIVE" color="success" />
                ) : (
                  <Chip size="small" label="INACTIVE" />
                )}
              </Stack>
              <Typography variant="body2">Ampere: {row.ampere}A</Typography>
              <Typography variant="body2">Price: {row.price}</Typography>
              <Typography variant="body2">Created: {formatDisplayDate(row.createdAt)}</Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <IconButton size="small" onClick={() => onEdit(row)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete(row.id)}>
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
        <Table size="small" sx={{ minWidth: 720 }}>
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
      </TableContainer>
    </Paper>
  );
}
