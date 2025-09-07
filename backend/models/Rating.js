const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  rater: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 }, // 1-5 scale
  feedback: String,
});

module.exports = mongoose.model("Rating", ratingSchema);
