import axios from "axios";
import { setQuote } from "../feature/quotes";
import { toast } from "react-toastify";

import { addLoader, removeLoader } from "../feature/Utility";

const callProxy = async (data, getState) => {
  let config = {
    method: "post",
    url: `${getState().auth.baseurl}/remittance`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    toast.error(error.response.data?.message);
    return {};
  }
};

export const getQuoteDetailsAPI =
  (forwardAmount, reverseAmount, recipientId, modalRef, setIsPending) =>
  async (dispatch, getState) => {
    setIsPending(true);
    dispatch(addLoader());

    const recipientDetails = getState().recipient.recipientDetails?.data;
    const recipient = recipientDetails?.find((row) => row.id === recipientId);

    let data = {
      method: "post",
      url: `${process.env.remiturl}/sgstlupy/v2/users/wallets/payouts/remittances/quotes`,
      body: {
        amount: forwardAmount || reverseAmount,
        quote_type: forwardAmount ? "FORWARD" : "REVERSE",
        recipient_country: recipient?.recipient_country,
        receiving_currency: recipient?.receiving_currency,
        recipient_type: recipient?.recipient_type,
        receiving_institution_type: "BANK",
      },
    };

    callProxy(data, getState)
      .then((data) => {
        setIsPending(false);
        dispatch(removeLoader());
        if (data?.quote?.status === "CONFIRMED") {
          dispatch(setQuote(data?.quote));
          modalRef.current.click();
        } else if (data?.status >= 400) {
          toast.error(data?.detail);
        } else if (data?.status === "BAD_REQUEST") {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        setIsPending(false);
        console.log(error);
        dispatch(removeLoader());
      });
  };
