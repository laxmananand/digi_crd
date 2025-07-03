import axios from "axios";
import {
  setAccount,
  setAccountStatement,
  setCards,
  setContacts,
  setVirtualAccountDetails,
} from "../feature/account";
import { toast } from "react-toastify";
import { getDates } from "../../@component_v2/CustomComponents";
import axiosInstance from "./../axiosInstance";

// Helper function for API errors
const handleApiError = (error) => {
  console.error("API Error:", error);
  const message =
    error?.response?.data?.message || "Something went wrong. Please try again.";
  toast.error(message); // Show error toast
  return { status: "ERROR", message };
};

// Fetch account details
export const getAccountDetailsAPI =
  (userId, type) => async (dispatch, getState) => {
    if (type === "update") {
      try {
        const url = `${process.env.VITE_apiurl}/caas/account/${userId}`;
        const response = await axiosInstance.get(url);

        if (response.data.length > 0) {
          dispatch(setAccount(response.data)); // Update Redux state
        }

        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      let accountDetails = getState().account.accountDetails;
      return accountDetails;
    }
  };

// Fetch virtual account details
export const getVirtualAccountDetailsAPI =
  (userId, type) => async (dispatch, getState) => {
    if (type === "update") {
      try {
        const url = `${process.env.VITE_apiurl}/caas/account/getVA/${userId}`;
        const response = await axiosInstance.get(url);

        if (response.data.length > 0) {
          dispatch(setVirtualAccountDetails(response.data)); // Update Redux state
        }

        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      let accountDetails = getState().account.virtualAccountDetails;
      return accountDetails;
    }
  };

// Create account details
export const createAccountDetailsAPI = () => async (dispatch, getState) => {
  // Check existing account in Redux state
  const accountDetails = getState().account.accountDetails;
  const userDetails = getState().auth.userDetails;
  if (accountDetails.length > 0) {
    const errorMessage = "You have already created your account!";
    toast.error(errorMessage); // Show error toast
    return { status: "BAD_REQUEST", message: errorMessage };
  }

  try {
    const url = `${process.env.VITE_apiurl}/caas/account/${userDetails.id}`;
    const data = {
      label: "walletAccountvirtualAccount",
      type: "walletAccount",
    };

    const response = await axiosInstance.post(url, data); // Use POST for account creation
    if (response.data.status === "SUCCESS") {
      await dispatch(getAccountDetailsAPI(userDetails.id)); // Refresh account details
      toast.success("Account created successfully!"); // Show success toast
    } else {
      toast.error(response.data.message);
    }

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create account details
export const createVirtualAccountDetailsAPI =
  () => async (dispatch, getState) => {
    // Check existing account in Redux state
    const accountDetails = getState().account.virtualAccountDetails;
    const userDetails = getState().auth.userDetails;
    if (accountDetails.length > 0) {
      const errorMessage = "You have already created your virtual account!";
      toast.error(errorMessage); // Show error toast
      return { status: "BAD_REQUEST", message: errorMessage };
    }

    try {
      const url = `${process.env.VITE_apiurl}/caas/account/${userDetails.id}`;
      const data = {
        label: "virtualAccount",
        type: "virtualAccount",
      };

      const response = await axiosInstance.post(url, data); // Use POST for account creation
      if (response.data.status === "SUCCESS") {
        await dispatch(getVirtualAccountDetailsAPI(userDetails.id)); // Refresh account details
        toast.success("Virtual account created successfully!"); // Show success toast
      } else {
        toast.error(response.data.message);
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

// Get Account Statement
export const getAccountStatementAPI =
  (userId, accountId, startDate, endDate, limit, type) =>
  async (dispatch, getState) => {
    // Check existing account in Redux state
    if (type === "update") {
      try {
        const url = `${process.env.VITE_apiurl}/caas/account/${userId}/${accountId}`;
        const data = {
          page: "1",
          limit: limit,
          startDate: startDate,
          endDate: endDate,
        };

        const response = await axiosInstance.post(url, data); // Use POST for account creation
        if (
          response.data.transactions &&
          response.data.transactions.length > 0
        ) {
          const formattedTransactions = response.data.transactions.map(
            (txn) => {
              const isCredit = txn.indicator === "credit";
              const isCardTransaction = txn.type === "Cross Border Fee";
              const isCrossBorder = txn.type.includes("Cross Border");
              const isPPConsumer = txn.details?.name?.includes("PP Consumer");

              return {
                transaction_id: txn.id,
                indicator: txn.indicator,
                date: txn.date,
                amount: {
                  value: txn.amount,
                  currency: txn.currency,
                },
                balance: {
                  value: txn.balance,
                  currency: txn.currency,
                },
                status: txn.status,
                description: isPPConsumer ? txn.details?.details : txn.type,
                recipient_name: isCredit
                  ? "SELF"
                  : isCardTransaction
                  ? txn.details.merchant_name
                  : isCrossBorder
                  ? txn.details.receiving_institution?.account_name || ""
                  : isPPConsumer
                  ? txn.details?.name
                  : txn.details?.receiver || "",
                details: {
                  description: txn.description || txn.type,
                  ...txn.details,
                  destination: txn.destination || {},
                },
              };
            }
          );

          await dispatch(setAccountStatement(formattedTransactions));
        } else {
          //toast.error("No transactions found for this user.");
        }

        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      let accountStatement = getState().account.accountStatement;
      return accountStatement;
    }
  };

// Get List of Cards
export const getCardsAPI =
  (userId, accountId, type) => async (dispatch, getState) => {
    // Check existing account in Redux state
    if (type === "update") {
      try {
        const url = `${process.env.VITE_apiurl}/caas/card/list/${userId}/${accountId}`;

        const response = await axiosInstance.get(url); // Use POST for account creation
        if (response.data.length > 0) {
          await dispatch(setCards(response.data)); // Refresh account details
        } else {
          //toast.error("No cards found for this user.");
        }

        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      let cards = getState().account.cards;
      return cards;
    }
  };

// Get Card Details
export const getCardsDetailsAPI = (cardId) => async (dispatch, getState) => {
  let userId = getState().auth?.userDetails?.id;
  let accountId = getState().account?.accountDetails[0]?.accountid;

  try {
    const url = `${process.env.VITE_apiurl}/caas/card/showtoken/${userId}/${accountId}/${cardId}`;

    console.log(url);

    const response = await axiosInstance.post(url); // Use POST for account creation
    if (response.data.status === "BAD_REQUEST") {
      toast.error(
        "Card details not available for the given card. Try again later or contact your admin for more information."
      );
    }

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

//Add Virtual Card
export const addVirtualCard =
  ({ setCardLoading, handleCloseCardModal }) =>
  async (dispatch, getState) => {
    let userId = getState().auth?.userDetails?.id;
    let accountId = getState().account?.accountDetails[0]?.accountid;

    setCardLoading(true);

    try {
      const url = `${process.env.VITE_apiurl}/caas/card/virtual/${userId}/${accountId}`;

      const response = await axiosInstance.post(url); // Use POST for account creation
      if (response.data.status === "BAD_REQUEST") {
        toast.error("Unable to add card: " + response.data.message);
      } else if (response.data.status === "SUCCESS") {
        await dispatch(getCardsAPI(userId, accountId, "update"));
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
        toast.success(`"Virtual" ${response.data.message}`);
        handleCloseCardModal();
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setCardLoading(false);
    }
  };

//Add Physical Card
export const addPhysicalCard =
  ({
    cardProxyNumber,
    cardLast4Digits,
    setCardLoading,
    handleCloseCardModal,
  }) =>
  async (dispatch, getState) => {
    let userId = getState().auth?.userDetails?.id;
    let accountId = getState().account?.accountDetails[0]?.accountid;

    if (!cardProxyNumber) {
      toast.error("Enter your physical card's proxy number to continue.");
      return;
    } else if (!cardLast4Digits) {
      toast.error("Enter your physical card's last 4 digits to continue.");
      return;
    }

    setCardLoading(true);

    try {
      const url = `${process.env.VITE_apiurl}/caas/card/physical/${userId}/${accountId}`;

      const body = {
        accountNumber: cardProxyNumber,
        cardLast4Digits: cardLast4Digits,
      };

      const response = await axiosInstance.post(url, body); // Use POST for account creation
      if (response.data.status === "BAD_REQUEST") {
        toast.error(
          "Unable to add card: " +
            response.data.message?.includes("assoc_number")
            ? "The card's proxy number has already been used, please try with a new one."
            : response.data.message
        );
      } else if (response.data.status === "SUCCESS") {
        await dispatch(getCardsAPI(userId, accountId, "update"));
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
        toast.success(`Physical ${response.data.message}`);
        handleCloseCardModal();
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setCardLoading(false);
    }
  };

import { SECRET_KEY } from "../../@component_v2/CustomComponents";
import { setPINblock } from "../../components/utility/encryption";

//Set PIN
export const setPINCard =
  ({ pin, cardId, setCardLoading, handleCloseCardModalActions }) =>
  async (dispatch, getState) => {
    if (!pin) {
      toast.error("Enter PIN to continue.");
      return;
    }

    if (!cardId) {
      toast.error(
        "No details for the given card available. Please try again later!"
      );
      return;
    }

    let userId = getState().auth?.userDetails?.id;
    let accountId = getState().account?.accountDetails[0]?.accountid;
    let PAN =
      getState().auth?.userDetails?.mobileCountryCode +
      getState().auth?.userDetails?.mobile;

    setCardLoading(true);

    try {
      const url = `${process.env.VITE_apiurl}/caas/card/pin/${userId}/${accountId}/${cardId}`;

      console.log(SECRET_KEY + " " + pin + " " + PAN);

      const encryptedPin = setPINblock(SECRET_KEY, pin, PAN);

      console.log("encryptedPin:", encryptedPin);

      const body = {
        pinBlock: encryptedPin,
      };

      const response = await axiosInstance.post(url, body); // Use POST for account creation
      if (response.data.status === "BAD_REQUEST") {
        toast.error("Unable to set PIN: " + response.data.message);
      } else if (response.data.status === "SUCCESS") {
        toast.success(response.data.message);
        handleCloseCardModalActions();
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setCardLoading(false);
    }
  };

//Activate Card
export const activateCardDetails =
  ({ cardId, setCardLoading, handleCloseCardModalActions }) =>
  async (dispatch, getState) => {
    let userId = getState().auth?.userDetails?.id;
    let accountId = getState().account?.accountDetails[0]?.accountid;

    setCardLoading(true);

    try {
      const url = `${process.env.VITE_apiurl}/caas/card/activate/${userId}/${accountId}/${cardId}`;

      const response = await axiosInstance.post(url); // Use POST for account creation
      if (response.data.status === "BAD_REQUEST") {
        toast.error(response.data.message);
      } else if (response.data.status === "SUCCESS") {
        await dispatch(getCardsAPI(userId, accountId, "update"));
        toast.success(response.data.message);
        handleCloseCardModalActions();
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setCardLoading(false);
    }
  };

//Temporary Block Card
export const temporaryBlockCardDetails =
  ({ reason, cardId, setCardLoading, handleCloseCardModalActions }) =>
  async (dispatch, getState) => {
    if (!reason) {
      toast.error("Please enter a temporary block reason to continue...");
      return;
    }

    let userId = getState().auth?.userDetails?.id;
    let accountId = getState().account?.accountDetails[0]?.accountid;

    setCardLoading(true);

    try {
      const url = `${process.env.VITE_apiurl}/caas/card/block/${userId}/${accountId}/${cardId}`;

      const body = {
        blockAction: "temporaryBlock",
        reason: reason,
      };

      const response = await axiosInstance.post(url, body); // Use POST for account creation
      if (response.data.status === "BAD_REQUEST") {
        toast.error(response.data.message);
      } else if (response.data.status === "SUCCESS") {
        await dispatch(getCardsAPI(userId, accountId, "update"));
        toast.success(response.data.message);
        handleCloseCardModalActions();
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setCardLoading(false);
    }
  };

//Permanent Block Card
export const permanentBlockCardDetails =
  ({ reason, cardId, setCardLoading, handleCloseCardModalActions }) =>
  async (dispatch, getState) => {
    if (!reason) {
      toast.error("Please select a permanent block reason to continue...");
      return;
    }

    let userId = getState().auth?.userDetails?.id;
    let accountId = getState().account?.accountDetails[0]?.accountid;

    setCardLoading(true);

    try {
      const url = `${process.env.VITE_apiurl}/caas/card/block/${userId}/${accountId}/${cardId}`;

      const body = {
        blockAction: "permanentBlock",
        reason: reason?.value,
      };

      const response = await axiosInstance.post(url, body); // Use POST for account creation
      if (response.data.status === "BAD_REQUEST") {
        toast.error(response.data.message);
      } else if (response.data.status === "SUCCESS") {
        await dispatch(getCardsAPI(userId, accountId, "update"));
        toast.success(response.data.message);
        handleCloseCardModalActions();
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setCardLoading(false);
    }
  };

//Permanent Block Card
export const unBlockCardDetails =
  ({ cardId, setCardLoading }) =>
  async (dispatch, getState) => {
    let userId = getState().auth?.userDetails?.id;
    let accountId = getState().account?.accountDetails[0]?.accountid;

    setCardLoading(true);

    try {
      const url = `${process.env.VITE_apiurl}/caas/card/block/${userId}/${accountId}/${cardId}`;

      const body = {
        blockAction: "unblock",
        reason: "recovered",
      };

      const response = await axiosInstance.post(url, body); // Use POST for account creation
      if (response.data.status === "BAD_REQUEST") {
        toast.error(response.data.message);
      } else if (response.data.status === "SUCCESS") {
        await dispatch(getCardsAPI(userId, accountId, "update"));
        toast.success(response.data.message);
        handleCloseCardModalActions();
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      setCardLoading(false);
    }
  };

export const getContactDetails = (email) => async (dispatch, getState) => {
  try {
    const url = `${process.env.VITE_apiurl}/caas/user/${email}`;
    const response = await axiosInstance.get(url);
    console.log("Fetch contact user: ", response.data);

    if (response.data.status === "SUCCESS") {
      try {
        const urlAccountDetails = `${process.env.VITE_apiurl}/caas/account/${response.data.id}`;
        const responseAccountDetails = await axiosInstance.get(
          urlAccountDetails
        );

        if (responseAccountDetails.data.length > 0) {
          return { ...responseAccountDetails.data[0], ...response.data };
        } else {
          return { ...response.data };
        }
      } catch (e) {
        return handleApiError(e);
      }
    } else {
      return response.data;
    }
  } catch (e) {
    return handleApiError(e);
  } finally {
  }
};
