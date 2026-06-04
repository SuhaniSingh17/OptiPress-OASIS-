import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip } from "chart.js";
import Logo from "../img/Logo.png";
import "../styles/Dashboard.css";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);

const Attendance = () => {
  const chartRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // Load attendance data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("attendanceData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCourses(parsed.courses || []);
    }
  }, []);

  // ✅ Logout function (same as Navbar)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };

  // Render Chart.js chart
  useEffect(() => {
    if (!courses.length) return;

    const ctx = chartRef.current.getContext("2d");

    const chartData = {
      labels: ["Jul", "Aug", "Sept", "Oct"],
      datasets: courses.map((course) => ({
        label: course.code,
        data: [course.total_percentage, course.total_percentage, course.total_percentage, course.total_percentage],
        borderColor: getRandomColor(course.code),
        fill: false,
        tension: 0.1,
      })),
    };

    const myChart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { mode: "index", intersect: false } },
        scales: {
          x: { title: { display: true, text: "Month" } },
          y: { title: { display: true, text: "Attendance (%)" }, min: 0, max: 100 },
        },
      },
    });

    return () => myChart.destroy();
  }, [courses]);

  const getRandomColor = (str) => {
    const colors = ["blue", "green", "orange", "red", "purple", "cyan", "magenta", "yellow"];
    return colors[str.charCodeAt(0) % colors.length];
  };

  return (
    <div>
      {/* SIDEBAR */}
      <section id="sidebar">
        <div className="brand">
          <span className="logo-icon">
            <img src={Logo} alt="Logo" style={{ marginTop: "15%", marginLeft: "5%" }} />
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

        {/* Top Menu */}
        <ul className="side-menu top">
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li>
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
          <li className={location.pathname === "/attendance" ? "active" : ""}>
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

        {/* Bottom Menu */}
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
                position: "absolute",
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
        </nav>

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Attendance</h1>
              <ul className="breadcrumb">
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <Link className="active" to="/attendance">
                    Attendance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="container" style={{ width: "100%", height: "500px", marginTop: "50px", padding: "20px" }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Attendance;
