import React, { useState, useEffect } from "react";
import "../styles/Profile.css"; 
import Logo from "../img/Logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  // ✅ Logout function (same as your Navbar)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };

  // ✅ Delete Account Function (removes user from MongoDB)
  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("No user found. Please log in again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );
    if (!confirmDelete) return;

    try {
      // Call backend DELETE API (make sure your backend route matches)
      await axios.delete(`http://localhost:5000/api/users/${userId}`);

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");

      alert("Your account has been deleted successfully.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div>
      {/* SIDEBAR */}
      <section id="sidebar">
        <a href="#" className="brand">
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
        </a>

        <ul className="side-menu top">
          <li>
            <a href="/">
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/plan_holidays">
              <i className="bx bxs-briefcase"></i>
              <span className="text">Plan Holidays</span>
            </a>
          </li>
          <li>
            <a href="/calendar">
              <i className="bx bx-calendar"></i>
              <span className="text">Calendar</span>
            </a>
          </li>
          <li>
            <a href="/attendance">
              <i className="bx bxs-bar-chart-alt-2"></i>
              <span className="text">Attendance</span>
            </a>
          </li>
          <li>
            <a href="/download_report">
              <i className="bx bx-download"></i>
              <span className="text">Download Report</span>
            </a>
          </li>
        </ul>

        <ul className="side-menu">
          <li>
            <a href="/profile">
              <i className="bx bxs-user"></i>
              <span className="text">Profile</span>
            </a>
          </li>
          <li className="active">
            <a href="/settings">
              <i className="bx bxs-cog"></i>
              <span className="text">Settings</span>
            </a>
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
        </nav>

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Settings</h1>
              <ul className="breadcrumb">
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <a className="active" href="/settings">
                    Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* SETTINGS SECTION */}
          <div className="profile-section">
            <h3>User Settings</h3>
            <form className="profile-form">
              {/* Edit Profile */}
              <div className="form-group">
                <label>Edit Profile:</label>
                <button onClick={() => navigate("/profile")}>
                  Edit Profile
                </button>
              </div>

              {/* Language Selection */}
              <div className="form-group">
                <label>Language:</label>
        
                  <button>English</button>
              </div>

              {/* Dark Theme Toggle */}
              <div className="form-group">
                <label>Dark Theme:</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              {/* Notifications Toggle */}
              <div className="form-group">
                <label>Notifications:</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              {/* Delete Account */}
              <div className="form-group">
                <label>Delete Account:</label>
                <button
                  type="button"
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>

              {/* Logout */}
              <div className="form-group">
                <label>Logout:</label>
                <button
                  type="button"
                  style={{ backgroundColor: "gray", color: "white" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Settings;
