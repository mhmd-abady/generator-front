import {
  Box,
  Stack,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import type { ReactNode } from "react";
import Sidebar from "../Sidebar";
import { useTheme } from "../../context/ThemeContext";

const drawerWidth = 280;
const mobileHeaderHeight = 64;

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { colors, getResponsiveSpacing, getShadow, getBorderRadius } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(muiTheme.breakpoints.up("lg"));

  const spacing = getResponsiveSpacing(3);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 25%, ${colors.dark} 50%, ${colors.primary} 75%, ${colors.secondary} 100%)`,
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Mobile Header with Menu */}
      {isMobile && <Sidebar />}

      {/* Main Content Container */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          width: "100%",
          minHeight: isMobile ? `calc(100vh - ${mobileHeaderHeight}px)` : "100vh",
        }}
      >
        {/* Desktop/Tablet Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: isLargeScreen ? drawerWidth : drawerWidth * 0.9,
              flexShrink: 0,
              overflow: "hidden",
              position: "relative",
              zIndex: 1000,
            }}
          >
            <Sidebar />
          </Box>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            width: isMobile ? "100%" : `calc(100vw - ${isLargeScreen ? drawerWidth : drawerWidth * 0.9}px)`,
            background: `radial-gradient(ellipse at center, ${colors.primary}15 0%, transparent 70%), linear-gradient(180deg, ${colors.secondary}08 0%, ${colors.dark}05 100%)`,
            position: "relative",
          }}
        >
          <Stack
            spacing={spacing}
            sx={{
              p: {
                xs: spacing.xs,
                sm: spacing.sm,
                md: spacing.md,
                lg: spacing.lg,
                xl: spacing.xl,
              },
              flex: 1,
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              position: "relative",
              "& > *": {
                borderRadius: getBorderRadius('medium'),
                boxShadow: getShadow('light'),
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: getShadow('medium'),
                  transform: "translateY(-2px)",
                },
              },
            }}
          >
            {children}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
