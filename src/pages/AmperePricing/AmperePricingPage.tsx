import {
  Box,
  Button,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import type { AmperePricing } from "../../api/ampere-pricing";
import { useAmperePricing } from "../../hooks/useAmperePricing";
import AmperePricingTable from "./AmperePricingTable";
import AmperePricingFormDialog from "./AmperePricingFormDialog";

export function AmperePricingContent() {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeOnly, setActiveOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AmperePricing | null>(null);

  const {
    rows,
    isLoading,
    createAmperePricing,
    updateAmperePricing,
    deleteAmperePricing,
  } = useAmperePricing(activeOnly);

  const filteredRows = (rows ?? []).filter((row) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return String(row.id).includes(q) || String(row.ampere).includes(q);
  });

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Delete this ampere pricing?");
    if (!confirmed) return;
    deleteAmperePricing.mutate(id);
  };

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Typography variant="h6" fontWeight={600}>
            Ampere Pricing
          </Typography>

          {isPhone ? (
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 1,
              }}
            >
              <TextField
                select
                size="small"
                label="View"
                value={activeOnly ? "active" : "all"}
                onChange={(e) => setActiveOnly(e.target.value === "active")}
                sx={{ width: "100%" }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
              </TextField>

              <TextField
                size="small"
                label="Search"
                placeholder="ID or ampere"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: "100%" }}
              />

              <Button
                variant="contained"
                sx={{ gridColumn: "span 2" }}
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
              >
                Add Pricing
              </Button>
            </Box>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <TextField
                select
                size="small"
                label="View"
                value={activeOnly ? "active" : "all"}
                onChange={(e) => setActiveOnly(e.target.value === "active")}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
              </TextField>

              <TextField
                size="small"
                label="Search"
                placeholder="ID or ampere"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 180 }}
              />

              <Button
                variant="contained"
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
              >
                Add Pricing
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      {isLoading ? (
        <Skeleton height={300} />
      ) : (
        <AmperePricingTable
          rows={filteredRows}
          onEdit={(row) => {
            setEditing(row);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <AmperePricingFormDialog
        open={open}
        editing={editing}
        loading={createAmperePricing.isPending || updateAmperePricing.isPending}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={(payload) => {
          if (editing) {
            updateAmperePricing.mutate(
              { id: editing.id, data: payload },
              {
                onSuccess: () => {
                  setOpen(false);
                  setEditing(null);
                },
              }
            );
            return;
          }

          createAmperePricing.mutate(payload, {
            onSuccess: () => {
              setOpen(false);
            },
          });
        }}
      />
    </>
  );
}

export default function AmperePricingPage() {
  return (
    <DashboardLayout>
      <AmperePricingContent />
    </DashboardLayout>
  );
}

