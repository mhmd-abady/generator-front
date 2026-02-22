import { Container, Stack, Box, IconButton, Tooltip } from "@mui/material";
import type{ ReactNode } from "react";
import { useState } from "react";
import Sidebar from "../Sidebar";
import { Menu } from "@mui/icons-material";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
   <Box sx={{ display: "flex" }}>
      {sidebarOpen && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <Box sx={{ position: "relative", flex: 1 }}>
        {!sidebarOpen && (
          <Tooltip title="Open sidebar">
            <IconButton
              size="small"
              onClick={() => setSidebarOpen(true)}
              sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
              aria-label="Open sidebar"
            >
              <Menu fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={3}>{children}</Stack>
      </Container>
      </Box>
    </Box>
  );
}
