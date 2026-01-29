import {
  Box,
  IconButton,
  Tooltip,
  Stack,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Meter } from "../../api/meters";
import DataTable from "../../components/DataTable";
import { useTheme } from "../../context/ThemeContext";

export default function MetersTable({
  rows,
  onEdit,
  onDelete,
}: {
  rows: Meter[];
  onEdit?: (meter: Meter) => void;
  onDelete?: (meterId: number) => void;
}) {
  const { colors } = useTheme();

  const columns = [
    {
      id: "number",
      label: "Meter Number",
      align: "left" as const,
      width: "15%",
      hiddenOnMobile: false,
      render: (row: Meter) => (
        <Box sx={{ fontWeight: 700, color: colors.accent, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
          #{row.number}
        </Box>
      ),
    },
    {
      id: "subscriber",
      label: "Subscriber",
      align: "left" as const,
      width: "25%",
      hiddenOnMobile: false,
      render: (row: Meter) => (
        <Box sx={{ color: colors.text }}>
          <Box sx={{ fontWeight: 600, color: colors.primary }}>
            {row.subscriber?.fullName ?? "—"}
          </Box>
          {row.subscriber?.phone && (
            <Box sx={{ fontSize: "0.85rem", color: colors.textSubtle, mt: 0.5 }}>
              {row.subscriber.phone}
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: "box",
      label: "Box",
      align: "center" as const,
      width: "15%",
      hiddenOnMobile: true,
      render: (row: Meter) => (
        <Chip
          label={row.box?.code ?? "—"}
          size="small"
          sx={{
            background: row.box ? `${colors.secondary}22` : `${colors.textSubtle}22`,
            color: row.box ? colors.secondary : colors.textSubtle,
            fontWeight: 600,
            minWidth: "60px",
          }}
        />
      ),
    },
    {
      id: "ampere",
      label: "Ampere",
      align: "center" as const,
      width: "12%",
      hiddenOnMobile: true,
      render: (row: Meter) => (
        <Box
          sx={{
            fontWeight: 600,
            color: row.ampere ? colors.accent : colors.textSubtle,
            background: row.ampere ? `${colors.accent}22` : "transparent",
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
            display: "inline-block",
            minWidth: "50px",
            textAlign: "center",
          }}
        >
          {row.ampere ?? "—"}
        </Box>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right" as const,
      width: "15%",
      hiddenOnMobile: false,
      render: (row: Meter) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          {onEdit && (
            <Tooltip title="Edit meter">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(row)}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: `${colors.primary}22`,
                    transform: "scale(1.1)",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete meter">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(row.id)}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: `${colors.error}22`,
                    transform: "scale(1.1)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <DataTable<Meter>
      columns={columns}
      rows={rows}
      title="Meters Management"
      density="normal"
      striped
      hoverable
      emptyMessage="No meters found"
      sx={{ '& .MuiTableCell-root': { color: colors.text }, '& .MuiTableHead-root .MuiTableCell-root': { color: colors.labelText } }}
    />
  );
}
