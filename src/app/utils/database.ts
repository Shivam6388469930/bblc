import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://agraharishivam6388:05UqlgRfgWwwHzaA@bblc.awm1fy7.mongodb.net/bblc?retryWrites=true&w=majority&appName=bblc");

    console.log(" MongoDB connected successfully");

  } catch (error) {
    console.error(" MongoDB connection error:", error);
  }
};
