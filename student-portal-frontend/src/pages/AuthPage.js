import React, { useState } from "react";
import { Container, Paper, Tabs, Tab, TextField, Button, Box } from "@mui/material";
import { registerUser, loginUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const doRegister = async () => {
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      alert("Registered. Please login.");
      setTab(0);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  const doLogin = async () => {
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      const token = res.data.token;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      navigate("/dashboard/profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Paper sx={{ p: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tab === 0 ? (
            <>
              <TextField label="Email" name="email" fullWidth margin="normal" value={form.email} onChange={onChange} />
              <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={form.password} onChange={onChange} />
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={doLogin}>Login</Button>
            </>
          ) : (
            <>
              <TextField label="Full name" name="name" fullWidth margin="normal" value={form.name} onChange={onChange} />
              <TextField label="Email" name="email" fullWidth margin="normal" value={form.email} onChange={onChange} />
              <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={form.password} onChange={onChange} />
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={doRegister}>Register</Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
