import mongoose from "mongoose"

const exerciseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
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

exerciseSchema.index({ userId: 1, date: -1 })

const Exercise = mongoose.model("Exercise", exerciseSchema)
export default Exercise