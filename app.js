import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import Course from "./models/Course.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* -------------------- DATABASE -------------------- */
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));

/* -------------------- MIDDLEWARE -------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

/* -------------------- ROUTES -------------------- */

// Home Page
app.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.render("index", { courses });
  } catch (err) {
    console.error(err);
    res.render("index", { courses: [] });
  }
});

// Courses Page
app.get("/courses", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category
      ? { category, isActive: true }
      : { isActive: true };

    const courses = await Course.find(filter);
    const categories = await Course.distinct("category");

    res.render("courses", {
      courses,
      categories,
      selectedCategory: category || ""
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Course Detail Page
app.get("/course/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    res.render("course-detail", { course });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
