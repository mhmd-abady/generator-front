import {
  Paper,
  Stack,
  Typography,
  Button,
  Skeleton,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useMeters } from "../../hooks/useMeters";
import MetersTable from "./MetersTable";
import MeterFormDialog from "./MeterFormDialog";
import { useTheme } from "../../context/ThemeContext";
import AddIcon from "@mui/icons-material/Add";

export default function MetersPage() {
  const { meters, isLoading } = useMeters();
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <DashboardLayout>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header Section */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            background: `linear-gradient(135deg, ${colors.primary}11 0%, ${colors.secondary}11 100%)`,
            border: `1px solid ${colors.border}`,
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: `0 8px 32px ${colors.primary}22`,
              transform: "translateY(-2px)",
            },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={{ xs: 2, sm: 0 }}
          >
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={700}
                sx={{
                  background: `linear-gradient(90deg, ${colors.accent} 90%, ${colors.primary} 100%, ${colors.secondary} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textFillColor: "transparent",
                  mb: 1,
                  letterSpacing: 1,
                  lineHeight: 1.2,
                  display: "inline-block",
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
                }}
              >
                Meters Management
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                }}
              >
                Manage and monitor all electrical meters in the system
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
                color: "white",
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 1.75 },
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textTransform: "none",
                boxShadow: `0 4px 16px ${colors.accent}44`,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${colors.accent}dd 0%, ${colors.primary}dd 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${colors.accent}66`,
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                minWidth: { xs: "100%", sm: "auto" },
              }}
            >
              Add New Meter
            </Button>
          </Stack>
        </Paper>

        {/* Content Section */}
        {isLoading ? (
          <Stack spacing={2}>
            <Skeleton
              variant="rectangular"
              height={60}
              sx={{
                borderRadius: "12px",
                background: `linear-gradient(90deg, ${colors.darker} 25%, ${colors.border} 50%, ${colors.darker} 75%)`,
                backgroundSize: "200% 100%",
                animation: "loading 1.5s infinite",
                "@keyframes loading": {
                  "0%": { backgroundPosition: "200% 0" },
                  "100%": { backgroundPosition: "-200% 0" },
                },
              }}
            />
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{
                borderRadius: "16px",
                background: `linear-gradient(90deg, ${colors.darker} 25%, ${colors.border} 50%, ${colors.darker} 75%)`,
                backgroundSize: "200% 100%",
                animation: "loading 1.5s infinite",
              }}
            />
          </Stack>
        ) : (
          <Paper
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              background: colors.darker,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 4px 24px ${colors.primary}11`,
            }}
          >
            <MetersTable
              rows={meters ?? []}
              onEdit={(meter) => {
                // TODO: Implement edit functionality
                console.log("Edit meter:", meter);
              }}
              onDelete={(meterId) => {
                // TODO: Implement delete functionality
                console.log("Delete meter:", meterId);
              }}
            />
          </Paper>
        )}

        <MeterFormDialog open={open} onClose={() => setOpen(false)} />
      </Box>
    </DashboardLayout>
  );
}
