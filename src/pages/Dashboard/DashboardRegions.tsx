import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
} from "@mui/material";
import type { RegionBreakdownRow } from "../../api/dashboard";

type Props = {
  data?: RegionBreakdownRow[];
  loading: boolean;
  neighborhoodSelected: boolean;
};

export default function DashboardRegions({
  data,
  loading,
  neighborhoodSelected,
}: Props) {
  if (neighborhoodSelected) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Region Breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Region breakdown is not available when a neighborhood is selected.
        </Typography>
      </Paper>
    );
  }

  const rows =
    data?.slice().sort(
      (a, b) => b.totalOutstanding - a.totalOutstanding
    ) ?? [];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Regions Breakdown
      </Typography>

      {loading ? (
        <Skeleton height={220} />
      ) : rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No regional data available
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Region</TableCell>
              <TableCell align="right">Invoiced</TableCell>
              <TableCell align="right">Collected</TableCell>
              <TableCell align="right">Outstanding</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.regionId}>
                <TableCell>{r.regionName}</TableCell>
                <TableCell align="right">
                  {r.totalInvoiced.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {r.totalCollected.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {r.totalOutstanding.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
