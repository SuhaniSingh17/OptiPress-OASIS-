// import React from 'react'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Navbar from './components/Navbar';
// import Dashboard from './components/Dashboard'
// import Plan_Holidays from './components/Plan_Holidays'
// import Calendar from './components/Calendar'
// import Attendance from './components/Attendance'
// import Profile from './components/Profile'
// import Settings from './components/Settings'
// import Download_Report from './components/Download_Report'
// const Router = () => {
//   return (
//     <BrowserRouter>
//       <Navbar /> 
//       <Routes>
//         <Route path='/' element={<Dashboard/>}></Route>
//         <Route path='/plan_holidays' element={<Plan_Holidays/>}></Route>
//         <Route path='/calendar' element={<Calendar/>}></Route>
//         <Route path='/attendance' element={<Attendance/>}></Route>
//         <Route path='/download_report' element={<Download_Report/>}></Route>
//         <Route path='/profile' element={<Profile/>}></Route>
//         <Route path='/settings' element={<Settings/>}></Route>
//         <Route path="*" element={<div>Error404</div>}></Route>
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default Router
import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard'
import Plan_Holidays from './components/Plan_Holidays'
import Calendar from './components/Calendar'
import Attendance from './components/Attendance'
import Profile from './components/Profile'
import Settings from './components/Settings'
import Download_Report from './components/Download_Report'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: login/signup */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <><Navbar /><Dashboard /></>
          </ProtectedRoute>
        }/>
        <Route path="/plan_holidays" element={
          <ProtectedRoute>
            <><Navbar /><Plan_Holidays /></>
          </ProtectedRoute>
        }/>
        <Route path="/calendar" element={
          <ProtectedRoute>
            <><Navbar /><Calendar /></>
          </ProtectedRoute>
        }/>
        <Route path="/attendance" element={
          <ProtectedRoute>
            <><Navbar /><Attendance /></>
          </ProtectedRoute>
        }/>
        <Route path="/download_report" element={
          <ProtectedRoute>
            <><Navbar /><Download_Report /></>
          </ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute>
            <><Navbar /><Profile /></>
          </ProtectedRoute>
        }/>
        <Route path="/settings" element={
          <ProtectedRoute>
            <><Navbar /><Settings /></>
          </ProtectedRoute>
        }/>

        {/* Fallback */}
        <Route path="*" element={<div>Error404</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
