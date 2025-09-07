const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const User = require("../models/User");
const Rating = require("../models/Rating");

const router = express.Router();

// Middleware: Verify Token
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

// Create task
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, rewardCredits } = req.body;
    const user = await User.findById(req.user.id);
    if (user.credits < rewardCredits) return res.status(400).json({ error: "Not enough credits" });

    user.credits -= rewardCredits;
    await user.save();

    const task = new Task({ title, description, rewardCredits, createdBy: user._id });
    await task.save();

    res.json({ message: "Task created", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all tasks
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "name email")
      .populate("claimedBy", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Claim task
router.post("/claim/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.status !== "open") return res.status(400).json({ error: "Cannot claim" });
    task.status = "claimed";
    task.claimedBy = req.user.id;
    await task.save();
    res.json({ message: "Task claimed", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Submit task
router.post("/submit/:id", authMiddleware, async (req, res) => {
  try {
    const { submissionLink } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task || task.claimedBy.toString() !== req.user.id) return res.status(400).json({ error: "Cannot submit" });

    task.submissionLink = submissionLink;
    task.status = "completed";
    await task.save();

    res.json({ message: "Task submitted", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rate a Task (1-5 scale)
router.post("/rate/:id", authMiddleware, async (req, res) => {
  try {
    let { rating, feedback } = req.body;

    rating = Number(rating);
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.status !== "completed") return res.status(400).json({ error: "Task not completed yet" });
    if (task.rated) return res.status(400).json({ error: "Task already rated" });
    if (task.createdBy.toString() !== req.user.id) return res.status(403).json({ error: "Only creator can rate" });

    const worker = await User.findById(task.claimedBy);

    // Credit calculation
    const creditEarned = (task.rewardCredits * rating) / 5;
    worker.credits += creditEarned;
    await worker.save();

    // Mark task as rated
    task.rated = true;
    await task.save();

    // Save rating
    const newRating = new Rating({
      task: task._id,
      rater: req.user.id,
      ratee: worker._id,
      rating,      // actual rating 1-5
      feedback
    });
    await newRating.save();

    res.json({ message: "Rating submitted", rating: newRating });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get user ratings
router.get("/ratings/:userId", async (req, res) => {
  try {
    const ratings = await Rating.find({ ratee: req.params.userId })
      .populate("rater", "name email");
    res.json(ratings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Dispute
router.post("/dispute/:id", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.createdBy.toString() !== req.user.id && task.claimedBy.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    // Here you can save disputes in DB if needed
    res.json({ message: "Dispute registered", taskId: task._id, reason });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
