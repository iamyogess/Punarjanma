import express from "express"
import { body, validationResult } from "express-validator"
import Course from "../models/course-model.js"

const router = express.Router()

// @desc    Add topic to course
// @route   POST /api/topics/:courseId
// @access  Private (Admin)
const addTopic = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const newTopic = {
      title: req.body.title,
      description: req.body.description || "",
      subTopics: req.body.subTopics || [],
      order: req.body.order || course.topics.length,
    }

    course.topics.push(newTopic)
    await course.save()

    res.status(201).json({
      success: true,
      data: course.topics[course.topics.length - 1],
      message: "Topic added successfully",
    })
  } catch (error) {
    console.error("Add topic error:", error)
    res.status(500).json({
      success: false,
      message: "Error adding topic",
      error: error.message,
    })
  }
}

// @desc    Update topic
// @route   PUT /api/topics/:courseId/:topicId
// @access  Private (Admin)
const updateTopic = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const topic = course.topics.id(req.params.topicId)
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      })
    }

    // Update topic fields
    if (req.body.title) topic.title = req.body.title
    if (req.body.description !== undefined) topic.description = req.body.description
    if (req.body.order !== undefined) topic.order = req.body.order

    await course.save()

    res.json({
      success: true,
      data: topic,
      message: "Topic updated successfully",
    })
  } catch (error) {
    console.error("Update topic error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating topic",
      error: error.message,
    })
  }
}

// @desc    Delete topic
// @route   DELETE /api/topics/:courseId/:topicId
// @access  Private (Admin)
const deleteTopic = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const topic = course.topics.id(req.params.topicId)
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      })
    }

    topic.deleteOne()
    await course.save()

    res.json({
      success: true,
      message: "Topic deleted successfully",
    })
  } catch (error) {
    console.error("Delete topic error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting topic",
      error: error.message,
    })
  }
}

// Validation rules
const topicValidation = [
  body("title").trim().isLength({ min: 3, max: 200 }).withMessage("Topic title must be between 3 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Topic description cannot exceed 500 characters"),
  body("order").optional().isInt({ min: 0 }).withMessage("Order must be a non-negative integer"),
]

// Routes
router.post("/:courseId", topicValidation, addTopic)
router.put("/:courseId/:topicId", topicValidation, updateTopic)
router.delete("/:courseId/:topicId", deleteTopic)

export default router
