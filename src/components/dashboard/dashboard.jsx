import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Box,
  Avatar,
  Divider,
  Switch,
  Checkbox,
  Fab,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreHoriz,
  AddBox,
  AccountBalanceWallet,
  RadioButtonChecked,
  Email,
  AttachMoney,
  EditNote,
  DoubleArrow,
  ChevronRight,
  Send,
  CurrencyExchange,
  AccountCircle,
  Call,
  MyLocation,
  NearMe,
  LocationCity,
  Explore,
  AppRegistration,
  NorthEast,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Savings,
  Business,
  BusinessCenter,
  PointOfSale,
  WorkHistory,
  AssuredWorkload,
  PaidOutlined,
  ArrowDropUp,
  Paid,
  CallReceived,
  KeyboardArrowDown,
  CallMade,
  KeyboardArrowUp,
  ArrowDropDown,
  Filter1,
  FilterList,
  TripOrigin,
  Lock,
  Block,
  CreditCard,
  Info,
  InfoOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCardView,
  CustomButton,
  CustomDatepicker,
  CustomFutureDatepicker,
  CustomPastDatepicker,
  CustomSelect,
} from "../../@component_v2/CustomComponents";
import { CustomInput } from "../../@component_v2/CustomComponents";
import { HashLoader, RingLoader } from "react-spinners";
import {
  fetchUser,
  fetchKyc,
  createUserDetails,
  createBusinessDetails,
  fetchBusiness,
  fetchKyb,
} from "../../@redux/action/Auth";
import {
  getAccountDetailsAPI,
  getAccountStatementAPI,
  createAccountDetailsAPI,
  getCardsAPI,
  getVirtualAccountDetailsAPI,
  createVirtualAccountDetailsAPI,
} from "../../@redux/action/account";
import { getDates } from "../../@component_v2/CustomComponents";
import { toast } from "react-toastify";
import { PaymentTransfer } from "./../../@redux/action/transaction";
import { LogoutFn } from "./../../@component_v2/Sidebar";
import { useNavigate } from "react-router-dom";
import { setActiveTab, setGlobalLoading } from "../../@redux/feature/Utility";
import regex from "./../utility/regex";
import { Carousel } from "react-bootstrap";
import CustomizedSteppers from "./../../@component_v2/Stepper";

