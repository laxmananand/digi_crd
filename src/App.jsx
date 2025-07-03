import React, { useState, useEffect } from "react";
import "./App.css";
import "./theme.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AppRouter from "./AppRouter";
import {
  getCountryList,
  getMobileCountryCodeList,
  getNationalityList,
  fetchFeeDetails,
  fetchDnsDetails,
} from "./@redux/action/Utility";
import { setFeeDetails } from "./@redux/feature/Utility";
import { RingLoader } from "react-spinners";
import { countryList } from "./config/utility";
import { setupAxiosInterceptors } from "./@redux/axiosInstance";
import store from "./@redux/store";

const App = () => {
  const dispatch = useDispatch();
  const [appLoading, setAppLoading] = useState(true);

  // Session timeout in case of Inactivity - Added by pabitra
  // useEffect(() => {
  //   const startSessionTimeout = () => {
  //     timeoutId = setTimeout(() => {
  //       const currentUrl = window.location.pathname;
  //       console.log(currentUrl);

  //       if (
  //         currentUrl === "/" ||
  //         currentUrl === "/sign-up" ||
  //         currentUrl === "/forgotpassword"
  //       ) {
  //         return;
  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           text: "Your session has expired. Would you like to log-in again or continue?",
  //           showDenyButton: true,
  //           confirmButtonText: "Logout",
  //           denyButtonText: `Continue`,
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             logout();
  //           } else if (result.isDenied) {
  //             Swal.close();
  //           }
  //         });
  //       }
  //     }, 5 * 60 * 1000); // 30 minutes in milliseconds
  //   };

  //   const resetSessionTimeout = () => {
  //     clearTimeout(timeoutId);
  //     startSessionTimeout();
  //   };

  //   const clearSessionTimeout = () => {
  //     clearTimeout(timeoutId);
  //   };

  //   const setupMousemoveListener = () => {
  //     window.addEventListener("mousemove", resetSessionTimeout);
  //   };

  //   const removeMousemoveListener = () => {
  //     window.removeEventListener("mousemove", resetSessionTimeout);
  //   };

  //   let timeoutId;

  //   startSessionTimeout();
  //   setupMousemoveListener();

  //   return () => {
  //     clearSessionTimeout();
  //     removeMousemoveListener();
  //   };
  // }, []);

  const countryList = useSelector((state) => state.utility.countryList);

  const dnsDetails = useSelector((state) => state.utility.dnsDetails);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setAppLoading(true);
        setupAxiosInterceptors(store.getState);

        await dispatch(fetchDnsDetails());
      } catch (e) {
        console.error("Error fetching DNS details:", e);
      } finally {
        setAppLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (dnsDetails) {
      // Run these actions only when dnsDetails is populated
      dispatch(getCountryList(dnsDetails?.program_id));
      dispatch(getMobileCountryCodeList(dnsDetails?.program_id));
      dispatch(getNationalityList(dnsDetails?.program_id));
      dispatch(
        fetchFeeDetails(dnsDetails?.agent_code, dnsDetails?.subagent_code)
      );
    }
  }, [dnsDetails]); // Runs whenever dnsDetails is updated

  if (appLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4 vh-100">
        <RingLoader size={100} color="black" />

        <label className="text-secondary">
          Loading resources, please wait...
        </label>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
