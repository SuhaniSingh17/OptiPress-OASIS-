import React, { useEffect } from 'react';
import '../styles/Dashboard.css';
import Logo from '../img/Logo.png';

const Download_Report = ({ overallAttendance = 82.5, courses = [] }) => {
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      const attendance = loader.style.width.match(/\d+/);
      if (attendance) {
        loader.style.width = `${attendance[0]}%`;
      }
    }
  }, []);

  return (
    <div>
      {/* SIDEBAR */}
      <section id="sidebar">
        <a href="#" className="brand">
          <span className="logo-icon">
            <img src={Logo} alt="Logo" style={{ marginTop: "15%", marginLeft: "5%" }} />
          </span>
          <span className="text" style={{ marginLeft: "5%", marginTop: "5%", fontFamily: "Times-New Roman" }}>
            <h1>OptiPress</h1>
          </span>
        </a>

        <ul className="side-menu top">
          <li><a href="/"><i className='bx bxs-dashboard'></i><span className="text">Dashboard</span></a></li>
          <li><a href="/plan_holidays"><i className='bx bxs-briefcase'></i><span className="text">Plan Holidays</span></a></li>
          <li><a href="/calendar"><i className='bx bx-calendar'></i><span className="text">Calendar</span></a></li>
          <li><a href="/attendance"><i className='bx bxs-bar-chart-alt-2'></i><span className="text">Attendance</span></a></li>
          <li className="active"><a href="/download_report"><i className='bx bx-download'></i><span className="text">Download Report</span></a></li>
        </ul>

        <ul className="side-menu">
          <li><a href="/profile"><i className='bx bxs-user'></i><span className="text">Profile</span></a></li>
          <li><a href="/settings"><i className='bx bxs-cog'></i><span className="text">Settings</span></a></li>
          <li><a href="/logout" className="logout"><i className='bx bx-log-out'></i><span className="text">Logout</span></a></li>
        </ul>
      </section>
      
      {/* CONTENT */}
      <section id="content">
        <nav>
          <i className='bx bx-menu'></i>
          
        </nav>
        <main>
          <div className="head-title">
            <div className="left">
              <h1>Download Report</h1>
              <ul className="breadcrumb">
                <li><a href="/">Dashboard</a></li>
                <li><i className="bx bx-chevron-right"></i></li>
                <li><a className="active" href="/plan_holidays">Download Report</a></li>
              </ul>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Download_Report;
