import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Logo from "../img/Logo.png";

const Plan_Holidays = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load attendance data from localStorage
    const savedData = localStorage.getItem("attendanceData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCourses(parsed.courses || []);
    }
  }, []);

  // Logout function (same as in Navbar)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };

  // Filter courses by search
  const filteredCourses = courses.filter(
    (course) =>
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate remaining missable classes based on 75% threshold
  const calculateRemainingMissable = (course) => {
    const totalClasses = course.max_hours_scraped;
    const attended = course.attended_hours;
    const minRequired = 0.75 * totalClasses;
    const remaining = Math.floor(attended - minRequired);
    return Math.max(0, remaining);
  };

  // Determine color class for remaining leave
  const getColorClass = (remaining) => {
    if (remaining <= 2) return "high"; // Red
    if (remaining <= 5) return "medium"; // Yellow
    return "low"; // Green
  };

  return (
    <div>
      {/* SIDEBAR */}
      <section id="sidebar">
        <div className="brand">
          <span className="logo-icon">
            <img
              src={Logo}
              alt="Logo"
              style={{ marginTop: "15%", marginLeft: "5%" }}
            />
          </span>
          <span
            className="text"
            style={{
              marginLeft: "5%",
              marginTop: "5%",
              fontFamily: "Times New Roman",
            }}
          >
            <h1>OptiPress</h1>
          </span>
        </div>

        <ul className="side-menu top">
          <li>
            <Link to="/">
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li className="active">
            <Link to="/plan_holidays">
              <i className="bx bxs-briefcase"></i>
              <span className="text">Plan Holidays</span>
            </Link>
          </li>
          <li>
            <Link to="/calendar">
              <i className="bx bx-calendar"></i>
              <span className="text">Calendar</span>
            </Link>
          </li>
          <li>
            <Link to="/attendance">
              <i className="bx bxs-bar-chart-alt-2"></i>
              <span className="text">Attendance</span>
            </Link>
          </li>
          <li>
            <Link to="/download_report">
              <i className="bx bx-download"></i>
              <span className="text">Download Report</span>
            </Link>
          </li>
        </ul>

        <ul className="side-menu">
          <li>
            <Link to="/profile">
              <i className="bx bxs-user"></i>
              <span className="text">Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <i className="bx bxs-cog"></i>
              <span className="text">Settings</span>
            </Link>
          </li>
          <li className="logout">
            <span
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10.5px 12px",
                borderRadius: "48px",
                fontSize: "16px",
                cursor: "pointer",
                color: "#DB504A",
                whiteSpace: "nowrap",
                overflowX: "hidden",
                textDecoration: "none",
                gap: "12px",
              }}
            >
              <i className="bx bx-log-out"></i>
              <span className="text">Logout</span>
            </span>
          </li>
        </ul>
      </section>

      {/* CONTENT */}
      <section id="content">
        <nav>
          <i className="bx bx-menu"></i>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-input">
              <input
                type="search"
                placeholder="Search subject or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="bx bx-search"></i>
              </button>
            </div>
          </form>
        </nav>

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Plan Holidays</h1>
              <ul className="breadcrumb">
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <Link className="active" to="/plan_holidays">
                    Plan Holidays
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="table-data">
            <div className="order">
              <div className="head">
                <h3>Subjects You Can Take Leave</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject</th>
                    <th>Attended Hours</th>
                    <th>Total Hours</th>
                    <th>Already Missed Classes</th>
                    <th>Remaining Missable Classes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => {
                      const remaining = calculateRemainingMissable(course);
                      return (
                        <tr key={index}>
                          <td>{course.code}</td>
                          <td>{course.description}</td>
                          <td>{course.attended_hours}</td>
                          <td>{course.max_hours_scraped}</td>
                          <td>
                            {course.max_hours_scraped - course.attended_hours}
                          </td>
                          <td className={getColorClass(remaining)}>
                            {remaining}
                          </td>
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
        </main>
      </section>
    </div>
  );
};

export default Plan_Holidays;
