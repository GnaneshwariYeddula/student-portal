const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Marks = require("../models/Marks");

const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };

const calculateCGPA = (subjects) => {
  if (!subjects || subjects.length === 0) return 0;
  let totalPoints = 0, totalCredits = 0;
  subjects.forEach(sub => {
    const point = gradePoints[sub.grade?.toUpperCase()] || 0;
    const credit = parseFloat(sub.credits) || 0;
    totalPoints += point * credit;
    totalCredits += credit;
  });
  return totalCredits ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
};

const calculateSGPA = (semesters) => {
  if (!semesters || semesters.length === 0) return 0;
  let totalPoints = 0, totalCredits = 0;
  semesters.forEach(sem => {
    sem.subjects.forEach(sub => {
      const point = gradePoints[sub.grade?.toUpperCase()] || 0;
      const credit = parseFloat(sub.credits) || 0;
      totalPoints += point * credit;
      totalCredits += credit;
    });
  });
  return totalCredits ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
};

// GET all semesters
router.get("/", auth, async (req, res) => {
  try {
    const marks = await Marks.findOne({ user: req.userId });
    res.json(marks || { user: req.userId, semesters: [], sgpa: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ADD new semester
router.post("/semester", auth, async (req, res) => {
  try {
    const { semester, subjects } = req.body;
    const formattedSubjects = (subjects || []).map(s => ({
      subjectName: s.subjectName || "",
      grade: (s.grade || "").toUpperCase(),
      credits: parseFloat(s.credits) || 0
    }));

    const cgpa = calculateCGPA(formattedSubjects);
    let marks = await Marks.findOne({ user: req.userId });

    if (!marks) {
      marks = new Marks({
        user: req.userId,
        semesters: [{ semester, subjects: formattedSubjects, cgpa }],
      });
    } else {
      marks.semesters.push({ semester, subjects: formattedSubjects, cgpa });
    }

    marks.sgpa = calculateSGPA(marks.semesters);
    await marks.save();
    res.json(marks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// EDIT semester
router.put("/semester/:semesterId", auth, async (req, res) => {
  try {
    const { semester, subjects } = req.body;
    const marks = await Marks.findOne({ user: req.userId });
    if (!marks) return res.status(404).send("Marks not found");

    const sem = marks.semesters.id(req.params.semesterId);
    if (!sem) return res.status(404).send("Semester not found");

    if (semester) sem.semester = semester;
    if (subjects) {
      sem.subjects = subjects.map(s => ({
        subjectName: s.subjectName || "",
        grade: (s.grade || "").toUpperCase(),
        credits: parseFloat(s.credits) || 0
      }));
    }

    sem.cgpa = calculateCGPA(sem.subjects);
    marks.sgpa = calculateSGPA(marks.semesters);
    await marks.save();
    res.json(marks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// DELETE semester
router.delete("/semester/:semesterId", auth, async (req, res) => {
  try {
    const marks = await Marks.findOne({ user: req.userId });
    if (!marks) return res.status(404).send("Marks not found");

    marks.semesters = marks.semesters.filter(s => s._id.toString() !== req.params.semesterId);
    marks.sgpa = calculateSGPA(marks.semesters);
    await marks.save();
    res.json(marks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ADD subject
router.post("/semester/:semesterId/subject", auth, async (req, res) => {
  try {
    const { subjectName, grade, credits } = req.body;
    const marks = await Marks.findOne({ user: req.userId });
    if (!marks) return res.status(404).send("Marks not found");

    const sem = marks.semesters.id(req.params.semesterId);
    if (!sem) return res.status(404).send("Semester not found");

    sem.subjects.push({
      subjectName: subjectName || "",
      grade: (grade || "").toUpperCase(),
      credits: parseFloat(credits) || 0
    });

    sem.cgpa = calculateCGPA(sem.subjects);
    marks.sgpa = calculateSGPA(marks.semesters);
    await marks.save();
    res.json(marks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// EDIT subject
router.put("/semester/:semesterId/subject/:subjectId", auth, async (req, res) => {
  try {
    const { subjectName, grade, credits } = req.body;
    const marks = await Marks.findOne({ user: req.userId });
    if (!marks) return res.status(404).send("Marks not found");

    const sem = marks.semesters.id(req.params.semesterId);
    if (!sem) return res.status(404).send("Semester not found");

    const sub = sem.subjects.id(req.params.subjectId);
    if (!sub) return res.status(404).send("Subject not found");

    sub.subjectName = subjectName || sub.subjectName;
    sub.grade = (grade || sub.grade).toUpperCase();
    sub.credits = parseFloat(credits) || 0;

    sem.cgpa = calculateCGPA(sem.subjects);
    marks.sgpa = calculateSGPA(marks.semesters);
    await marks.save();
    res.json(marks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// DELETE subject
router.delete("/semester/:semesterId/subject/:subjectId", auth, async (req, res) => {
  try {
    const marks = await Marks.findOne({ user: req.userId });
    if (!marks) return res.status(404).send("Marks not found");

    const sem = marks.semesters.id(req.params.semesterId);
    if (!sem) return res.status(404).send("Semester not found");

    sem.subjects = sem.subjects.filter(s => s._id.toString() !== req.params.subjectId);
    sem.cgpa = calculateCGPA(sem.subjects);
    marks.sgpa = calculateSGPA(marks.semesters);
    await marks.save();
    res.json(marks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
