const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: String,
  dob: Date,
  phone: String,
  email: String,
  address: String,
  photoUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
