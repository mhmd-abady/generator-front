import {
  Paper,
  Typography,
  Box,
  Skeleton,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import type { MonthlyTrendRow } from "../../api/dashboard";
import { useTheme } from "../../hooks/useThemeColors";

type Props = {
  data?: MonthlyTrendRow[];
  loading: boolean;
};

const monthLabels = [
  "",
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export default function DashboardTrend({ data, loading }: Props) {
  const { colors } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
            border: `1px solid ${colors.accent}40`,
            borderRadius: "8px",
            p: 2,
            boxShadow: `0 8px 32px ${colors.accent}20`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: colors.accent,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {monthLabels[Number(label)]}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                  mr: 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  mr: 1,
                  textTransform: "capitalize",
                }}
              >
                {entry.dataKey}:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text,
                  fontWeight: 600,
                }}
              >
                {entry.value?.toLocaleString() || "0"}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
        border: `1px solid ${colors.accent}40`,
        borderRadius: "16px",
        boxShadow: `0 8px 32px ${colors.accent}20`,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 12px 48px ${colors.accent}30`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            letterSpacing: "0.5px",
            mb: 1,
          }}
        >
          Monthly Trend Analysis
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSubtle,
            fontSize: "0.875rem",
          }}
        >
          Revenue performance over the past 12 months
        </Typography>
      </Box>

      {loading ? (
        <Skeleton
          height={isMobile ? 200 : 320}
          sx={{
            borderRadius: "12px",
            bgcolor: `${colors.accent}20`,
          }}
        />
      ) : !data || data.length === 0 ? (
        <Box
          sx={{
            height: isMobile ? 200 : 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px dashed ${colors.accent}40`,
            borderRadius: "12px",
            background: `${colors.accent}05`,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: colors.textSubtle,
              fontStyle: "italic",
            }}
          >
            No trend data available
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: isMobile ? 200 : 320, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="invoicedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.accent} stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.secondary} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="2 4"
                stroke={colors.accent}
                strokeOpacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickFormatter={(m) => monthLabels[m]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: colors.textSubtle,
                  fontSize: isMobile ? 10 : 12,
                  fontWeight: 500,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: colors.textSubtle,
                  fontSize: isMobile ? 10 : 12,
                  fontWeight: 500,
                }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="invoiced"
                stroke={colors.accent}
                strokeWidth={3}
                fill="url(#invoicedGradient)"
                dot={{
                  fill: colors.accent,
                  strokeWidth: 2,
                  stroke: colors.dark,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: colors.accent,
                  stroke: colors.dark,
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="collected"
                stroke={colors.secondary}
                strokeWidth={3}
                fill="url(#collectedGradient)"
                dot={{
                  fill: colors.secondary,
                  strokeWidth: 2,
                  stroke: colors.dark,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: colors.secondary,
                  stroke: colors.dark,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}

      {!loading && data && data.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: colors.accent,
                boxShadow: `0 0 8px ${colors.accent}40`,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: colors.textSubtle,
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            >
              Invoiced
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: colors.secondary,
                boxShadow: `0 0 8px ${colors.secondary}40`,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: colors.textSubtle,
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            >
              Collected
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
