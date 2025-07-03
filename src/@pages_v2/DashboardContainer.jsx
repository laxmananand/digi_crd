import React, { useState, useEffect } from "react";
import Sidebar from "../@component_v2/Sidebar";
import Navbar from "../@component_v2/Navbar";
import { useSelector } from "react-redux";

export const DashboardContainer = ({ children }) => {
  const loading = useSelector((state) => state.utility.globalLoading);
  const expanded = useSelector((state) => state.utility.isExpanded);
  return (
    <>
      <div
        className="d-flex align-items-start justify-content-start bg-white"
        style={{
          position: "relative",
          pointerEvents: loading ? "none" : "auto", // Disable interactions
          opacity: loading ? 0.5 : 1, // Optional: Dim the screen
        }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="d-flex flex-column align-items-start">
          {/* Navbar */}
          {/* <Navbar /> */}

          {/* Content */}
          <main
            className="p-4"
            style={{
              overflowY: "auto",
              height: "100vh",
              background: "rgba(211,211,211,0.35)",
              width: expanded ? "84vw" : "94vw",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardContainer;
