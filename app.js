import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Course from "./models/Course.js";
import CourseContent from "./models/CourseContent.js";
import Category from "./models/Category.js";
import Blog from "./models/Blog.js";  // ✅ ADD THIS
import Lecture from "./models/lecture.js";
import Assignment from "./models/Assignment.js";
import Test from "./models/Test.js";
import Enquiry from "./models/Enquiry.js";


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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ✅ ADD THIS for JSON parsing

/* ================= ROUTES ================= */

/* HOME */
app.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ status: "active" })
      .populate("category");
    const categories = await Category.find({ status: "active" });
    res.render("index", {
      courses,
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

    const query = req.query.q || "";
    const selectedCategory = req.query.category || null;

    const filter = {};

    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }

    if (selectedCategory) {
      filter.category = selectedCategory;
    }

    const courses = await Course
      .find(filter)
      .populate("category")
      .lean();

    const categories = await Category.find().lean();

    const popularCourses = await Course
      .find()
      .sort({ enrolledCount: -1 })
      .limit(5)
      .lean();

    res.render("courses", {
      courses,
      categories,
      popularCourses,
      query,
      selectedCategory
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading courses page");
  }
});


/* COURSE DETAIL */
app.get("/courses/:id", async (req, res) => {
  try {

    const course = await Course
      .findById(req.params.id)
      .populate("category")
      .lean();

    if (!course) {
      return res.status(404).send("Course not found");
    }

    const contents = await CourseContent
      .find({ course: course._id })
      .sort({ order: 1 })
      .lean();

    const lectures = await Lecture
      .find({ course: course._id })
      .lean();

    const demoLectures = lectures.filter(l => l.isPreview === true);

    const assignments = await Assignment
      .find({ course: course._id })
      .lean();

    const tests = await Test
      .find({ course: course._id })
      .lean();

    res.render("course-detail", {
      course,
      contents,
      lectures,
      demoLectures,   // ✅ ADD THIS
      assignments,
      tests
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading course details");
  }
});


// BLOG ROUTES
// ====================================

app.get('/__checkblogs', async (req, res) => {
  const blogs = await Blog.find();
  res.json({
    count: blogs.length,
    blogs
  });
});


// GET - All Blogs Page
app.get('/blogs', async (req, res) => {
    try {

        // ❌ removed .lean()
        const blogs = await Blog.find({ published: true })
            .sort({ createdAt: -1 });

        res.render('blogs', { 
            blogs,
            page: 'blogs'
        });

    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).render('error', { 
            message: 'Failed to load blogs',
            error
        });
    }
});


// GET - Single Blog Detail Page
app.get('/blogs/:id', async (req, res) => {
    try {

        // ❌ removed .lean()
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).render('error', { 
                message: 'Blog not found' 
            });
        }

        // Increment views
        await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        // ❌ removed .lean()
        const blogs = await Blog.find({ published: true })
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('blog-details', { 
            blog,
            blogs,
            page: 'blogs'
        });

    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).render('error', { 
            message: 'Failed to load blog',
            error
        });
    }
});


// POST - Add Comment to Blog
app.post('/blogs/:id/comment', async (req, res) => {
    try {

        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog not found' 
            });
        }

        blog.comments.push({
            name,
            email,
            message,
            date: new Date()
        });

        await blog.save();

        res.redirect(`/blogs/${req.params.id}`);

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add comment',
            error: error.message 
        });
    }
});



// ====================================
// ADMIN BLOG MANAGEMENT ROUTES
// ====================================


// GET - Blog Management Page (Admin)
app.get('/admin/blogs', async (req, res) => {
    try {

        // ❌ removed .lean()
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.render('admin/blogManagement', { blogs });

    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).send('Error loading blogs');
    }
});


// GET - Add Blog Page (Admin)
app.get('/admin/blogs/add', (req, res) => {
    res.render('admin/add-blog');
});


// POST - Create New Blog (Admin)
app.post('/admin/blogs/add', async (req, res) => {
    try {

        const { title, excerpt, content, image, author, category, tags, published } = req.body;

        const newBlog = new Blog({
            title,
            excerpt,
            content,
            image,
            author: author || 'Admin',
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            published: published === 'on' || published === true
        });

        await newBlog.save();
        res.redirect('/admin/blogs');

    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).send('Error creating blog');
    }
});


// GET - Edit Blog Page (Admin)
app.get('/admin/blogs/edit/:id', async (req, res) => {
    try {

        // ❌ removed .lean()
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        res.render('admin/edit-blog', { blog });

    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).send('Error loading blog');
    }
});


// POST - Update Blog (Admin)
app.post('/admin/blogs/edit/:id', async (req, res) => {
    try {

        const { title, excerpt, content, image, author, category, tags, published } = req.body;

        await Blog.findByIdAndUpdate(req.params.id, {
            title,
            excerpt,
            content,
            image,
            author,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            published: published === 'on' || published === true,
            updatedAt: Date.now()
        });

        res.redirect('/admin/blogs');

    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).send('Error updating blog');
    }
});


// DELETE - Delete Blog (Admin)
app.delete('/admin/blogs/:id', async (req, res) => {
    try {

        await Blog.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Blog deleted successfully' });

    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, message: 'Error deleting blog' });
    }
});
app.get("/contact", (req, res) => {
    res.render("contact", { page: "contact" });
});



app.post("/enquiries", async (req, res) => {

    try{

        const enquiry = new Enquiry({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            source: req.body.source || "contact",
            message: req.body.message
        });

        await enquiry.save();

        res.json({ success:true });

    }catch(err){
        console.error(err);
        res.status(500).json({ success:false });
    }

});


/* ================= START SERVER ================= */

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
  console.log("📝 Blogs available at http://localhost:3000/blogs");
  console.log("⚙️  Admin panel at http://localhost:3000/admin/blogs");
});
