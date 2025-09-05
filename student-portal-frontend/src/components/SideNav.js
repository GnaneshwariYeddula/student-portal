import React from "react";
import { Drawer, Toolbar, List, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link as RouterLink } from "react-router-dom";

const drawerWidth = 260;

export default function SideNav({ open }) {
  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton component={RouterLink} to="/dashboard/profile">
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        <ListItemButton component={RouterLink} to="/dashboard/marks">
          <ListItemIcon><SchoolIcon /></ListItemIcon>
          <ListItemText primary="Marks" />
        </ListItemButton>

        <ListItemButton component={RouterLink} to="/dashboard/certificates">
          <ListItemIcon><DescriptionIcon /></ListItemIcon>
          <ListItemText primary="Certificates" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
