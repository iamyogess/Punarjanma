import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
import Course from "../models/course-model.js"


const sampleCourses = [
  {
    title: "Python for Beginners",
    description:
      "Learn Python programming from scratch. This comprehensive course covers all the fundamentals you need to start your programming journey with hands-on projects and real-world examples.",
    category: "Programming",
    level: "Beginner",
    price: 0,
    instructor: "John Smith",
    tags: ["python", "programming", "beginner", "coding"],
    topics: [
      {
        title: "Introduction to Python",
        description: "Get started with Python programming language",
        subTopics: [
          {
            title: "What is Python?",
            videoContent:
              "Introduction to Python programming language and its applications in web development, data science, and automation",
            duration: 20,
          },
          {
            title: "Installing Python",
            videoContent: "Step-by-step guide to install Python on Windows, Mac, and Linux systems",
            duration: 15,
          },
          {
            title: "Python IDE Setup",
            videoContent: "Setting up development environment with VS Code and PyCharm",
            duration: 25,
          },
        ],
      },
      {
        title: "Variables and Data Types",
        description: "Learn about Python's basic data types and variables",
        subTopics: [
          {
            title: "Understanding Variables",
            videoContent: "Learn how to create and use variables in Python with naming conventions",
            duration: 18,
          },
          {
            title: "Numbers and Strings",
            videoContent: "Working with integers, floats, and string data types",
            duration: 22,
          },
          {
            title: "Lists and Dictionaries",
            videoContent: "Introduction to Python's most important data structures",
            duration: 30,
          },
        ],
      },
    ],
  },
  {
    title: "Web Development with React",
    description:
      "Master modern web development with React. Build interactive user interfaces and single-page applications using the most popular JavaScript library.",
    category: "Web Development",
    level: "Intermediate",
    price: 49.99,
    instructor: "Sarah Johnson",
    tags: ["react", "javascript", "web development", "frontend"],
    topics: [
      {
        title: "React Fundamentals",
        description: "Core concepts of React development",
        subTopics: [
          {
            title: "What is React?",
            videoContent: "Introduction to React library and component-based architecture",
            duration: 15,
          },
          {
            title: "Setting up React",
            videoContent: "Create your first React application using Create React App and Vite",
            duration: 20,
          },
        ],
      },
    ],
  },
  {
    title: "Data Science with Python",
    description:
      "Dive into data science using Python. Learn data analysis, visualization, and machine learning with popular libraries like Pandas, NumPy, and Scikit-learn.",
    category: "Data Science",
    level: "Advanced",
    price: 79.99,
    instructor: "Dr. Michael Chen",
    tags: ["data science", "python", "machine learning", "pandas", "numpy"],
    topics: [
      {
        title: "Data Science Basics",
        description: "Introduction to data science concepts",
        subTopics: [
          {
            title: "What is Data Science?",
            videoContent: "Introduction to data science and its applications",
            duration: 25,
          },
        ],
      },
    ],
  },
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_DB_URL)
    console.log("Connected to MongoDB")

    // Clear existing courses
    await Course.deleteMany({})
    console.log("Cleared existing courses")

    // Insert sample courses
    const courses = await Course.insertMany(sampleCourses)
    console.log(`Inserted ${courses.length} sample courses`)

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
