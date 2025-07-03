import axios from "axios";
import {
  setFeeDetails,
  setCountryList,
  setNationalityList,
  setMobileCountryCodeList,
  setDnsDetails,
  setHeaders,
} from "../feature/Utility";
import axiosInstance from "./../axiosInstance";
import { encryptData, decryptData } from "../encryptAES";
import { cognitoRequestBody } from "./Auth";
import { setProgram } from "../feature/Utility";
import { toast } from "react-toastify";

// Helper function for API errors
const handleApiError = (error) => {
  console.error("API Error:", error);
  const message =
    error?.response?.data?.message || "Something went wrong. Please try again.";
  toast.error(message); // Show error toast
  return { status: "ERROR", message };
};

// Fetch dns details
export const fetchDnsDetails = () => async (dispatch, getState) => {
  let origin = null;

  if (location.hostname === "localhost") {
    origin = "webapp-mcusd.stylopay.com";
    //origin = "baasusd-stylopay.vercel.app";
  } else {
    let host = location.hostname;
    if (host.includes("cards")) {
      origin = "webapp-mcusd.stylopay.com";
    } else {
      origin = "baasusd-stylopay.vercel.app";
    }
  }

  try {
    const url = `${process.env.VITE_apiurl}/utilities/fetchdns`;
    const body = { domain_name: origin };
    const headers = { "x-api-key": process.env.VITE_xApiKey };
    const response = await axiosInstance.post(url, body, { headers });
    if (response.data.domain_name === origin) {
      dispatch(setDnsDetails(response.data)); // Update Redux state

      cognitoRequestBody["clientId"] = response.data.cognito_client_id;
      cognitoRequestBody["userPoolId"] = response.data.cognito_pool_id;

      if (response.data.x_api_key) {
        // let xApiKey = encryptData(response.data.x_api_key);
        // let xClientId = encryptData(response.data.client_id);
        // let xProgramId = encryptData(response.data.program_id);
        // let xClientName = encryptData(response.data.dashboard_name);

        let xApiKey = response.data.x_api_key;
        let xClientId = response.data.client_id;
        let xProgramId = response.data.program_id;
        let xClientName = response.data.dashboard_name;

        let headersBody = { xApiKey, xClientId, xProgramId, xClientName };
        dispatch(setProgram(xProgramId));
        dispatch(setHeaders(headersBody)); // Update Redux state
      }
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch fee details
export const fetchFeeDetails =
  (agentCode, subagentCode) => async (dispatch, getState) => {
    try {
      const url = `${process.env.VITE_apiurl}/utilities/fetchfeedetails`;
      const body = {
        agentCode,
        subagentCode,
      };
      const response = await axiosInstance.post(url, body);
      if (response.data.length > 0) {
        dispatch(setFeeDetails(response.data)); // Update Redux state
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

export const getCountryList = (program) => async (dispatch, getState) => {
  try {
    const url = `${process.env.VITE_apiurl}/utilities/countryList`;
    const body = { programCode: program };
    const response = await axiosInstance.post(url, body);
    const obj = response.data.result;
    const extractedcountry = obj?.map((item) => ({
      label: item?.country_name,
      value: item?.ISOcc_2char,
    }));
    dispatch(setCountryList(extractedcountry));
    return extractedcountry; // Return the data
  } catch (error) {
    return handleApiError(error);
  }
};

export const getMobileCountryCodeList =
  (program) => async (dispatch, getState) => {
    try {
      const url = `${process.env.VITE_apiurl}/utilities/fetchmobilecountrylist`;
      const body = { programCode: program };
      const response = await axiosInstance.post(url, body);
      const obj = response.data.result;
      const extractedphonecode = obj?.map((item) => ({
        flag: item?.ISOcc_2char,
        label: `${item?.country_name} (+${item?.ISD_country_code})`,
        value: item?.ISD_country_code,
      }));
      dispatch(setMobileCountryCodeList(extractedphonecode));
      return extractedphonecode; // Return the data
    } catch (error) {
      return handleApiError(error);
    }
  };

export const getNationalityList = (program) => async (dispatch, getState) => {
  try {
    const url = `${process.env.VITE_apiurl}/utilities/fetchnationalitylist`;
    const body = { programCode: program };
    const response = await axiosInstance.post(url, body);
    const obj = response.data.result;
    const extractednationality = obj?.map((item) => ({
      label: item?.nationality,
      value: item?.ISOcc_2char,
    }));
    dispatch(setNationalityList(extractednationality));
    return extractednationality; // Return the data
  } catch (error) {
    return handleApiError(error);
  }
};
