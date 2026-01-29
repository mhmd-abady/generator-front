import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Chip,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import type { DashboardContext } from "./Index";
import type { PeriodStatus } from "../../api/dashboard";
import {
  fetchRegions,
  fetchNeighborhoodsByRegion,
} from "../../api/locations";
import type {Region, Neighborhood} from '../../api/locations';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from "../../context/ThemeContext";

type Props = {
  context: DashboardContext;
  onChange: (ctx: DashboardContext) => void;
  periodStatus?: PeriodStatus;
  loading: boolean;
};

export default function DashboardHeader({
  context,
  onChange,
  periodStatus,
  loading,
}: Props) {
  const { colors, getShadow, getBorderRadius, getResponsiveSpacing, getResponsiveFontSize } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const spacing = getResponsiveSpacing(2);
  const fontSize = getResponsiveFontSize("1.3rem");

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

const regionsQuery = useQuery<Region[]>({
  queryKey: ["regions"],
  queryFn: fetchRegions,
});

const neighborhoodsQuery = useQuery<Neighborhood[]>({
  queryKey: ["neighborhoods", context.regionId],
  queryFn: () => fetchNeighborhoodsByRegion(context.regionId!),
  enabled: !!context.regionId,
});

  return (
    <Paper
      sx={{
        p: {
          xs: spacing.xs,
          sm: spacing.sm,
          md: spacing.md,
          lg: spacing.lg,
        },
        background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
        border: `1px solid ${colors.accent}30`,
        borderRadius: getBorderRadius('large'),
        boxShadow: getShadow('medium'),
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${colors.accent}05 0%, transparent 100%)`,
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover": {
          boxShadow: getShadow('strong'),
          borderColor: colors.accent,
          "&::before": {
            opacity: 1,
          },
        },
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="space-between"
        spacing={isMobile ? spacing.xs : spacing.sm}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: colors.accent,
            fontSize: fontSize,
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 2px 4px ${colors.primary}40`,
          }}
        >
          Dashboard
        </Typography>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 1 : 2}
          alignItems={isMobile ? "stretch" : "center"}
          sx={{ width: isMobile ? "100%" : "auto" }}
        >
          <TextField
            select
            size="small"
            label="Month"
            value={context.month}
            onChange={(e) =>
              onChange({ ...context, month: Number(e.target.value) })
            }
            disabled={loading}
            sx={{
              minWidth: isMobile ? "100%" : 120,
              "& .MuiOutlinedInput-root": {
                color: colors.text,
                "& fieldset": {
                  borderColor: colors.border,
                },
                "&:hover fieldset": {
                  borderColor: colors.accentLight,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.accentLight,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.labelText,
              },
            }}
          >
            {months.map((m, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Year"
            type="number"
            value={context.year}
            onChange={(e) =>
              onChange({ ...context, year: Number(e.target.value) })
            }
            sx={{
              minWidth: isMobile ? "100%" : 100,
              "& .MuiOutlinedInput-root": {
                color: colors.text,
                "& fieldset": {
                  borderColor: colors.border,
                },
                "&:hover fieldset": {
                  borderColor: colors.accentLight,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.accentLight,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.labelText,
              },
            }}
            disabled={loading}
          />

          <TextField
            size="small"
            label="Region"
            select
            value={context.regionId ?? "all"}
            onChange={(e) =>
              onChange({
                ...context,
                regionId:
                  e.target.value === "all"
                    ? undefined
                    : Number(e.target.value),
                neighborhoodId: undefined,
              })
            }
            sx={{
              minWidth: isMobile ? "100%" : 160,
              "& .MuiOutlinedInput-root": {
                color: colors.text,
                "& fieldset": {
                  borderColor: colors.border,
                },
                "&:hover fieldset": {
                  borderColor: colors.accentLight,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.accentLight,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.labelText,
              },
            }}
            disabled={loading}
          >
            <MenuItem value="all">All Regions</MenuItem>

            {regionsQuery.data?.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Neighborhood"
            select
            disabled={!context.regionId || neighborhoodsQuery.isLoading || loading}
            value={context.neighborhoodId ?? "all"}
            onChange={(e) =>
              onChange({
                ...context,
                neighborhoodId:
                  e.target.value === "all"
                    ? undefined
                    : Number(e.target.value),
              })
            }
            sx={{
              minWidth: isMobile ? "100%" : 180,
              "& .MuiOutlinedInput-root": {
                color: colors.text,
                "& fieldset": {
                  borderColor: colors.border,
                },
                "&:hover fieldset": {
                  borderColor: colors.accentLight,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.accentLight,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.labelText,
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

          <Chip
            label={
              periodStatus
                ? periodStatus.isClosed
                  ? "CLOSED"
                  : "OPEN"
                : "—"
            }
            sx={{
              background: periodStatus?.isClosed 
                ? `linear-gradient(135deg, ${colors.error} 0%, ${colors.error}80 100%)` 
                : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
              color: colors.text,
              fontWeight: 700,
              border: `1px solid ${periodStatus?.isClosed ? colors.error : colors.accent}`,
              alignSelf: isMobile ? "flex-start" : "auto",
              boxShadow: getShadow('light'),
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: getShadow('medium'),
              },
              textShadow: `0 1px 2px ${colors.primary}60`,
            }}
            size={isMobile ? "small" : "medium"}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
