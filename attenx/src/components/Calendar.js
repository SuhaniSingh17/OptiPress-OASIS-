import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/calendar.css";
import Logo from "../img/Logo.png";

const Calendar = () => {
  const today = new Date();
  const navigate = useNavigate();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendarEvents");
    return saved ? JSON.parse(saved) : [];
  });

  const [eventDate, setEventDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // ✅ Save events to localStorage
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!eventDate || !eventTitle) return;
    setEvents([
      ...events,
      {
        id: Date.now(),
        date: eventDate,
        title: eventTitle,
        description: eventDescription,
      },
    ]);
    setEventDate("");
    setEventTitle("");
    setEventDescription("");
  };

  const deleteEvent = (id) => setEvents(events.filter((e) => e.id !== id));

  const next = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const previous = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const jump = (month, year) => {
    setCurrentMonth(parseInt(month));
    setCurrentYear(parseInt(year));
  };

  const daysInMonth = (month, year) => 32 - new Date(year, month, 32).getDate();

  const getEventsOnDate = (date, month, year) =>
    events.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getDate() === date &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

  const hasEventOnDate = (date, month, year) =>
    getEventsOnDate(date, month, year).length > 0;

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = daysInMonth(currentMonth, currentYear);
    const weeks = [];
    let date = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || date > totalDays) week.push(null);
        else week.push(date++);
      }
      weeks.push(week);
    }
    return weeks;
  };

  const weeks = generateCalendar();

  // ✅ Logout function (same as in Navbar)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };

  return (
    <div className="oasys-wrapper">
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
          <li>
            <Link to="/plan_holidays">
              <i className="bx bxs-briefcase"></i>
              <span className="text">Plan Holidays</span>
            </Link>
          </li>
          <li className="active">
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
        </nav>

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Calendar</h1>
              <ul className="breadcrumb">
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <Link className="active" to="/calendar">
                    Calendar
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="container-calendar">
            {/* LEFT PANEL */}
            <div id="left">
              <div id="event-section">
                <h3>Add Event</h3>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Event Title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Event Description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
                <button onClick={addEvent}>Add</button>
              </div>

              <div id="reminder-section">
                <h3>Reminders</h3>
                <ul id="reminderList">
                  {events
                    .filter(
                      (e) =>
                        new Date(e.date).getMonth() === currentMonth &&
                        new Date(e.date).getFullYear() === currentYear
                    )
                    .map((event) => (
                      <li key={event.id}>
                        <strong>{event.title}</strong> - {event.description} on{" "}
                        {new Date(event.date).toLocaleDateString()}
                        <button
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginLeft: "8px",
                          }}
                          onClick={() => deleteEvent(event.id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div id="right">
              <h3 id="monthAndYear">
                {months[currentMonth]} {currentYear}
              </h3>
              <div className="button-container-calendar">
                <button onClick={previous}>‹</button>
                <button onClick={next}>›</button>
              </div>

              <table className="table-calendar">
                <thead>
                  <tr>{days.map((day) => <th key={day}>{day}</th>)}</tr>
                </thead>
                <tbody>
                  {weeks.map((week, i) => (
                    <tr key={i}>
                      {week.map((date, j) => {
                        const hasEvent = date && hasEventOnDate(date, currentMonth, currentYear);
                        const isToday =
                          date === today.getDate() &&
                          currentMonth === today.getMonth() &&
                          currentYear === today.getFullYear();
                        return (
                          <td
                            key={j}
                            className={`date-picker ${isToday ? "selected" : ""} ${
                              hasEvent ? "event-marker" : ""
                            }`}
                          >
                            {date && <span>{date}</span>}
                            {hasEvent && (
                              <div className="event-tooltip">
                                {getEventsOnDate(date, currentMonth, currentYear).map((ev) => (
                                  <p key={ev.id}>
                                    <strong>{ev.title}</strong> - {ev.description}
                                  </p>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="footer-container-calendar">
                <label>Jump To: </label>
                <select
                  value={currentMonth}
                  onChange={(e) => jump(e.target.value, currentYear)}
                >
                  {months.map((m, i) => (
                    <option key={i} value={i}>
                      {m.slice(0, 3)}
                    </option>
                  ))}
                </select>
                <select
                  value={currentYear}
                  onChange={(e) => jump(currentMonth, e.target.value)}
                >
                  {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Calendar;

