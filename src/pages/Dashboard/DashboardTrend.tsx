import {
  Paper,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { MonthlyTrendRow } from "../../api/dashboard";

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
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Monthly Trend
      </Typography>

      {loading ? (
        <Skeleton height={260} />
      ) : !data || data.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      ) : (
        <Box sx={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(m) => monthLabels[m]}
              />
              <YAxis />
              <Tooltip
  formatter={(value) =>
    typeof value === "number"
      ? value.toLocaleString()
      : "-"
  }
  labelFormatter={(label) =>
    monthLabels[Number(label)]
  }
/>
              <Line
                type="monotone"
                dataKey="invoiced"
                stroke="#1976d2"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="collected"
                stroke="#2e7d32"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}
