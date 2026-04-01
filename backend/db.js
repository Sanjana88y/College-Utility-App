const mongoose = require("mongoose");

const DB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ccllg";

mongoose
  .connect(DB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.warn("MongoDB connection failed, API still works in-memory:", err.message));

module.exports = mongoose;