const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, enum: ["Personal", "Study", "Event/Project"], default: "Personal" },
  issuedBy: String,
  date: Date,
  fileUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Certificate", CertificateSchema);
