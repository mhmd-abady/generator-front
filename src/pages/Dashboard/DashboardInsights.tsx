import {
  Paper,
  Typography,
  Stack,
  Box,
  Chip,
  Avatar,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import type { DashboardInsight } from "../../utils/dashboardInsights";
import { useTheme } from "../../hooks/useThemeColors";
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function DashboardInsights({
  insights,
}: {
  insights: DashboardInsight[];
}) {
  const { colors } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      case 'negative':
        return <ErrorIcon sx={{ fontSize: 20 }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 20 }} />;
      default:
        return <InfoIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return colors.secondary; // Green for positive
      case 'negative':
        return colors.error; // Red for negative
      case 'warning':
        return colors.accent; // Gold for warning
      default:
        return colors.textSubtle; // Subtle for neutral
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'positive':
        return `${colors.secondary}15`;
      case 'negative':
        return 'rgba(255, 107, 107, 0.15)';
      case 'warning':
        return `${colors.accent}15`;
      default:
        return `${colors.textSubtle}15`;
    }
  };

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case 'positive':
        return `${colors.secondary}40`;
      case 'negative':
        return 'rgba(255, 107, 107, 0.4)';
      case 'warning':
        return `${colors.accent}40`;
      default:
        return `${colors.textSubtle}40`;
    }
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
          Business Insights
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSubtle,
            fontSize: "0.875rem",
          }}
        >
          Key performance indicators and actionable insights
        </Typography>
      </Box>

      {insights.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
          }}
        >
          <InfoIcon
            sx={{
              fontSize: "3rem",
              color: colors.accent,
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: colors.textSubtle,
              mb: 1,
            }}
          >
            No Insights Available
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.textSubtle,
              opacity: 0.7,
              maxWidth: 300,
              mx: "auto",
            }}
          >
            Insights will appear here as data becomes available for analysis
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {insights.map((insight, index) => {
            const icon = getInsightIcon(insight.type);
            const color = getInsightColor(insight.type);
            const bgColor = getInsightBgColor(insight.type);
            const borderColor = getInsightBorderColor(insight.type);

            return (
              <Box
                key={insight.id}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateX(4px)",
                    boxShadow: `0 4px 20px ${color}30`,
                    borderColor: color,
                  },
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                      color: color,
                      border: `2px solid ${color}40`,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: colors.text,
                          fontWeight: 600,
                          fontSize: isMobile ? "0.85rem" : "0.9rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {insight.title || `Insight #${index + 1}`}
                      </Typography>
                      <Chip
                        size="small"
                        label={insight.type}
                        sx={{
                          background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
                          color: "white",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          height: 20,
                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.textSubtle,
                        fontSize: isMobile ? "0.8rem" : "0.85rem",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {insight.message}
                    </Typography>

                    {insight.priority && (
                      <Box sx={{ mt: 1.5 }}>
                        <Chip
                          size="small"
                          label={`Priority: ${insight.priority}`}
                          variant="outlined"
                          sx={{
                            borderColor: color,
                            color: color,
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            height: 20,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}

      {insights.length > 0 && (
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${colors.accent}20`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: colors.textSubtle,
              fontSize: "0.75rem",
            }}
          >
            {insights.length} insight{insights.length !== 1 ? 's' : ''} • Updated in real-time
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: colors.secondary,
                }}
              />
              <Typography variant="caption" sx={{ color: colors.textSubtle, fontSize: "0.7rem" }}>
                Positive
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: colors.accent,
                }}
              />
              <Typography variant="caption" sx={{ color: colors.textSubtle, fontSize: "0.7rem" }}>
                Warning
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: colors.error,
                }}
              />
              <Typography variant="caption" sx={{ color: colors.textSubtle, fontSize: "0.7rem" }}>
                Negative
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
