import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  duration: String,
  thumbnail: String,
  isActive: Boolean,
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
