import express from "express"
import { createJournal, listJournals, listAllJournals, getJournal, updateJournal, deleteJournal } from "../controllers/journalController.js"

const router = express.Router()

// Routes for Journal resource
// Base: /api/journals

// Create journal
// POST /api/journals
router.post("/", createJournal)

// List journals
// GET /api/journals
router.get("/", listJournals)

// List all journals
// GET /api/journals/all
router.get("/all", listAllJournals)

// Get journal by id
// GET /api/journals/:id
router.get("/:id", getJournal)

// Update journal
// PATCH /api/journals/:id
router.patch("/:id", updateJournal)

// Delete journal
// DELETE /api/journals/:id
router.delete("/:id", deleteJournal)

export default router