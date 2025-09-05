// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { Paper, Grid, Avatar, TextField, Button, Typography, Stack, Fade } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import { fetchProfile, updateProfile, uploadProfilePhoto } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", dob: "", phone: "", email: "", address: "", photoUrl: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const res = await fetchProfile();
      setProfile(res || {});
    } catch (err) {
      console.error("Load profile error:", err);
      setProfile({});
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile(profile);
      alert("Profile saved");
      loadProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file");
    try {
      setLoading(true);
      await uploadProfilePhoto(file);
      alert("Photo uploaded");
      setFile(null);
      loadProfile();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}>My Profile</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Avatar src={profile.photoUrl} sx={{ width: 150, height: 150, mx: "auto", mb: 2 }} />
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
                {file?.name || "Choose"}
                <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Button>
              <Button variant="contained" onClick={handleUpload} disabled={loading}>Upload</Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <TextField label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />
              <TextField label="DOB" type="date" value={profile.dob ? profile.dob.slice(0,10) : ""} InputLabelProps={{ shrink: true }} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
              <TextField label="Mobile" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              <TextField label="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <TextField label="Address" value={profile.address} multiline minRows={2} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
              <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSave} disabled={loading}>Save Profile</Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Fade>
  );
}
