import { validationResult } from "express-validator";
import Course from "../models/course-model.js";

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      level,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (level && level !== "all") {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Only show published courses for public access
    query.isPublished = true;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const courses = await Course.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-__v");

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select("-__v");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Get course error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
const createCourse = async (req, res) => {
  try {
    const cleanDataRecursively = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(cleanDataRecursively);
      } else if (obj && typeof obj === 'object') {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
          if (key !== '_id') {
            cleaned[key] = cleanDataRecursively(value);
          }
        }
        return cleaned;
      }
      return obj;
    };

    const cleanData = cleanDataRecursively(req.body);
    
    console.log('Cleaned data for creation:', JSON.stringify(cleanData, null, 2)); // Debug log

    const course = await Course.create(cleanData);

    res.status(201).json({
      success: true,
      data: course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error("Create course error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
const updateCourse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("Update course error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};

// @desc    Get course statistics
// @route   GET /api/courses/stats
// @access  Private (Admin)
const getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Course.aggregate([
      { $group: { _id: null, total: { $sum: "$enrollmentCount" } } },
    ]);

    const categoryStats = await Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const levelStats = await Course.aggregate([
      { $group: { _id: "$level", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalCourses,
        publishedCourses,
        totalEnrollments: totalEnrollments[0]?.total || 0,
        categoryStats,
        levelStats,
      },
    });
  } catch (error) {
    console.error("Get course stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching course statistics",
      error: error.message,
    });
  }
};

export {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
};
