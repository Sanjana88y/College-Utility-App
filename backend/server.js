const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES FIXED 🔥
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/school", require("./routes/school"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});