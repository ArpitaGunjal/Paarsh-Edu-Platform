import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Course from "./models/Course.js";
import CourseContent from "./models/CourseContent.js";
import Category from "./models/Category.js";   // ✅ ADD THIS

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ================= DB ================= */

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Mongo error:", err));

/* ================= MIDDLEWARE ================= */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

/* HOME */
app.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ status: "active" })
      .populate("category");

    const categories = await Category.find({ status: "active" });

    res.render("index", {
      courses,      // ✅ THIS WAS MISSING
      categories,
      page: "home"
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});


app.get("/api/courses/by-category/:categoryId", async (req, res) => {
  try {
    const courses = await Course.find({
      category: req.params.categoryId,
      status: "active"
    }).populate("category");

    res.json(courses);

  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});



/* COURSES LIST */
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find({ status: "active" })
      .populate("category");

    console.log("COURSES FROM DB 👉", courses);

    res.render("courses", { courses });

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});


/* COURSE DETAIL (IMPORTANT FIX) */
app.get("/course/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("category");

    if (!course) return res.send("Course not found");

    const contents = await CourseContent.find({
      course: course._id,
      isPublished: true
    })
      .sort({ sectionOrder: 1, lectureOrder: 1 });

    res.render("course-detail", {
      course,
      contents
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});


/* DEBUG */
app.get("/debug-courses", async (req, res) => {
  res.json(await Course.find().populate("category"));
});


app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});
