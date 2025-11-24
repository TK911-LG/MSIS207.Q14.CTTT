import express from "express"
import { createExercise, listExercises, listAllExercises, getExercise, updateExercise, deleteExercise } from "../controllers/exerciseController.js"

const router = express.Router()

// Routes for Exercise resource
// Base: /api/exercises

// Create exercise
// POST /api/exercises
router.post("/", createExercise)

// List exercises
// GET /api/exercises
router.get("/", listExercises)

// List all exercises
// GET /api/exercises/all
router.get("/all", listAllExercises)

// Get exercise by id
// GET /api/exercises/:id
router.get("/:id", getExercise)

// Update exercise
// PATCH /api/exercises/:id
router.patch("/:id", updateExercise)

// Delete exercise
// DELETE /api/exercises/:id
router.delete("/:id", deleteExercise)

export default router