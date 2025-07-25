import express from "express";
import { body } from "express-validator";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
} from "../controllers/course-controller.js";

const router = express.Router();

// Validation rules
const courseValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category")
    .optional()
    .isIn([
      "Programming",
      "Web Development",
      "Data Science",
      "Mobile Development",
      "DevOps",
      "Design",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("level")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Invalid level"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("topics").optional().isArray().withMessage("Topics must be an array"),
  body("topics.*.title")
    .if(body("topics").exists())
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Topic title must be between 3 and 200 characters"),
  body("topics.*.subTopics")
    .if(body("topics").exists())
    .optional()
    .isArray()
    .withMessage("Sub-topics must be an array"),
  body("topics.*.subTopics.*.title")
    .if(body("topics.*.subTopics").exists())
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Sub-topic title must be between 3 and 200 characters"),
  body("topics.*.subTopics.*.videoContent")
    .if(body("topics.*.subTopics").exists())
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage(
      "Video content description must be between 10 and 1000 characters"
    ),
];

// Routes
router.route("/").get(getCourses).post(courseValidation, createCourse);
router.get("/stats", getCourseStats);
router
  .route("/:id")
  .get(getCourse)
  .put(courseValidation, updateCourse)
  .delete(deleteCourse);

export default router;
