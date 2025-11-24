import express from "express"
import { createHabit, listHabits, getHabit, updateHabit, deleteHabit, toggleHabit } from "../controllers/habitController.js"

const router = express.Router()

// Routes for Habit resource
// Base: /api/habits

// Create habit
// POST /api/habits
router.post("/", createHabit)

// List habits
// GET /api/habits
router.get("/", listHabits)

// List all habits (same as list)
// GET /api/habits/all
router.get("/all", listHabits)

// Get habit by id
// GET /api/habits/:id
router.get("/:id", getHabit)

// Update habit
// PATCH /api/habits/:id
router.patch("/:id", updateHabit)

// Delete habit
// DELETE /api/habits/:id
router.delete("/:id", deleteHabit)

// Toggle habit completion on a date
// POST /api/habits/:id/toggle
router.post("/:id/toggle", toggleHabit)

export default router