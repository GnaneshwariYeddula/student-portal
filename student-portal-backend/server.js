// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const marksRoutes = require("./routes/marks");
const certificatesRoutes = require("./routes/certificates");
const uploadRoutes = require("./routes/uploadroutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/upload/", uploadRoutes);

// connect DB and start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("DB connect error:", err.message || err);
    process.exit(1);
  });
