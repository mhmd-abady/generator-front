import { Paper, Stack, Typography, Button, Skeleton } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useTariffs } from "../../hooks/useTarrifs";
import TariffsTable from "./TarrifsTable";
import TariffFormDialog from "./TarrifFromDialog";

export default function TariffsPage() {
  const { tariffs, isLoading, createTariff, deleteTariff } = useTariffs();
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Tariffs
          </Typography>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Tariff
          </Button>
        </Stack>
      </Paper>

      {isLoading ? (
        <Skeleton height={300} />
      ) : (
        <TariffsTable
          rows={tariffs ?? []}
          onDelete={(id) => deleteTariff.mutate(id)}
        />
      )}

      <TariffFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => createTariff.mutate(data)}
      />
    </DashboardLayout>
  );
}
