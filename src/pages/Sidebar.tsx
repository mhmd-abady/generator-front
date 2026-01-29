import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import {
  Dashboard,
  LocationOn,
  People,
  Speed,
  Receipt,
  Payments,
  BarChart,
  Settings,
  Palette,
  Menu,
  Close,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const drawerWidth = 280;
const mobileDrawerWidth = 320;
const mobileHeaderHeight = 64;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, theme, toggleTheme, getGradient, getShadow, getBorderRadius, getResponsiveSpacing } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const spacing = getResponsiveSpacing(1.5);

  const items = [
    { label: "Dashboard", icon: <Dashboard />, path: "/" },
    { label: "Locations", icon: <LocationOn />, path: "/locations" },
    { label: "Subscribers", icon: <People />, path: "/subscribers" },
    { label: "Meters", icon: <Speed />, path: "/meters" },
    { label: "Meter Readings", icon: <Receipt />, path: "/meter-readings" },
    { label: "Invoices", icon: <Receipt />, path: "/invoices" },
    { label: "Tariffs", icon: <Receipt />, path: "/tariffs" },
    { label: "Payments", icon: <Payments />, path: "/payments" },
    { label: "Reports", icon: <BarChart />, path: "/reports" },
    { label: "Exchange Rate", icon: <Settings />, path: "/settings" },
  ];

  const themeLabel = theme === "TEAL_GOLD" ? "Black & Gold" : "Teal & Gold";

  const drawerContent = (
    <>
      <List sx={{ mt: isMobile ? spacing.xs : spacing.md, flex: 1, px: spacing.xs }}>
        {items.map((item) => {
          const selected = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                color: colors.text,
                m: `${spacing.xs}px ${isMobile ? spacing.sm : 0}px`,
                borderRadius: getBorderRadius(isMobile ? 'medium' : 'small'),
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
                  background: selected ? `${colors.accent}15` : "transparent",
                  transition: "background 0.3s ease",
                },
                "&.Mui-selected": {
                  background: "transparent",
                  "&::before": {
                    background: `${colors.accent}25`,
                  },
                  "& .MuiListItemIcon-root": {
                    color: colors.accent,
                    transform: "scale(1.1)",
                  },
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                    color: colors.accent,
                  },
                },
                "&:hover": {
                  background: "transparent",
                  "&::before": {
                    background: `${colors.accent}10`,
                  },
                  transform: "translateX(4px)",
                  "& .MuiListItemIcon-root": {
                    color: colors.accent,
                  },
                },
                "& .MuiListItemIcon-root": {
                  color: colors.textSubtle,
                  minWidth: 48,
                  transition: "all 0.3s ease",
                  zIndex: 1,
                  position: "relative",
                },
                "& .MuiTypography-root": {
                  fontSize: isMobile ? "0.95rem" : "0.9rem",
                  fontWeight: 500,
                  zIndex: 1,
                  position: "relative",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ 
        borderColor: `${colors.accent}30`,
        mx: spacing.sm,
        my: spacing.xs,
      }} />

      <Box sx={{ p: spacing.md }}>
        <Stack spacing={spacing.sm}>
          <Tooltip title={`Switch to ${themeLabel} theme`}>
            <Box sx={{ width: '100%' }}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  width: '100%',
                  background: `${colors.accent}15`,
                  color: colors.accent,
                  border: `1px solid ${colors.accent}40`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: getBorderRadius('medium'),
                  boxShadow: getShadow('light'),
                  "&:hover": {
                    background: `${colors.accent}25`,
                    transform: "scale(1.02)",
                    boxShadow: getShadow('medium'),
                    borderColor: colors.accent,
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                  py: 1.5,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                <Palette sx={{ mr: 1, fontSize: "1.1rem" }} />
                <span>Theme</span>
              </IconButton>
            </Box>
          </Tooltip>

          <ListItemButton
            onClick={() => {
              navigate("/settings");
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              color: colors.text,
              borderRadius: getBorderRadius('medium'),
              background: `${colors.accent}10`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: getShadow('light'),
              "&:hover": {
                background: `${colors.accent}20`,
                transform: "translateY(-1px)",
                boxShadow: getShadow('medium'),
              },
              "& .MuiListItemIcon-root": {
                color: colors.accent,
                minWidth: 48,
                transition: "transform 0.3s ease",
              },
              "&:hover .MuiListItemIcon-root": {
                transform: "scale(1.1)",
              },
            }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText 
              primary="Settings"
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: 500,
                  fontSize: "0.95rem",
                },
              }}
            />
          </ListItemButton>
        </Stack>
      </Box>
    </>
  );

  // Desktop Sidebar - Permanent
  if (!isMobile) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: isTablet ? drawerWidth * 0.9 : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isTablet ? drawerWidth * 0.9 : drawerWidth,
            boxSizing: "border-box",
            background: getGradient(),
            borderRight: `2px solid ${colors.accent}60`,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            boxShadow: getShadow('strong'),
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Mobile Sidebar - Temporary
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: spacing.md,
          background: getGradient(),
          borderBottom: `2px solid ${colors.accent}60`,
          position: "sticky",
          top: 0,
          zIndex: 1200,
          boxShadow: getShadow('medium'),
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          minHeight: mobileHeaderHeight,
        }}
      >
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            color: colors.accent,
            background: `${colors.accent}15`,
            border: `1px solid ${colors.accent}30`,
            transition: "all 0.3s ease",
            "&:hover": {
              background: `${colors.accent}25`,
              transform: "scale(1.05)",
            },
          }}
        >
          <Menu />
        </IconButton>
        <Box
          sx={{
            color: colors.accent,
            fontWeight: 700,
            fontSize: "1.2rem",
            textShadow: `0 2px 4px ${colors.primary}40`,
          }}
        >
          Menu
        </Box>
        <Box sx={{ width: 48 }} />
      </Box>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: mobileDrawerWidth,
            boxSizing: "border-box",
            background: getGradient(),
            borderRight: `2px solid ${colors.accent}60`,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            boxShadow: getShadow('strong'),
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: spacing.sm,
          }}
        >
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              color: colors.accent,
              background: `${colors.accent}15`,
              border: `1px solid ${colors.accent}30`,
              transition: "all 0.3s ease",
              "&:hover": {
                background: `${colors.accent}25`,
                transform: "scale(1.05)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        {drawerContent}
      </Drawer>
    </>
  );
}
