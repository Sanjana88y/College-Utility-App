const express = require("express");
const router = express.Router();

// In-memory storage for demo mode (no DB required, keeps code fast and safe)
const notes = [];
const assignments = [];
const notices = [];
const timetables = [];
const results = [];
const events = [];
const attendances = [];
const fees = [];

// STUDENT + TEACHER + ADMIN resources
router.get("/notes", (req, res) => {
  if (!notes.length) {
    notes.push({ id: 1, title: "Welcome Notes", content: "This note shows student updates.", postedBy: "admin" });
  }
  res.json(notes);
});
router.post("/notes", (req, res) => {
  const { title, content, postedBy } = req.body;
  if (!title || !content) return res.status(400).json({ msg: "Title and content required" });
  notes.push({ id: notes.length + 1, title, content, postedBy: postedBy || "teacher", createdAt: new Date() });
  res.json({ msg: "Note published" });
});

router.get("/assignments", (req, res) => {
  if (!assignments.length) {
    assignments.push({ id: 1, title: "Math Homework", description: "Solve 10 problems", dueDate: "2026-04-05", postedBy: "teacher" });
  }
  res.json(assignments);
});
router.post("/assignments", (req, res) => {
  const { title, description, dueDate, postedBy } = req.body;
  if (!title || !description) return res.status(400).json({ msg: "Title and description required" });
  assignments.push({ id: assignments.length + 1, title, description, dueDate: dueDate || null, postedBy: postedBy || "teacher", createdAt: new Date() });
  res.json({ msg: "Assignment added" });
});

router.get("/notices", (req, res) => {
  if (!notices.length) {
    notices.push({ id: 1, title: "Welcome", message: "Check the schedule every week", postedBy: "admin" });
  }
  res.json(notices);
});
router.post("/notices", (req, res) => {
  const { title, message, postedBy } = req.body;
  if (!title || !message) return res.status(400).json({ msg: "Title and message required" });
  notices.push({ id: notices.length + 1, title, message, postedBy: postedBy || "teacher", createdAt: new Date() });
  res.json({ msg: "Notice shared" });
});

router.get("/timetable", (req, res) => {
  if (!timetables.length) {
    timetables.push({ id: 1, day: "Monday", subject: "Math", startTime: "09:00", endTime: "10:00" });
    timetables.push({ id: 2, day: "Tuesday", subject: "Science", startTime: "10:00", endTime: "11:00" });
  }
  res.json(timetables);
});
router.post("/timetable", (req, res) => {
  const { day, subject, startTime, endTime } = req.body;
  if (!day || !subject) return res.status(400).json({ msg: "Day and subject required" });
  timetables.push({ id: timetables.length + 1, day, subject, startTime: startTime || "TBD", endTime: endTime || "TBD" });
  res.json({ msg: "Timetable entry added" });
});

router.get("/results", (req, res) => {
  if (!results.length) {
    results.push({ id: 1, studentEmail: "student@example.com", subject: "Math", marks: 88, grade: "A" });
  }
  res.json(results);
});
router.post("/results", (req, res) => {
  const { studentEmail, subject, marks, grade } = req.body;
  if (!studentEmail || !subject || marks == null) return res.status(400).json({ msg: "studentEmail, subject, marks required" });
  results.push({ id: results.length + 1, studentEmail, subject, marks, grade: grade || "N/A", createdAt: new Date() });
  res.json({ msg: "Result entry added" });
});

router.get("/events", (req, res) => {
  if (!events.length) {
    events.push({ id: 1, title: "Orientation", description: "Welcome all students", date: new Date().toISOString().slice(0, 10) });
  }
  res.json(events);
});
router.post("/events", (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !description) return res.status(400).json({ msg: "Title and description required" });
  events.push({ id: events.length + 1, title, description, date: date || new Date().toISOString().slice(0, 10) });
  res.json({ msg: "Event posted" });
});

router.get("/attendance", (req, res) => {
  if (!attendances.length) {
    attendances.push({ id: 1, studentEmail: "student@example.com", status: "Present", date: new Date().toISOString().slice(0, 10) });
  }
  res.json(attendances);
});
router.post("/attendance", (req, res) => {
  const { studentEmail, status, date } = req.body;
  if (!studentEmail || !status) return res.status(400).json({ msg: "studentEmail and status required" });
  attendances.push({ id: attendances.length + 1, studentEmail, status, date: date || new Date().toISOString().slice(0, 10) });
  res.json({ msg: "Attendance recorded" });
});

router.get("/fees", (req, res) => {
  if (!fees.length) {
    fees.push({ id: 1, studentEmail: "student@example.com", amount: 950, paidAt: new Date().toISOString() });
  }
  res.json(fees);
});
router.post("/fees/pay", (req, res) => {
  const { studentEmail, amount } = req.body;
  if (!studentEmail || !amount) return res.status(400).json({ msg: "studentEmail and amount required" });
  fees.push({ id: fees.length + 1, studentEmail, amount, paidAt: new Date() });
  res.json({ msg: "Fees paid" });
});

module.exports = router;
