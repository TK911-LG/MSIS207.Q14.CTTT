import mongoose from "mongoose"

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    iconName: {
      type: String,
      trim: true,
      default: 'target',
    },
    goal: {
      type: Number,
      min: 1,
      default: 1,
    },
    completedDates: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

habitSchema.index({ userId: 1, name: 1 })

const Habit = mongoose.model("Habit", habitSchema)
export default Habit