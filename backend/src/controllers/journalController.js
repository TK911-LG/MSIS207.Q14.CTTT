import Journal from "../models/Journal.js"
import mongoose from "mongoose"

// POST /api/journals
// Auth: Bearer access token
// Body: { content:string, prompt?:string, date?:ISODate }
// Response: 201 { journal }
export const createJournal = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { content, prompt, date } = req.body || {}
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "content is required" })
    }

    const journal = await Journal.create({
      userId,
      content,
      prompt,
      date: date ? new Date(date) : new Date(),
    })
    return res.status(201).json({ journal })
  } catch (error) {
    console.error("Error in createJournal", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/journals
// Auth: Bearer access token
// Query: from?:ISODate, to?:ISODate, limit?:number, page?:number
// Response: 200 { items, total }
export const listJournals = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { from, to, limit = 50, page = 1, all } = req.query
    const q = { userId }
    if (from || to) {
      q.date = {}
      if (from) q.date.$gte = new Date(from)
      if (to) q.date.$lte = new Date(to)
    }
    let items, total
    if (String(all).toLowerCase() === "true") {
      ;[items, total] = await Promise.all([
        Journal.find(q).sort({ date: -1, _id: -1 }),
        Journal.countDocuments(q),
      ])
    } else {
      const lim = Math.max(1, Math.min(Number(limit) || 50, 200))
      const skip = Math.max(0, (Number(page) || 1) - 1) * lim
      ;[items, total] = await Promise.all([
        Journal.find(q).sort({ date: -1, _id: -1 }).skip(skip).limit(lim),
        Journal.countDocuments(q),
      ])
    }
    return res.status(200).json({ items, total })
  } catch (error) {
    console.error("Error in listJournals", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/journals/all
// Auth: Bearer access token
// Response: 200 { items, total }
export const listAllJournals = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const q = { userId }
    const [items, total] = await Promise.all([
      Journal.find(q).sort({ date: -1, _id: -1 }),
      Journal.countDocuments(q),
    ])
    return res.status(200).json({ items, total })
  } catch (error) {
    console.error("Error in listAllJournals", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/journals/:id
// Auth: Bearer access token
// Response: 200 { journal }
export const getJournal = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid journal id format" })
    }
    const journal = await Journal.findOne({ _id: id, userId })
    if (!journal) return res.status(404).json({ message: "Journal not found" })
    return res.status(200).json({ journal })
  } catch (error) {
    console.error("Error in getJournal", error)
    res.status(500).json({ message: "System error" })
  }
}

// PATCH /api/journals/:id
// Auth: Bearer access token
// Body: any of { content, prompt, date }
// Response: 200 { journal }
export const updateJournal = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid journal id format" })
    }
    const updates = {}
    const allowed = ["content", "prompt", "date"]
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key]
    }
    if ("date" in updates) updates.date = new Date(updates.date)

    const journal = await Journal.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
      runValidators: true,
    })
    if (!journal) return res.status(404).json({ message: "Journal not found" })
    return res.status(200).json({ journal })
  } catch (error) {
    console.error("Error in updateJournal", error)
    res.status(500).json({ message: "System error" })
  }
}

// DELETE /api/journals/:id
// Auth: Bearer access token
// Response: 204
export const deleteJournal = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid journal id format" })
    }
    const result = await Journal.deleteOne({ _id: id, userId })
    if (!result.deletedCount) return res.status(404).json({ message: "Journal not found" })
    return res.sendStatus(204)
  } catch (error) {
    console.error("Error in deleteJournal", error)
    res.status(500).json({ message: "System error" })
  }
}