// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/Dashboard.css';
// import logo from '../img/Logo.png';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   // ✅ Logout handler
//   const handleLogout = () => {
//     localStorage.removeItem("attendanceData");
//     window.location.reload();
//     navigate("/login");
//   };

//   return (
//     <nav>
//       {/* Sidebar */}
//       <section id="sidebar" className={isOpen ? "open" : ""}>
//         <div className="brand">
//           <span className="logo-icon">
//             <img
//               src={logo}
//               alt="Logo"
//               style={{ marginTop: "15%", marginLeft: "5%" }}
//             />
//           </span>
//           <span
//             className="text"
//             style={{
//               marginLeft: "5%",
//               marginTop: "5%",
//               fontFamily: "Times New Roman",
//             }}
//           >
//             <h1>OptiPress</h1>
//           </span>
//         </div>

//         <ul className="side-menu top">
//           <li className="active">
//             <Link to="/">
//               <i className="bx bxs-dashboard"></i>
//               <span className="text">Dashboard</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/plan_holidays">
//               <i className="bx bxs-briefcase"></i>
//               <span className="text">Plan Holidays</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/calendar">
//               <i className="bx bx-calendar"></i>
//               <span className="text">Calendar</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/attendance">
//               <i className="bx bxs-bar-chart-alt-2"></i>
//               <span className="text">Attendance</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/Download_report" className="btn-download">
//               <i className="bx bx-download"></i>
//               <span className="text">Download Report</span>
//             </Link>
//           </li>
//         </ul>

//         <ul className="side-menu">
//           <li>
//             <Link to="/profile" className="profile">
//               <i className="bx bxs-user"></i>
//               <span className="text">Profile</span>
//             </Link>
//           </li>
//           <li>
//             <Link to="/settings">
//               <i className="bx bxs-cog"></i>
//               <span className="text">Settings</span>
//             </Link>
//           </li>
//           <li>
//             {/* ✅ Logout Button triggers handleLogout */}
//               <a href="/logout" className="logout" onClick={handleLogout}>
//               <i className='bx bx-log-out'></i><span className="text">Logout</span></a>
            
//           </li>
//         </ul>
//       </section>
//     </nav>
//   );
// };

// export default Navbar;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import logo from "../img/Logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true }); // Redirect to login
  };

  return (
    <nav>
      <section id="sidebar">
        {/* Brand / Logo */}
        <div className="brand">
          <span className="logo-icon">
            <img
              src={logo}
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

        {/* Top Menu */}
        <ul className="side-menu top">
          <li className="active">
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
          <li>
            <Link to="/attendance">
              <i className="bx bxs-bar-chart-alt-2"></i>
              <span className="text">Attendance</span>
            </Link>
          </li>
          <li>
            <Link to="/download_report" className="btn-download">
              <i className="bx bx-download"></i>
              <span className="text">Download Report</span>
            </Link>
          </li>
        </ul>

        {/* Bottom Menu */}
        <ul className="side-menu">
  <li>
    <Link to="/profile" className="profile">
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
      gap: "12px"
    }}
  >
    <i className="bx bx-log-out"></i>
    <span className="text">Logout</span>
  </span>
</li>
</ul>
      </section>
    </nav>
  );
};

export default Navbar;
