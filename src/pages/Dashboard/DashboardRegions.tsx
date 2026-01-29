import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
  Chip,
  Avatar,
} from "@mui/material";
import type { RegionBreakdownRow } from "../../api/dashboard";
import { useTheme } from "../../hooks/useThemeColors";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';

type Props = {
  data?: RegionBreakdownRow[];
  loading: boolean;
  neighborhoodSelected: boolean;
};

export default function DashboardRegions({
  data,
  loading,
  neighborhoodSelected,
}: Props) {
  const { colors } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  if (neighborhoodSelected) {
    return (
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
          border: `1px solid ${colors.accent}40`,
          borderRadius: "16px",
          boxShadow: `0 8px 32px ${colors.accent}20`,
        }}
      >
        <Box sx={{ textAlign: "center", py: 4 }}>
          <LocationOnIcon
            sx={{
              fontSize: "3rem",
              color: colors.accent,
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: colors.accent,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Region Breakdown Unavailable
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.textSubtle,
              maxWidth: 300,
              mx: "auto",
            }}
          >
            Regional breakdown data is not available when viewing neighborhood-specific information.
          </Typography>
        </Box>
      </Paper>
    );
  }

  const rows =
    data?.slice().sort(
      (a, b) => b.totalOutstanding - a.totalOutstanding
    ) ?? [];

  const getPerformanceColor = (outstanding: number, total: number) => {
    const ratio = outstanding / total;
    if (ratio > 0.3) return colors.secondary; // High outstanding - use secondary color
    if (ratio > 0.1) return colors.accent; // Medium outstanding - use accent
    return colors.textSubtle; // Low outstanding - use subtle
  };

  const getPerformanceIcon = (outstanding: number, total: number) => {
    const ratio = outstanding / total;
    if (ratio > 0.3) return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    if (ratio > 0.1) return <TrendingUpIcon sx={{ fontSize: 16 }} />;
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
        overflow: "hidden",
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
          Regional Performance Analysis
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSubtle,
            fontSize: "0.875rem",
          }}
        >
          Revenue breakdown by region with outstanding balances
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              height={48}
              sx={{
                borderRadius: "8px",
                bgcolor: `${colors.accent}20`,
              }}
            />
          ))}
        </Box>
      ) : rows.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
          }}
        >
          <LocationOnIcon
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
            No Regional Data
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.textSubtle,
              opacity: 0.7,
            }}
          >
            Regional performance data will appear here once available
          </Typography>
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Table
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiTableHead-root": {
                "& .MuiTableCell-head": {
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  color: colors.text,
                  fontWeight: 700,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  borderBottom: `2px solid ${colors.accent}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  py: 2,
                },
              },
              "& .MuiTableBody-root": {
                "& .MuiTableRow-root": {
                  "&:hover": {
                    background: `${colors.accent}10`,
                    transform: "scale(1.01)",
                    transition: "all 0.2s ease",
                  },
                  "& .MuiTableCell-body": {
                    color: colors.text,
                    borderBottom: `1px solid ${colors.accent}20`,
                    fontSize: isMobile ? "0.8rem" : "0.875rem",
                    py: isMobile ? 1.5 : 2,
                  },
                },
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: isMobile ? 120 : 160 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: colors.accent }} />
                    Region
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ minWidth: isMobile ? 80 : 100 }}>
                  Invoiced
                </TableCell>
                <TableCell align="right" sx={{ minWidth: isMobile ? 80 : 100 }}>
                  Collected
                </TableCell>
                <TableCell align="right" sx={{ minWidth: isMobile ? 100 : 120 }}>
                  Outstanding
                </TableCell>
                <TableCell align="center" sx={{ minWidth: isMobile ? 60 : 80 }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => {
                const totalRevenue = r.totalInvoiced;
                const outstandingRatio = r.totalOutstanding / totalRevenue;
                const performanceColor = getPerformanceColor(r.totalOutstanding, totalRevenue);

                return (
                  <TableRow key={r.regionId}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            background: `linear-gradient(135deg, ${colors.accent}20, ${colors.secondary}20)`,
                            color: colors.accent,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {r.regionName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: colors.text,
                              fontSize: isMobile ? "0.8rem" : "0.875rem",
                            }}
                          >
                            {r.regionName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.textSubtle,
                              fontSize: "0.7rem",
                            }}
                          >
                            Region #{r.regionId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: colors.accent,
                          fontSize: isMobile ? "0.75rem" : "0.8rem",
                        }}
                      >
                        {r.totalInvoiced.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: colors.secondary,
                          fontSize: isMobile ? "0.75rem" : "0.8rem",
                        }}
                      >
                        {r.totalCollected.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: performanceColor,
                            fontSize: isMobile ? "0.75rem" : "0.8rem",
                          }}
                        >
                          {r.totalOutstanding.toLocaleString()}
                        </Typography>
                        {getPerformanceIcon(r.totalOutstanding, totalRevenue)}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={
                          outstandingRatio > 0.3
                            ? "High"
                            : outstandingRatio > 0.1
                            ? "Medium"
                            : "Low"
                        }
                        sx={{
                          background: `linear-gradient(135deg, ${
                            outstandingRatio > 0.3
                              ? colors.secondary
                              : outstandingRatio > 0.1
                              ? colors.accent
                              : colors.textSubtle
                          }20, ${
                            outstandingRatio > 0.3
                              ? colors.secondary
                              : outstandingRatio > 0.1
                              ? colors.accent
                              : colors.textSubtle
                          }40)`,
                          color: outstandingRatio > 0.3
                            ? colors.secondary
                            : outstandingRatio > 0.1
                            ? colors.accent
                            : colors.textSubtle,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          border: `1px solid ${
                            outstandingRatio > 0.3
                              ? colors.secondary
                              : outstandingRatio > 0.1
                              ? colors.accent
                              : colors.textSubtle
                          }40`,
                          minWidth: isMobile ? 50 : 60,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}

      {!loading && rows.length > 0 && (
        <Box
          sx={{
            mt: 2,
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
            {rows.length} regions • Sorted by outstanding balance
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: colors.textSubtle,
                }}
              />
              <Typography variant="caption" sx={{ color: colors.textSubtle, fontSize: "0.7rem" }}>
                Low
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
                Medium
              </Typography>
            </Box>
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
                High
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
