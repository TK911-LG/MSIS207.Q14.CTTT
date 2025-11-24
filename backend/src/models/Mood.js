import mongoose from "mongoose"

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    note: {
      type: String,
      maxlength: 1000,
    },
    tags: {
      type: [String],
      default: [],
    },
    sleep: {
      type: Number,
      min: 0,
      max: 24,
      default: 0,
    },
    activity: {
      type: String,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

moodSchema.index({ userId: 1, date: -1 })

const Mood = mongoose.model("Mood", moodSchema)
export default Mood