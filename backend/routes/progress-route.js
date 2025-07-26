import express from "express"
import Course from "../models/course-model.js"
import { authenticateUser } from "../middleware/auth-middleware.js"
import UserModel from "../models/user-model.js"
import UserProgress from "../models/user-process-model.js"

const router = express.Router()

router.get("/courses/:courseId/progress", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params
    const progress = await UserProgress.findOne({ userId, courseId })
    if (!progress) {
      return res.json({
        success: true,
        data: {
          courseId,
          completedLessons: [],
          progressPercentage: 0,
          enrolledAt: null,
          isPremium: false,
        },
      })
    }
    res.json({
      success: true,
      data: progress,
    })
  } catch (error) {
    console.error("Get progress error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching progress",
      error: error.message,
    })
  }
})

// Update user progress
router.post("/courses/:courseId/progress", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params
    const { subTopicId, completed } = req.body
    const updateOperation = completed
      ? { $addToSet: { completedLessons: subTopicId } }
      : { $pull: { completedLessons: subTopicId } }
    const progress = await UserProgress.findOneAndUpdate(
      { userId, courseId },
      {
        ...updateOperation,
        lastAccessedLesson: subTopicId,
      },
      { upsert: true, new: true },
    )
    res.json({
      success: true,
      data: progress,
      message: "Progress updated successfully",
    })
  } catch (error) {
    console.error("Update progress error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating progress",
      error: error.message,
    })
  }
})

// Enroll in course
router.post("/courses/:courseId/enroll", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params
    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }
    // Create or update enrollment
    const progress = await UserProgress.findOneAndUpdate(
      { userId, courseId },
      {
        enrolledAt: new Date(),
      },
      { upsert: true, new: true },
    )

    // Update user's enrolledCourses
    await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } }, // Add courseId to enrolledCourses array
      { new: true },
    )

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 },
    })
    res.json({
      success: true,
      data: progress,
      message: "Enrolled successfully",
    })
  } catch (error) {
    console.error("Enrollment error:", error)
    res.status(500).json({
      success: false,
      message: "Error enrolling in course",
      error: error.message,
    })
  }
})
export default router
