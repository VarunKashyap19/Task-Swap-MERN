const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  rewardCredits: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["open", "claimed", "completed"], default: "open" },
  submissionLink: String,
  rated: { type: Boolean, default: false }
});

module.exports = mongoose.model("Task", taskSchema);
