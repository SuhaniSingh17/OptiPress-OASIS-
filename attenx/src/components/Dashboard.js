import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import logo from '../img/Logo.png';

const Dashboard = () => {
  const [overallAttendance, setOverallAttendance] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Added for search functionality

  // Fetch Attendance Data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        // Check localStorage first
        const savedData = localStorage.getItem("attendanceData");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setCourses(parsed.courses || []);
          setOverallAttendance(parseFloat(parsed.overall_attendance) || 0);
          setLoading(false);
          return;
        }

        // Fetch from backend (triggers SRM login)
        const res = await fetch("https://optipress-oasis.onrender.com/launch");
        if (!res.ok) throw new Error("Failed to fetch attendance data");

        const data = await res.json();
        localStorage.setItem("attendanceData", JSON.stringify(data));

        setCourses(data.courses || []);
        setOverallAttendance(parseFloat(data.overall_attendance) || 0);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch attendance. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Animate loader bar width
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.width = `${overallAttendance}%`;
  }, [overallAttendance]);

  // Calculate alert count (subjects below 78%)
  const alertCount = courses.filter((course) => course.total_percentage < 78).length;

  // Re-login
  const handleRelogin = async () => {
    try {
      setLoading(true);
      localStorage.removeItem("attendanceData");

      const res = await fetch("https://optipress-oasis.onrender.com/launch");
      if (!res.ok) throw new Error("Failed to fetch new data from SRM portal");

      const data = await res.json();
      localStorage.setItem("attendanceData", JSON.stringify(data));

      setCourses(data.courses || []);
      setOverallAttendance(parseFloat(data.overall_attendance) || 0);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to re-login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section id="content">
        {/* NAVBAR */}
        <nav>
          <i className="bx bx-menu"></i>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-input">
              <input
                type="search"
                placeholder="Search subject or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // ✅ updates searchTerm
              />
              <button type="submit" className="search-btn">
                <i className="bx bx-search"></i>
              </button>
            </div>
          </form>

          <a href="/calendar" className="notification">
            <i className="bx bxs-bell"></i>
            <span className="num">
              {(() => {
                const savedEvents = JSON.parse(localStorage.getItem("calendarEvents") || "[]");
                return savedEvents.length;
              })()}
            </span>
          </a>

          <a href="/profile" className="profile">
            <i className="bx bxs-user"></i>
          </a>

          <div style={{ display: "flex", gap: "10px", marginLeft: "10px" }}>
            <button
              onClick={handleRelogin}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer"
              }}
            >
              Re-login to SRM
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main>
          <div className="head-title">
            <div className="left">
              <h1>Dashboard</h1>
              <ul className="breadcrumb">
                <li><a href="/">Dashboard</a></li>
                <li><i className="bx bx-chevron-right"></i></li>
                <li><a className="active" href="/">Home</a></li>
              </ul>
            </div>
          </div>

          {loading ? (
            <div className="loading-message">⏳ Loading attendance data...</div>
          ) : error ? (
            <div className="error-message" style={{ color: "red", textAlign: "center" }}>
              ⚠️ {error}
            </div>
          ) : (
            <>
              {/* OVERALL ATTENDANCE */}
              <ul className="box-info">
                <li>
                  <i className="bx bx-shape-circle"></i>
                  <span className="text">
                    <h3>Overall Attendance</h3>
                    <div id="loader-container">
                      <div id="loader" style={{ width: `${overallAttendance}%` }}></div>
                    </div>
                    <div id="percent-display">{overallAttendance.toFixed(2)}%</div>
                    <p>{overallAttendance >= 75 ? "You're on track!" : "Warning: Below 75%"}</p>
                  </span>
                </li>
                <li>
                  <i className="bx bxs-error"></i>
                  <span className="text">
                    <h3>Alerts!</h3>
                    <p><b>{alertCount}</b> new alerts</p>
                  </span>
                </li>
              </ul>

              {/* COURSE TABLE */}
              <div className="table-data">
                <div className="order">
                  <div className="head">
                    <h3>Course Wise Attendance</h3>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Subject</th>
                        <th>Max Hours (Actual)</th>
                        <th>Attended Hours</th>
                        <th>Missable Classes</th>
                        <th>Total Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course, index) => {
                          let color = "";
                          if (course.missable_classes >= 10) color = "red";
                          else if (course.missable_classes > 5 && course.missable_classes < 10)
                            color = "orange";
                          else color = "green";

                          return (
                            <tr key={index}>
                              <td>{course.code}</td>
                              <td>{course.description}</td>
                              <td>{course.max_hours_scraped}</td>
                              <td>{course.attended_hours}</td>
                              <td style={{ color, fontWeight: "bold" }}>
                                {course.missable_classes}
                              </td>
                              <td>{course.total_percentage}%</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            No data found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
