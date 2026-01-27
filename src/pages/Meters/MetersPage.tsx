import {
  Paper,
  Stack,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useMeters } from "../../hooks/useMeters";
import MetersTable from "./MetersTable";
import MeterFormDialog from "./MeterFormDialog";

export default function MetersPage() {
  const { meters, isLoading } = useMeters();
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Meters
          </Typography>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Meter
          </Button>
        </Stack>
      </Paper>

      {isLoading ? (
        <Skeleton height={300} />
      ) : (
        <MetersTable rows={meters ?? []} />
      )}

      <MeterFormDialog open={open} onClose={() => setOpen(false)} />
    </DashboardLayout>
  );
}
