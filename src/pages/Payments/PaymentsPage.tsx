import {
  Paper,
  Typography,
  Skeleton,
  Stack,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useAllPayments } from "../../hooks/usePayments";
import SubscriberPaymentsTable from "../Subscribers/SubscriberPaymentsTable";
import ReversePaymentDialog from "../Subscribers/ReversePaymentDialog";
import { usePayments } from "../../hooks/usePayments";
import { useTheme } from "../../context/ThemeContext";

export default function PaymentsPage() {
  const { data, isLoading } = useAllPayments();
  const { colors } = useTheme();

  const { reversePayment } = usePayments(0); // we only use reverse mutation
  const [reverseId, setReverseId] = useState<number | null>(null);

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

  return (
    <DashboardLayout>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '12px', background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`, border: `1px solid ${colors.border}33`, boxShadow: `0 8px 32px rgba(0,0,0,0.08)` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700, background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Payments
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSubtle, mt: 0.5 }}>
              View received payments and perform reversals
            </Typography>
          </div>

          <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, sm: 0 } }}>
            <TextField
              size="small"
              placeholder="Search by subscriber, invoice or reference"
              sx={{ ...fieldSx, minWidth: { xs: 160, sm: 260 } }}
              InputProps={{ startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.textSubtle }} />
                </InputAdornment>
              ) }}
            />

            <Button variant="contained" sx={{ ...buttonSx, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, color: '#fff' }}>
              Export
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {isLoading ? (
        <Paper sx={{ p: 2, mt: 2, borderRadius: '12px', background: colors.darker, border: `1px solid ${colors.border}` }}>
          <Skeleton height={50} />
          <Skeleton height={50} />
        </Paper>
      ) : (
        <SubscriberPaymentsTable
          payments={data}
          loading={false}
          onReverse={(id) => setReverseId(id)}
        />
      )}

      <ReversePaymentDialog
        open={!!reverseId}
        onClose={() => setReverseId(null)}
        onConfirm={(reason) => {
          reversePayment.mutate({
            paymentId: reverseId!,
            reason,
          });
          setReverseId(null);
        }}
      />
    </DashboardLayout>
  );
}
