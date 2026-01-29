import mongoose from "mongoose";
import Course from "./models/Course.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/paarshEdu";

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB Connected");

    await Course.deleteMany({});

    const sampleCourses = [
      {
        name: "AWS Internship Program",
        category: "cloud",
        description: "Master AWS cloud services from basics to advanced.",
        duration: "180 hrs",
        fee: 12000,
        enrolledCount: 45,
        status: "active"
      },
      {
        name: "Full Stack Web Development",
        category: "web-development",
        description: "Learn MERN stack with real-world projects.",
        duration: "200 hrs",
        fee: 15000,
        enrolledCount: 60,
        status: "active"
      },
      {
        name: "C & C++ Programming",
        category: "programming",
        description: "Build strong programming fundamentals.",
        duration: "150 hrs",
        fee: 8000,
        enrolledCount: 30,
        status: "active"
      },
      {
        name: "Java Development",
        category: "programming",
        description: "Core Java + Advanced Java + Spring Boot.",
        duration: "180 hrs",
        fee: 10000,
        enrolledCount: 55,
        status: "active"
      },
      {
        name: "Python for Data Science",
        category: "data",
        description: "Python, NumPy, Pandas, and ML basics.",
        duration: "160 hrs",
        fee: 11000,
        enrolledCount: 40,
        status: "active"
      }
    ];

    await Course.insertMany(sampleCourses);
    console.log("Sample courses inserted successfully");

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

seedDB();
