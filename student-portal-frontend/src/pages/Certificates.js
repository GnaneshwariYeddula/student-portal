// src/pages/Certificates.js
import React, { useEffect, useState } from "react";
import { Paper, Typography, Stack, TextField, Button, MenuItem, Grid, IconButton, Fade } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchCertificates, addCertificate, deleteCertificate, uploadCertificateFile } from "../api/api";
import { useNavigate } from "react-router-dom";

const categories = ["Personal", "Study", "Event/Project"];

export default function Certificates() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", category: "Personal", issuedBy: "", date: "" });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { loadCertificates(); }, []);

  const loadCertificates = async () => {
    try {
      const res = await fetchCertificates();
      setList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setList([]);
    }
  };

  const handleAdd = async () => {
    if (!form.name) return alert("Provide certificate name");
    try {
      const created = await addCertificate(form);
      if (file) await uploadCertificateFile(created._id, file);
      setForm({ name: "", category: "Personal", issuedBy: "", date: "" });
      setFile(null);
      loadCertificates();
    } catch (err) {
      alert("Failed to add certificate");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete certificate?")) return;
    try { await deleteCertificate(id); loadCertificates(); } catch { alert("Failed to delete"); }
  };

  const handleFileChange = async (id, f) => {
    if (!f) return;
    try {
      await uploadCertificateFile(id, f);
      loadCertificates();
    } catch { alert("Upload failed"); }
  };

  return (
    <Fade in>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}>Certificates</Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Issued By" value={form.issuedBy} onChange={(e) => setForm({ ...form, issuedBy: e.target.value })} />
          <TextField type="date" label="Date" InputLabelProps={{ shrink: true }} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Button component="label" startIcon={<UploadFileIcon />}>
            {file ? file.name : "Choose File"}
            <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0])} />
          </Button>
          <Button variant="contained" onClick={handleAdd}>Add</Button>
        </Stack>

        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item xs={12} md={4} key={cat}>
              <Typography variant="h6">{cat}</Typography>
              {(list.filter(c => c.category === cat) || []).map(c => (
                <Paper key={c._id} sx={{ p: 1, mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 2 }}>
                  <div>
                    <Typography sx={{ fontWeight: 600 }}>{c.name}</Typography>
                    <Typography variant="caption">{c.issuedBy} {c.date ? `• ${new Date(c.date).toLocaleDateString()}` : ""}</Typography>
                    {c.fileUrl && <div style={{ marginTop: "4px" }}>
                      <a href={c.fileUrl} target="_blank" rel="noopener noreferrer">View</a> | 
                      <a href={c.fileUrl} download style={{ marginLeft: "8px" }}>Download</a>
                    </div>}
                  </div>
                  <div>
                    <input id={`file-${c._id}`} type="file" style={{ display: "none" }} onChange={(e) => handleFileChange(c._id, e.target.files?.[0])} />
                    <label htmlFor={`file-${c._id}`}><Button component="span" size="small">Replace File</Button></label>
                    <IconButton onClick={() => handleDelete(c._id)} color="error"><DeleteIcon /></IconButton>
                  </div>
                </Paper>
              ))}
            </Grid>
          ))}
        </Grid>

      </Paper>
    </Fade>
  );
}
