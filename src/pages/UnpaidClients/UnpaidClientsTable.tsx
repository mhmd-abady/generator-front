import {
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export type UnpaidInvoiceRow = {
  id: number;
  invoiceDate: string;
  subscriberName: string;
  phone: string;
  regionName: string;
  neighborhoodName: string;
  boxCode: string;
  meterNumber: string;
  totalDue: number;
  remainingBalance: number;
  daysOverdue: number;
  status: string;
};

const getOverdueChip = (daysOverdue: number) => {
  if (daysOverdue >= 61) return { label: `${daysOverdue}d`, color: "error" as const };
  if (daysOverdue >= 31) return { label: `${daysOverdue}d`, color: "warning" as const };
  return { label: `${daysOverdue}d`, color: "default" as const };
};

export default function UnpaidClientsTable({
  rows,
  loading,
  onView,
  onNotify,
}: {
  rows: UnpaidInvoiceRow[];
  loading: boolean;
  onView: (invoiceId: number) => void;
  onNotify: (row: UnpaidInvoiceRow) => void;
}) {
  const isCompactView = useMediaQuery("(max-width:1024px)");

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Skeleton height={300} />
      </Paper>
    );
  }

  if (!rows.length) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No unpaid clients found for these filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      {isCompactView ? (
        <Stack spacing={1.5}>
          {rows.map((row) => {
            const overdue = getOverdueChip(row.daysOverdue);

            return (
              <Paper
                key={row.id}
                variant="outlined"
                sx={{ p: 1.5, borderRadius: 2, borderColor: "divider" }}
              >
                <Stack spacing={1.1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography fontWeight={700}>Invoice #{row.id}</Typography>
                    <Chip size="small" label={overdue.label} color={overdue.color} />
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    {row.subscriberName} - {row.phone || "No phone"}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 0.75,
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    }}
                  >
                    <Typography variant="body2">Date: {row.invoiceDate}</Typography>
                    <Typography variant="body2">Meter: {row.meterNumber}</Typography>
                    <Typography variant="body2">Box: {row.boxCode}</Typography>
                    <Typography variant="body2">Region: {row.regionName}</Typography>
                    <Typography variant="body2">Area: {row.neighborhoodName}</Typography>
                    <Typography variant="body2">Total: {row.totalDue}</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      Remaining: {row.remainingBalance}
                    </Typography>
                    <Typography variant="body2">Status: {row.status}</Typography>
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View invoice">
                      <IconButton size="small" onClick={() => onView(row.id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send notification">
                      <IconButton size="small" color="warning" onClick={() => onNotify(row)}>
                        <NotificationsActiveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Neighborhood</TableCell>
                <TableCell>Box</TableCell>
                <TableCell>Meter</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Remaining</TableCell>
                <TableCell align="center">Overdue</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => {
                const overdue = getOverdueChip(row.daysOverdue);

                return (
                  <TableRow key={row.id} hover>
                    <TableCell>#{row.id}</TableCell>
                    <TableCell>{row.invoiceDate}</TableCell>
                    <TableCell>{row.subscriberName}</TableCell>
                    <TableCell>{row.phone || "-"}</TableCell>
                    <TableCell>{row.regionName}</TableCell>
                    <TableCell>{row.neighborhoodName}</TableCell>
                    <TableCell>{row.boxCode}</TableCell>
                    <TableCell>{row.meterNumber}</TableCell>
                    <TableCell align="right">{row.totalDue}</TableCell>
                    <TableCell align="right">
                      <b>{row.remainingBalance}</b>
                    </TableCell>
                    <TableCell align="center">
                      <Chip size="small" label={overdue.label} color={overdue.color} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View invoice">
                          <IconButton size="small" onClick={() => onView(row.id)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send notification">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => onNotify(row)}
                          >
                            <NotificationsActiveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
