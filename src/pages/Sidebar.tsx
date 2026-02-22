import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
  Tooltip,
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
  AssignmentTurnedIn,
  ManageAccounts,
  Close,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: "Dashboard", icon: <Dashboard />, path: "/" },
    { label: "Locations", icon: <LocationOn />, path: "/locations" },
    { label: "Subscribers", icon: <People />, path: "/subscribers" },
    { label: "Meters", icon: <Speed />, path: "/meters" },
    { label: "Meter Readings", icon: <Receipt />, path: "/meter-readings" },
    { label: "Invoices", icon: <Receipt />, path: "/invoices" },
    { label: "Tariffs", icon: <Receipt />, path: "/tariffs" },
    { label: "Payments", icon: <Payments />, path: "/payments" },
    { label: "Staff", icon: <ManageAccounts />, path: "/staff" },
    { label: "Collector Tasks", icon: <AssignmentTurnedIn />, path: "/collector-tasks" },
    { label: "Reports", icon: <BarChart />, path: "/reports" },
    { label: "Exchange Rate", icon: <Settings />, path: "/settings" },
    { label: "Ampere Pricing", icon: <Settings />, path: "/settings/ampere-pricing" }
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Tooltip title="Close sidebar">
          <IconButton size="small" onClick={onClose} aria-label="Close sidebar">
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <List sx={{ mt: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List>
        <ListItemButton onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
