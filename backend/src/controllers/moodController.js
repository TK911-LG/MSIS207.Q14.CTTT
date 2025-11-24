import Mood from "../models/Mood.js"
import mongoose from "mongoose"

// POST /api/moods
// Auth: Bearer access token
// Body: { score:number(1-10), note?:string, tags?:string[], sleep?:number, activity?:string, date?:ISODate }
// Response: 201 { mood }
export const createMood = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { score, note, tags = [], sleep = 0, activity, date } = req.body || {}
    if (typeof score !== "number") {
      return res.status(400).json({ message: "score is required and must be a number" })
    }

    const mood = await Mood.create({
      userId,
      score,
      note,
      tags,
      sleep,
      activity,
      date: date ? new Date(date) : new Date(),
    })

    return res.status(201).json({ mood })
  } catch (error) {
    console.error("Error in createMood", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/moods
// Auth: Bearer access token
// Query: from?:ISODate, to?:ISODate, tags?:comma-separated, limit?:number, page?:number
// Response: 200 { items, total }
export const listMoods = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { from, to, tags, limit = 50, page = 1, all } = req.query
    const q = { userId }
    if (from || to) {
      q.date = {}
      if (from) q.date.$gte = new Date(from)
      if (to) q.date.$lte = new Date(to)
    }
    if (tags) {
      const arr = String(tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      if (arr.length) q.tags = { $in: arr }
    }

    let items, total
    if (String(all).toLowerCase() === "true") {
      ;[items, total] = await Promise.all([
        Mood.find(q).sort({ date: -1, _id: -1 }),
        Mood.countDocuments(q),
      ])
    } else {
      const lim = Math.max(1, Math.min(Number(limit) || 50, 200))
      const skip = Math.max(0, (Number(page) || 1) - 1) * lim
      ;[items, total] = await Promise.all([
        Mood.find(q).sort({ date: -1, _id: -1 }).skip(skip).limit(lim),
        Mood.countDocuments(q),
      ])
    }

    return res.status(200).json({ items, total })
  } catch (error) {
    console.error("Error in listMoods", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/moods/all
// Auth: Bearer access token
// Response: 200 { items, total }
export const listAllMoods = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const q = { userId }
    const [items, total] = await Promise.all([
      Mood.find(q).sort({ date: -1, _id: -1 }),
      Mood.countDocuments(q),
    ])
    return res.status(200).json({ items, total })
  } catch (error) {
    console.error("Error in listAllMoods", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/moods/:id
// Auth: Bearer access token
// Response: 200 { mood }
export const getMood = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid mood id format" })
    }
    const mood = await Mood.findOne({ _id: id, userId })
    if (!mood) return res.status(404).json({ message: "Mood not found" })

    return res.status(200).json({ mood })
  } catch (error) {
    console.error("Error in getMood", error)
    res.status(500).json({ message: "System error" })
  }
}

// PATCH /api/moods/:id
// Auth: Bearer access token
// Body: any of { score, note, tags, sleep, activity, date }
// Response: 200 { mood }
export const updateMood = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid mood id format" })
    }
    const updates = {}
    const allowed = ["score", "note", "tags", "sleep", "activity", "date"]
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key]
    }
    if ("date" in updates) updates.date = new Date(updates.date)

    const mood = await Mood.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
      runValidators: true,
    })
    if (!mood) return res.status(404).json({ message: "Mood not found" })

    return res.status(200).json({ mood })
  } catch (error) {
    console.error("Error in updateMood", error)
    res.status(500).json({ message: "System error" })
  }
}

// DELETE /api/moods/:id
// Auth: Bearer access token
// Response: 204
export const deleteMood = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid mood id format" })
    }
    const result = await Mood.deleteOne({ _id: id, userId })
    if (!result.deletedCount) return res.status(404).json({ message: "Mood not found" })

    return res.sendStatus(204)
  } catch (error) {
    console.error("Error in deleteMood", error)
    res.status(500).json({ message: "System error" })
  }
}