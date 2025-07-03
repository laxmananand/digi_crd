import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CreditCardView,
  CustomButton,
  CustomButtonSecondary,
  CustomInput,
  CustomModal,
  CustomSelect,
} from "../../@component_v2/CustomComponents";
import { useNavigate } from "react-router-dom";
import {
  AccountBalanceWallet,
  AddCard,
  AppRegistration,
  AttachMoney,
  Block,
  Cancel,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  CreditCardOff,
  CurrencyExchange,
  Delete,
  DoNotDisturb,
  EditNote,
  Email,
  GroupAdd,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  MergeType,
  NoAccounts,
  NorthEast,
  Notes,
  PanoramaFishEye,
  Password,
  PersonAddAlt1,
  PsychologyAlt,
  Search,
  Send,
  Settings,
  ShoppingCart,
  TripOrigin,
  Tune,
  VpnLock,
  WorkHistory,
} from "@mui/icons-material";
import { addAccount } from "./dashboard";
import regex from "./../utility/regex";
import { Card } from "react-bootstrap";
import { CircularProgress, Divider, Switch, Tooltip } from "@mui/material";
import { createVirtualAccountDetailsAPI } from "../../@redux/action/account";
import {
  createRecipient,
  fetchBanks,
  fetchContacts,
  fetchRates,
  fetchRecipientCountry,
  fetchRecipientCurrency,
  fetchRecipientForm,
  updateRecipientStatus,
} from "../../@redux/action/transaction";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import AsyncSelect from "react-select/async";
import {
  resetFormState,
  resetLists,
  setFormState,
} from "../../@redux/feature/transaction";
import "../../@component_v2/new-structure.css";
import { debounce } from "lodash";
import { sendMoneyCrossBorder } from "./../../@redux/action/transaction";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#212529",
    color: "white",
    fontFamily: "Figtree",
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12.5,
    fontFamily: "Figtree",
    fontWeight: 600,
    // color: "rgba(0, 0, 0, 0.55)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AsyncBankSelect = ({
  recCountry,
  onChange,
  label,
  className = "",
  required = true,
  style = {},
  helperText = "",
}) => {
  const dispatch = useDispatch();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "2px 12px",
      fontSize: "13px",
      borderRadius: "8px",
      border: "2px solid lightgrey",
      outline: state.isFocused ? "1px solid brown" : "none",
      backgroundColor: "rgba(211, 211, 211, 0.25)",
      fontWeight: 600,
      ...style, // Merge custom inline styles passed from the parent component
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "darkgrey" : null,
      fontWeight: 600,
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "brown",
        color: "white",
      },
    }),
  };

  // Fetch options based on input
  const loadOptions = debounce(async (inputValue) => {
    if (!inputValue || inputValue.length < 3) return []; // Minimum 5 characters before searching

    try {
      const response = await dispatch(fetchBanks(recCountry, inputValue));

      if (response.status === "SUCCESS") {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      return [];
    }
  }, 300); // Wait for 300ms after user stops typing

  return (
    <div className={`select-container ${className}`} style={{ width: "115%" }}>
      {label && (
        <label className="select-label">
          {label}
          {required && (
            <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
          )}
        </label>
      )}

      <AsyncSelect
        loadOptions={loadOptions}
        onChange={onChange}
        placeholder="Search Banks..."
        noOptionsMessage={() => "No bank(s) found"}
        styles={customStyles}
      />
      {helperText && <span className="select-helper-text">{helperText}</span>}
    </div>
  );
};