export const AccountSummary = ({ account, SetPage }) => {
  const addAccount = async () => {
    try {
      setLoading(true);
      let res = await dispatch(createAccountDetailsAPI());
      if (res.status === "SUCCESS") {
        SetPage();
      }
    } catch (e) {
      toast.error("Something went wrong, please try again later!");
    } finally {
      setLoading(false);
    }
  };

  const [visible, setVisible] = useState(false);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const type = useSelector((state) => state.auth.type);
  const program = useSelector((state) => state.utility.program);

  const accountStatement = useSelector(
    (state) => state.account.accountStatement
  );

  const [totals, setTotals] = useState({ totalDebit: 0, totalCredit: 0 });

  const calculateTotals = (statements) => {
    let totalDebit = 0;
    let totalCredit = 0;

    statements.forEach((txn, index) => {
      const amount = Number(txn.amount.value) || 0;
      if (txn.indicator === "debit") {
        totalDebit += amount;
      } else if (txn.indicator === "credit") {
        totalCredit += amount;
      }
    });

    return { totalDebit, totalCredit };
  };

  useEffect(() => {
    if (accountStatement?.length) {
      const { totalDebit, totalCredit } = calculateTotals(accountStatement);
      setTotals({ totalDebit, totalCredit });
    }
  }, [accountStatement]);

  const [percentageChange, setPercentageChange] = useState(0);
  const currentBalance = account[0]?.availableBalance;

  const calculatePercentageChange = (statements, balance) => {
    if (!statements.length) return 0; // No transactions? No change.

    const lastTransaction = statements[statements.length - 1]; // Get last txn
    const lastTxnAmount = Number(lastTransaction.balance.value) || 0; // Ensure valid number

    if (lastTxnAmount === 0) return 0; // Prevent division by zero

    return ((balance - lastTxnAmount) / lastTxnAmount) * 100;
  };

  useEffect(() => {
    if (accountStatement?.length) {
      const percentChange = calculatePercentageChange(
        accountStatement,
        currentBalance
      );
      setPercentageChange(percentChange);
    }
  }, [account, accountStatement, currentBalance]);

  return (
    <div className="">
      {account.length === 0 ? (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center gap-3 margin-auto h-100">
            <AccountBalanceWallet className="fs-8 text-white" />
            <div className="text-center px-4">
              <label className="text-white fs-8">
                You haven't added any accounts yet.
              </label>
              <label className="text-white fs-7">
                <span
                  onClick={addAccount}
                  className="fw-500 border-bottom border-white cursor-pointer"
                  style={{ cursor: "pointer" }}
                >
                  Click here
                </span>{" "}
                to add your account.
              </label>
            </div>
          </div>
        </>
      ) : (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ gap: program === "SMMAAS0" ? "1rem" : "5rem" }}
        >
          <Card
            className="p-3 w-75 d-flex align-items-between flex-column gap-4"
            style={{ borderRadius: 12 }}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <IconButton className="p-2 bg-dark text-white">
                <AttachMoney />
              </IconButton>

              <div
                className={"d-flex justify-content-center align-items-center"}
              >
                {percentageChange > 0 ? (
                  <ArrowDropUp sx={{ color: "green" }} />
                ) : (
                  <ArrowDropDown sx={{ color: "brown" }} />
                )}
                <p
                  className={`pb-0 mb-0 fw-600${
                    percentageChange > 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {percentageChange.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="d-flex flex-column align-items-start gap-1 pt-2">
              <p className="fs-7">Current Balance</p>
              <p className="fs-6 d-flex gap-1 align-items-center">
                ${" "}
                <p className="fs-6 text-dark fw-600">
                  {account[0].availableBalance}
                </p>
              </p>
            </div>
          </Card>
          <Card
            className="p-3 w-75 d-flex align-items-between flex-column gap-4"
            style={{ borderRadius: 12 }}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <IconButton className="p-2 bg-light text-success">
                <CallReceived />
              </IconButton>

              <div className="d-flex justify-content-center align-items-center">
                <p className="pb-0 mb-0">Monthly</p>
              </div>
            </div>
            <div className="d-flex flex-column align-items-start gap-1 pt-2">
              <p className="fs-7">Total Credit</p>
              <p className="fs-6 d-flex gap-1 align-items-center">
                ${" "}
                <p className="fs-6 text-success fw-600">
                  {totals.totalCredit.toFixed(2)}
                </p>
              </p>
            </div>
          </Card>
          <Card
            className="p-3 w-75 d-flex align-items-between flex-column gap-4"
            style={{ borderRadius: 12 }}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <IconButton className="p-2 bg-light text-danger">
                <CallMade />
              </IconButton>

              <div className="d-flex justify-content-center align-items-center">
                <p className="pb-0 mb-0">Monthly</p>
              </div>
            </div>
            <div className="d-flex flex-column align-items-start gap-1 pt-2">
              <p className="fs-7">Total Debit</p>
              <p className="fs-6 d-flex gap-1 align-items-center">
                ${" "}
                <p className="fs-6 text-danger fw-600">
                  {totals.totalDebit.toFixed(2)}
                </p>
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export const Cards = ({ cards, SetPage }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState("view-card");
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();
  const [cardType, setCardType] = useState("Active");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (type) => {
    if (type) setCardType(type); // Only update if a type is selected
    setAnchorEl(null);
  };

  // 🔥 Filter cards based on `cardType`
  const filteredCards = cards.filter(
    (card) => card.cardStatus === cardType.toLowerCase()
  );

  return (
    <div
      className="p-4 border bg-white box-shadow"
      style={{ borderRadius: "12px", minHeight: "auto" }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between border-bottom mb-3 pb-3">
        <label htmlFor="" className="text-dark fs-5">
          My Cards
        </label>
        <p
          className="pb-0 mb-0 d-flex align-items-center justify-content-end"
          onClick={() => {
            dispatch(setActiveTab("Cards"));
            navigate("/cards");
          }}
          style={{ cursor: "pointer" }}
        >
          View All <ChevronRight fontSize="small" />
        </p>
      </div>

      {/* Card Type Selector */}
      {cards.length > 0 && (
        <div>
          <div
            className="d-flex align-items-center justify-content-start text-secondary fs-7 pb-3"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          >
            {cardType} <KeyboardArrowDown fontSize="small" />
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose(null)}
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            {["Active", "Locked", "Suspended"].map((type) => (
              <MenuItem
                key={type}
                onClick={() => handleClose(type)}
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.55)",
                }}
              >
                {type === "Active" && (
                  <TripOrigin
                    fontSize="small"
                    sx={{ color: "green", marginRight: 1 }}
                  />
                )}
                {type === "Locked" && (
                  <Lock
                    fontSize="small"
                    sx={{ color: "orange", marginRight: 1 }}
                  />
                )}
                {type === "Suspended" && (
                  <Block
                    fontSize="small"
                    sx={{ color: "brown", marginRight: 1 }}
                  />
                )}
                {type}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}

      {/* Render Cards */}
      {filteredCards.length > 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center gap-4 my-3 px-3">
          {filteredCards.slice(0, 2).map((item) => (
            <CreditCardView
              key={item.id} // Always provide a unique key
              item={item}
              dispatch={dispatch}
              setForm={setForm}
              setActiveCard={setActiveCard}
            />
          ))}
        </div>
      ) : (
        // <div className="d-flex flex-column align-items-center justify-content-center gap-4 my-3 px-3">
        //   <CreditCardView
        //     key={0}
        //     item={{
        //       accountid: "",
        //       last4: "0000",
        //       createdAt: "",
        //       cardid: "",
        //       currency: "USD",
        //       type: "virtual",
        //       cardStatus: "active",
        //     }}
        //     dispatch={dispatch}
        //     setForm={setForm}
        //     setActiveCard={setActiveCard}
        //   />
        // </div>

        <div className="d-flex flex-column justify-content-center align-items-center gap-4 mx-auto mt-5">
          <img src="/credit-card.png" alt="" style={{ width: 200 }} />
          <label htmlFor="" style={{ textAlign: "center", minWidth: 360 }}>
            No card(s) found.
          </label>
          <CustomButton
            label={"Add Card(s)"}
            icon={<CreditCard />}
            onClick={() => {
              dispatch(setActiveTab("Cards"));
              navigate("/cards");
            }}
            style={{ margin: "0 auto", width: 250 }}
          />
        </div>
      )}
    </div>
  );
};

export const addAccount = async ({ dispatch, setLoading, SetPage }) => {
  try {
    setLoading(true);
    let res = await dispatch(createAccountDetailsAPI());
    if (res.status === "SUCCESS") {
      SetPage();
    }
  } catch (e) {
    toast.error("Something went wrong, please try again later!");
  } finally {
    setLoading(false);
  }
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

  return (
    <>
      <Card
        className={
          location.pathname === "/dashboard"
            ? `ms-4 p-4 w-60 border rounded-4`
            : `p-4 border rounded-4`
        }
      >
        <label className="pb-2 fw-500 border-bottom border-2 w-100 mb-3">
          Virtual Account Details
        </label>

        {type === "individual" &&
        kybDetails.kycStatus.toLowerCase() !== "completed" ? (
          <>
            <div className="d-flex flex-column justify-content-center align-items-center gap-3">
              <img src="/verification.png" alt="" style={{ width: 80 }} />

              <label htmlFor="" className="fs-7 text-secondary px-2">
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
                  divClass="w-50"
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
                  divClass="w-50"
                />
              )}
            </div>
          </>
        ) : type === "business" && kybDetails.kybStatus !== "completed" ? (
          <>
            <div className="d-flex flex-column justify-content-center align-items-center gap-3">
              <img src="/verification.png" alt="" style={{ width: 80 }} />

              <label htmlFor="" className="fs-7 text-secondary px-2">
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
                  divClass="w-50"
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
                  divClass="w-50"
                />
              )}
            </div>
          </>
        ) : vaDetails.length === 0 ? (
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
                gridTemplateColumns: "repeat(3, 1fr)",
                rowGap: "2rem",
                columnGap: "3rem",
              }}
            >
              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Account Holder Name
                </label>
                <p className="text-primary fw-600 fs-7">
                  {account[0].accountHolderName}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Account Type
                </label>
                <p className="text-primary fw-600 fs-7">Virtual Account</p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Account Number
                </label>
                <p className="text-primary fw-600 fs-7">
                  {account[0].accountNumber}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Bank Name
                </label>
                <p className="text-primary fw-600 fs-7">
                  {account[0].accountBankName}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Bank Country
                </label>
                <p className="text-primary fw-600 fs-7">
                  {account[0].accountBankCountry}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Bank Address
                </label>
                <p className="text-primary fw-600 fs-7">
                  {location.pathname === "/accounts"
                    ? account[0].accountBankAddress
                    : account[0].accountBankAddress.slice(0, 20) + "..."}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Bank Code
                </label>
                <p className="text-primary fw-600 fs-7">
                  {account[0].bankCode}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Created At
                </label>
                <p className="text-primary fw-600 fs-7">
                  {account[0].createdAt}
                </p>
              </div>

              <div>
                <label htmlFor="" className="text-secondary fs-8">
                  Status
                </label>
                <p className="text-success fw-600 fs-7">
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

export const LastTransactions = ({ transactions }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("all");

  const [limit, setLimit] = useState({ value: "10", label: "10" });
  const [fromDateFilter, setFromDateFilter] = useState(
    getDates().startDate || ""
  );
  const [toDateFilter, setToDateFilter] = useState(getDates().endDate || "");

  const transactionIcons = {
    credit: <CallReceived style={{ color: "green" }} size={8} />,
    debit: <CallMade style={{ color: "brown" }} size={8} />,
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5; // Show 5 per page

  const handleFilterChange = (selected) => setFilterType(selected.value);

  // Filter transactions
  const filteredTransactions = transactions?.length
    ? transactions.filter((txn) => {
        const matchesSearch =
          txn?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn?.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
          filterType === "all" || txn?.indicator === filterType;

        return matchesFilter;
      })
    : []; // Ensure it doesn't break when transactions are empty

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortBy) return 0;

    let valA = a[sortBy] ?? ""; // Default to empty if undefined
    let valB = b[sortBy] ?? "";

    if (sortBy === "amount") {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    } else if (sortBy === "date") {
      valA = new Date(valA) || new Date(0);
      valB = new Date(valB) || new Date(0);
    }

    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  // Ensure at least one transaction appears
  const totalPages = Math.max(
    1,
    Math.ceil(sortedTransactions.length / transactionsPerPage)
  );
  const indexOfLastTxn = Math.min(
    currentPage * transactionsPerPage,
    sortedTransactions.length
  );
  const indexOfFirstTxn = Math.max(0, indexOfLastTxn - transactionsPerPage);
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTxn,
    indexOfLastTxn
  );

  // Handle Pagination Navigation
  const nextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const limitOptions = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "40", label: "40" },
    { value: "50", label: "50" },
  ];

  const userData = useSelector((state) => state.auth.userDetails);
  const accountData = useSelector((state) => state.account.accountDetails);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchAccountStatement = async () => {
    try {
      setLoading(true);
      let txn = await dispatch(
        getAccountStatementAPI(
          userData.id,
          accountData[0].accountid,
          fromDateFilter,
          toDateFilter,
          limit?.value,
          "update"
        )
      );

      console.log(txn);
    } catch (e) {
      console.log(e);
      toast.error(
        "Something went wrong while fetching your account statement, please try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="transaction-container border px-4"
        // style={{
        //   width: location.pathname.includes("dashboard") ? "85%" : "100%",
        // }}
      >
        <label className="py-3 border-bottom w-100 mb-2 d-flex justify-content-between align-items-center">
          <p className="fw-600 text-dark fs-5 pb-0 mb-0">Recent Transactions</p>
          <p className="pb-0 mb-0">Last 30 days</p>
        </label>

        <div className="table-controls d-none">
          <div
            className="my-2"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${
                location.pathname.includes("transactions") ? 2 : 4
              }, 1fr)`,
              gridGap: 10,
            }}
          >
            <CustomSelect
              options={[
                { value: "all", label: "All Transactions" },
                { value: "debit", label: "Debit" },
                { value: "credit", label: "Credit" },
              ]}
              value={{ value: filterType, label: filterType }}
              onChange={handleFilterChange}
              label="Type"
              leftIcon={<Filter1 />}
              disabled={transactions.length === 0}
            />

            <CustomSelect
              options={limitOptions}
              value={limit}
              onChange={(selected) => {
                setLimit(selected);
              }}
              label="Limit"
              leftIcon={<Filter1 />}
            />

            <CustomPastDatepicker
              selectedDate={fromDateFilter}
              onDateChange={setFromDateFilter}
              label="From Date"
            />

            <CustomPastDatepicker
              selectedDate={toDateFilter}
              onDateChange={setToDateFilter}
              label="To Date"
            />
          </div>

          {/* <div className="d-flex justify-content-between align-items-center gap-4 my-4">
            <CustomInput
              type="alphanumeric"
              id="search"
              placeholder="Search..."
              value={searchQuery}
              onInput={setSearchQuery}
              label="Search transactions"
              leftIcon={<Search />}
              max={35}
              disabled={transactions.length === 0}
              divClass={"w-50"}
            />
          </div> */}
        </div>

        <div className="d-flex justify-content-start py-2 d-none">
          {" "}
          <CustomButton
            label="Filter Transactions"
            icon={<FilterList />}
            onClick={fetchAccountStatement}
            isLoading={isLoading}
            style={{
              width: location.pathname.includes("transactions") ? 332 : "auto",
            }}
          />
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center flex-column gap-4 py-5">
            <HashLoader color="brown" />
            <p>Fetching your transactions, please wait...</p>
          </div>
        ) : (
          <>
            <div
              className="table-responsive"
              style={{
                width: "100%",
                overflowX: "auto",
                padding: 5,
              }}
            >
              <table className="transaction-table">
                {transactions.length > 0 && (
                  <>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Receiver</th>
                        <th>Status</th>
                        <th>Info</th>
                        <th>Amount</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                  </>
                )}
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <div className="w-100 d-flex align-items-center justify-content-center flex-column gap-3">
                          <div className="w-60 d-flex align-items-center justify-content-center flex-column gap-4 my-4">
                            <img
                              src="/no-transactions.jpg"
                              alt=""
                              style={{ width: 135 }}
                            />
                            <p className="fs-6 text-center">
                              Looks like your transaction list is empty for the
                              above filters. If you haven't made a transaction
                              yet, send money locally or through remittance to
                              get started!
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {currentTransactions.map((txn, index) => (
                        <tr
                          key={txn.transactionid}
                          className={`transaction-row`}
                          style={{
                            border: "1px solid rgba(211,211,211,0.55)",
                            background:
                              index % 2 === 0
                                ? "rgba(211,211,211,0.25)"
                                : "white",
                          }}
                        >
                          <td>{formatDate(txn.date)}</td>

                          <td>
                            <div className="d-flex align-items-center">
                              {/* <div className="icon">
                                {transactionIcons[txn.indicator]}
                              </div> */}
                              <span className="receiver-name">
                                {txn.recipient_name}
                              </span>
                            </div>
                          </td>
                          {/* <td>{txn.indicator.toUpperCase()}</td> */}
                          <td>
                            <div
                              className={`fw-600 ${
                                txn.status.toUpperCase() === "SUCCESS"
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                              // style={{
                              //   background:
                              //     txn.status.toUpperCase() === "SUCCESS"
                              //       ? "rgba(0,255,0,0.25)"
                              //       : "rgba(150, 75, 0,0.25)",
                              // }}
                            >
                              {txn.status.toUpperCase()}
                            </div>
                          </td>
                          <td>{`${txn.transaction_id}/${
                            txn.description || txn.details.description
                          }`}</td>
                          <td
                            className={`fw-600 ${
                              txn.indicator === "debit"
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            {`${txn.indicator === "debit" ? "-" : "+"}$${Number(
                              txn.amount.value
                            ).toFixed(2)}`}
                          </td>
                          <td>{`$${Number(txn.balance.value).toFixed(2)}`}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {transactions.length > 0 && totalPages > 1 && (
              <div className="pagination-controls d-flex justify-content-center align-items-center gap-3 mt-2">
                <IconButton onClick={prevPage} disabled={currentPage === 1}>
                  <ChevronLeft />
                </IconButton>
                <label className="fs-7">
                  Page {currentPage} of {totalPages}
                </label>
                <IconButton
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight />
                </IconButton>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dnsDetails = useSelector((state) => state.utility.dnsDetails);
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const email =
    useSelector((state) => state.auth?.loginEmail) || "alexmercerweb@gmail.com";

  const [stage, setStage] = useState(0);
  const isOnboarded = useSelector((state) => state.auth?.isOnboarded);
  const kycStatus = useSelector((state) => state.auth?.kycDetails?.kycStatus);
  const userDetails = useSelector((state) => state.auth?.userDetails);
  const authUser = useSelector((state) => state.auth?.user);
  const account = useSelector((state) => state.account.accountDetails);
  const accountStatement = useSelector(
    (state) => state.account.accountStatement
  );
  const cards = useSelector((state) => state.account.cards);

  const program = useSelector((state) => state.utility.program);
  const type = useSelector((state) => state.auth.type);
  const kybDetails = useSelector((state) => state.auth.kycDetails);

  const vaDetails = useSelector((state) => state.account.virtualAccountDetails);

  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // 📌 Step 1: Get the current date
    const date = new Date();

    // 📌 Step 2: Format the date (e.g., "Sunday, March 04")
    const options = { weekday: "long", month: "long", day: "2-digit" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    setCurrentDate(formattedDate);

    // 📌 Step 3: Determine the greeting based on time
    const hours = date.getHours();
    if (hours < 12) {
      setGreeting("Good Morning!");
    } else if (hours < 18) {
      setGreeting("Good Afternoon!");
    } else {
      setGreeting("Good Evening!");
    }
  }, []);

  const SetPage = async () => {
    setLoading(true);
    dispatch(setGlobalLoading(true));
    try {
      let userData = await dispatch(fetchUser(email, "fetch"));

      if (
        userData.status === "BAD_REQUEST" &&
        userData.message.includes("email not found")
      ) {
        toast.error(
          "We're currently experiencing technical issues right now. Please try again later."
        );

        setTimeout(() => {
          LogoutFn({ dispatch, navigate });
        }, 2000);

        return;
      }

      if (userData.status === "SUCCESS") {
        let kycData = await dispatch(fetchKyc(email));

        if (kycData.status === "SUCCESS") {
          if (program === "SMMAAS0") {
            let accountData = await dispatch(
              getAccountDetailsAPI(
                userData.id,
                account.length > 0 ? "fetch" : "update"
              )
            );

            if (accountData[0].accountid) {
              let transactions = await dispatch(
                getAccountStatementAPI(
                  userData.id,
                  accountData[0].accountid,
                  getDates().startDate,
                  getDates().endDate,
                  10,
                  accountStatement.length > 0 ? "fetch" : "update"
                )
              );

              let cardsList = await dispatch(
                getCardsAPI(
                  userData.id,
                  accountData[0].accountid,
                  cards.length > 0 ? "fetch" : "update"
                )
              );
            }
          } else {
            if (kycData.kycStatus.toLowerCase() === "completed") {
              let accountData = await dispatch(
                getAccountDetailsAPI(
                  userData.id,
                  account.length > 0 ? "fetch" : "update"
                )
              );

              if (accountData[0].accountid) {
                let transactions = await dispatch(
                  getAccountStatementAPI(
                    userData.id,
                    accountData[0].accountid,
                    getDates().startDate,
                    getDates().endDate,
                    10,
                    accountStatement.length > 0 ? "fetch" : "update"
                  )
                );

                let va = await dispatch(
                  getVirtualAccountDetailsAPI(
                    userData.id,
                    vaDetails.length > 0 ? "fetch" : "update"
                  )
                );
              }
            }
          }
        }
      }
    } catch (e) {
      console.log("Dashboard Page Set Error: ", e);
    } finally {
      setLoading(false);
      dispatch(setGlobalLoading(false));
    }
  };

  const SetPageBusiness = async () => {
    setLoading(true);
    dispatch(setGlobalLoading(true));
    try {
      let userData = await dispatch(fetchBusiness(email, "fetch"));

      console.log("businessData: ", userData);

      if (
        userData.status === "BAD_REQUEST" &&
        userData.message.includes("email not found")
      ) {
        toast.error(
          "We're currently experiencing technical issues right now. Please try again later."
        );

        setTimeout(() => {
          LogoutFn({ dispatch, navigate });
        }, 2000);

        return;
      }

      if (userData.status === "SUCCESS") {
        let kybData = await dispatch(fetchKyb(userData?.id));

        if (kybData?.status === "SUCCESS") {
          if (kybData?.kybStatus === "completed") {
            let accountData = await dispatch(
              getAccountDetailsAPI(
                userData.id,
                account.length > 0 ? "fetch" : "update"
              )
            );

            let va = await dispatch(
              getVirtualAccountDetailsAPI(
                userData.id,
                vaDetails.length > 0 ? "fetch" : "update"
              )
            );

            if (accountData[0].accountid) {
              let transactions = await dispatch(
                getAccountStatementAPI(
                  userData.id,
                  accountData[0].accountid,
                  getDates().startDate,
                  getDates().endDate,
                  10,
                  accountStatement.length > 0 ? "fetch" : "update"
                )
              );
            }
          }
        }
      }
    } catch (e) {
      console.log("Dashboard Page Set Error: ", e);
    } finally {
      setLoading(false);
      dispatch(setGlobalLoading(false));
    }
  };

  useEffect(() => {
    try {
      if (!isOnboarded && !kycStatus) {
        setStage(0);
      } else if (isOnboarded && kycStatus) {
        setStage(2);
      }
    } catch (e) {
    } finally {
    }
  }, []);

  //Form variables
  const [title, setTitle] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [mobileCountryCode, setMobileCountryCode] = useState(null);
  const [mobile, setMobile] = useState("");
  const [nationality, setNationality] = useState(null);
  const [deliveryAddress1, setDeliveryAddress1] = useState("");
  const [deliveryAddress2, setDeliveryAddress2] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryCountry, setDeliveryCountry] = useState(null);
  const [deliveryZipCode, setDeliveryZipCode] = useState("");
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingCountry, setBillingCountry] = useState(null);
  const [billingZipCode, setBillingZipCode] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const validateFields = ({
    title,
    firstName,
    middleName,
    lastName,
    gender,
    dateOfBirth,
    mobileCountryCode,
    mobile,
    nationality,
    deliveryAddress1,
    deliveryCity,
    deliveryState,
    deliveryCountry,
    deliveryZipCode,
    billingAddress1,
    billingCity,
    billingState,
    billingCountry,
    billingZipCode,
  }) => {
    // Required Fields
    const requiredFields = [
      { value: title, name: "Title" },
      { value: firstName, name: "First Name" },
      { value: lastName, name: "Last Name" },
      { value: gender, name: "Gender" },
      { value: dateOfBirth, name: "Date of Birth" },
      { value: mobileCountryCode, name: "Mobile Country Code" },
      { value: mobile, name: "Mobile Number" },
      { value: nationality, name: "Nationality" },
      { value: deliveryAddress1, name: "Delivery Address" },
      { value: deliveryCity, name: "Delivery City" },
      { value: deliveryState, name: "Delivery State" },
      { value: deliveryCountry, name: "Delivery Country" },
      { value: deliveryZipCode, name: "Delivery Zip Code" },
      { value: billingAddress1, name: "Billing Address" },
      { value: billingCity, name: "Billing City" },
      { value: billingState, name: "Billing State" },
      { value: billingCountry, name: "Billing Country" },
      { value: billingZipCode, name: "Billing Zip Code" },
    ];

    for (let field of requiredFields) {
      if (!field.value) {
        toast.error(`${field.name} is required.`);
        return false;
      }
    }

    // Regex Validations
    if (!regex.alpha.pattern.test(firstName)) {
      toast.error(`First Name: ${regex.alpha.message}`);
      return false;
    }

    if (middleName && !regex.alpha.pattern.test(middleName)) {
      toast.error(`Middle Name: ${regex.alpha.message}`);
      return false;
    }

    if (!regex.alpha.pattern.test(lastName)) {
      toast.error(`Last Name: ${regex.alpha.message}`);
      return false;
    }

    if (!regex.phoneNumber.pattern.test(mobile)) {
      toast.error(`Mobile Number: ${regex.phoneNumber.message}`);
      return false;
    }

    if (!regex.addressLine.pattern.test(deliveryAddress1)) {
      toast.error(`Delivery Address 1: ${regex.addressLine.message}`);
      return false;
    }

    if (!regex.addressLine.pattern.test(deliveryAddress2)) {
      toast.error(`Delivery Address 2: ${regex.addressLine.message}`);
      return false;
    }

    if (!regex.city.pattern.test(deliveryCity)) {
      toast.error(`Delivery City: ${regex.city.message}`);
      return false;
    }

    if (!regex.state.pattern.test(deliveryState)) {
      toast.error(`Delivery State: ${regex.state.message}`);
      return false;
    }

    if (deliveryZipCode && !regex.zipCode.pattern.test(deliveryZipCode)) {
      toast.error(`Delivery Zip Code: ${regex.zipCode.message}`);
      return false;
    }

    if (!regex.alphanumeric.pattern.test(billingAddress1)) {
      toast.error(`Billing Address 1: ${regex.alphanumeric.message}`);
      return false;
    }

    if (!regex.addressLine.pattern.test(billingAddress2)) {
      toast.error(`Billing Address 2: ${regex.addressLine.message}`);
      return false;
    }

    if (!regex.city.pattern.test(billingCity)) {
      toast.error(`Billing City: ${regex.city.message}`);
      return false;
    }

    if (!regex.state.pattern.test(billingState)) {
      toast.error(`Billing State: ${regex.state.message}`);
      return false;
    }

    if (billingZipCode && !regex.zipCode.pattern.test(billingZipCode)) {
      toast.error(`Billing Zip Code: ${regex.zipCode.message}`);
      return false;
    }

    return true; // Validation Passed
  };

  const createUser = async () => {
    const isValid = validateFields({
      title,
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      mobileCountryCode,
      mobile,
      nationality,
      deliveryAddress1,
      deliveryCity,
      deliveryState,
      deliveryCountry,
      deliveryZipCode,
      billingAddress1,
      billingCity,
      billingState,
      billingCountry,
      billingZipCode,
    });

    console.log(isValid);

    if (!isValid) return;

    if (!isChecked) {
      toast.warn("Agree to the terms and conditions before registering.");
      return;
    }

    try {
      setSubmitting(true);

      const data = {
        agentCode: dnsDetails?.agent_code,
        subAgentCode: dnsDetails?.subagent_code,
        title: title?.value || "",
        firstName,
        middleName,
        lastName,
        gender: gender?.value || "",
        dateOfBirth,
        mobileCountryCode: mobileCountryCode?.value || "",
        mobile,
        nationality: nationality?.value || "",
        email,
        deliveryAddress1,
        deliveryAddress2,
        deliveryCity,
        deliveryState,
        deliveryCountry: deliveryCountry?.value || "",
        deliveryZipCode,
        billingAddress1,
        billingAddress2,
        billingCity,
        billingState,
        billingCountry: billingCountry?.value || "",
        billingZipCode,
      };

      let res = await dispatch(createUserDetails({ body: data }));
      if (res.status === "SUCCESS") {
        SetPage();
      }
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  const [isEnabled, setIsEnabled] = useState(false);

  const onToggleSwitch = () => {
    setIsEnabled(!isEnabled);

    if (!isEnabled) {
      // Copy delivery address to billing address
      setBillingAddress1(deliveryAddress1);
      setBillingAddress2(deliveryAddress2);
      setBillingCity(deliveryCity);
      setBillingState(deliveryState);
      setBillingCountry(
        countryList.find((option) => option.value === deliveryCountry?.value) ||
          null
      );
      setBillingZipCode(deliveryZipCode);
    } else {
      // Clear billing address when toggled off
      setBillingAddress1("");
      setBillingAddress2("");
      setBillingCity("");
      setBillingState("");
      setBillingCountry(null);
      setBillingZipCode("");
    }
  };

  const countryList = useSelector((state) => state.utility?.countryList);
  const nationalityList = useSelector(
    (state) => state.utility?.nationalityList
  );
  const mobileCountryCodeList = useSelector(
    (state) => state.utility?.mobileCountryCodeList
  );

  const titleList = [
    {
      label: "Mr.",
      value: "Mr",
    },
    {
      label: "Miss.",
      value: "Miss",
    },
    {
      label: "Mrs.",
      value: "Mrs",
    },
  ];

  const genderList = [
    {
      label: "Male",
      value: "M",
    },
    {
      label: "Female",
      value: "F",
    },
    {
      label: "Others",
      value: "O",
    },
  ];

  useEffect(() => {
    if (title?.value) {
      let val = title?.value;

      if (val === "Mr") {
        setGender({
          label: "Male",
          value: "M",
        });
      } else if (val === "Mrs" || val === "Miss") {
        setGender({
          label: "Female",
          value: "F",
        });
      }
    }
  }, [title]);

  useEffect(() => {
    type === "individual" ? SetPage() : SetPageBusiness();
  }, []);

  //BAAS
  const [businessName, setBusinessName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [foundationDate, setFoundationDate] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState(null);
  const [purposeOfAccountOpening, setPurposeOfAccountOpening] = useState(null);

  const [taxIdType, setTaxIdType] = useState(null);
  const [taxIdNumber, setTaxIdNumber] = useState("");
  const [taxIdNationality, setTaxIdNationality] = useState(null);
  const [taxIdDateIssued, setTaxIdDateIssued] = useState("");
  const [taxIdDateExpiry, setTaxIdDateExpiry] = useState("");

  const sourceOfFundsOptions = [
    { label: "Debt", value: "debt" },
    { label: "Debt Capital", value: "debt_capital" },
    { label: "Directors Capital", value: "directors_capital" },
    { label: "Equity Capital", value: "equity_capital" },
    { label: "Others", value: "others" },
    { label: "Term Loan", value: "term_loan" },
    { label: "Venture Funding", value: "venture_funding" },
  ];

  const purposeOfAccountOpeningOptions = [
    { label: "Cash Deposit", value: "cash_deposit" },
    { label: "Cash Withdrawal", value: "cash_withdrawal" },
    { label: "Forex", value: "forex" },
    { label: "Loan Payments", value: "loan_payments" },
    { label: "Online Payment", value: "online_payment" },
  ];
  const taxIdTypeOptions = [
    { label: "Employer Identification Number", value: "ein" },
    { label: "Tax Identification Number", value: "tin" },
    { label: "Unique Entity Number", value: "uen" },
    { label: "Individual Taxpayer Number", value: "itn" },
    { label: "Business Registration Number", value: "brn" },
    { label: "Nomor Pokok Wajib Pajak", value: "npwp" },
    { label: "Identification Number", value: "in" },
  ];

  const validateFieldsBusiness = ({
    businessName,
    preferredName,
    foundationDate,

    taxIdType,
    taxIdNumber,
    taxIdNationality,
    taxIdDateIssued,
    taxIdDateExpiry,
    deliveryAddress1,
    deliveryAddress2,
    deliveryCity,
    deliveryState,
    deliveryCountry,
    deliveryZipCode,
    billingAddress1,
    billingAddress2,
    billingCity,
    billingState,
    billingCountry,
    billingZipCode,
  }) => {
    // Required Fields
    const requiredFields = [
      { value: businessName, name: "Business Name" },
      { value: preferredName, name: "Preferred Name" },
      { value: foundationDate, name: "Foundation Date" },

      { value: taxIdType, name: "Tax ID Type" },
      { value: taxIdNumber, name: "Tax ID Number" },
      { value: taxIdNationality, name: "Tax ID Nationality" },
      { value: taxIdDateIssued, name: "Tax ID Date Issued" },
      { value: taxIdDateExpiry, name: "Tax ID Date Expiry" },
      { value: deliveryAddress1, name: "Foundation Address 1" },
      { value: deliveryAddress2, name: "Foundation Address 2" },
      { value: deliveryCity, name: "Foundation City" },
      { value: deliveryState, name: "Foundation State" },
      { value: deliveryCountry, name: "Foundation Country" },
      { value: deliveryZipCode, name: "Foundation Zip Code" },
      { value: billingAddress1, name: "Operational Address 1" },
      { value: billingAddress2, name: "Operational Address 2" },
      { value: billingCity, name: "Operational City" },
      { value: billingState, name: "Operational State" },
      { value: billingCountry, name: "Operational Country" },
      { value: billingZipCode, name: "Operational Zip Code" },
    ];

    for (let field of requiredFields) {
      if (!field.value) {
        toast.error(`${field.name} is required.`);
        return false;
      }
    }

    // Regex Validations
    if (!regex.alphanumeric.pattern.test(businessName)) {
      toast.error(`Business Name: ${regex.alphanumeric.message}`);
      return false;
    }

    if (preferredName && !regex.alphanumeric.pattern.test(preferredName)) {
      toast.error(`Preferred Name: ${regex.alphanumeric.message}`);
      return false;
    }

    // if (!regex.date.pattern.test(foundationDate)) {
    //   toast.error(`Foundation Date: ${regex.date.message}`);
    //   return false;
    // }

    // if (!regex.alphanumeric.pattern.test(sourceOfFunds)) {
    //   toast.error(`Source of Funds: ${regex.alphanumeric.message}`);
    //   return false;
    // }

    // if (!regex.alphanumeric.pattern.test(purposeOfAccountOpening)) {
    //   toast.error(`Purpose of Account Opening: ${regex.alphanumeric.message}`);
    //   return false;
    // }

    if (!regex.alphanumeric.pattern.test(taxIdNumber)) {
      toast.error(`Tax ID Number: ${regex.alphanumeric.message}`);
      return false;
    }

    // if (!regex.date.pattern.test(taxIdDateIssued)) {
    //   toast.error(`Tax ID Date Issued: ${regex.date.message}`);
    //   return false;
    // }

    // if (!regex.date.pattern.test(taxIdDateExpiry)) {
    //   toast.error(`Tax ID Date Expiry: ${regex.date.message}`);
    //   return false;
    // }

    if (!regex.addressLine.pattern.test(deliveryAddress1)) {
      toast.error(`Foundation Address 1: ${regex.addressLine.message}`);
      return false;
    }

    if (!regex.addressLine.pattern.test(deliveryAddress2)) {
      toast.error(`Foundation Address 2: ${regex.addressLine.message}`);
      return false;
    }

    if (!regex.city.pattern.test(deliveryCity)) {
      toast.error(`Foundation City: ${regex.city.message}`);
      return false;
    }

    if (!regex.state.pattern.test(deliveryState)) {
      toast.error(`Foundation State: ${regex.state.message}`);
      return false;
    }

    if (!regex.zipCode.pattern.test(deliveryZipCode)) {
      toast.error(`Foundation Zip Code: ${regex.zipCode.message}`);
      return false;
    }

    if (!regex.alphanumeric.pattern.test(billingAddress1)) {
      toast.error(`Operational Address 1: ${regex.alphanumeric.message}`);
      return false;
    }

    if (!regex.alphanumeric.pattern.test(billingAddress2)) {
      toast.error(`Operational Address 2: ${regex.alphanumeric.message}`);
      return false;
    }

    if (!regex.city.pattern.test(billingCity)) {
      toast.error(`Operational City: ${regex.city.message}`);
      return false;
    }

    if (!regex.state.pattern.test(billingState)) {
      toast.error(`Operational State: ${regex.state.message}`);
      return false;
    }

    if (!regex.zipCode.pattern.test(billingZipCode)) {
      toast.error(`Operational Zip Code: ${regex.zipCode.message}`);
      return false;
    }

    return true; // Validation Passed
  };

  const createBusiness = async () => {
    const isValid = validateFieldsBusiness({
      businessName,
      preferredName,
      foundationDate,
      taxIdType,
      taxIdNumber,
      taxIdNationality,
      taxIdDateIssued,
      taxIdDateExpiry,
      deliveryAddress1,
      deliveryAddress2,
      deliveryCity,
      deliveryState,
      deliveryCountry,
      deliveryZipCode,
      billingAddress1,
      billingAddress2,
      billingCity,
      billingState,
      billingCountry,
      billingZipCode,
    });

    console.log(isValid);

    if (!isValid) return;

    if (!isChecked) {
      toast.warn("Agree to the terms and conditions before registering.");
      return;
    }

    try {
      setSubmitting(true);

      const body = {
        agentCode: "VAR039",
        subAgentCode: "01",
        businessName,
        preferredName,
        email,
        mobileCountryCode: mobileCountryCode?.value || "",
        mobile,
        foundationDate,
        purposeOfAccountOpening: purposeOfAccountOpening?.value || "",
        sourceOfFunds: sourceOfFunds?.value || "",
        taxIdType: taxIdType?.value || "",
        taxIdNumber,
        taxIdNationality: taxIdNationality?.value || "",
        taxIdDateIssued,
        taxIdDateExpiry,
        foundationAddress1: deliveryAddress1,
        foundationAddress2: deliveryAddress2,
        foundationCity: deliveryCity,
        foundationCountry: deliveryCountry?.value || "",
        foundationZipcode: deliveryZipCode,
        foundationState: deliveryState,
        operationalAddress1: billingAddress1,
        operationalAddress2: billingAddress2,
        operationalCity: billingCity,
        operationalCountry: billingCountry?.value || "",
        operationalZipcode: billingZipCode,
        operationalState: billingState,
      };

      let res = await dispatch(createBusinessDetails({ body }));
      if (res.status === "SUCCESS") {
        SetPageBusiness();
      }
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4 vh-80">
        <RingLoader size={100} color="black" />

        <label className="text-secondary">
          Hold on, we're fetching stuffs for your dashboard...
        </label>
      </div>
    );
  }

  if (type === "individual" && !userDetails) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4">
        <Card className="w-100 px-4 py-2" style={{ borderRadius: 15 }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-start align-items-center gap-3">
              <img
                src="/kyc.png"
                alt=""
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />

              <div>
                <h3 className="text-dark fw-600">Register your account</h3>
                <p className="text-center fs-7">
                  Your journey begins here. Register and explore all we have to
                  offer!
                </p>
              </div>
            </div>

            <InfoOutlined className="fs-2 text-secondary" />
          </div>
        </Card>

        <Card className="p-4 w-100" style={{ borderRadius: 15 }}>
          <h5 className="text-primary fw-600 text-start">
            Personal Information
          </h5>
          <Divider className="my-3" />

          <div className="onboarding-form">
            <CustomInput
              value={email}
              leftIcon={<Email />}
              right={""}
              label={"Email Address"}
              disabled={true}
              max={100}
              type={"email"}
              regex={regex.email}
            />

            <CustomSelect
              options={titleList}
              id="title"
              value={title}
              onChange={setTitle}
              className=""
              style={{}}
              label="Title"
              required
            />

            <CustomInput
              value={firstName}
              onInput={setFirstName}
              leftIcon={<AccountCircle />}
              label={"First Name"}
              max={25}
              required
              regex={regex.alpha}
              type={"alpha"}
            />
            <CustomInput
              value={middleName}
              onInput={setMiddleName}
              leftIcon={<AccountCircle />}
              label={"Middle Name"}
              max={25}
              regex={regex.alpha}
              type={"alpha"}
            />

            <CustomInput
              value={lastName}
              onInput={setLastName}
              leftIcon={<AccountCircle />}
              label={"Last Name"}
              max={25}
              required
              regex={regex.alpha}
              type={"alpha"}
            />

            <CustomSelect
              options={genderList}
              id="gender"
              value={gender}
              onChange={setGender}
              className=""
              style={{}}
              label="Gender"
              required
            />

            <CustomDatepicker
              selectedDate={dateOfBirth}
              onDateChange={setDateOfBirth}
              label="Date of Birth"
              required
            />

            <CustomSelect
              options={mobileCountryCodeList}
              id="mobileCountryCode"
              value={mobileCountryCode}
              onChange={setMobileCountryCode}
              className=""
              style={{}}
              label="Mobile Country Code"
              required
            />

            <CustomInput
              value={mobile}
              onInput={setMobile}
              leftIcon={<Call />}
              label={"Mobile Number"}
              max={12}
              type={"phoneNumber"}
              required
              regex={regex.phoneNumber}
            />

            <CustomSelect
              options={nationalityList}
              id="nationality"
              value={nationality}
              onChange={setNationality}
              className=""
              style={{}}
              label="Nationality"
              required
            />
          </div>
        </Card>

        <Card className="p-4 w-100" style={{ borderRadius: 15 }}>
          <h5 className="text-primary fw-600 text-start">Delivery Address</h5>
          <Divider className="my-3" />
          <div className="onboarding-form">
            <CustomInput
              value={deliveryAddress1}
              onInput={setDeliveryAddress1}
              leftIcon={<MyLocation />}
              right={""}
              label={"Delivery Address 1"}
              required
              regex={regex.addressLine}
              type={"adressLine"}
              max={35}
            />

            <CustomInput
              value={deliveryAddress2}
              onInput={setDeliveryAddress2}
              leftIcon={<NearMe />}
              label={"Delivery Address 2"}
              max={35}
              required
              regex={regex.addressLine}
              type={"adressLine"}
            />
            <CustomInput
              value={deliveryCity}
              onInput={setDeliveryCity}
              leftIcon={<LocationCity />}
              label={"Delivery City"}
              max={20}
              required
              regex={regex.city}
              type={"city"}
            />

            <CustomInput
              value={deliveryState}
              onInput={setDeliveryState}
              leftIcon={<LocationCity />}
              label={"Delivery State"}
              max={20}
              required
              regex={regex.state}
              type={"state"}
            />

            <CustomInput
              value={deliveryZipCode}
              onInput={setDeliveryZipCode}
              leftIcon={<Explore />}
              label={"Delivery Zipcode"}
              max={8}
              required
              regex={regex.zipCode}
              type={"zipCode"}
            />

            <CustomSelect
              options={countryList}
              id="deliveryCountry"
              value={deliveryCountry}
              onChange={setDeliveryCountry}
              className=""
              style={{}}
              label="Delivery Country"
              required
            />
          </div>
        </Card>

        <Card className="p-4 w-100" style={{ borderRadius: 15 }}>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="text-primary fw-600 text-start">Billing Address</h5>

            <div>
              <label htmlFor="" className="fs-8 fw-600 text-secondary">
                Is Billing Address same as Delivery Address?
              </label>

              <Switch
                size="small"
                className="me-3 ms-2"
                onClick={onToggleSwitch}
              />
            </div>
          </div>

          <Divider className="my-3" />
          <div className="onboarding-form">
            <CustomInput
              value={billingAddress1}
              onInput={setBillingAddress1}
              leftIcon={<MyLocation />}
              right={""}
              label={"Billing Address 1"}
              required
              regex={regex.addressLine}
              type={"adressLine"}
              max={35}
            />

            <CustomInput
              value={billingAddress2}
              onInput={setBillingAddress2}
              leftIcon={<NearMe />}
              label={"Billing Address 2"}
              max={20}
              required
              regex={regex.addressLine}
              type={"adressLine"}
            />
            <CustomInput
              value={billingCity}
              onInput={billingCity}
              leftIcon={<LocationCity />}
              label={"Billing City"}
              max={20}
              required
              regex={regex.city}
              type={"city"}
            />

            <CustomInput
              value={billingState}
              onInput={setBillingState}
              leftIcon={<LocationCity />}
              label={"Billing State"}
              max={20}
              required
              regex={regex.state}
              type={"state"}
            />

            <CustomInput
              value={billingZipCode}
              onInput={setBillingZipCode}
              leftIcon={<Explore />}
              label={"Billing Zipcode"}
              max={8}
              required
              regex={regex.zipCode}
              type={"zipCode"}
            />

            <CustomSelect
              options={countryList}
              id="billingCountry"
              value={billingCountry}
              onChange={setBillingCountry}
              className=""
              style={{}}
              label="Billing Country"
              required
            />
          </div>

          <div className="text-center py-3">
            <Checkbox
              color="success"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="" className="fs-7">
              I agree to the{" "}
              <a
                className="fw-600"
                onClick={() =>
                  window.open(process.env.VITE_privacyPolicy, "_blank")
                }
              >
                Terms & Conditions
              </a>
            </label>
          </div>

          <CustomButton
            label={"Register Now"}
            icon={<AppRegistration />}
            style={{ width: 350, margin: "0 auto" }}
            isLoading={isSubmitting}
            onClick={createUser}
          />
        </Card>
      </div>
    );
  }

  if (type === "business" && !userDetails) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4">
        <Card className="w-100 px-4 py-2" style={{ borderRadius: 15 }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-start align-items-center gap-3">
              <img
                src="/kyc.png"
                alt=""
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />

              <div>
                <h3 className="text-dark fw-600">Register your business</h3>
                <p className="text-center fs-7">
                  Your journey begins here. Register and explore all we have to
                  offer!
                </p>
              </div>
            </div>

            <InfoOutlined className="fs-2 text-secondary" />
          </div>
        </Card>

        <Card className="p-4 w-100" style={{ borderRadius: 15 }}>
          <h5 className="text-primary fw-600 text-start">
            Business Information
          </h5>
          <Divider className="my-3" />

          <div className="onboarding-form">
            <CustomInput
              value={email}
              leftIcon={<Email />}
              right={""}
              label={"Email Address"}
              disabled={true}
              max={100}
              type={"email"}
              regex={regex.email}
            />

            <CustomInput
              value={businessName}
              onInput={setBusinessName}
              leftIcon={<Business />}
              label={"Business Name"}
              max={25}
              required
              regex={regex.alphanumeric}
              type={"alphanumeric"}
            />
            <CustomInput
              value={preferredName}
              onInput={setPreferredName}
              leftIcon={<BusinessCenter />}
              label={"Preferred Name"}
              max={25}
              regex={regex.alphanumeric}
              type={"alphanumeric"}
              required
            />

            <CustomPastDatepicker
              selectedDate={foundationDate}
              onDateChange={setFoundationDate}
              label="Foundation Date"
              required
            />

            <CustomSelect
              options={mobileCountryCodeList}
              id="mobileCountryCode"
              value={mobileCountryCode}
              onChange={setMobileCountryCode}
              className=""
              style={{}}
              label="Mobile Country Code"
              required
            />

            <CustomInput
              value={mobile}
              onInput={setMobile}
              leftIcon={<Call />}
              label={"Mobile Number"}
              max={12}
              type={"phoneNumber"}
              required
              regex={regex.phoneNumber}
            />

            <CustomSelect
              options={sourceOfFundsOptions}
              id="sourceOfFunds"
              value={sourceOfFunds}
              onChange={setSourceOfFunds}
              className=""
              style={{}}
              label="Source Of Funds"
            />

            <CustomSelect
              options={purposeOfAccountOpeningOptions}
              id="purposeOfAccountOpening"
              value={purposeOfAccountOpening}
              onChange={setPurposeOfAccountOpening}
              className=""
              style={{}}
              label="Purpose Of Account Opening"
            />
          </div>
        </Card>

        <Card className="p-4 w-100" style={{ borderRadius: 15 }}>
          <h5 className="text-primary fw-600 text-start">Tax Information</h5>
          <Divider className="my-3" />

          <div className="onboarding-form">
            <CustomSelect
              options={taxIdTypeOptions}
              id="taxIdType"
              value={taxIdType}
              onChange={setTaxIdType}
              className=""
              style={{}}
              label="Id Type"
              required
            />

            <CustomInput
              value={taxIdNumber}
              onInput={setTaxIdNumber}
              leftIcon={<PointOfSale />}
              label={"Id Number"}
              max={9}
              required
              regex={regex.alphanumeric}
              type={"alphanumeric"}
            />

            <CustomSelect
              options={nationalityList}
              id="taxIdNationality"
              value={taxIdNationality}
              onChange={setTaxIdNationality}
              className=""
              style={{}}
              label="Nationality"
              required
            />

            <CustomPastDatepicker
              selectedDate={taxIdDateIssued}
              onDateChange={setTaxIdDateIssued}
              label="Issue Date"
              required
            />

            <CustomFutureDatepicker
              selectedDate={taxIdDateExpiry}
              onDateChange={setTaxIdDateExpiry}
              label="Expiry Date"
              required
            />
          </div>
        </Card>

        <Card className="p-4 w-100" style={{ borderRadius: 15 }}>
          <h5 className="text-primary fw-600 text-start">Foundation Address</h5>
          <Divider className="my-3" />
          <div className="onboarding-form">
            <CustomInput
              value={deliveryAddress1}
              onInput={setDeliveryAddress1}
              leftIcon={<MyLocation />}
              right={""}
              label={"Foundation Address 1"}
              required
              regex={regex.addressLine}
              type={"adressLine"}
              max={35}
            />

            <CustomInput
              value={deliveryAddress2}
              onInput={setDeliveryAddress2}
              leftIcon={<NearMe />}
              label={"Foundation Address 2"}
              max={35}
              required
              regex={regex.addressLine}
              type={"adressLine"}
            />
            <CustomInput
              value={deliveryCity}
              onInput={setDeliveryCity}
              leftIcon={<LocationCity />}
              label={"Foundation City"}
              max={20}
              required
              regex={regex.city}
              type={"city"}
            />

            <CustomInput
              value={deliveryState}
              onInput={setDeliveryState}
              leftIcon={<LocationCity />}
              label={"Foundation State"}
              max={20}
              required
              regex={regex.state}
              type={"state"}
            />

            <CustomInput
              value={deliveryZipCode}
              onInput={setDeliveryZipCode}
              leftIcon={<Explore />}
              label={"Foundation Zipcode"}
              max={8}
              required
              regex={regex.zipCode}
              type={"zipCode"}
            />

            <CustomSelect
              options={countryList}
              id="deliveryCountry"
              value={deliveryCountry}
              onChange={setDeliveryCountry}
              className=""
              style={{}}
              label="Foundation Country"
              required
            />
          </div>
        </Card>

        <Card className="p-4 w-100" style={{ borderRadius: 15 }}>
          <div className="d-flex align-items-end justify-content-between">
            <h5 className="text-primary fw-600 text-start">
              Operational Address
            </h5>

            <div>
              <label htmlFor="" className="fs-8 fw-600 text-secondary">
                Is Operational Address same as Foundation Address?
              </label>

              <Switch
                size="small"
                className="me-3 ms-2"
                onClick={onToggleSwitch}
              />
            </div>
          </div>

          <Divider className="my-3" />
          <div className="onboarding-form">
            <CustomInput
              value={billingAddress1}
              onInput={setBillingAddress1}
              leftIcon={<MyLocation />}
              right={""}
              label={"Operational Address 1"}
              required
              regex={regex.addressLine}
              type={"adressLine"}
              max={35}
            />

            <CustomInput
              value={billingAddress2}
              onInput={setBillingAddress2}
              leftIcon={<NearMe />}
              label={"Operational Address 2"}
              max={20}
              required
              regex={regex.addressLine}
              type={"adressLine"}
            />
            <CustomInput
              value={billingCity}
              onInput={billingCity}
              leftIcon={<LocationCity />}
              label={"Operational City"}
              max={20}
              required
              regex={regex.city}
              type={"city"}
            />

            <CustomInput
              value={billingState}
              onInput={setBillingState}
              leftIcon={<LocationCity />}
              label={"Operational State"}
              max={20}
              required
              regex={regex.state}
              type={"state"}
            />

            <CustomInput
              value={billingZipCode}
              onInput={setBillingZipCode}
              leftIcon={<Explore />}
              label={"Operational Zipcode"}
              max={8}
              required
              regex={regex.zipCode}
              type={"zipCode"}
            />

            <CustomSelect
              options={countryList}
              id="billingCountry"
              value={billingCountry}
              onChange={setBillingCountry}
              className=""
              style={{}}
              label="Operational Country"
              required
            />
          </div>

          <div className="text-center py-3">
            <Checkbox
              color="success"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="" className="fs-7">
              I agree to the{" "}
              <a
                className="fw-600"
                onClick={() =>
                  window.open(process.env.VITE_privacyPolicy, "_blank")
                }
              >
                Terms & Conditions
              </a>
            </label>
          </div>

          <CustomButton
            label={"Register Now"}
            icon={<AppRegistration />}
            style={{ width: 350, margin: "0 auto" }}
            isLoading={isSubmitting}
            onClick={createBusiness}
          />
        </Card>
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
    <div className="p-2 flex-column d-flex gap-3">
      <div className="pb-2" style={{ letterSpacing: "-0.5px" }}>
        <p style={{ fontSize: "14px" }} className="text-secondary pb-1">
          {currentDate}
        </p>
        <label className="text-dark fs-5">
          {greeting}{" "}
          {type === "individual" && userDetails
            ? `${userDetails?.firstName}`
            : type === "business" && userDetails
            ? `${userDetails?.businessName}`
            : ``}
        </label>
      </div>

      <div className="d-flex justify-content-start align-items-start gap-4">
        <div
          className="d-flex flex-column"
          style={{ gap: "2rem", width: program === "SMMAAS0" ? "65%" : "100%" }}
        >
          <AccountSummary account={account} SetPage={SetPage} />
          <LastTransactions transactions={accountStatement.slice(0, 5)} />
        </div>

        <div className="d-flex flex-column" style={{ gap: "2rem" }}>
          {program === "SMMAAS0" ? (
            <Cards cards={cards} SetPage={SetPage} />
          ) : (
            // <VA SetPage={type === "individual" ? SetPage : SetPageBusiness} />
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
