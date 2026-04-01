const express = require("express");
const Note = require("../models/note");
const router = express.Router();

// ADD NOTE (Teacher)
router.post("/add", async (req, res) => {
  const { title, content, postedBy } = req.body;

  if (!title || !content) {
    return res.status(400).json({ msg: "Title and content required" });
  }

  try {
    const note = new Note({ title, content, postedBy: postedBy || "teacher" });
    await note.save();
    res.json({ msg: "Note Added", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Could not add note" });
  }
});

// GET NOTES (Student)
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Could not fetch notes" });
  }
});

module.exports = router;