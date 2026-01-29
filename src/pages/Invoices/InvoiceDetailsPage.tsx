import {
  Paper,
  Typography,
  Stack,
  Divider,
  Skeleton,
  Button,
  Box,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useInvoice } from "../../hooks/useInvoices";
import { getInvoicePdfUrl } from "../../api/invoices";
import { useQueryClient } from "@tanstack/react-query";
import PayInvoiceDialog from "./PayInvoiceDialog";
import  InvoiceFixesDialog  from "./InvoiceFixesDialog.tsx";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";




const InvoiceDetailsPage = () => {
  const { colors } = useTheme();
  const { id } = useParams();
  const invoiceId = Number(id);

  const { data, isLoading } = useInvoice(invoiceId);
  const qc = useQueryClient();
  const [payOpen, setPayOpen] = useState(false);
  const [fixesOpen, setFixesOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return { bg: colors.secondary, text: '#fff' };
      case 'partially_paid':
        return { bg: colors.accent, text: colors.dark };
      case 'issued':
        return { bg: colors.primary, text: '#fff' };
      case 'cancelled':
        return { bg: colors.error, text: '#fff' };
      default:
        return { bg: colors.textSubtle, text: colors.text };
    }
  };

  const buttonSx = {
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none',
    px: 3,
    py: 1.5,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${colors.primary}33`,
    },
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
        }}
      >
        {isLoading ? (
          <Skeleton height={80} />
        ) : (
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                Invoice #{data!.id}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colors.textSubtle,
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                {data!.month}/{data!.year}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'center', sm: 'flex-start' }}
            >
              <Box>
                <Typography variant="body1" sx={{ color: colors.text, fontWeight: 600 }}>
                  Subscriber: {data!.meter.subscriber.fullName}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSubtle }}>
                  Meter: #{data!.meter.number}
                </Typography>
              </Box>

              <Button
                component={Link}
                to={`/subscribers/${data!.meter.subscriber.id}`}
                size="small"
                variant="outlined"
                sx={{
                  ...buttonSx,
                  color: colors.accent,
                  borderColor: colors.border,
                  '&:hover': {
                    ...buttonSx['&:hover'],
                    background: `${colors.accent}11`,
                  },
                }}
              >
                ← Back to Subscriber
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>

      {/* Details */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
        }}
      >
        {isLoading ? (
          <Skeleton height={120} />
        ) : (
          <Stack spacing={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: colors.accent,
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              Invoice Details
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{
                '& > div': {
                  flex: 1,
                  p: 2,
                  borderRadius: '8px',
                  background: `${colors.darker}33`,
                  border: `1px solid ${colors.border}22`,
                },
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: colors.textSubtle, mb: 1 }}>
                  Total Due
                </Typography>
                <Typography variant="h6" sx={{ color: colors.secondary, fontWeight: 700 }}>
                  ${data!.totalDue?.toFixed(2) ?? "0.00"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: colors.textSubtle, mb: 1 }}>
                  Paid
                </Typography>
                <Typography variant="h6" sx={{ color: colors.secondary, fontWeight: 700 }}>
                  ${data!.amountPaid?.toFixed(2) ?? "0.00"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: colors.textSubtle, mb: 1 }}>
                  Remaining
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: data!.remainingBalance > 0 ? colors.error : colors.secondary,
                    fontWeight: 700,
                  }}
                >
                  ${data!.remainingBalance?.toFixed(2) ?? "0.00"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: colors.textSubtle, mb: 1 }}>
                  Status
                </Typography>
                <Chip
                  label={data!.status}
                  size="small"
                  sx={{
                    background: getStatusColor(data!.status).bg,
                    color: getStatusColor(data!.status).text,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                />
              </Box>
            </Stack>

            <Divider sx={{ borderColor: colors.border }} />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
            >
              <Button
                variant="contained"
                onClick={() => setPayOpen(true)}
                disabled={!data || data.remainingBalance <= 0 || data.status === "CANCELLED"}
                sx={{
                  ...buttonSx,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  color: '#fff',
                  '&:hover': {
                    ...buttonSx['&:hover'],
                    background: `linear-gradient(135deg, ${colors.primary}cc 0%, ${colors.secondary}cc 100%)`,
                  },
                  '&:disabled': {
                    background: colors.textSubtle,
                    color: colors.text,
                  },
                }}
              >
                Pay Invoice
              </Button>

              <Button
                variant="outlined"
                onClick={() => setFixesOpen(true)}
                disabled={
                  data?.status === "PAID" ||
                  data?.status === "CANCELLED"
                }
                sx={{
                  ...buttonSx,
                  color: colors.accent,
                  borderColor: colors.accent,
                  '&:hover': {
                    ...buttonSx['&:hover'],
                    background: `${colors.accent}11`,
                    borderColor: colors.accent,
                  },
                }}
              >
                Add Fixes
              </Button>

              <Button
                variant="outlined"
                href={getInvoicePdfUrl(invoiceId)}
                target="_blank"
                sx={{
                  ...buttonSx,
                  color: colors.accent,
                  borderColor: colors.border,
                  '&:hover': {
                    ...buttonSx['&:hover'],
                    background: `${colors.accent}11`,
                  },
                }}
              >
                Download PDF
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>

      {data && (
        <PayInvoiceDialog
          open={payOpen}
          onClose={() => setPayOpen(false)}
          invoiceId={data.id}
          subscriberId={data.meter.subscriber.id}
          remainingBalance={data.remainingBalance}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
            qc.invalidateQueries({ queryKey: ["invoices"], exact: false });
            qc.invalidateQueries({ queryKey: ["payments"] });
            qc.invalidateQueries({ queryKey: ["subscriber-statement"] });
          }}
        />
      )}

      {data && (
        <InvoiceFixesDialog
          open={fixesOpen}
          onClose={() => setFixesOpen(false)}
          invoiceId={data.id}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["invoice", data.id] });
            qc.invalidateQueries({ queryKey: ["invoices"], exact: false });
            qc.invalidateQueries({ queryKey: ["subscriber-statement"] });
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default InvoiceDetailsPage;
