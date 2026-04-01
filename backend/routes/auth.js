const router = require("express").Router();
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      // For development/testing, all registrations are approved immediately.
      // Later, change this to false for students/teachers to enforce admin approval.
      approved: true
    });
    await newUser.save();
    res.json({ msg: "Registered Successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error registering user", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) return res.status(401).json({ msg: "Invalid credentials" });
  if (!user.approved) return res.status(403).json({ msg: "Your account is pending approval" });

  res.json({ msg: "Success", user });
});

// ✅ ADMIN - GET ALL USERS
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ ADMIN - GET PENDING USERS
router.get("/pending", async (req, res) => {
  const pendingUsers = await User.find({ approved: false });
  res.json(pendingUsers);
});

// ✅ ADMIN - APPROVE USER
router.patch("/approve/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  user.approved = true;
  await user.save();
  res.json({ msg: "User approved" });
});

module.exports = router;