import mongoose from "mongoose"

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [
      {
        type: String, // SubTopic IDs
      },
    ],
    lastAccessedLesson: {
      type: String,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumPurchasedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for efficient queries
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true })

// Virtual for progress percentage
userProgressSchema.virtual("progressPercentage").get(() => {
  // This would need to be calculated with course data
  return 0
})

userProgressSchema.set("toJSON", { virtuals: true })

const UserProgress = mongoose.model("UserProgress", userProgressSchema)

export default UserProgress
