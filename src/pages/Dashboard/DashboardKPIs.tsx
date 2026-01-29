import { Paper, Typography, Stack, Skeleton, Box } from "@mui/material";
import type { DashboardOverview } from "../../api/dashboard";
import { useTheme } from "../../context/ThemeContext";

const KPIBox = ({
  label,
  value,
  loading,
  colors,
  getShadow,
  getBorderRadius,
  getResponsiveSpacing,
  getResponsiveFontSize,
}: {
  label: string;
  value?: number;
  loading: boolean;
  colors: any;
  getShadow: (intensity?: 'light' | 'medium' | 'strong') => string;
  getBorderRadius: (size?: 'small' | 'medium' | 'large') => string;
  getResponsiveSpacing: (base: number) => { xs: number; sm: number; md: number; lg: number; xl: number };
  getResponsiveFontSize: (base: string) => { xs: string; sm: string; md: string; lg: string; xl: string };
}) => {
  const spacing = getResponsiveSpacing(0.5);
  const fontSize = getResponsiveFontSize("0.75rem");

  return (
    <Paper
      sx={{
        p: {
          xs: spacing.xs * 2,
          sm: spacing.sm * 2,
          md: spacing.md * 2,
        },
        background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
        border: `1px solid ${colors.accent}30`,
        borderRadius: getBorderRadius('large'),
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
          transform: "translateY(-6px) scale(1.02)",
          borderColor: colors.accent,
          "&::before": {
            opacity: 1,
          },
        },
        cursor: "pointer",
        boxShadow: getShadow('medium'),
      }}
    >
      <Stack spacing={spacing} sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSubtle,
            fontSize: fontSize,
            letterSpacing: "0.5px",
            fontWeight: 600,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {label}
        </Typography>
        {loading ? (
          <Skeleton 
            width="80%" 
            sx={{ 
              bgcolor: `${colors.accent}20`,
              mx: "auto",
              borderRadius: getBorderRadius('small'),
            }} 
          />
        ) : (
          <Typography
            variant="h6"
            sx={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              fontSize: {
                xs: "1.4rem",
                sm: "1.6rem",
                md: "1.8rem",
              },
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {value?.toLocaleString() ?? "—"}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default function DashboardKPIs({
  overview,
  loading,
}: {
  overview?: DashboardOverview;
  loading: boolean;
}) {
  const { colors, getResponsiveSpacing, getShadow, getBorderRadius, getResponsiveFontSize } = useTheme();

  const spacing = getResponsiveSpacing(2);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // 1 column on mobile
          sm: "repeat(2, 1fr)", // 2 columns on small screens
          md: "repeat(3, 1fr)", // 3 columns on medium screens
          lg: "repeat(4, 1fr)", // 4 columns on large screens
          xl: "repeat(6, 1fr)", // 6 columns on extra large screens
        },
        gap: spacing,
        alignItems: "stretch",
      }}
    >
      <Box sx={{ gridColumn: { xs: "span 1", sm: "span 1", md: "span 1", lg: "span 1", xl: "span 1" } }}>
        <KPIBox
          label="Total Invoiced"
          value={overview?.totalInvoiced}
          loading={loading}
          colors={colors}
          getShadow={getShadow}
          getBorderRadius={getBorderRadius}
          getResponsiveSpacing={getResponsiveSpacing}
          getResponsiveFontSize={getResponsiveFontSize}
        />
      </Box>
      <Box sx={{ gridColumn: { xs: "span 1", sm: "span 1", md: "span 1", lg: "span 1", xl: "span 1" } }}>
        <KPIBox
          label="Total Collected"
          value={overview?.totalCollected}
          loading={loading}
          colors={colors}
          getShadow={getShadow}
          getBorderRadius={getBorderRadius}
          getResponsiveSpacing={getResponsiveSpacing}
          getResponsiveFontSize={getResponsiveFontSize}
        />
      </Box>
      <Box sx={{ gridColumn: { xs: "span 1", sm: "span 1", md: "span 1", lg: "span 1", xl: "span 1" } }}>
        <KPIBox
          label="Outstanding"
          value={overview?.totalOutstanding}
          loading={loading}
          colors={colors}
          getShadow={getShadow}
          getBorderRadius={getBorderRadius}
          getResponsiveSpacing={getResponsiveSpacing}
          getResponsiveFontSize={getResponsiveFontSize}
        />
      </Box>
      <Box sx={{ gridColumn: { xs: "span 1", sm: "span 1", md: "span 1", lg: "span 1", xl: "span 1" } }}>
        <KPIBox
          label="Subscribers"
          value={overview?.subscribersCount}
          loading={loading}
          colors={colors}
          getShadow={getShadow}
          getBorderRadius={getBorderRadius}
          getResponsiveSpacing={getResponsiveSpacing}
          getResponsiveFontSize={getResponsiveFontSize}
        />
      </Box>
      <Box sx={{ gridColumn: { xs: "span 1", sm: "span 1", md: "span 1", lg: "span 1", xl: "span 1" } }}>
        <KPIBox
          label="Meters"
          value={overview?.metersCount}
          loading={loading}
          colors={colors}
          getShadow={getShadow}
          getBorderRadius={getBorderRadius}
          getResponsiveSpacing={getResponsiveSpacing}
          getResponsiveFontSize={getResponsiveFontSize}
        />
      </Box>
      <Box sx={{ gridColumn: { xs: "span 1", sm: "span 1", md: "span 1", lg: "span 1", xl: "span 1" } }}>
        <KPIBox
          label="Boxes"
          value={overview?.boxesCount}
          loading={loading}
          colors={colors}
          getShadow={getShadow}
          getBorderRadius={getBorderRadius}
          getResponsiveSpacing={getResponsiveSpacing}
          getResponsiveFontSize={getResponsiveFontSize}
        />
      </Box>
    </Box>
  );
}
