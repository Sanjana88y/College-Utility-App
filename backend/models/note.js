const mongoose = require("../db");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedBy: { type: String, default: "teacher" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", noteSchema);