import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    source: {
      type: String,
      enum: ["course", "contact", "homepage"],
      required: true
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null
    },

    courseName: {
      type: String,
      default: null
    },

    message: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["new", "contacted", "enrolled", "closed"],
      default: "new"
    },

    adminRemark: {
      type: String,
      default: ""
    },

    contactedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
