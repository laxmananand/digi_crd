import React, { useState, useEffect } from "react";
import FeaturesComponent from "../components/registration/FeaturesComponent";

export const Auth = ({ children }) => {
  return (
    <div
      className="d-flex w-100 gap-4"
      style={{
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Placeholder for features component */}
      <div
        style={{
          width: "60%",
        }}
        className="auth-left d-flex justify-content-center align-items-center flex-column gap-5 zoqq-sign-up-1-1"
      >
        {/* <img src="/cover/auth-cover.svg" alt="" className="w-40" />
        <div className="w-75">
          <h1 className="text-uppercase fw-bold">
            Stay on top of all company spending in real-time
          </h1>
          <h5 className="text-secondary">
            through our corporate innovative payment platform.
          </h5>
        </div> */}

        <FeaturesComponent />
      </div>

      {/* Placeholder for auth child components */}
      <div className="auth-form">{children}</div>
    </div>
  );
};
