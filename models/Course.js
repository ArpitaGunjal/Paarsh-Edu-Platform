import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: String,

    thumbnail: { type: String, required: true },
    introVideo: String,

    duration: { type: String, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true
    },

    languages: [String],
    certificate: { type: Boolean, default: false },

    fee: { type: Number, required: true },

    enrolledCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "inactive", "full"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
