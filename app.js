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

/* DB */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

/* MIDDLEWARE */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

/* ROUTES */

// HOME
app.get("/", async (req, res) => {
  const courses = await Course.find({ status: "active" });
  res.render("index", { courses, page: "home" });
});

// COURSES LIST
app.get("/courses", async (req, res) => {
  const courses = await Course.find({ status: "active" });

  console.log("COURSES FROM DB 👉", courses); // 👈 ADD THIS

  res.render("courses", { courses });
});


// COURSE DETAIL
app.get("/course/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.send("Course not found");
  res.render("course-detail", { course });
});

// DEBUG (optional)
app.get("/debug-courses", async (req, res) => {
  res.json(await Course.find());
});

app.listen(3000, () =>
  console.log("🚀 http://localhost:3000")
);
