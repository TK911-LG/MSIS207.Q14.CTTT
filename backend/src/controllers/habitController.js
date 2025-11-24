import Habit from "../models/Habit.js"
import mongoose from "mongoose"

// POST /api/habits
// Auth: Bearer access token
// Body: { name:string, category?:string, goal?:number }
// Response: 201 { habit }
export const createHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { name, category, iconName = 'target', goal = 1 } = req.body || {}
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" })
    }

    const habit = await Habit.create({ userId, name, category, iconName, goal })
    return res.status(201).json({ habit })
  } catch (error) {
    console.error("Error in createHabit", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/habits
// Auth: Bearer access token
// Response: 200 { items, total }
export const listHabits = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const items = await Habit.find({ userId }).sort({ name: 1 })
    const total = await Habit.countDocuments({ userId })
    return res.status(200).json({ items, total })
  } catch (error) {
    console.error("Error in listHabits", error)
    res.status(500).json({ message: "System error" })
  }
}

// GET /api/habits/:id
// Auth: Bearer access token
// Response: 200 { habit }
export const getHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid habit id format" })
    }
    const habit = await Habit.findOne({ _id: id, userId })
    if (!habit) return res.status(404).json({ message: "Habit not found" })
    return res.status(200).json({ habit })
  } catch (error) {
    console.error("Error in getHabit", error)
    res.status(500).json({ message: "System error" })
  }
}

// PATCH /api/habits/:id
// Auth: Bearer access token
// Body: any of { name, category, goal }
// Response: 200 { habit }
export const updateHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid habit id format" })
    }
    const updates = {}
    const allowed = ["name", "category", "goal"]
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key]
    }

    const habit = await Habit.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
      runValidators: true,
    })
    if (!habit) return res.status(404).json({ message: "Habit not found" })
    return res.status(200).json({ habit })
  } catch (error) {
    console.error("Error in updateHabit", error)
    res.status(500).json({ message: "System error" })
  }
}

// DELETE /api/habits/:id
// Auth: Bearer access token
// Response: 204
export const deleteHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid habit id format" })
    }
    const result = await Habit.deleteOne({ _id: id, userId })
    if (!result.deletedCount) return res.status(404).json({ message: "Habit not found" })
    return res.sendStatus(204)
  } catch (error) {
    console.error("Error in deleteHabit", error)
    res.status(500).json({ message: "System error" })
  }
}

// POST /api/habits/:id/toggle
// Auth: Bearer access token
// Body: { date?:ISODate } — defaults to today; store as DateString
// Response: 200 { habit }
export const toggleHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid habit id format" })
    }
    const dateInput = req.body?.date ? new Date(req.body.date) : new Date()
    const dateStr = dateInput.toDateString()

    const habit = await Habit.findOne({ _id: id, userId })
    if (!habit) return res.status(404).json({ message: "Habit not found" })

    const exists = habit.completedDates.includes(dateStr)
    if (exists) {
      habit.completedDates = habit.completedDates.filter((d) => d !== dateStr)
    } else {
      habit.completedDates = [...habit.completedDates, dateStr]
    }
    await habit.save()
    return res.status(200).json({ habit })
  } catch (error) {
    console.error("Error in toggleHabit", error)
    res.status(500).json({ message: "System error" })
  }
}