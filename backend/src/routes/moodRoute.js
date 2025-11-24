import express from "express"
import { createMood, listMoods, listAllMoods, getMood, updateMood, deleteMood } from "../controllers/moodController.js"

const router = express.Router()

// Routes for Mood resource
// Base: /api/moods

// Create mood
// POST /api/moods
router.post("/", createMood)

// List moods
// GET /api/moods
router.get("/", listMoods)

// List all moods
// GET /api/moods/all
router.get("/all", listAllMoods)

// Get mood by id
// GET /api/moods/:id
router.get("/:id", getMood)

// Update mood
// PATCH /api/moods/:id
router.patch("/:id", updateMood)

// Delete mood
// DELETE /api/moods/:id
router.delete("/:id", deleteMood)

export default router
