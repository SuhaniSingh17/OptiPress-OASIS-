import React, { createContext, useContext, useState } from "react";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [overallAttendance, setOverallAttendance] = useState(null);
  const [courses, setCourses] = useState([]);
  const [fetched, setFetched] = useState(false); // so we fetch only once

  return (
    <AttendanceContext.Provider
      value={{
        overallAttendance,
        setOverallAttendance,
        courses,
        setCourses,
        fetched,
        setFetched
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
