import {
  AccountBalanceWallet,
  AppRegistration,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  WorkHistory,
  EmailOutlined,
  Email,
  TransferWithinAStation,
  Public,
  PublicOutlined,
  Person,
  CurrencyExchange,
  Paid,
  KeyboardArrowDown,
  NoteAdd,
  Note,
  Send,
  Settings,
  GroupAdd,
  VideoLabel,
  ChangeCircleOutlined,
  DoneAll,
  CheckCircle,
  ChangeCircle,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAccount } from "./dashboard";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../../@redux/feature/Utility";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Card,
  Divider,
  Avatar,
} from "@mui/material";
import {
  CustomInput,
  CustomButton,
  CustomSelect,
  CustomButtonSecondary,
} from "../../@component_v2/CustomComponents";
import regex from "../utility/regex";
import { getContactDetails } from "../../@redux/action/account";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import { PaymentTransfer } from "../../@redux/action/transaction";
import { LastTransactions } from "./accounts";

const formatDate = (date) => {
  return (
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " • " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
};
const steps = [
  {
    label: "Select Receipient",
  },
  {
    label: "Enter Amount",
  },
  {
    label: "Review Transaction",
  },
  {
    label: "Transaction Success",
  },
];

export function VerticalLinearStepper({ activeStep }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-4 py-2">
      {steps.map((step, index) => (
        <div className="d-flex flex-column align-items-start justify-content-center gap-2">
          <div
            className={`border ${
              activeStep === index
                ? "bg-dark border-dark"
                : "bg-secondary border-secondary opacity-25"
            }`}
            style={{ width: 200, borderRadius: 30, height: 5 }}
          ></div>
          <p className={`${activeStep === index ? "text-dark fw-600" : ""}`}>
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export const Payment = () => {
  const dispatch = useDispatch();
  const program = useSelector((state) => state.utility.program);
  const [recipient, setRecipient] = useState("");
  const [recHelperText, setRecHelperText] = useState("");
  const [amount, setAmount] = useState("");
  const [amountHelperText, setAmountHelperText] = useState("");
  const [description, setDescription] = useState("");
  const [descHelperText, setDescHelperText] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const sendMoney = async () => {
    if (!recipient) {
      toast.error("Enter recipient email to continue.");
      return;
    }
    if (!amount) {
      toast.error("Enter amount to continue.");
      return;
    }
    if (!description) {
      toast.error("Enter purpose of transfer to continue.");
      return;
    }

    // Regex Validations
    if (recipient && !regex.email.pattern.test(recipient)) {
      toast.error(`Recipient Email: ${regex.email.message}`);
      return;
    }

    if (amount && !regex.amount?.pattern.test(amount)) {
      toast.error(`Amount: ${regex.amount?.message}`);
      return;
    }

    if (description && !regex.alphanumeric?.pattern.test(description)) {
      toast.error(`Description: ${regex.alphanumeric?.message}`);
      return;
    }

    try {
      await dispatch(
        PaymentTransfer({
          recipient,
          amount,
          description,
          setPaymentLoading,
          setActiveStep,
        })
      );
    } catch (e) {
      toast.error(
        "Something went wrong, please try again later or contact your admin."
      );
    }
  };
  const feeDetails = useSelector((state) => state.utility.feeDetails);
  const [platformFee, setPlatformFee] = useState("");

  useEffect(() => {
    if (feeDetails.length > 0 && amount) {
      let p2pFee = feeDetails.find((item) => item.fee_code === "W2W")?.value;

      if (p2pFee && amount) {
        const calculatedFee = (Number(p2pFee) / 100) * Number(amount);
        setPlatformFee(calculatedFee.toFixed(2)); // Ensure the fee is set to 2 decimal places
      } else {
        setPlatformFee("0.00"); // Handle cases where p2pFee or amount is missing
      }
    }
  }, [feeDetails, amount]);

  const [txnType, setTxnType] = useState(true);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === 0 && !recipient) {
      setRecHelperText("Enter recipient email to continue...");
      return;
    } else if (activeStep === 1 && !amount) {
      setAmountHelperText("Enter transfer amount to continue...");
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getRecipientDetails = async (email) => {
    if (!email) return;
    try {
      setLoading(true);
      let obj = await dispatch(getContactDetails(email));
      if (obj.status === "SUCCESS") {
        setFirstName(obj.firstName);
        setLastName(obj.lastName);
        setAccountNumber(obj.accountNumber);
      } else {
        toast.error(
          "Recipient not found, please re-check the email and try again!"
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={"p-4 w-100"} style={{ borderRadius: 12 }}>
      <label
        htmlFor=""
        className="pb-2 mb-3 fs-5 fw-600 text-start border-bottom w-100"
      >
        Send Money
      </label>

      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{ minHeight: "60vh" }}
      >
        <div className="">
          <VerticalLinearStepper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            handleNext={handleNext}
            handleBack={handleBack}
            handleReset={handleReset}
          />
        </div>
        <div style={{ width: "60%", marginTop: 20 }} className="mx-auto">
          <div>
            <label
              htmlFor=""
              className="fs-2 text-dark fw-bold text-center w-100 py-3"
            >
              {activeStep === 0
                ? `Who do you want to send money to?`
                : activeStep === 1
                ? `How much do you want to send?`
                : activeStep === 2
                ? `Review details of your transfer`
                : ``}
            </label>
          </div>

          <div className="mt-4">
            {/* {program === "SMMACS0" && (
              <div
                className="d-flex align-items-center justify-content-between my-4"
                style={{
                  borderRadius: 8,
                  background: "rgba(211,211,211,0.35)",
                  border: "2px solid rgba(211,211,211,0.35)",
                }}
              >
                <div
                  className={`d-flex align-items-center justify-content-center gap-2 px-5 text-center fs-7 ${
                    txnType
                      ? "box-shadow bg-white text-dark fw-600 w-60"
                      : "w-50"
                  }`}
                  style={{
                    borderRadius: 8,
                    cursor: "pointer",
                    padding: "0.65rem 0",
                  }}
                  onClick={() => setTxnType(true)}
                >
                  <TransferWithinAStation fontSize="small" />
                  Domestic
                </div>
                <div
                  className={`d-flex align-items-center justify-content-center gap-2 px-5 text-center fs-7 ${
                    !txnType
                      ? "box-shadow bg-white text-dark fw-600 w-60"
                      : "w-50"
                  }`}
                  style={{
                    borderRadius: 8,
                    cursor: "pointer",
                    padding: "0.65rem 0",
                  }}
                  onClick={() => setTxnType(false)}
                >
                  <PublicOutlined fontSize="small" />
                  International
                </div>
              </div>
            )} */}

            {activeStep === 0 ? (
              <>
                {isLoading ? (
                  <div className="d-flex flex-column align-items-center justify-content-center gap-4 my-5 py-5">
                    <HashLoader size={40} />
                    <label className="fw-bold text-dark">
                      Fetching recipient details... Please wait...
                    </label>
                  </div>
                ) : (
                  <>
                    <label className="pb-2 fs-6 fw-600">
                      Recipient Details
                    </label>
                    <Card
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gridGap: 20,
                        padding: "1.5rem",
                        borderRadius: 12,
                      }}
                    >
                      <div onBlur={() => getRecipientDetails(recipient)}>
                        <CustomInput
                          label={"Recipient Email"}
                          placeholder={"Recipient Email"}
                          value={recipient}
                          onInput={(e) => {
                            setRecipient(e);
                            setRecHelperText("");
                            setFirstName("");
                            setLastName("");
                            setAccountNumber("");
                          }}
                          leftIcon={<Email />}
                          regex={regex.email}
                          helperText={recHelperText}
                        />
                      </div>

                      <CustomInput
                        placeholder={"First Name"}
                        label={"First Name"}
                        value={firstName}
                        onInput={setFirstName}
                        leftIcon={<Person />}
                      />

                      <CustomInput
                        label={"Last Name"}
                        placeholder={"Last Name"}
                        value={lastName}
                        onInput={setLastName}
                        leftIcon={<Person />}
                      />

                      <CustomInput
                        placeholder={"Account Number"}
                        label={"Account Number"}
                        value={accountNumber}
                        onInput={setAccountNumber}
                        leftIcon={<AccountBalanceWallet />}
                      />
                    </Card>
                  </>
                )}
              </>
            ) : activeStep === 1 ? (
              <>
                <div className="d-flex flex-column gap-3 align-items center">
                  <div className="d-flex align-items-start justify-content-between gap-4">
                    <div
                      className="w-50"
                      onBlur={() => {
                        if (amount) {
                          setAmount(parseFloat(amount).toFixed(2)); // Ensure two decimal places
                        }
                      }}
                    >
                      <CustomInput
                        label={"You will send"}
                        placeholder={"You will send"}
                        value={amount}
                        onInput={(e) => {
                          setAmount(e);
                          setAmountHelperText("");
                        }}
                        leftIcon={<Paid />}
                        regex={regex.amount}
                        type={"amount"}
                        required
                        helperText={amountHelperText}
                        rightIcon={
                          <div className="d-flex gap-2 align-items center border-start border-2 border-secondary ps-3 text-dark">
                            <img
                              src="/flags/us.svg"
                              alt=""
                              width={22}
                              height={22}
                              style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            USD
                            {/* <KeyboardArrowDown
                        fontSize="medium"
                        className="text-dark"
                      /> */}
                          </div>
                        }
                      />
                    </div>

                    <div className="w-50">
                      <CustomInput
                        label={"Recipient will get"}
                        placeholder={"Recipient will get"}
                        value={amount}
                        leftIcon={<Paid />}
                        regex={regex.amount}
                        type={"amount"}
                        required
                        helperText={""}
                        rightIcon={
                          <div className="d-flex gap-2 align-items center border-start border-2 border-secondary ps-3 text-dark">
                            <img
                              src="/flags/us.svg"
                              alt=""
                              width={22}
                              height={22}
                              style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            USD
                            {/* <KeyboardArrowDown
                        fontSize="medium"
                        className="text-secondary"
                      /> */}
                          </div>
                        }
                        disabled
                      />
                    </div>
                  </div>

                  <CustomInput
                    placeholder={"Purpose of transfer"}
                    value={description}
                    onInput={(e) => {
                      setDescription(e);
                      setDescHelperText("");
                    }}
                    leftIcon={<Note />}
                    helperText={descHelperText}
                    required
                  />

                  {amount && (
                    <Card className="px-3" style={{ borderRadius: 12 }}>
                      <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                        <p className="text-dark">Original amount</p>
                        <p className="text-secondary fw-600">${amount}</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                        <p className="text-dark">Platfrom fees</p>
                        <p className="text-danger fw-600">+${platformFee}</p>
                      </div>
                      <Divider className="my-3" />
                      <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                        <p className="text-dark">You will pay</p>
                        <p className="text-success fw-600">
                          $
                          {parseFloat(
                            Number(amount) + Number(platformFee)
                          ).toFixed(2)}
                        </p>
                      </div>
                      {/* <Divider className="my-3" /> */}
                    </Card>
                  )}
                </div>
              </>
            ) : activeStep === 2 ? (
              <>
                <div className="my-4">
                  <label className="pb-2 fs-6 fw-600">Recipient Details</label>
                  <Card
                    className="py-3 px-3 d-flex justify-content-between align-items-center"
                    style={{ borderRadius: 12 }}
                  >
                    <div className="d-flex justify-content-start align-items-center gap-3">
                      <Avatar className="bg-dark">
                        {firstName.slice(0, 1)}
                      </Avatar>
                      <div>
                        <p className="fs-6 text-dark">{`${firstName} ${lastName}`}</p>
                        <p className="fs-7 text-secondary">{`${recipient}`}</p>
                      </div>
                    </div>

                    <p className="fs-5 text-dark fw-600">${amount}</p>
                  </Card>
                </div>

                <div className="my-4">
                  <label className="pb-2 fs-6 fw-600">Transfer Details</label>
                  <Card className="px-3" style={{ borderRadius: 12 }}>
                    <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                      <p className="text-dark">Original amount</p>
                      <p className="text-secondary fw-600">${amount}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                      <p className="text-dark">Platfrom fees</p>
                      <p className="text-danger fw-600">+${platformFee}</p>
                    </div>
                    <Divider className="my-3" />
                    <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                      <p className="text-dark">You will pay</p>
                      <p className="text-success fw-600">
                        $
                        {parseFloat(
                          Number(amount) + Number(platformFee)
                        ).toFixed(2)}
                      </p>
                    </div>
                    {/* <Divider className="my-3" /> */}
                  </Card>
                </div>
              </>
            ) : (
              <>
                <div className="">
                  <div className="d-flex flex-column align-items-center justify-content-center gap-3 mb-3">
                    <CheckCircle color="success" sx={{ fontSize: 65 }} />
                    <label className="pb-2 fs-4 fw-600">
                      Transaction Successful
                    </label>
                  </div>
                  <Card
                    className="py-3 px-3 d-flex flex-column justify-content-between align-items-center bg-dark mx-auto"
                    style={{ borderRadius: 12 }}
                  >
                    <label
                      className="pb-3 fs-6 fw-500 text-light w-100 text-center"
                      style={{ borderBottom: "2px dashed lightgray" }}
                    >
                      Receipt
                    </label>

                    <div className="d-flex justify-content-start align-items-center gap-2 py-4 w-100 px-3">
                      <Avatar
                        className="bg-light text-dark"
                        sx={{ width: 30, height: 30 }}
                      >
                        {firstName.slice(0, 1)}
                      </Avatar>
                      <div>
                        <p className="fs-7 text-secondary">{`Recipient`}</p>
                        <p className="fs-6 text-light">{`${firstName} ${lastName}`}</p>
                      </div>
                    </div>

                    <div className="my-1 w-100">
                      <div className="d-flex justify-content-between align-items-center my-2">
                        <p className="text-secondary">Transfer amount</p>
                        <p className="text-white fw-600">
                          $
                          {parseFloat(
                            Number(amount) + Number(platformFee)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center my-2">
                        <p className="text-secondary">Fee</p>
                        <p className="text-white fw-600">+${platformFee}</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center my-2">
                        <p className="text-secondary">Date</p>
                        <p className="text-white fw-600">
                          {formatDate(new Date())}
                        </p>
                      </div>
                    </div>

                    {/*<p className="fs-5 text-dark fw-600">${amount}</p> */}
                  </Card>
                </div>

                {/* <div className="my-4">
                <label className="pb-2 fs-6 fw-600">Transfer Details</label>
                <Card className="px-3" style={{ borderRadius: 12 }}>
                  <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                    <p className="text-dark">Original amount</p>
                    <p className="text-secondary fw-600">${amount}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                    <p className="text-dark">Platfrom fees</p>
                    <p className="text-danger fw-600">+${platformFee}</p>
                  </div>
                  <Divider className="my-3" />
                  <div className="d-flex justify-content-between align-items-center my-3 text-dark">
                    <p className="text-dark">You will pay</p>
                    <p className="text-success fw-600">
                      $
                      {parseFloat(Number(amount) + Number(platformFee)).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </Card>
              </div> */}
              </>
            )}
          </div>

          {!isLoading && (
            <div className="d-flex justify-content-end align-items-center gap-2 w-100 mt-4">
              <div className="d-flex justify-content-end align-items-center gap-2 w-50">
                {activeStep > 0 && activeStep < 3 && (
                  <CustomButtonSecondary
                    label={"Back"}
                    leftIcon={<ChevronLeft />}
                    onClick={handleBack}
                    isLoading={paymentLoading}
                    buttonClass={`gap-0`}
                  />
                )}

                {activeStep < 2 && (
                  <CustomButton
                    label={"Continue"}
                    icon={<ChevronRight />}
                    onClick={handleNext}
                    isLoading={paymentLoading}
                    buttonClass={`gap-0`}
                  />
                )}

                {activeStep >= 2 && activeStep < 3 && (
                  <CustomButton
                    label={"Send"}
                    icon={<Send />}
                    onClick={sendMoney}
                    isLoading={paymentLoading}
                  />
                )}

                {activeStep === 3 && (
                  <CustomButton
                    label={"Send Money Again!"}
                    icon={<ChangeCircle />}
                    onClick={() => {
                      setRecipient("");
                      setRecHelperText("");
                      setFirstName("");
                      setLastName("");
                      setAccountNumber("");
                      setAmount("");
                      setAmountHelperText("");
                      setDescription("");
                      setDescHelperText("");
                      setActiveStep(0);
                    }}
                    isLoading={paymentLoading}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const Payments = () => {
  const account = useSelector((state) => state.account.accountDetails);
  const accountStatement = useSelector(
    (state) => state.account.accountStatement
  );

  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const SetPage = () => {
    dispatch(setActiveTab("Dashboard"));
    navigate("/dashboard");
  };

  const userDetails = useSelector((state) => state.auth.userDetails);
  const type = useSelector((state) => state.auth.type);
  const kybDetails = useSelector((state) => state.auth.kycDetails);
  const program = useSelector((state) => state.utility.program);

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
  return (
    <div className="m-3 d-flex align-items-start justify-content-between flex-column gap-4">
      <Payment />

      <LastTransactions transactions={accountStatement} />

      {/* <div className="w-60">
        <div className="d-flex align-items-center justify-content-between gap-3 pb-2">
          <label className="text-primary pb-2 fs-6">
            Cross-Border Remittance
          </label>
        </div>{" "}
      </div> */}
    </div>
  );
};

export default Payments;
