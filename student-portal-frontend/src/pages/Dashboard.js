import { useState } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Paper
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";

import Profile from "./Profile";
import Marks from "./Marks";
import Certificates from "./Certificates";

const drawerWidth = 230;

export default function Dashboard() {
  const [selected, setSelected] = useState("dashboard");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "linear-gradient(90deg,#004e92,#000428)" }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Student Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            pt: 8,
            background: "linear-gradient(180deg, #1976d2, #64b5f6)",
            color: "white",
          },
        }}
      >
        <List>
          <ListItemButton component={Link} to="/dashboard" selected={location.pathname === "/dashboard"} onClick={() => setSelected("dashboard")}>
            <ListItemIcon><DashboardIcon sx={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItemButton>
          <ListItemButton component={Link} to="/dashboard/profile" selected={location.pathname.includes("/dashboard/profile")} onClick={() => setSelected("profile")}>
            <ListItemIcon><PersonIcon sx={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton component={Link} to="/dashboard/marks" selected={location.pathname.includes("/dashboard/marks")} onClick={() => setSelected("marks")}>
            <ListItemIcon><SchoolIcon sx={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Marks" />
          </ListItemButton>
          <ListItemButton component={Link} to="/dashboard/certificates" selected={location.pathname.includes("/dashboard/certificates")} onClick={() => setSelected("certificates")}>
            <ListItemIcon><DescriptionIcon sx={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Certificates" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon sx={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
        <Routes>
          <Route
            path="/"
            element={
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  Welcome 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Use the menu to manage your Profile, Marks, and Certificates.
                </Typography>
              </Paper>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route path="marks" element={<Marks />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Box>
    </Box>
  );
}
