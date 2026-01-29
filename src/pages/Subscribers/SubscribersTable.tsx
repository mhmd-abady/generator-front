import {
  IconButton,
  Box,
  Tooltip,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import type { Subscriber } from "../../api/subscribers";
import DataTable from "../../components/DataTable";
import { useTheme } from "../../context/ThemeContext";

export default function SubscribersTable({
  rows,
  onDelete,
  onEdit,
  onViewDetails,
  onViewStatement,
}: {
  rows: Subscriber[];
  onDelete: (id: number) => void;
  onEdit: (row: Subscriber) => void;
  onViewDetails: (row: Subscriber) => void;
  onViewStatement: (row: Subscriber) => void;
}) {
  const { colors } = useTheme();

  const columns = [
    {
      id: "name",
      label: "Name",
      align: "left" as const,
      width: "25%",
      hiddenOnMobile: false,
      render: (row: Subscriber) => (
        <Box
          onClick={() => onViewDetails(row)}
          sx={{
            cursor: "pointer",
            color: colors.accent,
            fontWeight: 600,
            transition: "all 0.2s ease",
            "&:hover": {
              textDecoration: "underline",
              color: colors.secondary,
              textShadow: `0 0 8px ${colors.accent}44`,
            },
          }}
        >
          {row.fullName}
        </Box>
      ),
    },
    {
      id: "phone",
      label: "Phone",
      align: "left" as const,
      width: "20%",
      hiddenOnMobile: true,
      render: (row: Subscriber) => row.phone,
    },
    {
      id: "address",
      label: "Address",
      align: "left" as const,
      width: "30%",
      hiddenOnMobile: true,
      render: (row: Subscriber) => row.address ?? "—",
    },
    {
      id: "meters",
      label: "Meters",
      align: "center" as const,
      width: "12%",
      render: (row: Subscriber) => (
        <Box
          sx={{
            display: "inline-block",
            px: 2,
            py: 0.5,
            borderRadius: "8px",
            background: `linear-gradient(135deg, ${colors.primary}33 0%, ${colors.secondary}33 100%)`,
            border: `1px solid ${colors.accent}44`,
            fontWeight: 600,
            color: colors.accent,
            fontSize: "0.875rem",
          }}
        >
          {row.meters?.length ?? 0}
        </Box>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right" as const,
      width: "13%",
      render: (row: Subscriber) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="View Statement">
            <IconButton
              size="small"
              onClick={() => onViewStatement(row)}
              sx={{
                color: colors.accent,
                transition: "all 0.2s ease",
                "&:hover": {
                  background: `${colors.accent}22`,
                  transform: "scale(1.1)",
                },
              }}
            >
              <DescriptionIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(row)}
              sx={{
                color: colors.secondary,
                transition: "all 0.2s ease",
                "&:hover": {
                  background: `${colors.secondary}22`,
                  transform: "scale(1.1)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete(row.id)}
              sx={{
                color: colors.error,
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
        </Stack>
      ),
    },
  ];

  return (
    <DataTable<Subscriber>
      columns={columns}
      rows={rows}
      title="Subscribers"
      density="normal"
      striped
      hoverable
      emptyMessage="No subscribers found"
    />
  );
}
