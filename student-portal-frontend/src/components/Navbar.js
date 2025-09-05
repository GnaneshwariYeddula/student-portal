import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const logout = () => {
    localStorage.removeItem("token");
    closeMenu();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          Student Portal
        </Typography>

        <Box>
          <IconButton color="inherit" onClick={() => navigate("/profile")}>
            <AccountCircle />
          </IconButton>

          <IconButton color="inherit" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            <MenuItem onClick={() => { closeMenu(); navigate("/profile"); }}>Profile</MenuItem>
            <MenuItem onClick={() => { closeMenu(); navigate("/marks"); }}>Marks</MenuItem>
            <MenuItem onClick={() => { closeMenu(); navigate("/certificates"); }}>Certificates</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
