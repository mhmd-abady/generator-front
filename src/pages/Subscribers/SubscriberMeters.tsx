import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Button,
} from "@mui/material";

export default function SubscriberMeters({
  meters,
  loading,
  onReassign,
}: {
  meters?: any[];
  loading: boolean;
  onReassign: (meterId: number) => void;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Meters
      </Typography>

      {loading ? (
        <Skeleton height={160} />
      ) : !meters || meters.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No meters assigned
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Meter Number</TableCell>
              <TableCell>Box</TableCell>
              <TableCell>Neighborhood</TableCell>
                <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meters.map((m) => (
             <TableRow key={m.id}>
  <TableCell>{m.number}</TableCell>
  <TableCell>{m.box?.code}</TableCell>
  <TableCell>{m.box?.neighborhood?.name}</TableCell>
  <TableCell align="right">
    <Button size="small" onClick={() => onReassign(m.id)}>
      Reassign
    </Button>
  </TableCell>
</TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
