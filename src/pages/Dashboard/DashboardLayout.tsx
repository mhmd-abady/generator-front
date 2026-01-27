import { Container, Stack, Box } from "@mui/material";
import type{ ReactNode } from "react";
import Sidebar from "../Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
   <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={3}>{children}</Stack>
      </Container>
    </Box>
  );
}
