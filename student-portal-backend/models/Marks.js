const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  grade: { type: String, required: true },
  credits: {
    type: Number,
    required: true,
    default: 0,          // default 0 if not provided
    get: (v) => parseFloat(v.toFixed(1)), // ensures decimal display
  },
});

const SemesterSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  subjects: [SubjectSchema],
  cgpa: { type: Number, default: 0 },
});

const MarksSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  semesters: [SemesterSchema],
});

module.exports = mongoose.model("Marks", MarksSchema);
