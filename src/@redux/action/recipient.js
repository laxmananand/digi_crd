import axios from "axios";
import {
  setFormSchema,
  setPaymentStatus,
  setPending,
  setRecipient,
  setRecipientCountry,
  setRecipientCurrencyList,
  setRecipientDetails,
} from "../feature/recipient";
import { toast } from "react-toastify";

import { addLoader, removeLoader } from "../feature/Utility";

function convertToNewFormat(inputArray) {
  let result = {};

  inputArray.forEach((item) => {
    for (let key in item) {
      let splitKeys = key.split(".");
      let value = item[key];
      let current = result;

      splitKeys.forEach((subKey, index) => {
        if (index === splitKeys.length - 1) {
          current[subKey] = value;
        } else {
          current[subKey] = current[subKey] || {};
          current = current[subKey];
        }
      });
    }
  });

  return result;
}

const callProxy = async (data, getState) => {
  let config = {
    method: "post",
    url: `${getState().auth.baseurl}/remittance`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    toast.error(error.response.data?.message);
    return { status: "BAD_REQUEST" };
  }
};

export const getFormSchemaAPI =
  (recipient_type, recipient_country) => async (dispatch, getState) => {
    let data = {
      method: "get",
      url: `${process.env.remiturl}/sgstlupy/v2/users/wallets/payouts/remittances/recipients/forms?recipient_type=${recipient_type}&recipient_country=${recipient_country}`,
    };

    dispatch(setFormSchema([]));
    dispatch(setRecipientCountry(recipient_country));

    callProxy(data, getState)
      .then((data) => {
        if (data?.recipient_form) dispatch(setFormSchema(data?.recipient_form));
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getCountryListForRecipientAPI =
  () => async (dispatch, getState) => {
    let data = {
      method: "get",
      url: `${
        process.env.remiturl
      }/sgstlupy/v2/payouts/remittances/utilities/countries?records_per_page=100&sort_order=asc&status=active&user_type=${
        getState().auth.userType?.toLowerCase() === "individual"
          ? "INDIVIDUAL"
          : "BUSINESS"
      }`,
    };

    callProxy(data, getState)
      .then((response) => {
        if (response?.data)
          dispatch(setRecipient({ recipientCountryList: response?.data }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getCurrencyListForRecipientAPI =
  (country, setIsLoading) => async (dispatch, getState) => {
    setIsLoading(true);
    dispatch(setRecipientCurrencyList([]));
    let data = {
      method: "get",
      url: `${process.env.remiturl}/sgstlupy/v2/payouts/remittances/utilities/currencies?status=active&search=${country}`,
    };
    dispatch(setRecipientCountry(country));

    callProxy(data, getState)
      .then((data) => {
        if (Array.isArray(data?.data)) {
          const filterData = data?.data?.filter(
            (item) => item.country === country
          );
          const formattedData = filterData?.[0]?.currencies?.map((item) => ({
            label: item?.currency_name,
            value: item?.currency_code,
          }));
          dispatch(setRecipientCurrencyList(formattedData));
          dispatch(setRecipientCountry(country));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

export const getBankAccountAPI =
  (name, setIsLoading) => async (dispatch, getState) => {
    setIsLoading(true);

    let data = {
      method: "get",
      url: `${
        process.env.remiturl
      }/sgstlupy/v2/users/wallets/payouts/remittances/corridors/${
        getState().recipient?.recipient_country
      }/institutions/bank?page=1&records_per_page=100&name=${name}&sort_fields=name&sort_order=asc&status=active`,
    };

    callProxy(data, getState)
      .then((response) => {
        if (response?.data) {
          const options = response?.data;
          const filterOptions = options?.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          dispatch(setRecipient({ bankOptions: filterOptions }));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

export const getBranchAccountAPI =
  (bank_id, setIsLoading = () => {}, name = "") =>
  async (dispatch, getState) => {
    setIsLoading(true);

    let data = {
      method: "get",
      url: `${
        process.env.remiturl
      }/sgstlupy/v2/users/wallets/payouts/remittances/BANK/branches/${
        bank_id || getState()?.recipient?.bankId
      }?records_per_page=100&name=${name}`,
    };

    dispatch(setRecipient({ branchOptions: [] }));
    callProxy(data, getState)
      .then((response) => {
        if (response?.data) {
          const options = response?.data;
          const filterOptions = options?.map((item) => ({
            label: item.code + " ( " + item.name + " )",
            value: item.code,
            branch_id: item.id,
          }));
          dispatch(setRecipient({ branchOptions: filterOptions }));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

export const createRecipientAPI =
  (body, closeRef, setPending, setErrors) => async (dispatch, getState) => {
    setPending(true);
    let data = {
      method: "post",
      url: `${process.env.remiturl}/sgstlupy/v2/users/wallets/payouts/remittances/recipients`,
      body,
    };

    callProxy(data, getState)
      .then((data) => {
        if (Number(data?.status) >= 400) {
          if (data?.code === "validation_error") {
            const source = data?.source;
            const errors = convertToNewFormat(source);
            setErrors(errors?.recipient_data);
          } else {
            toast.error(data?.detail);
          }
          setPending(false);
          return;
        }
        if (data?.status !== "BAD_REQUEST") {
          toast.success("Recipient Created Successful");
          dispatch(getRecipientsAPI(setPending));
          closeRef.current?.click();
        }
      })
      .catch((error) => {
        setPending(false);
      });
  };

export const getRecipientsAPI =
  (setPending = () => {}, forDownload = false, setData) =>
  async (dispatch, getState) => {
    setPending(true);
    const page = getState().recipient.currentPage;
    const status = getState().recipient.currentStatus;

    let data = {
      method: "get",
      url: `${
        process.env.remiturl
      }/sgstlupy/v2/users/wallets/payouts/remittances/recipients?page=${page}&records_per_page=${
        forDownload ? "100" : "10"
      }&status=${status}`,
    };

    callProxy(data, getState)
      .then((data) => {
        if (data?.data) {
          if (forDownload) {
            setData(data?.data);
            if (data?.pagination?.total_pages != 1) {
              toast.warn("Top 100 entries downloaded");
            }
            return;
          } else dispatch(setRecipientDetails(data));
        } else dispatch(setRecipientDetails({ data: [] }));
        setPending(false);
      })
      .catch((error) => {
        console.log(error);
        setPending(false);
      });
  };

export const sendMoneyAPI =
  (recipient_id, remarks, setSendingMoney) => async (dispatch, getState) => {
    setSendingMoney(true);
    dispatch(addLoader());

    let data = {
      method: "post",
      url: `${process.env.remiturl}/sgstlupy/v2/users/wallets/payouts/remittances/transactions`,
      body: {
        quote_id: getState().quotes?.quote?.id,
        recipient_id: recipient_id,
        tos_acceptance: {
          date: new Date(),
          ip: "49.37.9.100",
          service_agreement: "string",
          user_agent:
            "AMozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1",
          device_id: "string",
        },
        remarks: remarks,
      },
    };

    callProxy(data, getState)
      .then((res) => {
        dispatch(setPending(false));
        if (res.status >= 400) dispatch(setPaymentStatus({ status: "failed" }));
        else dispatch(setPaymentStatus({ status: "success" }));
        setSendingMoney(false);
        dispatch(removeLoader());
      })
      .catch((error) => {
        console.log(error);
        dispatch(setPending(false));
        dispatch(setPaymentStatus({ status: "failed" }));
        setSendingMoney(false);
        dispatch(removeLoader());
      });
  };

export const statusUpdate =
  (recipient_id, newStatus, setPending) => async (dispatch, getState) => {
    setPending(true);

    let data = {
      method: "put",
      url: `${process.env.remiturl}/sgstlupy/v2/users/wallets/payouts/remittances/recipients/${recipient_id}/statuses`,
      body: {
        status: newStatus,
      },
    };

    callProxy(data, getState)
      .then((res) => {
        if (Number(res?.status) !== NaN && res?.status >= 400) {
          toast.error(res.detail);
          setPending(false);
          return;
        }

        let message = "";
        if (newStatus === "ACTIVATE") message = "activated.";
        if (newStatus === "DEACTIVATE") message = "deactivated.";
        if (newStatus === "DELETE") message = "deleted.";
        if (newStatus === "BLOCK") message = "blocked.";
        toast.success("User is successfully " + message);
        dispatch(getRecipientsAPI(setPending));
      })
      .catch((error) => {
        console.log(error);
        setPending(false);
        toast.error("Status change failed!");
      });
  };

export const sendMoneyP2PAPI =
  (data, callSuccess) => async (dispatch, getState) => {
    dispatch(addLoader());

    let config = {
      method: "post",
      url: `${getState().auth.baseurl}/fund/transfer`,
      data,
    };

    axios(config)
      .then((res) => {
        if (res.data.status === "BAD_REQUEST") toast.error(res.data.message);

        if (res.data.status === "SUCCESS") {
          toast.success(res.data.message);
          callSuccess();
        }
        dispatch(removeLoader());
      })
      .catch((error) => {
        dispatch(removeLoader());
      });
  };

export const transferEligibilityCheck =
  (setPending, email, userType, setIsRecipientVerified, setName) =>
  async (dispatch, getState) => {
    setPending(true);

    let config = {
      method: "get",
      url: `${
        getState().auth.baseurl
      }/utilities/searchuserbyemail?email=${email}&userType=${userType}`,
    };

    axios(config)
      .then((res) => {
        if (res.data.status === "BAD_REQUEST")
          toast.error("Not Eligible for Transfer Money");

        if (res.data.status === "SUCCESS") {
          setIsRecipientVerified(true);
          setName(res.data.name);
        }
        setPending(false);
      })
      .catch((error) => {
        toast.error("Not Eligible for Transfer Money");
        setPending(false);
      });
  };
