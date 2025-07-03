import axios from "axios";
import {
  setRecCountryList,
  setRecCurrencyList,
  setTransaction,
} from "../feature/transaction";
import { toast } from "react-toastify";

import { getAccountDetailsAPI, getAccountStatementAPI } from "./account";

import { getDates } from "../../@component_v2/CustomComponents";
import axiosInstance from "../axiosInstance";
import { setContacts } from "../feature/account";

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const today = Date.now();
const start = new Date(today - 86400000 * 90);
const end = new Date(today);

//P2P Transfer
export const PaymentTransfer =
  ({ recipient, amount, description, setPaymentLoading, setActiveStep }) =>
  async (dispatch, getState) => {
    let userId = getState().auth?.userDetails?.id;
    let accountId = getState().account?.accountDetails[0]?.accountid;

    setPaymentLoading(true);

    try {
      const url = `${process.env.VITE_apiurl}/caas/payment/${userId}/${accountId}`;

      const body = {
        type: "P2P",
        amount: amount,
        description: description,
        email: recipient,
      };

      const response = await axiosInstance.post(url, body); // Use POST for account creation
      if (response.data.status === "BAD_REQUEST") {
        toast.error("Transfer failed: " + response.data.message);
      } else if (response.data.status === "SUCCESS") {
        //toast.success(response.data.message);
        await dispatch(getAccountDetailsAPI(userId, "update"));
        await dispatch(
          getAccountStatementAPI(
            userId,
            accountId,
            getDates().startDate,
            getDates().endDate,
            "50",
            "update"
          )
        );
        setActiveStep(3);
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setPaymentLoading(false);
    }
  };

//Remittance related APIs

// Fetch Contacts
export const fetchContacts = (recType) => async (dispatch, getState) => {
  // const contacts = getState().account.contacts;
  // if (contacts.length > 0) return contacts;

  try {
    const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
    if (!userId) {
      toast.error("User ID is missing!");
      return { status: "BAD_REQUEST" };
    }

    const headers = { userid: userId };

    const url = `${process.env.VITE_apiurl}/baas/listRecipients?page=1&records_per_page=10&recipient_type=${recType}`;

    const response = await axiosInstance.get(url, { headers });

    if (response.data.data) {
      dispatch(setContacts(response.data.data)); // Save KYC details to Redux
      return { data: response.data, status: "SUCCESS" };
    } else {
      toast.error("No contacts found for the given user or contact type...");
      return { data: response.data, status: "BAD_REQUEST" };
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchRecipientCountry =
  (recType, type) => async (dispatch, getState) => {
    try {
      const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
      if (!userId) {
        toast.error("User ID is missing!");
        return { status: "BAD_REQUEST" };
      }

      const url = `${process.env.VITE_apiurl}/baas/supportedCountries?recipient_type=${recType}&user_type=${type}`;
      const response = await axiosInstance.get(url, {
        headers: { userid: userId },
      });

      const data = response.data?.data || [];

      if (data.length === 0) {
        toast.error("No countries found for the given recipient type.");
        return { status: "BAD_REQUEST" };
      }

      const mappedList = data.map((item) => ({
        label: item.destination_country,
        value: item.destination_country_code,
      }));

      console.log("mappedCountryList:", mappedList);
      dispatch(setRecCountryList(mappedList));

      return { data: mappedList, status: "SUCCESS" };
    } catch (error) {
      console.error("Error in fetchRecipientCountry:", error);
      return handleApiError(error);
    }
  };

export const fetchRecipientCurrency =
  (recCountry) => async (dispatch, getState) => {
    try {
      const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
      if (!userId) {
        toast.error("User ID is missing!");
        return { status: "BAD_REQUEST" };
      }

      const url = `${process.env.VITE_apiurl}/baas/supportedCurrencies`;

      const response = await axiosInstance.get(url, {
        headers: { userid: userId, search: recCountry },
      });

      const data = response.data?.data || [];

      const mappedList = data[0].currencies.map((currency) => ({
        label: currency.currency_name,
        value: currency.currency_code,
      }));

      console.log("mappedCurrencyList:", mappedList);
      dispatch(setRecCurrencyList(mappedList));

      return { data: mappedList, status: "SUCCESS" };
    } catch (error) {
      console.error("Error in fetchRecipientCurrency:", error);
      return handleApiError(error);
    }
  };

export const fetchRecipientForm =
  (recType, recCountry) => async (dispatch, getState) => {
    try {
      const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
      if (!userId) {
        toast.error("User ID is missing!");
        return { status: "BAD_REQUEST" };
      }

      const url = `${
        process.env.VITE_apiurl
      }/baas/recipientForm?recipient_type=${recType?.toUpperCase()}&recipient_country=${recCountry}`;

      const response = await axiosInstance.get(url, {
        headers: { userid: userId },
      });

      const data = response.data?.recipient_form;

      if (data.length > 0) {
        return { data, status: "SUCCESS" };
      } else {
        return { data: { ...response.data }, status: "BAD_REQUEST" };
      }
    } catch (error) {
      console.error("Error in fetchRecipientForm:", error);
      return handleApiError(error);
    }
  };

export const createRecipient =
  ({ body }) =>
  async (dispatch, getState) => {
    try {
      const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
      if (!userId) {
        toast.error("User ID is missing!");
        return { status: "BAD_REQUEST" };
      }

      const url = `${process.env.VITE_apiurl}/baas/recipient`;

      const response = await axiosInstance.post(url, body, {
        headers: { userid: userId },
      });

      const obj = response.data;

      if (obj.status === 400) {
        return { data: obj, status: "BAD_REQUEST" };
      } else {
        await dispatch(fetchContacts(""));
        return { data: obj, status: "SUCCESS" };
      }
    } catch (error) {
      console.error("Error in Create Recipient:", error);
      return handleApiError(error);
    }
  };

export const fetchBanks = (recCountry, name) => async (dispatch, getState) => {
  try {
    const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
    if (!userId) {
      toast.error("User ID is missing!");
      return { status: "BAD_REQUEST" };
    }

    const url = `${process.env.VITE_apiurl}/baas/supportedReceivingInstitution/${recCountry}`;

    const response = await axiosInstance.get(url, {
      headers: { userid: userId, "x-name-id": name },
    });

    const data = response.data?.data || [];

    const mappedList = data.map((currency) => ({
      label: currency.name,
      value: currency.id,
    }));

    return { data: mappedList, status: "SUCCESS" };
  } catch (error) {
    console.error("Error in fetchBanks:", error);
    return handleApiError(error);
  }
};

export const fetchRates =
  (amount, recInstType, recType, recCurrency, recCountry, quoteType) =>
  async (dispatch, getState) => {
    try {
      const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
      if (!userId) {
        toast.error("User ID is missing!");
        return { status: "BAD_REQUEST" };
      }

      const url = `${process.env.VITE_apiurl}/baas/quotes`;

      const body = {
        amount: amount,
        recipient_country: recCountry,
        receiving_currency: recCurrency,
        recipient_type: recType?.toUpperCase(),
        receiving_institution_type: recInstType || "BANK",
        quote_type: quoteType,
      };

      const response = await axiosInstance.post(url, body, {
        headers: { userid: userId },
      });

      const obj = response.data;

      if (obj?.detail) {
        return {
          data: obj?.detail || "Something went wrong, please try again!",
          status: "BAD_REQUEST",
        };
      } else {
        return { data: obj.quote, status: "SUCCESS" };
      }
    } catch (error) {
      console.error("Error in fetchBanks:", error);
      return handleApiError(error);
    }
  };

export const sendMoneyCrossBorder =
  ({ body }) =>
  async (dispatch, getState) => {
    try {
      const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
      if (!userId) {
        toast.error("User ID is missing!");
        return { status: "BAD_REQUEST" };
      }

      const url = `${process.env.VITE_apiurl}/baas/sendTransaction`;

      const response = await axiosInstance.post(url, body, {
        headers: { userid: userId },
      });

      const obj = response.data;

      if (obj.status === "BAD_REQUEST") {
        return {
          data:
            obj?.internalerror ||
            obj?.message ||
            "Something went wrong, please try again!",
          status: "BAD_REQUEST",
        };
      } else {
        return { data: obj, status: "SUCCESS" };
      }
    } catch (error) {
      console.error("Error in fetchBanks:", error);
      return handleApiError(error);
    }
  };

export const updateRecipientStatus =
  ({ id, status, setActionLoading }) =>
  async (dispatch, getState) => {
    try {
      setActionLoading(true);
      const userId = getState().auth?.userDetails?.id; // Make sure userId is properly fetched
      if (!userId) {
        toast.error("User ID is missing!");
        return { status: "BAD_REQUEST" };
      }

      const url = `${process.env.VITE_apiurl}/baas/recipient/${id}`;

      const body = { status };

      const response = await axiosInstance.put(url, body, {
        headers: { userid: userId },
      });

      const obj = response.data;

      if (obj.detail) {
        toast.error(
          `An error occured while ${status} operation: ${obj?.detail}`
        );
        return {
          data: obj?.detail || "Something went wrong, please try again!",
          status: "BAD_REQUEST",
        };
      } else {
        await dispatch(fetchContacts(""));
        toast.success(`${status} operation for selected recipient successful.`);
        return { data: obj, status: "SUCCESS" };
      }
    } catch (error) {
      console.error("Error in fetchBanks:", error);
      return handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };
