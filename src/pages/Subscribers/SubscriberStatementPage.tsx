import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Skeleton,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useSubscriberStatement } from "../../hooks/useSubscriberStatement";
import SubscriberStatementTable from "./SubscriberStatementTable";
import { getSubscriberStatementPdfUrl } from "../../api/statements";
import { useTheme } from "../../context/ThemeContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GetAppIcon from "@mui/icons-material/GetApp";

export default function SubscriberStatementPage() {
  const { id } = useParams();
  const subscriberId = Number(id);
  const { colors } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();

  const { data, isLoading } = useSubscriberStatement(subscriberId, {
    from,
    to,
  });

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
          mb: 3,
        }}
      >
        <Stack spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            to={`/subscribers/${subscriberId}`}
            sx={{
              color: colors.textSubtle,
              justifyContent: "flex-start",
              p: 0,
              mb: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                color: colors.accent,
              },
            }}
          >
            Back to Subscriber
          </Button>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            Statement — {data?.subscriber.fullName}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.textSubtle,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
            }}
          >
            📞 {data?.subscriber.phone}
          </Typography>
        </Stack>
      </Paper>

      {/* Filters Section */}
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <TextField
            type="date"
            size="small"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={from ?? ""}
            onChange={(e) => setFrom(e.target.value || undefined)}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", sm: "150px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: colors.text,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
                "& fieldset": {
                  borderColor: colors.border,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.textSubtle,
              },
              "& .MuiInputBase-input": {
                color: colors.text,
              },
            }}
          />

          <TextField
            type="date"
            size="small"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            value={to ?? ""}
            onChange={(e) => setTo(e.target.value || undefined)}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", sm: "150px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: colors.text,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
                "& fieldset": {
                  borderColor: colors.border,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.textSubtle,
              },
              "& .MuiInputBase-input": {
                color: colors.text,
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            href={getSubscriberStatementPdfUrl(subscriberId)}
            target="_blank"
            sx={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
              color: colors.darker,
              fontWeight: 700,
              borderRadius: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 24px ${colors.accent}44`,
              },
              minWidth: { xs: "100%", sm: "auto" },
            }}
          >
            {!isMobile && "Download PDF"}
            {isMobile && "PDF"}
          </Button>
        </Stack>
      </Paper>

      {/* Statement Table Section */}
      {isLoading ? (
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Skeleton height={60} sx={{ mb: 2 }} />
          <Skeleton height={40} sx={{ mb: 1 }} />
          <Skeleton height={40} sx={{ mb: 1 }} />
          <Skeleton height={40} />
        </Paper>
      ) : data ? (
        <SubscriberStatementTable
          openingBalanceUsd={data.openingBalanceUsd}
          rows={data.statement}
          finalUsd={data.finalBalanceUsd}
          finalLbp={data.finalBalanceLbp}
        />
      ) : (
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${colors.border}33`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.textSubtle,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            No statement data available for the selected period.
          </Typography>
        </Paper>
      )}
    </DashboardLayout>
  );
}
