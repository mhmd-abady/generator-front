import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { useBoxMeters } from "../../hooks/useBoxMeters";
import MetersTable from "../Meters/MetersTable";

type Props = {
  box: { id: number; code: string };
  open: boolean;
  onClose: () => void;
};

export default function BoxMetersDialog({ box, open, onClose }: Props) {
  const { data, isLoading } = useBoxMeters(box.id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Meters - Box {box.code}</DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Typography>Loading…</Typography>
        ) : !data || data.length === 0 ? (
          <Typography color="text.secondary">No meters in this box</Typography>
        ) : (
          <MetersTable rows={data} />
        )}
      </DialogContent>
    </Dialog>
  );
}
