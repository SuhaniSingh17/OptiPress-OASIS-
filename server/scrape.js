// server/scrape.js
import { chromium } from "playwright";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

const login_url =
  "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp";
const dashboard_url =
  "https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp";

const user_id = process.env.USER_ID;
const password = process.env.PASSWORD;

export async function scrapeAttendance() {
  const browser = await chromium.launch({ headless: true }); // true = background mode
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to SRM login page...");
  await page.goto(login_url, { waitUntil: "domcontentloaded" });

  if (!user_id || !password) throw new Error("Missing credentials in .env");

  // Fill login details
  await page.fill('input[id="login"]', user_id);
  await page.fill('input[id="passwd"]', password);
  await page.keyboard.press("Enter");

  console.log("Logging in...");
  await page.waitForURL(`${dashboard_url}*`, { timeout: 60000 });
  await page.waitForTimeout(2000);

  // Navigate to attendance page
  await page.locator("a#listId9").click();
  await page.waitForSelector("#divMainDetails", { timeout: 30000 });
  await page.waitForTimeout(2000);

  const html = await page.content();
  const $ = cheerio.load(html);

  const table = $("table.table");
  const courses = [];

  table.find("tr").slice(1).each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 8) return;

    try {
      const code = $(cells[0]).text().trim();
      const description = $(cells[1]).text().trim();
      const max_hours_scraped = parseInt($(cells[2]).text().trim());
      const attended_hours = parseInt($(cells[3]).text().trim());
      const total_percentage = parseFloat($(cells[7]).text().trim());

      const missable_classes = max_hours_scraped - attended_hours;

      courses.push({
        code,
        description,
        max_hours_scraped,
        attended_hours,
        missable_classes,
        total_percentage,
      });
    } catch (err) {
      console.error("Parsing error:", err);
    }
  });

  await browser.close();

  // Compute overall attendance
  const total_attended = courses.reduce(
    (sum, c) => sum + c.attended_hours,
    0
  );
  const total_max = courses.reduce(
    (sum, c) => sum + c.max_hours_scraped,
    0
  );

  const overall_attendance =
    total_max > 0 ? (total_attended / total_max) * 100 : 0;

  console.log("✅ Scraping complete!");
  return { overall_attendance, courses };
}
