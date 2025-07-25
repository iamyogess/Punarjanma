import mongoose from "mongoose"

const subTopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Sub-topic title is required"],
      trim: true,
      maxlength: [200, "Sub-topic title cannot exceed 200 characters"],
    },
    videoContent: {
      type: String,
      required: [true, "Video content description is required"],
      trim: true,
      maxlength: [1000, "Video content description cannot exceed 1000 characters"],
    },
    videoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    duration: {
      type: Number,
      default: 15,
      min: [1, "Duration must be at least 1 minute"],
    },
    order: {
      type: Number,
      default: 0,
    },
    tier: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  {
    timestamps: true,
  },
)

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Topic title is required"],
      trim: true,
      maxlength: [200, "Topic title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Topic description cannot exceed 500 characters"],
    },
    subTopics: [subTopicSchema],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Course title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: [1000, "Course description cannot exceed 1000 characters"],
    },
    topics: [topicSchema],
    instructor: {
      type: String,
      default: "Admin",
      trim: true,
    },
    category: {
      type: String,
      enum: ["Programming", "Web Development", "Data Science", "Mobile Development", "DevOps", "Design", "Other"],
      default: "Other",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    premiumPrice: {
      type: Number,
      default: 1000,
      min: [0, "Premium price cannot be negative"],
    },
    tier: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
      min: [0, "Enrollment count cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    thumbnail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for total duration
courseSchema.virtual("totalDuration").get(function () {
  return this.topics.reduce((total, topic) => {
    return (
      total +
      topic.subTopics.reduce((topicTotal, subTopic) => {
        return topicTotal + (subTopic.duration || 15)
      }, 0)
    )
  }, 0)
})

// Virtual for total lessons
courseSchema.virtual("totalLessons").get(function () {
  return this.topics.reduce((total, topic) => {
    return total + topic.subTopics.length
  }, 0)
})

// Virtual for free lessons count
courseSchema.virtual("freeLessons").get(function () {
  return this.topics.reduce((total, topic) => {
    return total + topic.subTopics.filter((st) => st.tier === "free").length
  }, 0)
})

// Virtual for premium lessons count
courseSchema.virtual("premiumLessons").get(function () {
  return this.topics.reduce((total, topic) => {
    return total + topic.subTopics.filter((st) => st.tier === "premium").length
  }, 0)
})

// Ensure virtual fields are serialized
courseSchema.set("toJSON", { virtuals: true })

const Course = mongoose.model("Course", courseSchema)

export default Course
