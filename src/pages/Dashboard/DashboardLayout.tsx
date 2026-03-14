import {
  Container,
  Stack,
  Box,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { Menu } from "@mui/icons-material";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [sidebarOpen, setSidebarOpen] = useState(isLargeScreen);

  useEffect(() => {
    setSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
        {(!sidebarOpen || !isLargeScreen) && (
          <Tooltip title="Open sidebar">
            <IconButton
              size="small"
              onClick={() => setSidebarOpen(true)}
              sx={{ position: "fixed", top: 12, left: 12, zIndex: 1201 }}
              aria-label="Open sidebar"
            >
              <Menu fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            pt: { xs: 7, sm: 8, lg: 3 },
          }}
        >
          <Stack spacing={{ xs: 2, sm: 3 }}>{children}</Stack>
        </Container>
      </Box>
    </Box>
  );
}
