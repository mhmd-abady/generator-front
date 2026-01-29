import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, MenuItem, Typography, useMediaQuery
} from "@mui/material";
import { useState } from "react";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../../context/ThemeContext";

export default function TariffFormDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const { colors } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [scope, setScope] = useState<"GLOBAL" | "REGION" | "NEIGHBORHOOD">("GLOBAL");
  const [regionId, setRegionId] = useState<number>();
  const [neighborhoodId, setNeighborhoodId] = useState<number>();
  const [kwhRate, setKwhRate] = useState(0);
  const [ampereRate, setAmpereRate] = useState(0);

  const regionsQuery = useQuery({ queryKey: ["regions"], queryFn: fetchRegions });
  const neighborhoodsQuery = useQuery({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      background: colors.darker,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      '& input, & .MuiSelect-select': { color: colors.text },
      '&.Mui-focused': { boxShadow: `0 0 0 2px ${colors.primary}22` },
    },
    '& .MuiInputLabel-root': { color: colors.labelText },
    '& .MuiSelect-icon': { color: colors.textSubtle },
  };

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

  const submit = () => {
    onSubmit({
      month,
      year,
      kwhRate,
      ampereRate,
      regionId: scope === "REGION" ? regionId : undefined,
      neighborhoodId: scope === "NEIGHBORHOOD" ? neighborhoodId : undefined,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      PaperProps={{ sx: {
        borderRadius: isMobile ? 0 : '12px',
        background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}33`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
      } }}
    >
      <DialogTitle sx={{
        background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
        color: '#fff',
        fontWeight: 700,
        textAlign: 'center',
        py: 2,
      }}>
        Create Tariff
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
          <Stack spacing={0.5} sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600 }}>Billing Month</Typography>
            <TextField
              select
              size="small"
              value={month}
              onChange={(e) => setMonth(+e.target.value)}
              sx={fieldSx}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={0.5} sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600 }}>Billing Year</Typography>
            <TextField
              size="small"
              value={year}
              onChange={(e) => setYear(+e.target.value)}
              sx={fieldSx}
            />
          </Stack>

          <Stack spacing={0.5} sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600 }}>Applicability</Typography>
            <TextField select size="small" value={scope} onChange={(e) => setScope(e.target.value as any)} sx={fieldSx}>
              <MenuItem value="GLOBAL">Global</MenuItem>
              <MenuItem value="REGION">Region</MenuItem>
              <MenuItem value="NEIGHBORHOOD">Neighborhood</MenuItem>
            </TextField>
          </Stack>

          {scope !== 'GLOBAL' && (
            <Stack spacing={0.5} sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600 }}>Service Region</Typography>
              <TextField select size="small" onChange={(e) => setRegionId(+e.target.value)} sx={fieldSx}>
                {regionsQuery.data?.map(r => (
                  <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                ))}
              </TextField>
            </Stack>
          )}

          {scope === 'NEIGHBORHOOD' && (
            <Stack spacing={0.5} sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600 }}>Neighborhood / Locality</Typography>
              <TextField select size="small" onChange={(e) => setNeighborhoodId(+e.target.value)} sx={fieldSx}>
                {neighborhoodsQuery.data?.map(n => (
                  <MenuItem key={n.id} value={n.id}>{n.name}</MenuItem>
                ))}
              </TextField>
            </Stack>
          )}

          <Stack spacing={0.5} sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600 }}>Energy Rate (kWh)</Typography>
            <TextField size="small" type="number" value={kwhRate} onChange={(e) => setKwhRate(+e.target.value)} sx={fieldSx} />
          </Stack>

          <Stack spacing={0.5} sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ color: colors.labelText, fontWeight: 600 }}>Capacity Rate (Ampere)</Typography>
            <TextField size="small" type="number" value={ampereRate} onChange={(e) => setAmpereRate(+e.target.value)} sx={fieldSx} />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ ...buttonSx, color: colors.textSubtle, borderColor: colors.border, '&:hover': { background: `${colors.textSubtle}11` } }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          sx={{ ...buttonSx, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, color: '#fff', '&:hover': { background: `linear-gradient(135deg, ${colors.primary}cc 0%, ${colors.secondary}cc 100%)` } }}
        >
          Create Tariff
        </Button>
      </DialogActions>
    </Dialog>
  );
}