export const VA = ({ SetPage }) => {
  const kybDetails = useSelector((state) => state.auth.kycDetails);
  const vaDetails = useSelector((state) => state.account.virtualAccountDetails);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const type = useSelector((state) => state.auth.type);
  const account = useSelector((state) => state.account.virtualAccountDetails);

  const addVirtualAccount = async () => {
    try {
      setLoading(true);
      let res = await dispatch(createVirtualAccountDetailsAPI());
      if (res.status === "SUCCESS") {
        SetPage();
      }
    } catch (e) {
      toast.error("Something went wrong, please try again later!");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Card className={`p-4 w-100`}>
          <label className="pb-2 fw-500 border-bottom border-2 w-100 mb-3">
            Virtual Account Details
          </label>

          <div className="d-flex align-items-center flex-column justify-content-center gap-4 w-100 mt-4 mb-3">
            <CircularProgress size={40} sx={{ color: "brown" }} />
            <p className="fs-6">
              Hang tight! We're fetching your virtual account details in no
              time.
            </p>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className={`p-4 w-100`} style={{ borderRadius: 15 }}>
        <label className="pb-2 fw-500 border-bottom border-2 w-100 mb-3">
          Virtual Account Details
        </label>

        {vaDetails.length === 0 ? (
          <>
            <div className="d-flex flex-column justify-content-center align-items-center gap-3">
              <img src="/verification.png" alt="" style={{ width: 80 }} />

              <label htmlFor="" className="fs-7 text-secondary px-4">
                You don’t have a virtual account yet. Add one now to start
                transacting.
              </label>
              <CustomButton
                label={"Add Virtual Account"}
                icon={<AssuredWorkload />}
                onClick={addVirtualAccount}
                isLoading={isLoading}
                divClass="w-50"
              />
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                rowGap: "1.5rem",
                columnGap: "2rem",
              }}
            >
              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Account Holder Name
                </label>
                <p className="text-primary fw-bold fs-7">
                  {account[0].accountHolderName}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Account Type
                </label>
                <p className="text-primary fw-bold fs-7">Virtual Account</p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Account Number
                </label>
                <p className="text-primary fw-bold fs-7">
                  {account[0].accountNumber}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Bank Name
                </label>
                <p className="text-primary fw-bold fs-7">
                  {account[0].accountBankName}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Bank Country
                </label>
                <p className="text-primary fw-bold fs-7">
                  {account[0].accountBankCountry}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Bank Address
                </label>
                <p className="text-primary fw-bold fs-7">
                  {location.pathname === "/accounts"
                    ? account[0].accountBankAddress
                    : account[0].accountBankAddress.slice(0, 30) + "..."}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Bank Code
                </label>
                <p className="text-primary fw-bold fs-7">
                  {account[0].bankCode}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Created At
                </label>
                <p className="text-primary fw-bold fs-7">
                  {account[0].createdAt}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Status
                </label>
                <p className="text-success fw-bold fs-7">
                  {account[0].status.toUpperCase()}
                </p>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export const AddRecipient = ({ closeModal }) => {
  const dispatch = useDispatch();

  const [recType, setRecType] = useState(null);
  const [recCountry, setRecCountry] = useState(null);
  const [recCurrency, setRecCurrency] = useState(null);
  const type = useSelector((state) => state.auth.type);
  const [isLoading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const recCountryList = useSelector(
    (state) => state.transaction.recCountryList
  );
  const recCurrencyList = useSelector(
    (state) => state.transaction.recCurrencyList
  );

  const recTypeOptions = [
    { label: "Individual", value: "individual" },
    { label: "Business", value: "business" },
  ];

  // Fetch countries based on Recipient Type
  useEffect(() => {
    if (recType) {
      setRecCountry(null); // Reset country and currency
      setRecCurrency(null);
      dispatch(fetchRecipientCountry(recType.value, type));
    }
  }, [recType, dispatch]);

  // Fetch currencies based on Recipient Country
  useEffect(() => {
    if (recCountry) {
      setRecCurrency(null); // Reset currency
      dispatch(fetchRecipientCurrency(recCountry.value));
    }
  }, [recCountry, dispatch]);

  const [stage, setStage] = useState(0);
  const [formData, setFormData] = useState(null);

  const formState = useSelector((state) => state.transaction.formState);

  const handleInputChange = (field, value) => {
    dispatch(setFormState({ [field]: value }));
  };

  const [showAllFields, setShowAllFields] = useState(true);

  const FetchRecForm = async () => {
    dispatch(
      setFormState({
        recipient_type: recType?.value,
        receiving_currency: recCurrency?.value,
        recipient_country: recCountry?.value,
      })
    );

    try {
      setLoading(true);
      const response = await dispatch(
        fetchRecipientForm(recType?.value, recCountry?.value)
      );
      if (response.status === "SUCCESS") {
        setFormData(response.data);
        setStage(1);
      } else {
        toast.error(
          "We're facing some technical difficulties on our end, the current operation has been canceled. Please try again later."
        );
      }
    } catch (e) {
      toast.error(
        "An error occured when generating the recipient form, please try again later."
      );
      console.log("Form generation error: ", e);
    } finally {
      setLoading(false);
    }
  };

  const processCreateRecipientBody = ({ formState }) => {
    let user_data = null;
    if (recType?.value?.toLowerCase() === "individual") {
      user_data = {
        user_information: {
          first_name: formState.first_name,
          last_name: formState.last_name,
          email: formState.email,
          mobile_country_code: formState.mobile_country_code?.value,
          mobile: formState.mobile,
        },
      };
    } else {
      user_data = {
        business_information: {
          registered_org_name: formState.registered_org_name,
          trading_name: formState.trading_name,
          business_email: formState.business_email,
          registration_number: formState.registration_number,
          tax_id: formState.tax_id,
        },

        representative_info: {
          first_name: formState.first_name,
          last_name: formState.last_name,
          mobile_country_code: formState.mobile_country_code?.value,
          mobile: formState.mobile,
        },
      };
    }

    return {
      receiving_institution_type: "BANK",
      recipient_type: formState.recipient_type?.toUpperCase(),
      receiving_currency: formState.receiving_currency,
      recipient_country: formState.recipient_country,
      recipient_data: {
        ...user_data,
        address_details: {
          address_line_1: formState.address_line_1,
          address_line_2: formState.address_line_2,
          city: formState.city,
          state: formState.state,
          postal_code: formState.postal_code,
          country: formState.country?.value,
        },
        bank_details: {
          account_type: formState.account_type?.value,
          account_name: formState.account_name,
          account_number: formState.account_number,
          code: formState.code,
          bank_id: formState.bank_id?.value,
        },
        additional_data: {
          purpose_of_payment: formState.purpose_of_payment?.value,
          user_recipient_relationship:
            formState.user_recipient_relationship?.value,
        },
      },
    };
  };

  const parseValidationErrors = (errorResponse) => {
    if (!errorResponse?.source) return {};

    const errorMap = {};

    errorResponse.source.forEach((errorObj) => {
      const [fieldPath, message] = Object.entries(errorObj)[0];

      // Extract the field name for more readable error keys
      const fieldKey = fieldPath.split(".").pop();
      if (!errorMap[fieldKey]) errorMap[fieldKey] = [];

      errorMap[fieldKey].push(message);
    });

    return errorMap;
  };

  const CreateRecipient = async () => {
    let body = processCreateRecipientBody({
      recType,
      recCountry,
      recCurrency,
      formState,
    });

    console.log(body);

    try {
      setBtnLoading(true);

      let res = await dispatch(createRecipient({ body }));
      if (res.status === "SUCCESS") {
        toast.success(
          `Recipient ${
            formState.recipient_type === "individual"
              ? `${formState.first_name} ${formState.last_name}`
              : `${formState.registered_org_name}`
          } has been successfully added!`
        );
        dispatch(resetFormState());
        closeModal();
      } else {
        const parsedErrors = parseValidationErrors(res.data);
        // Loop through the parsed errors and display each in a toast
        Object.entries(parsedErrors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(`${field.toUpperCase()}: ${message}`);
          });
        });
      }
    } catch (e) {
      toast.error("Something went wrong, please try again later!");
      console.log(e);
    } finally {
      setBtnLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="d-flex flex-column align-items-center justify-content-center gap-4 my-5">
          <HashLoader color={"rgba(0,0,0,0.55)"} size={40} />
          <p className="fs-6 text-secondary">Loading... Please Wait...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {stage === 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridGap: "1.5rem",
            padding: "1rem",
          }}
        >
          <CustomSelect
            options={recTypeOptions}
            id="userType"
            value={recType}
            onChange={setRecType}
            className=""
            style={{}}
            label="Recipient Type"
            required
            leftIcon={<MergeType />}
          />

          <CustomSelect
            options={recCountryList || []}
            id="recipientCountry"
            value={recCountry}
            onChange={setRecCountry}
            label="Recipient Country"
            required
            leftIcon={<MergeType />}
            disabled={!recType} // Disabled until recipient type is selected
          />

          <CustomSelect
            options={recCurrencyList || []}
            id="recipientCurrency"
            value={recCurrency}
            onChange={setRecCurrency}
            label="Recipient Currency"
            required
            leftIcon={<MergeType />}
            disabled={!recCountry} // Disabled until recipient country is selected
          />
        </div>
      ) : (
        <>
          {formData?.map((item) => (
            <div className="w-100 p-3" key={item?.field_group_label}>
              <div className="d-flex align-items-start justify-content-between">
                <label className="fs-4 text-primary fw-bold mb-3">
                  {item?.field_group_label}
                </label>

                {(item?.field_group_key === "user_information" ||
                  item?.field_group_key === "business_information") && (
                  <div className="d-flex align-items-center">
                    <label className="fs-8 text-center text-secondary">
                      Show Required Fields Only?
                    </label>
                    <Switch
                      checked={showAllFields}
                      onChange={(e) => setShowAllFields(e.target.checked)}
                      color="disabled"
                    />
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridGap: "1rem",
                }}
              >
                {item?.fields?.map((fields, index) => {
                  // Skip non-mandatory fields if showAllFields is false
                  if (showAllFields && !fields?.is_mandatory) return null;

                  if (fields.field_key === "bank_id") {
                    return (
                      <>
                        <AsyncBankSelect
                          recCountry={formState.recipient_country}
                          onChange={(selectedBank) =>
                            handleInputChange(fields.field_key, selectedBank)
                          }
                          label={fields.field_label}
                        />
                      </>
                    );
                  } else if (fields?.values_supported?.length > 0) {
                    return (
                      <CustomSelect
                        key={fields.field_key}
                        options={fields.values_supported.map((option) => ({
                          label:
                            fields.field_key === "mobile_country_code"
                              ? `${option.description} (+${option.code})`
                              : option.description,
                          value: option.code,
                        }))}
                        id={fields.field_key}
                        value={formState[fields.field_key] || ""}
                        onChange={(selectedOption) =>
                          handleInputChange(fields.field_key, selectedOption)
                        }
                        label={fields.field_label}
                        required={fields.is_mandatory}
                      />
                    );
                  } else {
                    return (
                      <CustomInput
                        key={fields.field_key}
                        id={fields.field_key}
                        placeholder={`${fields.field_label}...`}
                        value={formState[fields.field_key] || ""}
                        onInput={(value) =>
                          handleInputChange(fields.field_key, value)
                        }
                        label={fields.field_label}
                        max={fields.validation?.max_length || 50}
                        regex={fields.validation?.regex}
                        required={fields.is_mandatory}
                      />
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </>
      )}

      <Divider className="my-2 mx-4" />

      <div className="d-flex w-100 justify-content-end align-items-center gap-3 mt-3">
        <CustomButtonSecondary
          label={`Back`}
          leftIcon={<KeyboardDoubleArrowLeft />}
          onClick={() => setStage(0)}
          divClass="w-15"
          disabled={stage === 0}
        />

        {stage === 0 ? (
          <CustomButton
            label={`Continue`}
            icon={<KeyboardDoubleArrowRight />}
            onClick={FetchRecForm}
            divClass="w-15"
          />
        ) : (
          <CustomButton
            label={`Create Recipient`}
            icon={<GroupAdd />}
            onClick={CreateRecipient}
            divClass="w-30"
            isLoading={btnLoading}
          />
        )}
      </div>
    </>
  );
};

export const CrossBorderTransfer = ({ closeModal, activeRec }) => {
  const dispatch = useDispatch();
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [rate, setRate] = useState(null);

  const [stage, setStage] = useState(0);

  const getRate = async () => {
    let amount = "";
    let quoteType = "";

    if (payAmount) {
      amount = payAmount;
      quoteType = "FORWARD";
    } else if (receiveAmount) {
      amount = receiveAmount;
      quoteType = "REVERSE";
    }

    if (!amount) {
      toast.error(
        "Enter either the 'Pay Amount' or the 'Receive Amount' to continue."
      );
      return;
    }

    try {
      setLoading(true);
      let response = await dispatch(
        fetchRates(
          amount,
          activeRec?.receiving_institution_type,
          activeRec?.recipient_type,
          activeRec?.receiving_currency,
          activeRec?.recipient_country,
          quoteType
        )
      );

      if (response.status === "SUCCESS") {
        setRate(response.data);
        setStage(1);
      } else {
        toast.error("Error Fetch Transaction Rates: " + response.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return "0.0.0.0"; // Fallback IP
    }
  };

  const generateTosAcceptance = async () => {
    const ip = await fetchIp();
    return {
      date: new Date().toISOString(),
      ip,
      service_agreement: "Standard Service Agreement",
      user_agent: navigator.userAgent,
      device_id: Math.random().toString(36).substring(2, 15),
    };
  };

  const SendMoneyCrossBorder = async () => {
    let quote_id = rate?.id;
    let recipient_id = activeRec?.id;
    let tos_acceptance = await generateTosAcceptance();

    if (!quote_id || !recipient_id) {
      toast.error(
        "An error occured during the current transaction, please try again later."
      );
      return;
    }

    const body = {
      quote_id,
      recipient_id,
      tos_acceptance,
      remarks,
    };

    try {
      setLoading(true);
      let response = await dispatch(sendMoneyCrossBorder({ body }));

      if (response.status === "SUCCESS") {
        toast.success("Transaction Successful");
        closeModal();
      } else {
        toast.error("Transaction Failed: " + response.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pb-3 border-bottom d-flex flex-column w-100 justify-content-between align-items-center gap-3 my-3 px-2">
        <CustomInput
          type={"email"}
          id="email"
          placeholder="Enter your email address..."
          value={
            activeRec?.recipient_type?.toLowerCase() === "individual"
              ? activeRec?.user_information?.email
              : activeRec?.business_information?.business_email
          }
          label="Recipient Email"
          required
          leftIcon={<Email />}
          max={100}
          disabled
        />

        <div className="d-flex w-100 justify-content-between align-items-center gap-4">
          <CustomInput
            type={"amount"}
            id="email"
            placeholder="What amount do you want to pay?"
            value={payAmount}
            onInput={setPayAmount}
            label="Pay Amount"
            required
            max={1000000}
            disabled={receiveAmount}
            regex={regex.amount}
            rightIcon={<div className="fs-7 text-secondary fw-bold">USD</div>}
          />

          <div className="pt-3 text-secondary fw-bold">OR</div>

          <CustomInput
            type={"amount"}
            id="email"
            placeholder="What amount do you want them to receive?"
            value={receiveAmount}
            onInput={setReceiveAmount}
            label="Receive Amount"
            required
            max={1000000}
            disabled={payAmount}
            regex={regex.amount}
            rightIcon={<div className="fs-7 text-secondary fw-bold">INR</div>}
          />
        </div>

        {rate ? (
          <div className="w-100 py-3 ps-2">
            <p className="fs-6 fw-500 fw-bold pb-2 text-primary">
              Rate Details:
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: 5,
                width: "100%",
              }}
            >
              {/* <p>
              <strong>Transaction ID:</strong> {rate.id}
            </p> */}
              <p>
                <strong>Delivery Time:</strong> {rate.delivery_time}
              </p>
              <p>
                <strong>Charged Amount:</strong> {rate.charged_amount.amount}{" "}
                {rate.charged_amount.currency}
              </p>
              <p>
                <strong>Converted Amount:</strong>{" "}
                {rate.converted_amount.amount} {rate.converted_amount.currency}
              </p>
              <p>
                <strong>Recipient Amount:</strong>{" "}
                {rate.recipient_amount.amount} {rate.recipient_amount.currency}
              </p>
              {/* <p>
              <strong>Recipient Type:</strong> {rate.recipient_type}
            </p>
            <p>
              <strong>Source Country:</strong> {rate.source_country}
            </p>
            <p>
              <strong>Source Currency:</strong> {rate.source_currency}
            </p>
            <p>
              <strong>Status:</strong> {rate.status}
            </p> */}
              <p>
                <strong>Platform Fee:</strong> {rate.fees.platform_fee.amount}{" "}
                {rate.fees.platform_fee.currency}
              </p>
              <p>
                <strong>FX Rate:</strong> {parseFloat(rate.fx_rate).toFixed(2)}
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}

        <CustomInput
          type={"alphanumeric"}
          id="email"
          placeholder="Add a remark..."
          value={remarks}
          onInput={setRemarks}
          label="Remarks (optional)"
          leftIcon={<EditNote />}
          max={100}
        />
      </div>

      <div className="d-flex justify-content-center">
        {stage === 0 ? (
          <CustomButton
            label={"Get Rate"}
            icon={<CurrencyExchange />}
            onClick={getRate}
            isLoading={isLoading}
            divClass={"w-30"}
          />
        ) : (
          <CustomButton
            label={"Send Money"}
            icon={<NorthEast />}
            onClick={SendMoneyCrossBorder}
            isLoading={isLoading}
            divClass={"w-30"}
          />
        )}
      </div>
    </>
  );
};

export const Recipients = ({ SetPage }) => {
  const userDetails = useSelector((state) => state.auth.userDetails);
  const kybDetails = useSelector((state) => state.auth.kycDetails);
  const vaDetails = useSelector((state) => state.account.virtualAccountDetails);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const type = useSelector((state) => state.auth.type);
  const account = useSelector((state) => state.account.virtualAccountDetails);
  const transactions = useSelector((state) => state.account.contacts);

  const [recType, setRecType] = useState("");
  const [recStatus, setRecStatus] = useState("");
  const recStatusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "ACTIVE" },
    { label: "Pending", value: "PENDING" },
    { label: "Blocked", value: "BLOCKED" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipients = transactions.filter((row) => {
    const isIndividual = row.recipient_type === "INDIVIDUAL";

    // Extract recipient details
    const name = isIndividual
      ? `${row.user_information?.first_name || ""} ${
          row.user_information?.last_name || ""
        }`
      : row.business_information?.registered_org_name || "N/A";

    const email = isIndividual
      ? row.user_information?.email || "N/A"
      : row.business_information?.business_email || "N/A";

    const phone = isIndividual
      ? `+${row.user_information?.mobile_country_code || ""} ${
          row.user_information?.mobile || ""
        }`
      : `+${row.representative_info?.mobile_country_code || ""} ${
          row.representative_info?.mobile || ""
        }`;

    const accountNumber = row.bank_details?.account_number || "N/A";

    // **1️⃣ Apply Status Filter**
    const matchesStatus = recStatus === "" || row.status === recStatus;

    // **2️⃣ Apply Search Query**
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      phone.toLowerCase().includes(searchLower) ||
      accountNumber.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const [show, setShow] = useState(false);

  const closeModal = () => {
    setShow(false);
  };

  const [activeRec, setActiveRec] = useState({});

  const [showTransfer, setShowTransfer] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const closeModalTransfer = () => {
    setShowTransfer(false);
  };

  const FetchRecipients = async (type) => {
    try {
      setLoading(true);
      let res = await dispatch(fetchContacts(type));
      // if (res.status === "SUCCESS") {
      //   SetPage();
      // }
    } catch (e) {
      toast.error("Something went wrong, please try again later!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchRecipients(recType);
  }, []);

  if (isLoading) {
    return (
      <>
        <Card className={`p-4 w-100`} style={{ borderRadius: 15 }}>
          <div className="d-flex w-100 align-items-center justify-content-between pb-2 fw-500 border-bottom border-2 mb-3">
            <label className="">Recipient(s)</label>

            <CustomButton
              label={`Add Recipient`}
              icon={<PersonAddAlt1 />}
              onClick={() => {
                dispatch(resetLists());
                setShow(true);
              }}
              divClass="w-15"
              disabled
            />
          </div>

          <div className="table-controls d-flex align-items-center gap-4">
            <CustomInput
              type="alphanumeric"
              id="search"
              placeholder="Search..."
              value={searchQuery}
              onInput={setSearchQuery}
              label="Search Recipients"
              leftIcon={<Search />}
              max={35}
              disabled
            />

            <CustomSelect
              options={[
                { label: "Individual", value: "individual" },
                { label: "Business", value: "business" },
              ]}
              id="userType"
              value={
                recType
                  ? {
                      label:
                        recType === "individual" ? "Individual" : "Business",
                      value: recType,
                    }
                  : { label: "Individual", value: "individual" } // Default to Individual
              }
              onChange={(selectedOption) => setRecType(selectedOption.value)}
              className=""
              style={{}}
              label="Recipient Type"
              required
              leftIcon={<MergeType />}
              disabled
            />

            <CustomSelect
              options={recStatusOptions}
              id="recipientStatus"
              value={
                recStatus
                  ? {
                      label:
                        recStatusOptions.find((opt) => opt.value === recStatus)
                          ?.label || "Active",
                      value: recStatus,
                    }
                  : { label: "Active", value: "active" } // Default to Individual
              }
              onChange={(selectedOption) => setRecStatus(selectedOption.value)}
              className=""
              style={{}}
              label="Recipient Status"
              required
              leftIcon={<MergeType />}
              disabled
            />
          </div>

          <div className="d-flex align-items-center flex-column justify-content-center gap-4 w-100 mt-4 mb-3">
            <CircularProgress size={40} sx={{ color: "#212529" }} />
            <p className="fs-7">Fetching recipients, please wait...</p>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className={`p-4 w-100`}>
        <div className="d-flex w-100 align-items-center justify-content-between pb-2 fw-500 border-bottom border-2 mb-3">
          <label className="">Recipient(s)</label>

          <CustomButton
            label={`Add Recipient`}
            icon={<PersonAddAlt1 />}
            onClick={() => {
              dispatch(resetLists());
              setShow(true);
            }}
            divClass="w-15"
          />
        </div>

        <div className="table-controls d-flex align-items-center gap-4">
          <CustomInput
            type="alphanumeric"
            id="search"
            placeholder="Search..."
            value={searchQuery}
            onInput={setSearchQuery}
            label="Search Recipients"
            leftIcon={<Search />}
            max={35}
            disabled={transactions.length === 0}
          />

          <CustomSelect
            options={[
              { label: "All", value: "" },
              { label: "Individual", value: "individual" },
              { label: "Business", value: "business" },
            ]}
            id="userType"
            value={
              recType
                ? {
                    label: recType === "individual" ? "Individual" : "Business",
                    value: recType,
                  }
                : { label: "All", value: "" } // Default to Individual
            }
            onChange={(selectedOption) => {
              setRecType(selectedOption.value);

              FetchRecipients(selectedOption.value);
            }}
            className=""
            style={{}}
            label="Recipient Type"
            required
            leftIcon={<MergeType />}
          />

          <CustomSelect
            options={recStatusOptions}
            id="recipientStatus"
            value={
              recStatus
                ? {
                    label:
                      recStatusOptions.find((opt) => opt.value === recStatus)
                        ?.label || "Active",
                    value: recStatus,
                  }
                : { label: "All", value: "" } // Default to Individual
            }
            onChange={(selectedOption) => setRecStatus(selectedOption.value)}
            className=""
            style={{}}
            label="Recipient Status"
            required
            leftIcon={<MergeType />}
          />
        </div>

        <TableContainer component={Paper} className="mt-4">
          <Table sx={{ minWidth: "100%" }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Recipient Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone Number</StyledTableCell>
                <StyledTableCell>Bank Account Number</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecipients.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={6} align="center">
                    No recipients found.
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                filteredRecipients.map((row, index) => {
                  const isIndividual = row.recipient_type === "INDIVIDUAL";

                  const name = isIndividual
                    ? `${row.user_information?.first_name || ""} ${
                        row.user_information?.last_name || ""
                      }`
                    : row.business_information?.registered_org_name || "N/A";

                  const email = isIndividual
                    ? row.user_information?.email || "N/A"
                    : row.business_information?.business_email || "N/A";

                  const phone = isIndividual
                    ? `+${row.user_information?.mobile_country_code || ""} ${
                        row.user_information?.mobile || ""
                      }`
                    : `+${row.representative_info?.mobile_country_code || ""} ${
                        row.representative_info?.mobile || ""
                      }`;

                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell
                        sx={{
                          color:
                            row.status === "ACTIVE"
                              ? "green"
                              : row.status === "PENDING"
                              ? "orange"
                              : row.status === "BLOCKED"
                              ? "red"
                              : row.status === "INACTIVE"
                              ? "gray"
                              : row.status === "DELETED"
                              ? "brown"
                              : "black",
                          fontWeight: "bold",
                        }}
                      >
                        {row.status}
                      </StyledTableCell>
                      <StyledTableCell>{name}</StyledTableCell>
                      <StyledTableCell>{email}</StyledTableCell>
                      <StyledTableCell>{phone}</StyledTableCell>
                      <StyledTableCell>
                        {row.bank_details?.account_number || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className="d-flex justify-content-between align-item-center gap-1">
                          {actionLoading ? (
                            <>
                              <HashLoader color="black" size={20} />
                            </>
                          ) : (
                            <>
                              {row.status === "ACTIVE" && (
                                <Tooltip
                                  title="Delete Recipient"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        fontFamily: "Figtree",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "white",
                                        backgroundColor: "#333",
                                        padding: "8px 12px",
                                        borderRadius: "4px",
                                      },
                                    },
                                  }}
                                >
                                  <Delete
                                    fontSize="small"
                                    sx={{ color: "brown", cursor: "pointer" }}
                                    onClick={async () => {
                                      await dispatch(
                                        updateRecipientStatus({
                                          id: row?.id,
                                          status: "DELETE",
                                          setActionLoading,
                                        })
                                      );
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {row.status === "ACTIVE" && (
                                <Tooltip
                                  title="Deactivate Recipient"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        fontFamily: "Figtree",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "white",
                                        backgroundColor: "#333",
                                        padding: "8px 12px",
                                        borderRadius: "4px",
                                      },
                                    },
                                  }}
                                >
                                  <NoAccounts
                                    fontSize="small"
                                    color="secondary"
                                    sx={{ cursor: "pointer" }}
                                    onClick={async () => {
                                      await dispatch(
                                        updateRecipientStatus({
                                          id: row?.id,
                                          status: "DEACTIVATE",
                                          setActionLoading,
                                        })
                                      );
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {row.status === "ACTIVE" && (
                                <Tooltip
                                  title="Block Recipient"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        fontFamily: "Figtree",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "white",
                                        backgroundColor: "#333",
                                        padding: "8px 12px",
                                        borderRadius: "4px",
                                      },
                                    },
                                  }}
                                >
                                  <Block
                                    fontSize="small"
                                    sx={{ cursor: "pointer", color: "red" }}
                                    onClick={async () => {
                                      await dispatch(
                                        updateRecipientStatus({
                                          id: row?.id,
                                          status: "BLOCK",
                                          setActionLoading,
                                        })
                                      );
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {row.status === "INACTIVE" && (
                                <Tooltip
                                  title="Activate Recipient"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        fontFamily: "Figtree",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "white",
                                        backgroundColor: "#333",
                                        padding: "8px 12px",
                                        borderRadius: "4px",
                                      },
                                    },
                                  }}
                                >
                                  <TripOrigin
                                    fontSize="small"
                                    color="primary"
                                    sx={{ cursor: "pointer" }}
                                    onClick={async () => {
                                      await dispatch(
                                        updateRecipientStatus({
                                          id: row?.id,
                                          status: "ACTIVATE",
                                          setActionLoading,
                                        })
                                      );
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {row.status === "ACTIVE" && (
                                <Tooltip
                                  title="Send Money"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        fontFamily: "Figtree",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "white",
                                        backgroundColor: "#333",
                                        padding: "8px 12px",
                                        borderRadius: "4px",
                                      },
                                    },
                                  }}
                                >
                                  <Send
                                    fontSize="small"
                                    color="success"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setActiveRec(row);
                                      setShowTransfer(true);
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </>
                          )}
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CustomModal
        isOpen={show}
        handleClose={closeModal}
        children={<AddRecipient closeModal={closeModal} />}
        headerText="Add New Recipient"
      />

      <CustomModal
        isOpen={showTransfer}
        handleClose={closeModalTransfer}
        children={
          <CrossBorderTransfer
            closeModal={closeModalTransfer}
            activeRec={activeRec}
          />
        }
        headerText="Add New Recipient"
      />
    </>
  );
};

export const Remittance = () => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.auth.userDetails);
  const type = useSelector((state) => state.auth.type);
  const kybDetails = useSelector((state) => state.auth.kycDetails);
  const program = useSelector((state) => state.utility.program);
  const account = useSelector((state) => state.account.accountDetails);
  const va = useSelector((state) => state.account.virtualAccountDetails);

  const SetPage = () => {
    navigate(0);
  };

  if (!userDetails) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4 vh-80">
        <div className="d-flex flex-column justify-content-center align-items-center gap-1">
          <img src="/kyc.png" alt="" style={{ width: 250 }} />

          <label className="text-secondary">
            Whoops! It looks like you haven't registered yet.
          </label>
        </div>

        <CustomButton
          label={"Register Now"}
          icon={<AppRegistration />}
          style={{ width: 350, margin: "0 auto" }}
          isLoading={isLoading}
          onClick={() => {
            dispatch(setActiveTab("Dashboard"));
            navigate("/dashboard");
          }}
        />
      </div>
    );
  }

  if (
    program === "SMMACS0" &&
    ((type === "individual" &&
      kybDetails?.kycStatus?.toLowerCase() !== "completed") ||
      (type === "business" &&
        kybDetails?.kybStatus?.toLowerCase() !== "completed"))
  ) {
    return (
      <>
        {type === "individual" &&
        kybDetails.kycStatus.toLowerCase() !== "completed" ? (
          <>
            <div
              className="d-flex flex-column justify-content-center align-items-center gap-4"
              style={{ height: "80vh", padding: "0 20rem" }}
            >
              <img
                src="/verification.png"
                alt=""
                style={{ width: 300, height: 300, objectFit: "cover" }}
              />

              <label
                htmlFor=""
                className="fs-7 text-secondary px-2 text-center"
              >
                {kybDetails?.kycStatus.toLowerCase() === "pending"
                  ? `Your KYC verification hasn't been started yet. Complete the process now to add your virtual account.`
                  : `We've received your KYC documents and is currently under review. We'll notify you once verification is complete.`}
              </label>
              {kybDetails?.kycStatus.toLowerCase() === "pending" ? (
                <CustomButton
                  label={`Complete ${type === "business" ? "KYB" : "KYC"}`}
                  icon={<WorkHistory />}
                  onClick={() => {
                    dispatch(setActiveTab("Settings"));
                    navigate(
                      `/settings/${type === "business" ? "kyb" : "kyc"}`
                    );
                  }}
                  isLoading={isLoading}
                  divClass="w-60"
                />
              ) : (
                <CustomButton
                  label={`Check ${type === "business" ? "KYB" : "KYC"} Details`}
                  icon={<WorkHistory />}
                  onClick={() => {
                    dispatch(setActiveTab("Settings"));
                    navigate(
                      `/settings/${type === "business" ? "kyb" : "kyc"}`
                    );
                  }}
                  isLoading={isLoading}
                  divClass="w-60"
                />
              )}
            </div>
          </>
        ) : type === "business" && kybDetails.kybStatus !== "completed" ? (
          <>
            <div
              className="d-flex flex-column justify-content-center align-items-center gap-4"
              style={{ height: "80vh", padding: "0 20rem" }}
            >
              <img
                src="/verification.png"
                alt=""
                style={{ width: 300, height: 300, objectFit: "cover" }}
              />

              <label
                htmlFor=""
                className="fs-7 text-secondary px-2 text-center"
              >
                {kybDetails?.kybStatus === "not_submitted"
                  ? `Your business verification (${
                      type === "business" ? "KYB" : "KYC"
                    }) hasn't been submitted yet. Complete the process now to activate your account.`
                  : `Your ${
                      type === "business" ? "KYB" : "KYC"
                    } documents have been submitted and are currently under review. We'll notify you once verification is complete.`}
              </label>
              {kybDetails?.kybStatus === "not_submitted" ? (
                <CustomButton
                  label={`Complete ${type === "business" ? "KYB" : "KYC"}`}
                  icon={<WorkHistory />}
                  onClick={() => {
                    dispatch(setActiveTab("Settings"));
                    navigate(
                      `/settings/${type === "business" ? "kyb" : "kyc"}`
                    );
                  }}
                  isLoading={isLoading}
                  divClass="w-60"
                />
              ) : (
                <CustomButton
                  label={`Check ${type === "business" ? "KYB" : "KYC"} Details`}
                  icon={<WorkHistory />}
                  onClick={() => {
                    dispatch(setActiveTab("Settings"));
                    navigate(
                      `/settings/${type === "business" ? "kyb" : "kyc"}`
                    );
                  }}
                  isLoading={isLoading}
                  divClass="w-60"
                />
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }

  if (account.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4 vh-80">
        <img src="/banks/bank-icon.svg" alt="" style={{ width: "10%" }} />

        <label className="text-secondary">
          It looks like you haven't added your account yet.
        </label>

        <CustomButton
          label={"Add Account"}
          icon={<AccountBalanceWallet />}
          style={{ width: 350, margin: "0 auto" }}
          isLoading={isLoading}
          onClick={() => addAccount({ dispatch, setLoading, SetPage })}
        />
      </div>
    );
  }

  if (va.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4 vh-80">
        <img src="/banks/bank-icon.svg" alt="" style={{ width: "10%" }} />

        <label className="text-secondary">
          It looks like you haven't added your virtual account yet.
        </label>

        <CustomButton
          label={"Add Account"}
          icon={<AccountBalanceWallet />}
          style={{ width: 350, margin: "0 auto" }}
          isLoading={isLoading}
          onClick={() => addAccount({ dispatch, setLoading, SetPage })}
        />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <VA SetPage={SetPage} />
      <Recipients SetPage={SetPage} />
    </div>
  );
};

export default Remittance;
