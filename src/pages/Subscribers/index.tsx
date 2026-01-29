import { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Skeleton,
  TextField,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { fetchRegions, fetchNeighborhoodsByRegion } from "../../api/locations";
import { useQuery } from "@tanstack/react-query";
import type { Region, Neighborhood } from "../../api/locations";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useSubscribers } from "../../hooks/useSubscribers";
import SubscribersTable from "./SubscribersTable";
import SubscriberFormDialog from "./SubscriberFormDialog";
import type { Subscriber } from "../../api/subscribers";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

export default function SubscribersPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Subscriber | null>(null);
  const [regionId, setRegionId] = useState<number | undefined>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | undefined>();

  const regionsQuery = useQuery<Region[]>({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const neighborhoodsQuery = useQuery<Neighborhood[]>({
    queryKey: ["neighborhoods", regionId],
    queryFn: () => fetchNeighborhoodsByRegion(regionId!),
    enabled: !!regionId,
  });
  const subscribers = useSubscribers(neighborhoodId);
  const [search, setSearch] = useState("");
  const filteredSubscribers =
    subscribers.subscribers?.filter((s) => {
      if (!search.trim()) return true;

      const q = search.toLowerCase();

      return s.fullName.toLowerCase().includes(q) || s.phone.includes(q);
    }) ?? [];

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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                mb: 0.5,
              }}
            >
              Subscribers
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.textSubtle,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              }}
            >
              Manage your customer accounts and billing information
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            sx={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
              color: colors.darker,
              fontWeight: 700,
              padding: { xs: "8px 16px", sm: "10px 24px" },
              borderRadius: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 24px ${colors.accent}44`,
              },
              whiteSpace: "nowrap",
            }}
          >
            {!isMobile && "Add Subscriber"}
            {isMobile && "Add"}
          </Button>
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
          direction={{ xs: "column", sm: "column", md: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
        >
          <TextField
            select
            size="small"
            label="Region"
            value={regionId ?? "all"}
            onChange={(e) => {
              const value = e.target.value;
              setRegionId(value === "all" ? undefined : Number(value));
              setNeighborhoodId(undefined);
            }}
            sx={{
              flex: { xs: 1, sm: 1, md: 0.25 },
              minWidth: { xs: "100%", sm: "100%", md: "180px" },
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
              "& .MuiInputBase-input": {
                color: colors.text,
              },
              "& .MuiInputLabel-root": {
                color: colors.textSubtle,
              },
            }}
          >
            <MenuItem value="all">All Regions</MenuItem>
            {regionsQuery.data?.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Neighborhood"
            disabled={!regionId}
            value={neighborhoodId ?? "all"}
            onChange={(e) => {
              const value = e.target.value;
              setNeighborhoodId(value === "all" ? undefined : Number(value));
            }}
            sx={{
              flex: { xs: 1, sm: 1, md: 0.25 },
              minWidth: { xs: "100%", sm: "100%", md: "200px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: colors.text,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accent,
                },
                "& fieldset": {
                  borderColor: colors.border,
                },
                "&.Mui-disabled": {
                  "& fieldset": {
                    borderColor: colors.border,
                  },
                },
              },
              "& .MuiInputBase-input": {
                color: colors.text,
              },
              "& .MuiInputLabel-root": {
                color: colors.textSubtle,
              },
            }}
          >
            <MenuItem value="all">All Neighborhoods</MenuItem>
            {neighborhoodsQuery.data?.map((n) => (
              <MenuItem key={n.id} value={n.id}>
                {n.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Search"
            placeholder="Name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: colors.textSubtle }} />,
            }}
            sx={{
              flex: { xs: 1, sm: 1, md: 0.5 },
              minWidth: { xs: "100%", sm: "100%", md: "260px" },
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
              "& .MuiInputBase-input": {
                color: colors.text,
              },
              "& .MuiInputLabel-root": {
                color: colors.textSubtle,
              },
            }}
          />
        </Stack>
      </Paper>

      {/* Table Section */}
      {subscribers.isLoading ? (
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
      ) : (
        <SubscribersTable
          rows={filteredSubscribers}
          onDelete={(id) => subscribers.deleteSubscriber.mutate(id)}
          onEdit={(row) => {
            setEditing(row);
            setOpen(true);
          }}
          onViewDetails={(row) => navigate(`/subscribers/${row.id}`)}
          onViewStatement={(row) => navigate(`/subscribers/${row.id}/statement`)}
        />
      )}

      {/* Dialog */}
      <SubscriberFormDialog
        open={open}
        mode={editing ? "edit" : "create"}
        initialData={editing}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          if (editing) {
            subscribers.updateSubscriber.mutate({
              id: editing.id,
              dto: data,
            });
          } else {
            subscribers.createSubscriber.mutate(data);
          }
          setOpen(false);
        }}
      />
    </DashboardLayout>
  );
}
