import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.info("Connected to database!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
