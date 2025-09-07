const mongoose = require("mongoose");

const DisputeSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  against: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Dispute", DisputeSchema);
