import express from "express";
import { body, validationResult } from "express-validator";
import Course from "../models/course-model.js";

const router = express.Router();

// Validation rules
const subTopicValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Sub-topic title must be between 3 and 200 characters"),
  body("videoContent")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Video content description must be between 10 and 1000 characters"),
  body("videoUrl").optional().trim().isURL().withMessage("Video URL must be a valid URL"),
  body("duration").optional().isInt({ min: 1 }).withMessage("Duration must be at least 1 minute"),
  body("order").optional().isInt({ min: 0 }).withMessage("Order must be a non-negative integer"),
];

// Controller logic

const addSubTopic = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const topic = course.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ success: false, message: "Topic not found" });

    const newSubTopic = {
      title: req.body.title,
      videoContent: req.body.videoContent,
      videoUrl: req.body.videoUrl || "",
      duration: req.body.duration || 15,
      order: req.body.order || topic.subTopics.length,
    };

    topic.subTopics.push(newSubTopic);
    await course.save();

    res.status(201).json({
      success: true,
      data: topic.subTopics[topic.subTopics.length - 1],
      message: "Sub-topic added successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateSubTopic = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const topic = course.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ success: false, message: "Topic not found" });

    const subTopic = topic.subTopics.id(req.params.subTopicId);
    if (!subTopic) return res.status(404).json({ success: false, message: "Sub-topic not found" });

    if (req.body.title) subTopic.title = req.body.title;
    if (req.body.videoContent) subTopic.videoContent = req.body.videoContent;
    if (req.body.videoUrl !== undefined) subTopic.videoUrl = req.body.videoUrl;
    if (req.body.duration !== undefined) subTopic.duration = req.body.duration;
    if (req.body.order !== undefined) subTopic.order = req.body.order;

    await course.save();

    res.json({
      success: true,
      data: subTopic,
      message: "Sub-topic updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteSubTopic = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const topic = course.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ success: false, message: "Topic not found" });

    const subTopic = topic.subTopics.id(req.params.subTopicId);
    if (!subTopic) return res.status(404).json({ success: false, message: "Sub-topic not found" });

    subTopic.deleteOne();
    await course.save();

    res.json({ success: true, message: "Sub-topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Routes
router.post("/:courseId/:topicId", subTopicValidation, addSubTopic);
router.put("/:courseId/:topicId/:subTopicId", subTopicValidation, updateSubTopic);
router.delete("/:courseId/:topicId/:subTopicId", deleteSubTopic);

export default router;
