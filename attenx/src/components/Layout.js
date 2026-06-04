import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar"; // your existing Navbar component

const Layout = () => {
  return (
    <div>
      <Navbar />  {/* Sidebar / Navbar */}
      <section id="content">
        <Outlet /> {/* Page content goes here */}
      </section>
    </div>
  );
};

export default Layout;
