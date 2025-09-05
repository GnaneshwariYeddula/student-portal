import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/api";   // ✅ using your api.js login
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sn, setSn] = useState({ open: false, msg: "", severity: "success" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password)
      return setSn({
        open: true,
        msg: "Fill all fields",
        severity: "warning",
      });

    try {
      const res = await login({ email, password }); // res = { token, user }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // ✅ show success first
      setSn({ open: true, msg: "Login successful", severity: "success" });

      // ✅ redirect after short delay so Snackbar is visible
      setTimeout(() => {
      window.location.href = "/dashboard/profile"; // ✅ hard redirect fixes stale state
    }, 800);

    } catch (err) {
      setSn({
        open: true,
        msg: err.response?.data?.message || "Login failed",
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
          <Typography variant="h4">Welcome Back</Typography>
          <Typography variant="body2">
            Sign in to access your student portal
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
          <Typography textAlign="center">
            Don’t have an account? <Link to="/register">Register</Link>
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
