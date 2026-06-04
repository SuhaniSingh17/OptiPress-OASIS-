import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { AttendanceProvider } from "./context/AttendanceContext";

// Create root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app with context provider and router
root.render(
  <React.StrictMode>
    <AttendanceProvider>
      <Router />
    </AttendanceProvider>
  </React.StrictMode>
);



