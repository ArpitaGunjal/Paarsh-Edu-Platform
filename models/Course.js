import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    fullDescription: {
      type: String,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    introVideo: {
      type: String,
    },

    /* ================= META DETAILS ================= */

    duration: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    languages: [
      {
        type: String,
        trim: true,
      },
    ],

    certificate: {
      type: Boolean,
      default: false,
    },

    /* ================= PRICING ================= */

    fee: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentType: {
      type: String,
      enum: ["one-time", "subscription"],
      default: "one-time",
    },

    accessType: {
      type: String,
      default: "Lifetime access",
    },

    /* ================= COURSE CONTENT ================= */

    courseIncludes: [
      {
        type: String,
        trim: true,
      },
    ],

    syllabusOverview: {
      type: String,
      trim: true,
    },

    syllabusTopics: [
      {
        type: String,
        trim: true,
      },
    ],

    syllabusFile: {
      type: String,
    },

    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ================= INSTRUCTOR ================= */

    instructor: {
      name: {
        type: String,
        trim: true,
      },
      bio: {
        type: String,
        trim: true,
      },
      designation: {
        type: String,
        trim: true,
      },
    },

    /* ================= CATEGORY ================= */

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ================= REVIEWS ================= */

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    /* ================= SYSTEM ================= */

    intakeLimit: {
      type: Number,
      default: 10,
      min: 1,
    },

    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "full"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
