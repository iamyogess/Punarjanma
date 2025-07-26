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
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth-middleware.js";

const router = express.Router();

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
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Each topic title must be between 3 and 200 characters"),

  body("topics.*.subTopics")
    .optional()
    .isArray()
    .withMessage("Sub-topics must be an array"),

  body("topics.*.subTopics.*.title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Each sub-topic title must be between 3 and 200 characters"),

  body("topics.*.subTopics.*.videoContent")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Video content must be between 10 and 1000 characters"),
];

// Routes
router.get("/", authenticateUser, getCourses);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  courseValidation,
  createCourse
);
router.get("/stats", getCourseStats);
router.get("/:id", authenticateUser, getCourse);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  updateCourse
);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteCourse);

export default router;
