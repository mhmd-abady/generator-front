import { Paper, Stack, Typography, Button, Skeleton } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useTariffs } from "../../hooks/useTarrifs";
import TariffsTable from "./TarrifsTable";
import TariffFormDialog from "./TarrifFromDialog";
import { useTheme } from "../../context/ThemeContext";

export default function TariffsPage() {
  const { tariffs, isLoading, createTariff, deleteTariff } = useTariffs();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const buttonSx = {
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none',
    px: 3,
    py: 1.25,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${colors.primary}33`,
    },
  };

  return (
    <DashboardLayout>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '12px', background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`, border: `1px solid ${colors.border}33`, boxShadow: `0 8px 32px rgba(0,0,0,0.08)` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700, background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tariffs Management
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSubtle, mt: 0.5 }}>
              Manage tariff rates and applicability for billing periods
            </Typography>
          </div>

          <Button variant="contained" onClick={() => setOpen(true)} sx={{ ...buttonSx, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, color: '#fff' }}>
            Add Tariff
          </Button>
        </Stack>
      </Paper>

      {isLoading ? (
        <Paper sx={{ p: 2, mt: 2, borderRadius: '12px', background: colors.darker, border: `1px solid ${colors.border}` }}>
          <Skeleton height={50} />
          <Skeleton height={50} />
        </Paper>
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
