import mongoose from "mongoose";

const courseContentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    /* ================= SECTION ================= */

    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },

    sectionOrder: {
      type: Number,
      default: 0,
    },

    /* ================= LECTURE ================= */

    lectureTitle: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    subTopic: {
      type: String,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    lectureType: {
      type: String,
      enum: ["video", "live"],
      required: true,
    },

    videoUrl: {
      type: String,
      required: function () {
        return this.lectureType === "video";
      },
    },

    liveClass: {
      meetingLink: {
        type: String,
      },
      scheduledAt: {
        type: Date,
      },
      duration: {
        type: String,
      },
    },

    lectureOrder: {
      type: Number,
      default: 0,
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CourseContent = mongoose.model("CourseContent", courseContentSchema);
export default CourseContent;
