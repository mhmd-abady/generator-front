import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { useBoxMeters } from "../../hooks/useBoxMeters";

type Props = {
  box: { id: number; code: string };
  open: boolean;
  onClose: () => void;
};

export default function BoxMetersDialog({ box, open, onClose }: Props) {
  const { data, isLoading } = useBoxMeters(box.id);


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Meters — Box {box.code}</DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Typography>Loading…</Typography>
        ) : !data || data.length === 0 ? (
          <Typography color="text.secondary">
            No meters in this box
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Meter</TableCell>
                <TableCell>Subscriber</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell>{m.number}</TableCell>
                  <TableCell>{m.subscriber?.fullName || "—"}</TableCell>
                  <TableCell>{m.subscriber?.phone || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
