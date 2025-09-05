import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/api";  // ✅ fixed import
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sn, setSn] = useState({ open: false, msg: "", severity: "success" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password)
      return setSn({
        open: true,
        msg: "Fill all fields",
        severity: "warning",
      });

    try {
      const res = await register({ name, email, password }); // res = { token, user }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setSn({ open: true, msg: "Registration successful", severity: "success" });
      setTimeout(() => navigate("/dashboard/profile"), 800);
    } catch (err) {
      setSn({
        open: true,
        msg: err.response?.data?.message || "Registration failed",
        severity: "error",
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", minHeight: "100vh", alignItems: "center" }}
    >
      <Paper sx={{ width: "100%", p: 4, borderRadius: 3 }}>
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography variant="h4">Create Account</Typography>
          <Typography variant="body2">
            Register to access your student portal
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
          <Typography textAlign="center">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={sn.open}
        autoHideDuration={3000}
        onClose={() => setSn({ ...sn, open: false })}
      >
        <Alert severity={sn.severity}>{sn.msg}</Alert>
      </Snackbar>
    </Container>
  );
}
