import Exercise from "../models/Exercise.js"
import mongoose from "mongoose"

// POST /api/exercises
// Auth: Bearer access token
// Body: { type:string, duration:number, date?:ISODate }
// Response: 201 { exercise }
export const createExercise = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { type, duration, date } = req.body || {}
    if (!type || typeof type !== "string") {
      return res.status(400).json({ message: "type is required" })
    }
    if (typeof duration !== "number") {
      return res.status(400).json({ message: "duration is required and must be a number" })
    }

    const exercise = await Exercise.create({
      userId,
      type,
      duration,
      date: date ? new Date(date) : new Date(),
    })
    return res.status(201).json({ exercise })
  } catch (error) {
    console.error("Error in createExercise", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/exercises
// Auth: Bearer access token
// Query: from?:ISODate, to?:ISODate, limit?:number, page?:number
// Response: 200 { items, total }
export const listExercises = async (req, res) => {
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
        Exercise.find(q).sort({ date: -1, _id: -1 }),
        Exercise.countDocuments(q),
      ])
    } else {
      const lim = Math.max(1, Math.min(Number(limit) || 50, 200))
      const skip = Math.max(0, (Number(page) || 1) - 1) * lim
      ;[items, total] = await Promise.all([
        Exercise.find(q).sort({ date: -1, _id: -1 }).skip(skip).limit(lim),
        Exercise.countDocuments(q),
      ])
    }
    return res.status(200).json({ items, total })
  } catch (error) {
    console.error("Error in listExercises", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/exercises/all
// Auth: Bearer access token
// Response: 200 { items, total }
export const listAllExercises = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const q = { userId }
    const [items, total] = await Promise.all([
      Exercise.find(q).sort({ date: -1, _id: -1 }),
      Exercise.countDocuments(q),
    ])
    return res.status(200).json({ items, total })
  } catch (error) {
    console.error("Error in listAllExercises", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/exercises/:id
// Auth: Bearer access token
// Response: 200 { exercise }
export const getExercise = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid exercise id format" })
    }
    const exercise = await Exercise.findOne({ _id: id, userId })
    if (!exercise) return res.status(404).json({ message: "Exercise not found" })
    return res.status(200).json({ exercise })
  } catch (error) {
    console.error("Error in getExercise", error)
    res.status(500).json({ message: "System error" })
  }
}

// PATCH /api/exercises/:id
// Auth: Bearer access token
// Body: any of { type, duration, date }
// Response: 200 { exercise }
export const updateExercise = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid exercise id format" })
    }
    const updates = {}
    const allowed = ["type", "duration", "date"]
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key]
    }
    if ("date" in updates) updates.date = new Date(updates.date)

    const exercise = await Exercise.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
      runValidators: true,
    })
    if (!exercise) return res.status(404).json({ message: "Exercise not found" })
    return res.status(200).json({ exercise })
  } catch (error) {
    console.error("Error in updateExercise", error)
    res.status(500).json({ message: "System error" })
  }
}

// DELETE /api/exercises/:id
// Auth: Bearer access token
// Response: 204
export const deleteExercise = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid exercise id format" })
    }
    const result = await Exercise.deleteOne({ _id: id, userId })
    if (!result.deletedCount) return res.status(404).json({ message: "Exercise not found" })
    return res.sendStatus(204)
  } catch (error) {
    console.error("Error in deleteExercise", error)
    res.status(500).json({ message: "System error" })
  }
}