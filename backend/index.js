import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./configs/connect-db.js";
import { errorResponseHandler, invalidPathHandler } from "./middleware/error-handler.js";
import authRoute from "./routes/auth-route.js";
import courseRoutes from "./routes/course-route.js";
import topicRoutes from "./routes/topicRoute.js";
import subTopicRoutes from "./routes/subTopicRoute.js";
import paymentRoutes from "./routes/payment-route.js";
import progressRoutes from "./routes/progress-route.js";
import { authenticateUser, authorizeRoles } from "./middleware/auth-middleware.js";

const PORT = process.env.PORT || 8000;
const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

connectDB();

// Routes
app.use("/api/auth/v1", authRoute);

// Course routes
app.use("/api/courses", courseRoutes);
// Other protected routes
app.use("/api/topics", authenticateUser, topicRoutes);
app.use("/api/subtopics", authenticateUser, subTopicRoutes);
app.use("/api/payments", authenticateUser, paymentRoutes);
app.use("/api", authenticateUser, progressRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "E-Learning Platform API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/v1",
      courses: "/api/courses",
      topics: "/api/topics",
      subtopics: "/api/subtopics",
      payments: "/api/payments",
      progress: "/api",
    },
  });
});

// Error handlers
app.use(invalidPathHandler);
app.use(errorResponseHandler);

app.listen(PORT, () => {
  console.info(`🚀 Server started at http://localhost:${PORT}`);
  console.info(`📚 E-Learning Platform API is ready!`);
});
