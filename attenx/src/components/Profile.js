// import React, { useEffect, useState } from "react";
// import "../styles/Profile.css";
// import Logo from "../img/Logo.png";
// import axios from "axios";

// const Profile = ({ email }) => {
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     studentId: "",
//     major: "",
//     year: "",
//     phone: "",
//   });

//   // Load user info on page load
//   useEffect(() => {
//     if (!email) return;
//     axios
//       .get(`http://localhost:5000/api/users/${email}`)
//       .then((res) => setUser(res.data))
//       .catch((err) => console.error(err));
//   }, [email]);

//   // Handle field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser((prev) => ({ ...prev, [name]: value }));
//   };

//   // Save changes
//   const handleSave = async () => {
//     try {
//       await axios.put(`http://localhost:5000/api/users/${user.email}`, user);
//       alert("Profile updated successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update profile");
//     }
//   };

//   return (
//     <div>
//       {/* SIDEBAR (same as before) */}
//       <section id="sidebar">
//         <a href="#" className="brand">
//           <span className="logo-icon">
//             <img
//               src={Logo}
//               alt="Logo"
//               style={{ marginTop: "15%", marginLeft: "5%" }}
//             />
//           </span>
//           <span
//             className="text"
//             style={{
//               marginLeft: "5%",
//               marginTop: "5%",
//               fontFamily: "Times-New Roman",
//             }}
//           >
//             <h1>OptiPress</h1>
//           </span>
//         </a>

//         <ul className="side-menu top">
//           <li>
//             <a href="/">
//               <i className="bx bxs-dashboard"></i>
//               <span className="text">Dashboard</span>
//             </a>
//           </li>
//           <li>
//             <a href="/plan_holidays">
//               <i className="bx bxs-briefcase"></i>
//               <span className="text">Plan Holidays</span>
//             </a>
//           </li>
//           <li>
//             <a href="/calendar">
//               <i className="bx bx-calendar"></i>
//               <span className="text">Calendar</span>
//             </a>
//           </li>
//           <li>
//             <a href="/attendance">
//               <i className="bx bxs-bar-chart-alt-2"></i>
//               <span className="text">Attendance</span>
//             </a>
//           </li>
//           <li>
//             <a href="/download_report">
//               <i className="bx bx-download"></i>
//               <span className="text">Download Report</span>
//             </a>
//           </li>
//         </ul>

//         <ul className="side-menu">
//           <li className="active">
//             <a href="/profile">
//               <i className="bx bxs-user"></i>
//               <span className="text">Profile</span>
//             </a>
//           </li>
//           <li>
//             <a href="/settings">
//               <i className="bx bxs-cog"></i>
//               <span className="text">Settings</span>
//             </a>
//           </li>
//           <li>
//             <a href="/logout" className="logout">
//               <i className="bx bx-log-out"></i>
//               <span className="text">Logout</span>
//             </a>
//           </li>
//         </ul>
//       </section>

//       {/* CONTENT */}
//       <section id="content">
//         <nav>
//           <i className="bx bx-menu"></i>
          
//         </nav>

//         <main>
//           <div className="head-title">
//             <div className="left">
//               <h1>Profile</h1>
//               <ul className="breadcrumb">
//                 <li>
//                   <a href="/dashboard">Dashboard</a>
//                 </li>
//                 <li>
//                   <i className="bx bx-chevron-right"></i>
//                 </li>
//                 <li>
//                   <a className="active" href="/profile">
//                     Profile
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* PROFILE SECTION */}
//           <div className="profile-section">
//             <h3>Student Profile</h3>
//             <form className="profile-form">
//               <div className="form-group">
//                 <label>First Name:</label>
//                 <input
//                   name="firstName"
//                   value={user.firstName}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Last Name:</label>
//                 <input
//                   name="lastName"
//                   value={user.lastName}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Email:</label>
//                 <input name="email" value={user.email} readOnly />
//               </div>

//               <div className="form-group">
//   <label>Password:</label>
//   <input
//     type="password"
//     name="password"
//     value={user.password || ""}
//     placeholder="Enter new password"
//     onChange={handleChange}
//   />
// </div>


//               <div className="form-group">
//                 <label>Major:</label>
//                 <input
//                   name="major"
//                   value={user.major}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Year:</label>
//                 <input
//                   name="year"
//                   value={user.year}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Phone Number:</label>
//                 <input
//                   name="phone"
//                   value={user.phone}
//                   onChange={handleChange}
//                 />
//               </div>

//               <button type="button" onClick={handleSave}>
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </main>
//       </section>
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import Logo from "../img/Logo.png";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    studentId: "",
    major: "",
    year: "",
    phone: "",
  });

  // On mount, get email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      navigate("/login");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  // Fetch user info once email is set
  useEffect(() => {
    if (!email) return;

    axios
      .get(`http://localhost:5000/api/users/${email}`)
      .then((res) => setUser({ ...res.data, password: res.data.password || "" }))
      .catch((err) => console.error(err));
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        studentId: user.studentId,
        major: user.major,
        year: user.year,
        phone: user.phone,
      };
      await axios.put(`http://localhost:5000/api/users/${email}`, updatedUser);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  // ✅ Same Logout as Attendance.js
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
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
            style={{ marginLeft: "5%", marginTop: "5%", fontFamily: "Times New Roman" }}
          >
            <h1>OptiPress</h1>
          </span>
        </div>

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
          <li className={location.pathname === "/profile" ? "active" : ""}>
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

          {/* ✅ Logout same as Attendance.js */}
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
              <h1>Profile</h1>
              <ul className="breadcrumb">
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <Link className="active" to="/profile">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* PROFILE SECTION */}
          <div className="profile-section">
            <h3>Student Profile</h3>
            <form className="profile-form">
              <div className="form-group">
                <label>First Name:</label>
                <input name="firstName" value={user.firstName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Last Name:</label>
                <input name="lastName" value={user.lastName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input name="email" value={user.email} readOnly />
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input type="password" name="password" value={user.password || ""} readOnly />
              </div>

              <div className="form-group">
                <label>Student ID:</label>
                <input name="studentId" value={user.studentId} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Major:</label>
                <input name="major" value={user.major} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Year:</label>
                <input name="year" value={user.year} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Phone Number:</label>
                <input name="phone" value={user.phone} onChange={handleChange} />
              </div>

              <button type="button" onClick={handleSave}>
                Save Changes
              </button>
            </form>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Profile;
