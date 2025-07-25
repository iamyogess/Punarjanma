import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./configs/connect-db.js";
import authRoute from "./routes/auth-route.js";
import {
  errorResponseHandler,
  invalidPathHandler,
} from "./middleware/error-handler.js";

const PORT = process.env.PORT;

const app = express();
const allowedOrigin = process.env.FRONTEND_URL;

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

app.use("/api/auth/v1", authRoute);

app.get("/", (req, res) => {
  app.json({
    message: "hellooooooooooo",
  });
});

// error middlewares
app.use(invalidPathHandler);
app.use(errorResponseHandler);

app.listen(PORT, () => {
  console.info(`Server started at port http://localhost:${PORT}`);
});
