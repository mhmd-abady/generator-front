import {
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import DataTable from "../../components/DataTable";
import { useTheme } from "../../context/ThemeContext";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

type SubscriberMeter = {
  id: number;
  number: string;
  boxId: number;
  box?: {
    id: number;
    code: string;
    neighborhoodId: number;
  };
};

export default function SubscriberMeters({
  meters,
  loading,
  onReassign,
}: {
  meters?: SubscriberMeter[];
  loading: boolean;
  onReassign: (meterId: number) => void;
}) {
  const { colors } = useTheme();

  const columns = [
    {
      id: "number",
      label: "Meter Number",
      align: "left" as const,
      width: "25%",
      render: (row: any) => (
        <Box sx={{ fontWeight: 600, color: colors.accent }}>
          {row.number}
        </Box>
      ),
    },
    {
      id: "box",
      label: "Box Code",
      align: "left" as const,
      width: "25%",
      hiddenOnMobile: true,
      render: (row: any) => (
        <Box sx={{ color: colors.text }}>
          {row.box?.code ?? "—"}
        </Box>
      ),
    },
    {
      id: "neighborhood",
      label: "Neighborhood",
      align: "left" as const,
      width: "35%",
      hiddenOnMobile: true,
      render: (row: any) => (
        <Box sx={{ color: colors.text }}>
          {row.box?.neighborhood?.name ?? "—"}
        </Box>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right" as const,
      width: "15%",
      render: (row: any) => (
        <Tooltip title="Reassign meter to another subscriber">
          <Button
            size="small"
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            onClick={() => onReassign(row.id)}
            sx={{
              color: colors.secondary,
              borderColor: colors.secondary,
              borderRadius: "6px",
              transition: "all 0.2s ease",
              "&:hover": {
                background: `${colors.secondary}22`,
                borderColor: colors.accent,
                color: colors.accent,
              },
            }}
          >
            {true && "Reassign"}
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <DataTable<SubscriberMeter>
      columns={columns}
      rows={meters ?? []}
      loading={loading}
      title="Assigned Meters"
      density="normal"
      striped
      hoverable
      emptyMessage="No meters assigned to this subscriber"
    />
  );
}
