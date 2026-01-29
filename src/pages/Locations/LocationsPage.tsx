import {
  Paper,
  Stack,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  useTheme as useMuiTheme,
  Box,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useRegions } from "../../hooks/useRegions";
import { useNeighborhoods } from "../../hooks/useNeighborhoods";
import type { Region, Neighborhood } from "../../api/locations";
import { useBoxes } from "../../hooks/useBoxes";
import type { Box as BoxType } from "../../api/boxes";
import BoxMetersDialog from "./BoxMetersDialog";
import HierarchyDialog from "./HierarchyDialog";
import { useTheme } from "../../context/ThemeContext";

export default function LocationsPage() {
  const { colors, getBorderRadius, getResponsiveSpacing, getResponsiveFontSize } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const { regions, createRegion, updateRegion, deleteRegion } = useRegions();
  const {
    neighborhoods,
    createNeighborhood,
    updateNeighborhood,
    deleteNeighborhood,
  } = useNeighborhoods();

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  /* dialogs */
  const [open, setOpen] = useState<"region" | "neighborhood" | null>(null);
  const [editing, setEditing] = useState<Region | Neighborhood | null>(null);
  const [name, setName] = useState("");

  const [boxOpen, setBoxOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<BoxType | null>(null);
  const [boxCode, setBoxCode] = useState("");
  const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);
  /* ================= handlers ================= */
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<Neighborhood | null>(null);
  const {
    boxes,
    isLoading: boxesLoading,
    createBox,
    updateBox,
    deleteBox,
  } = useBoxes(selectedNeighborhood?.id);  
  const submitRegion = () => {
    if (!name.trim()) return;

    if (editing) {
      updateRegion.mutate({ id: (editing as Region).id, data: { name } });
    } else {
      createRegion.mutate({ name });
    }
    setOpen(null);
  };

  const submitNeighborhood = () => {
    if (!name.trim() || !selectedRegion) return;

    if (editing) {
      updateNeighborhood.mutate({
        id: (editing as Neighborhood).id,
        data: { name, regionId: selectedRegion.id },
      });
    } else {
      createNeighborhood.mutate({
        name,
        regionId: selectedRegion.id,
      });
    }
    setOpen(null);
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "transparent",
          border: "none",
          p: {
            xs: getResponsiveSpacing(1).xs,
            sm: getResponsiveSpacing(2).sm,
            md: getResponsiveSpacing(3).md,
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: {
              xs: getResponsiveSpacing(3).xs,
              sm: getResponsiveSpacing(4).sm,
              md: getResponsiveSpacing(5).md,
            },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: getResponsiveFontSize("2rem"),
                sm: getResponsiveFontSize("2.5rem"),
                md: getResponsiveFontSize("3rem"),
              },
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 50%, ${colors.secondary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 4px 8px ${colors.primary}40`,
              mb: getResponsiveSpacing(1).md,
            }}
          >
            Location Management
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: colors.textSubtle,
              fontWeight: 400,
              fontSize: {
                xs: getResponsiveFontSize("1rem"),
                sm: getResponsiveFontSize("1.1rem"),
              },
              maxWidth: "600px",
              mx: { xs: "auto", sm: 0 },
              lineHeight: 1.6,
            }}
          >
            Organize and manage your regions, neighborhoods, and meter boxes with hierarchical control
          </Typography>
        </Box>

        {/* Main Grid Layout */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Mobile: single column
              sm: "320px 1fr", // Tablet: regions + neighborhoods/boxes
              lg: "320px 1fr 340px", // Desktop: all three columns
            },
            gap: {
              xs: getResponsiveSpacing(3).xs,
              sm: getResponsiveSpacing(3).sm,
              md: getResponsiveSpacing(4).md,
            },
            alignItems: "start",
          }}
        >
        {/* ================= REGIONS ================= */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: getResponsiveSpacing(3).xs,
              sm: getResponsiveSpacing(3).sm,
              md: getResponsiveSpacing(4).md,
            },
            background: `linear-gradient(145deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
            border: `1px solid ${colors.accent}20`,
            borderRadius: getBorderRadius('large'),
            boxShadow: `0 8px 32px ${colors.primary}15, 0 2px 8px ${colors.accent}10`,
            backdropFilter: "blur(10px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary}, ${colors.accentLight})`,
            },
            "&:hover": {
              boxShadow: `0 12px 48px ${colors.primary}20, 0 4px 16px ${colors.accent}15`,
              transform: "translateY(-2px)",
              borderColor: colors.accent,
            },
            minHeight: isMobile ? "auto" : "500px",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: getResponsiveSpacing(2).md }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: getResponsiveFontSize("1.4rem"),
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: `0 2px 4px ${colors.primary}40`,
                  mb: 0.5,
                }}
              >
                Regions
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  fontSize: "0.85rem",
                  opacity: 0.8,
                }}
              >
                {regions.length} total regions
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setEditing(null);
                setName("");
                setOpen("region");
              }}
              sx={{
                background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}10 100%)`,
                color: colors.accent,
                border: `1px solid ${colors.accent}30`,
                borderRadius: getBorderRadius('large'),
                width: 48,
                height: 48,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
                  color: colors.text,
                  transform: "scale(1.1) rotate(90deg)",
                  boxShadow: `0 6px 20px ${colors.accent}40`,
                },
                "&:active": {
                  transform: "scale(0.95) rotate(90deg)",
                },
              }}
            >
              <Add />
            </IconButton>
          </Stack>

          <List sx={{ p: 0 }}>
            {regions.map((r) => (
              <ListItemButton
                key={r.id}
                selected={r.id === selectedRegion?.id}
                onClick={() => {
                  setSelectedRegion(r);
                  setSelectedNeighborhood(null);
                }}
                sx={{
                  borderRadius: getBorderRadius('large'),
                  mb: 1,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  background: "transparent",
                  border: `1px solid transparent`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: r.id === selectedRegion?.id
                      ? `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.secondary}10 100%)`
                      : "transparent",
                    transition: "all 0.3s ease",
                    borderRadius: getBorderRadius('large'),
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: r.id === selectedRegion?.id ? "4px" : "0px",
                    height: "100%",
                    background: `linear-gradient(180deg, ${colors.accent}, ${colors.secondary})`,
                    transition: "width 0.3s ease",
                    borderRadius: "0 2px 2px 0",
                  },
                  "&.Mui-selected": {
                    background: "transparent",
                    borderColor: `${colors.accent}40`,
                    "&::before": {
                      background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.secondary}15 100%)`,
                      boxShadow: `inset 0 0 20px ${colors.accent}10`,
                    },
                    "&::after": {
                      width: "4px",
                    },
                    "& .MuiTypography-root": {
                      fontWeight: 700,
                      color: colors.accent,
                      textShadow: `0 1px 2px ${colors.primary}30`,
                    },
                  },
                  "&:hover": {
                    background: "transparent",
                    borderColor: `${colors.accent}30`,
                    transform: "translateX(4px) scale(1.02)",
                    "&::before": {
                      background: `linear-gradient(135deg, ${colors.accent}10 0%, ${colors.secondary}8 100%)`,
                    },
                    "& .action-buttons": {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  },
                  "& .MuiTypography-root": {
                    fontWeight: 500,
                    zIndex: 1,
                    position: "relative",
                    transition: "all 0.3s ease",
                    fontSize: "0.95rem",
                  },
                }}
              >
                <ListItemText
                  primary={r.name}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    },
                  }}
                />
                <Stack
                  direction="row"
                  spacing={0.5}
                  className="action-buttons"
                  sx={{
                    opacity: r.id === selectedRegion?.id ? 1 : 0.7,
                    transform: r.id === selectedRegion?.id ? "translateX(0)" : "translateX(10px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(r);
                      setName(r.name);
                      setOpen("region");
                    }}
                    sx={{
                      color: colors.textSubtle,
                      background: "transparent",
                      borderRadius: getBorderRadius('medium'),
                      width: 32,
                      height: 32,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        color: colors.accent,
                        background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}10 100%)`,
                        transform: "scale(1.1) rotate(5deg)",
                        boxShadow: `0 4px 12px ${colors.accent}30`,
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRegion.mutate(r.id);
                    }}
                    sx={{
                      color: colors.error,
                      background: "transparent",
                      borderRadius: getBorderRadius('medium'),
                      width: 32,
                      height: 32,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        color: colors.text,
                        background: `linear-gradient(135deg, ${colors.error} 0%, ${colors.error}80 100%)`,
                        transform: "scale(1.1) rotate(-5deg)",
                        boxShadow: `0 4px 12px ${colors.error}40`,
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* ================= NEIGHBORHOODS ================= */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: getResponsiveSpacing(3).xs,
              sm: getResponsiveSpacing(3).sm,
              md: getResponsiveSpacing(4).md,
            },
            background: `linear-gradient(145deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
            border: `1px solid ${colors.secondary}20`,
            borderRadius: getBorderRadius('large'),
            boxShadow: `0 8px 32px ${colors.primary}15, 0 2px 8px ${colors.secondary}10`,
            backdropFilter: "blur(10px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${colors.secondary}, ${colors.accent}, ${colors.secondary}80)`,
            },
            "&:hover": {
              boxShadow: `0 12px 48px ${colors.primary}20, 0 4px 16px ${colors.secondary}15`,
              transform: "translateY(-2px)",
              borderColor: colors.secondary,
            },
            minHeight: isMobile ? "auto" : "500px",
            gridColumn: {
              xs: "1", // Mobile: spans full width
              sm: "2", // Tablet: second column
              lg: "2", // Desktop: second column
            },
          }}
        >
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            spacing={isMobile ? 1 : 0}
            sx={{ mb: getResponsiveSpacing(2).md }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: getResponsiveFontSize("1.4rem"),
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: `0 2px 4px ${colors.primary}40`,
                  mb: 0.5,
                }}
              >
                Neighborhoods{" "}
                {selectedRegion && (
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 500,
                      color: colors.textSubtle,
                      fontSize: "0.9em",
                      opacity: 0.8,
                    }}
                  >
                    — {selectedRegion.name}
                  </Typography>
                )}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  fontSize: "0.85rem",
                  opacity: 0.8,
                }}
              >
                {selectedRegion
                  ? `${neighborhoods.filter((n) => n.regionId === selectedRegion.id).length} neighborhoods`
                  : "Select a region first"
                }
              </Typography>
            </Box>

            <Button
              variant="contained"
              disabled={!selectedRegion}
              onClick={() => {
                setEditing(null);
                setName("");
                setOpen("neighborhood");
              }}
              sx={{
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
                color: colors.text,
                border: `1px solid ${colors.secondary}`,
                borderRadius: getBorderRadius('large'),
                fontWeight: 600,
                textTransform: "none",
                boxShadow: `0 4px 16px ${colors.secondary}30`,
                px: 3,
                py: 1.5,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
                  transform: "translateY(-2px) scale(1.02)",
                  boxShadow: `0 8px 24px ${colors.secondary}40`,
                },
                "&:active": {
                  transform: "translateY(0) scale(0.98)",
                },
                "&:disabled": {
                  background: `linear-gradient(135deg, ${colors.disabled} 0%, ${colors.disabled}80 100%)`,
                  color: colors.disabledText,
                  border: `1px solid ${colors.disabled}`,
                  opacity: 0.7,
                  boxShadow: `0 2px 8px ${colors.disabled}30`,
                  transform: "none",
                  cursor: "not-allowed",
                },
              }}
            >
              <Add sx={{ mr: 1, fontSize: "1.1rem" }} />
              Add Neighborhood
            </Button>
          </Stack>

          <Divider
            sx={{
              borderColor: `${colors.secondary}30`,
              my: getResponsiveSpacing(2).md,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, ${colors.secondary}50 50%, transparent 100%)`,
            }}
          />

          {!selectedRegion ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
                textAlign: "center",
                p: getResponsiveSpacing(3).md,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.secondary}20 0%, ${colors.accent}10 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  boxShadow: `0 8px 24px ${colors.secondary}20`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "2rem",
                    color: colors.secondary,
                    opacity: 0.6,
                  }}
                >
                  🏘️
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: colors.textSubtle,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Select a Region First
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  opacity: 0.7,
                  maxWidth: "280px",
                  lineHeight: 1.6,
                }}
              >
                Choose a region from the left panel to view and manage its neighborhoods
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      "& .MuiTableCell-head": {
                        background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.accent}10 100%)`,
                        color: colors.secondary,
                        fontWeight: 700,
                        borderBottom: `2px solid ${colors.secondary}40`,
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        py: 2,
                      },
                    }}
                  >
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {neighborhoods
                    .filter((n) => n.regionId === selectedRegion.id)
                    .map((n) => (
                      <TableRow
                        key={n.id}
                        hover
                        selected={n.id === selectedNeighborhood?.id}
                        onClick={() => setSelectedNeighborhood(n)}
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          "&.Mui-selected": {
                            background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.accent}10 100%)`,
                            boxShadow: `inset 0 0 20px ${colors.secondary}10`,
                            "& .MuiTableCell-root": {
                              color: colors.secondary,
                              fontWeight: 600,
                              textShadow: `0 1px 2px ${colors.primary}20`,
                            },
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "3px",
                              background: `linear-gradient(180deg, ${colors.secondary}, ${colors.accent})`,
                              borderRadius: "0 2px 2px 0",
                            },
                          },
                          "&:hover": {
                            background: `linear-gradient(135deg, ${colors.secondary}8 0%, ${colors.accent}5 100%)`,
                            transform: "scale(1.01)",
                            boxShadow: `0 4px 12px ${colors.secondary}15`,
                          },
                          "& .MuiTableCell-root": {
                            borderBottom: `1px solid ${colors.secondary}20`,
                            color: colors.text,
                            transition: "all 0.3s ease",
                            py: 2,
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: colors.secondary,
                                mr: 2,
                                opacity: 0.6,
                              }}
                            />
                            {n.name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditing(n);
                                setName(n.name);
                                setOpen("neighborhood");
                              }}
                              sx={{
                                color: colors.textSubtle,
                                background: "transparent",
                                borderRadius: getBorderRadius('medium'),
                                width: 36,
                                height: 36,
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  color: colors.secondary,
                                  background: `linear-gradient(135deg, ${colors.secondary}20 0%, ${colors.secondary}10 100%)`,
                                  transform: "scale(1.1) rotate(5deg)",
                                  boxShadow: `0 4px 12px ${colors.secondary}30`,
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNeighborhood.mutate(n.id);
                              }}
                              sx={{
                                color: colors.error,
                                background: "transparent",
                                borderRadius: getBorderRadius('medium'),
                                width: 36,
                                height: 36,
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  color: colors.text,
                                  background: `linear-gradient(135deg, ${colors.error} 0%, ${colors.error}80 100%)`,
                                  transform: "scale(1.1) rotate(-5deg)",
                                  boxShadow: `0 4px 12px ${colors.error}40`,
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>

        {/* ================= BOXES ================= */}
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: getResponsiveSpacing(3).xs,
              sm: getResponsiveSpacing(3).sm,
              md: getResponsiveSpacing(4).md,
            },
            background: `linear-gradient(145deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
            border: `1px solid ${colors.primary}20`,
            borderRadius: getBorderRadius('large'),
            boxShadow: `0 8px 32px ${colors.primary}15, 0 2px 8px ${colors.primary}10`,
            backdropFilter: "blur(10px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
            },
            "&:hover": {
              boxShadow: `0 12px 48px ${colors.primary}20, 0 4px 16px ${colors.primary}15`,
              transform: "translateY(-2px)",
              borderColor: colors.primary,
            },
            minHeight: isMobile ? "auto" : "500px",
            gridColumn: {
              xs: "1", // Mobile: spans full width
              sm: "2", // Tablet: second column (stacks with neighborhoods)
              lg: "3", // Desktop: third column
            },
            mt: {
              xs: getResponsiveSpacing(3).xs,
              sm: getResponsiveSpacing(3).sm,
              lg: 0, // No margin on desktop
            },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: getResponsiveSpacing(2).md }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: getResponsiveFontSize("1.4rem"),
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: `0 2px 4px ${colors.primary}40`,
                  mb: 0.5,
                }}
              >
                Meter Boxes{" "}
                {selectedNeighborhood && (
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 500,
                      color: colors.textSubtle,
                      fontSize: "0.9em",
                      opacity: 0.8,
                    }}
                  >
                    — {selectedNeighborhood.name}
                  </Typography>
                )}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  fontSize: "0.85rem",
                  opacity: 0.8,
                }}
              >
                {selectedNeighborhood
                  ? boxesLoading
                    ? "Loading boxes..."
                    : `${boxes.length} meter boxes`
                  : "Select a neighborhood first"
                }
              </Typography>
            </Box>
          </Stack>

          <Divider
            sx={{
              borderColor: `${colors.primary}30`,
              my: getResponsiveSpacing(2).md,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, ${colors.primary}50 50%, transparent 100%)`,
            }}
          />

          {!selectedNeighborhood ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
                textAlign: "center",
                p: getResponsiveSpacing(3).md,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}10 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  boxShadow: `0 8px 24px ${colors.primary}20`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "2rem",
                    color: colors.primary,
                    opacity: 0.6,
                  }}
                >
                  📦
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: colors.textSubtle,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Select a Neighborhood First
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  opacity: 0.7,
                  maxWidth: "280px",
                  lineHeight: 1.6,
                }}
              >
                Choose a neighborhood to view and manage its meter boxes
              </Typography>
            </Box>
          ) : boxesLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  animation: "spin 2s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              >
                <Typography sx={{ fontSize: "1.5rem", color: colors.text }}>
                  ⟳
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: colors.primary,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Loading Meter Boxes
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  opacity: 0.7,
                }}
              >
                Please wait while we fetch the data...
              </Typography>
            </Box>
          ) : boxes.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
                textAlign: "center",
                p: getResponsiveSpacing(3).md,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}8 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  boxShadow: `0 8px 24px ${colors.primary}15`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "2rem",
                    color: colors.primary,
                    opacity: 0.5,
                  }}
                >
                  📦
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: colors.textSubtle,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                No Meter Boxes Found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSubtle,
                  opacity: 0.7,
                  maxWidth: "280px",
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                This neighborhood doesn't have any meter boxes yet. Add the first one to get started.
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {boxes.map((b) => (
                <ListItemButton
                  key={b.id}
                  onClick={() => setSelectedBox(b)}
                  sx={{
                    borderRadius: getBorderRadius('large'),
                    mb: 1,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    background: "transparent",
                    border: `1px solid transparent`,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "transparent",
                      transition: "all 0.3s ease",
                      borderRadius: getBorderRadius('large'),
                    },
                    "&:hover": {
                      background: "transparent",
                      borderColor: `${colors.primary}30`,
                      transform: "translateX(4px) scale(1.02)",
                      "&::before": {
                        background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}8 100%)`,
                      },
                      "& .MuiTypography-root": {
                        color: colors.primary,
                        fontWeight: 600,
                      },
                      "& .action-buttons": {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                    },
                    "& .MuiTypography-root": {
                      fontWeight: 500,
                      zIndex: 1,
                      position: "relative",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: colors.primary,
                            mr: 2,
                            opacity: 0.7,
                          }}
                        />
                        {b.code}
                      </Box>
                    }
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "0.95rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                  <Stack
                    direction="row"
                    spacing={0.5}
                    className="action-buttons"
                    sx={{
                      opacity: 0.7,
                      transform: "translateX(10px)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBox(b);
                        setBoxCode(b.code);
                        setBoxOpen(true);
                      }}
                      sx={{
                        color: colors.textSubtle,
                        background: "transparent",
                        borderRadius: getBorderRadius('medium'),
                        width: 32,
                        height: 32,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          color: colors.primary,
                          background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.primary}10 100%)`,
                          transform: "scale(1.1) rotate(5deg)",
                          boxShadow: `0 4px 12px ${colors.primary}30`,
                        },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBox.mutate(b.id);
                      }}
                      sx={{
                        color: colors.error,
                        background: "transparent",
                        borderRadius: getBorderRadius('medium'),
                        width: 32,
                        height: 32,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          color: colors.text,
                          background: `linear-gradient(135deg, ${colors.error} 0%, ${colors.error}80 100%)`,
                          transform: "scale(1.1) rotate(-5deg)",
                          boxShadow: `0 4px 12px ${colors.error}40`,
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      </Box>
      </Box>
      
      {selectedBox && (
        <BoxMetersDialog
          open={!!selectedBox}
          box={selectedBox}
          onClose={() => setSelectedBox(null)}
        />
      )}

      {/* Hierarchy Dialog - Regions & Neighborhoods */}
      <HierarchyDialog
        open={!!open}
        type={open === "region" ? "region" : "neighborhood"}
        title={
          open === "region"
            ? editing
              ? "✏️ Edit Region"
              : "➕ Add New Region"
            : editing
            ? "✏️ Edit Neighborhood"
            : "➕ Add New Neighborhood"
        }
        subtitle={
          open === "neighborhood"
            ? selectedRegion
              ? `Managing neighborhoods in ${selectedRegion.name}`
              : "Select a region first"
            : undefined
        }
        label={open === "region" ? "Region Name" : "Neighborhood Name"}
        value={name}
        isEditing={!!editing}
        onValueChange={setName}
        onClose={() => {
          setOpen(null);
          setEditing(null);
          setName("");
        }}
        onSubmit={open === "region" ? submitRegion : submitNeighborhood}
      />

      {/* Box Dialog - Meter Boxes */}
      <HierarchyDialog
        open={boxOpen}
        type="box"
        title={editingBox ? "📦 Edit Meter Box" : "📦 Add New Meter Box"}
        subtitle={selectedNeighborhood ? `In: ${selectedNeighborhood.name}` : undefined}
        label="Box Code"
        value={boxCode}
        isEditing={!!editingBox}
        onValueChange={setBoxCode}
        onClose={() => {
          setBoxOpen(false);
          setEditingBox(null);
          setBoxCode("");
        }}
        onSubmit={() => {
          if (!boxCode.trim() || !selectedNeighborhood) return;

          if (editingBox) {
            updateBox.mutate({
              id: editingBox.id,
              dto: { code: boxCode },
            });
          } else {
            createBox.mutate({
              code: boxCode,
              neighborhoodId: selectedNeighborhood.id,
            });
          }

          setBoxOpen(false);
          setEditingBox(null);
          setBoxCode("");
        }}
      />
    </DashboardLayout>
  );
}
