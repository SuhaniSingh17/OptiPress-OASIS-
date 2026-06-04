// import express from "express";
// import cors from "cors";
// import * as dotenv from "dotenv";
// import { chromium } from "playwright";
// import * as cheerio from "cheerio";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const loginUrl =
//   "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp";

// function scrapeAttendance(html) {
//   const $ = cheerio.load(html);
//   const table = $("table.table");
//   const attendanceData = [];

//   if (table.length) {
//     const rows = table.find("tr").slice(1);
//     rows.each((_, row) => {
//       const cells = $(row).find("td");
//       if (cells.length < 8) return;

//       try {
//         const course = {
//           code: $(cells[0]).text().trim(),
//           description: $(cells[1]).text().trim(),
//           max_hours_scraped: parseInt($(cells[2]).text().trim(), 10),
//           attended_hours: parseInt($(cells[3]).text().trim(), 10),
//           absent_hours: parseFloat($(cells[4]).text().trim()),
//           total_percentage: parseFloat($(cells[7]).text().trim()),
//         };

//         course.missable_classes =
//           course.max_hours_scraped - course.attended_hours;
//         attendanceData.push(course);
//       } catch (err) {
//         console.error("Parsing error:", err.message);
//       }
//     });
//   }

//   return attendanceData;
// }

// /**
//  * 🧠 Express route: Launch SRM portal & wait for manual login
//  */
// app.get("/launch", async (req, res) => {
//   console.log("🚀 Launching SRM portal...");

//   const browser = await chromium.launch({ headless: false, slowMo: 50 });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   try {
//     // Step 1: Open SRM portal for manual login
//     await page.goto(loginUrl, { timeout: 120000 });
//     console.log("✅ SRM login page opened. Please log in manually...");

//     // Step 2: Wait until the user finishes logging in
//     await page.waitForNavigation({
//       waitUntil: "networkidle",
//       timeout: 300000, // 5 minutes
//     });

//     console.log("🎯 Login detected. Fetching attendance data...");

//     // Step 3: Navigate to attendance page
//     await page.locator("a#listId9").click();
//     await page.waitForSelector("#divMainDetails", { timeout: 30000 });
//     await page.waitForTimeout(2000);

//     // Step 4: Scrape HTML content
//     const html = await page.content();
//     const attendanceData = scrapeAttendance(html);

//     await browser.close();

//     const totalAttended = attendanceData.reduce(
//       (a, c) => a + c.attended_hours,
//       0
//     );
//     const totalMax = attendanceData.reduce((a, c) => a + c.max_hours_scraped, 0);
//     const overallAttendance =
//       totalMax > 0 ? (totalAttended / totalMax) * 100 : 0.0;

//     console.log("✅ Attendance data fetched successfully.");

//     return res.json({
//       courses: attendanceData,
//       overall_attendance: overallAttendance.toFixed(2),
//     });
//   } catch (err) {
//     await browser.close();
//     console.error("❌ Error:", err.message);
//     return res.status(500).json({
//       error: "Failed to fetch attendance. Please check login or network.",
//     });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Backend running at http://localhost:${PORT}`)
// );
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { chromium } from "playwright";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

// ---------------- CORS ----------------
const corsOptions = {
  origin: "http://localhost:3000", // frontend URL
  credentials: true,
};
app.use(cors(corsOptions));

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- MONGODB CONNECTION ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ---------------- USER MODEL ----------------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  studentId: { type: String, default: "" },
  major: { type: String, default: "" },
  year: { type: String, default: "" },
  phone: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);

// ---------------- AUTH ROUTES ----------------
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashed });
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "hvhbjnkmk",
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- USER PROFILE ROUTES ----------------

// Get user by email
app.get("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email }).select("-__v"); // exclude __v
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user by email
app.put("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  const updates = req.body;
  try {
    const user = await User.findOneAndUpdate({ email }, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ DELETE user by ID (for Settings page delete account)
app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- SRM ATTENDANCE SCRAPER ----------------
const loginUrl =
  "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp";

function scrapeAttendance(html) {
  const $ = cheerio.load(html);
  const table = $("table.table");
  const attendanceData = [];

  if (table.length) {
    const rows = table.find("tr").slice(1);
    rows.each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length < 8) return;

      try {
        const course = {
          code: $(cells[0]).text().trim(),
          description: $(cells[1]).text().trim(),
          max_hours_scraped: parseInt($(cells[2]).text().trim(), 10),
          attended_hours: parseInt($(cells[3]).text().trim(), 10),
          absent_hours: parseFloat($(cells[4]).text().trim()),
          total_percentage: parseFloat($(cells[7]).text().trim()),
        };
        course.missable_classes =
          course.max_hours_scraped - course.attended_hours;
        attendanceData.push(course);
      } catch (err) {
        console.error("Parsing error:", err.message);
      }
    });
  }

  return attendanceData;
}

app.get("/launch", async (req, res) => {
  console.log("🚀 Launching SRM portal...");
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(loginUrl, { timeout: 120000 });
    console.log("✅ SRM login page opened. Please log in manually...");

    await page.waitForNavigation({
      waitUntil: "networkidle",
      timeout: 300000,
    });

    console.log("🎯 Login detected. Fetching attendance data...");
    await page.locator("a#listId9").click();
    await page.waitForSelector("#divMainDetails", { timeout: 30000 });
    await page.waitForTimeout(2000);

    const html = await page.content();
    const attendanceData = scrapeAttendance(html);

    await browser.close();

    const totalAttended = attendanceData.reduce(
      (a, c) => a + c.attended_hours,
      0
    );
    const totalMax = attendanceData.reduce(
      (a, c) => a + c.max_hours_scraped,
      0
    );
    const overallAttendance =
      totalMax > 0 ? (totalAttended / totalMax) * 100 : 0.0;

    console.log("✅ Attendance data fetched successfully.");

    return res.json({
      courses: attendanceData,
      overall_attendance: overallAttendance.toFixed(2),
    });
  } catch (err) {
    await browser.close();
    console.error("❌ Error:", err.message);
    return res.status(500).json({
      error: "Failed to fetch attendance. Please check login or network.",
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);

