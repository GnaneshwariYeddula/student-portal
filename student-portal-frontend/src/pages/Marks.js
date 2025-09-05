// src/pages/Marks.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Add, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  fetchMarks,
  addSemester,
  editSemester,
  deleteSemester,
  editSubject,
  deleteSubject,
} from "../api/api";

const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };

const calculateCGPA = (subjects) => {
  if (!subjects || subjects.length === 0) return "";
  let totalPoints = 0,
    totalCredits = 0;
  subjects.forEach((sub) => {
    const point = gradePoints[sub.grade?.toUpperCase()] || 0;
    const credit = parseFloat(sub.credits) || 0;
    totalPoints += point * credit;
    totalCredits += credit;
  });
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "";
};

const calculateSGPA = (semesters) => {
  if (!semesters || semesters.length === 0) return "";
  let totalPoints = 0,
    totalCredits = 0;
  semesters.forEach((sem) => {
    sem.subjects.forEach((sub) => {
      const point = gradePoints[sub.grade?.toUpperCase()] || 0;
      const credit = parseFloat(sub.credits) || 0;
      totalPoints += point * credit;
      totalCredits += credit;
    });
  });
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "";
};

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([{ subjectName: "", grade: "", credits: "" }]);
  const [editingSemesterId, setEditingSemesterId] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [tempSubject, setTempSubject] = useState({ subjectName: "", grade: "", credits: "" });
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadMarks();
  }, []);

  const loadMarks = async () => {
    try {
      const res = await fetchMarks();
      setMarks(res?.semesters || []);
    } catch (err) {
      console.error("Error fetching marks:", err);
      setMarks([]);
    }
  };

  const handleAddSubjectInput = () =>
    setSubjects([...subjects, { subjectName: "", grade: "", credits: "" }]);

  const handleChangeSubject = (i, field, value) => {
    const tmp = [...subjects];
    tmp[i][field] = value;
    setSubjects(tmp);
  };

  const handleRemoveSubjectInput = (i) => {
    const tmp = subjects.filter((_, idx) => idx !== i);
    setSubjects(tmp.length ? tmp : [{ subjectName: "", grade: "", credits: "" }]);
  };

  const handleSaveSemester = async () => {
    if (!semester) return alert("Please provide semester number");

    const formattedSubjects = subjects
      .filter((s) => s.subjectName.trim() !== "")
      .map((s) => ({
        subjectName: s.subjectName.trim(),
        grade: (s.grade || "").toUpperCase(),
        credits: parseFloat(s.credits) || 0,
      }));

    if (formattedSubjects.length === 0) return alert("Enter at least one valid subject");

    try {
      const semesterData = { semester: Number(semester), subjects: formattedSubjects };

      if (editingSemesterId) {
        await editSemester(editingSemesterId, semesterData);
      } else {
        await addSemester(semesterData);
      }

      setSemester("");
      setSubjects([{ subjectName: "", grade: "", credits: "" }]);
      setEditingSemesterId(null);

      loadMarks();
    } catch (err) {
      console.error(err);
      alert("Failed to save semester. Make sure all fields are correct.");
    }
  };

  const handleEditSemester = (sem) => {
    setSemester(sem.semester);
    setSubjects(
      sem.subjects.map((s) => ({
        subjectName: s.subjectName,
        grade: s.grade,
        credits: s.credits?.toString() || "0",
      }))
    );
    setEditingSemesterId(sem._id);
  };

  const handleDeleteSemester = async (semId) => {
    if (!window.confirm("Delete this semester?")) return;
    try {
      await deleteSemester(semId);
      loadMarks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete semester");
    }
  };

  const openEditDialog = (semId, sub) => {
    setEditingSubject({ semId, subId: sub._id });
    setTempSubject({
      subjectName: sub.subjectName,
      grade: sub.grade,
      credits: sub.credits?.toString() || "0",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubject(null);
    setTempSubject({ subjectName: "", grade: "", credits: "" });
  };

  const saveEditSubject = async () => {
    if (!editingSubject) return;
    try {
      await editSubject(editingSubject.semId, editingSubject.subId, {
        subjectName: tempSubject.subjectName,
        grade: tempSubject.grade.toUpperCase(),
        credits: parseFloat(tempSubject.credits) || 0,
      });
      handleCloseDialog();
      loadMarks();
    } catch (err) {
      console.error(err);
      alert("Failed to edit subject");
    }
  };

  const handleDeleteSubject = async (semId, subId) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      await deleteSubject(semId, subId);
      loadMarks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete subject");
    }
  };

  const sgpa = calculateSGPA(marks);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Marks / Grades
      </Typography>

      {/* Add/Edit Semester Form */}
      <Card sx={{ mb: 3, p: 2, backgroundColor: "#f9f9f9", boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingSemesterId ? "Edit Semester" : "Add New Semester"}
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Semester Number"
              fullWidth
              type="number"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="CGPA"
              fullWidth
              value={calculateCGPA(
                subjects.map((s) => ({ ...s, credits: parseFloat(s.credits) || 0 }))
              )}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        {subjects.map((sub, i) => (
          <Grid container spacing={2} mb={1} key={i}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Subject Name"
                fullWidth
                value={sub.subjectName}
                onChange={(e) => handleChangeSubject(i, "subjectName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Grade"
                fullWidth
                value={sub.grade}
                onChange={(e) => handleChangeSubject(i, "grade", e.target.value.toUpperCase())}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Credits"
                fullWidth
                type="number"
                inputProps={{ step: "0.1" }}
                value={sub.credits}
                onChange={(e) => handleChangeSubject(i, "credits", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <IconButton color="error" onClick={() => handleRemoveSubjectInput(i)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button startIcon={<Add />} onClick={handleAddSubjectInput} sx={{ mt: 1, mr: 2 }}>
          Add Subject
        </Button>
        <Button variant="contained" color="primary" onClick={handleSaveSemester} sx={{ mt: 1 }}>
          {editingSemesterId ? "Update Semester" : "Save Semester"}
        </Button>
      </Card>

      {/* Display Semesters */}
      {marks.map((sem) => (
        <Card key={sem._id} sx={{ mb: 2, maxWidth: 600, boxShadow: 3 }}>
          <CardContent>
            <Grid container justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1">
                Semester {sem.semester} - CGPA: {calculateCGPA(sem.subjects)}
              </Typography>
              <Box>
                <Button size="small" variant="outlined" onClick={() => handleEditSemester(sem)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => handleDeleteSemester(sem._id)}
                >
                  Delete
                </Button>
              </Box>
            </Grid>

            <Divider sx={{ mb: 1 }} />

            {sem.subjects.map((sub) => (
              <Grid
                container
                key={sub._id}
                alignItems="center"
                spacing={1}
                sx={{
                  py: 0.5,
                  px: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Grid item xs={6}>
                  <Typography variant="body2">{sub.subjectName}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" align="center">{sub.grade}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" align="center">{parseFloat(sub.credits).toFixed(1)}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton size="small" color="primary" onClick={() => openEditDialog(sem._id, sub)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteSubject(sem._id, sub._id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Overall SGPA */}
      {sgpa && (
        <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
          Overall SGPA: {sgpa}
        </Typography>
      )}

      {/* Edit Subject Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Subject Name"
            fullWidth
            value={tempSubject.subjectName}
            onChange={(e) => setTempSubject({ ...tempSubject, subjectName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Grade"
            fullWidth
            value={tempSubject.grade}
            onChange={(e) => setTempSubject({ ...tempSubject, grade: e.target.value.toUpperCase() })}
          />
          <TextField
            margin="dense"
            label="Credits"
            type="number"
            inputProps={{ step: "0.1" }}
            fullWidth
            value={tempSubject.credits}
            onChange={(e) => setTempSubject({ ...tempSubject, credits: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
          <Button onClick={saveEditSubject} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
