const mongoose = require("../db");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  approved: { type: Boolean, default: true }
});

module.exports = mongoose.model("User", userSchema);