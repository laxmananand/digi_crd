import {
  AccountBalance,
  AccountBalanceWallet,
  AppRegistration,
  CallMade,
  CallReceived,
  ChevronLeft,
  ChevronRight,
  CurrencyExchangeOutlined,
  Filter,
  Filter1,
  FilterAlt,
  FilterList,
  HelpCenter,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ReceiptLong,
  Savings,
  Search,
  SearchRounded,
  ShoppingCartOutlined,
  TrendingDown,
  TrendingUp,
  Tune,
  Visibility,
  WorkHistory,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addAccount, VA } from "./dashboard";
import { FaExchangeAlt, FaShoppingCart, FaUndo } from "react-icons/fa";
import {
  CustomButton,
  CustomFutureDatepicker,
  CustomInput,
  CustomPastDatepicker,
  CustomSelect,
} from "../../@component_v2/CustomComponents";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../../@redux/feature/Utility";
import {
  Box,
  CircularProgress,
  Fab,
  IconButton,
  Tooltip,
  Zoom,
} from "@mui/material";
import { getDates } from "../../@component_v2/CustomComponents";
import { getAccountStatementAPI } from "../../@redux/action/account";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import { motion } from "framer-motion";

export const FinanceList = () => {
  const account = useSelector((state) => state.account.accountDetails);
  const accountStatement = useSelector(
    (state) => state.account.accountStatement
  );

  const availableBalance = parseFloat(account[0]?.availableBalance || "0");

  const income = accountStatement
    .filter((txn) => txn.indicator === "credit")
    .reduce((sum, txn) => sum + parseFloat(txn.amount.value), 0);

  const expense = accountStatement
    .filter((txn) => txn.indicator === "debit")
    .reduce((sum, txn) => sum + parseFloat(txn.amount.value), 0);

  const totalSaving = income - expense;

  const financeData = [
    {
      id: 1,
      title: "My Balance",
      amount: `$${availableBalance.toFixed(2)}`,
      icon: <AccountBalance />,
      bgColor: "#FF5733", // Vibrant Red-Orange
      progress: 80, // Higher balance → More progress
    },
    {
      id: 2,
      title: "Income",
      amount: `$${income.toFixed(2)}`,
      icon: <TrendingUp />,
      bgColor: "#28A745", // Green for positive income
      progress: 90, // High income → Higher progress
    },
    {
      id: 3,
      title: "Expense",
      amount: `$${expense.toFixed(2)}`,
      icon: <TrendingDown />,
      bgColor: "#DC3545", // Red for expenses (warning)
      progress: 60, // Expenses should be moderate
    },
    {
      id: 4,
      title: "Total Saving",
      amount: `$${totalSaving.toFixed(2)}`,
      icon: <Savings />,
      bgColor: "#212529", // Blue for stable savings
      progress: 70, // Decent savings but can be improved
    },
  ];

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridGap: 20,
        }}
      >
        {financeData.map((item) => (
          <div
            key={item.id}
            className="d-flex justify-content-start align-items-enter gap-1"
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "15px",
              width: "auto",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <div className="d-flex align-items-center">
              <Box sx={{ m: 1, position: "relative" }}>
                <Fab aria-label="save" className="bg-white" size="small">
                  {item.icon}
                </Fab>

                <CircularProgress
                  variant="determinate"
                  size={50}
                  value={100}
                  sx={{
                    color: item.bgColor,
                    position: "absolute",
                    top: -5,
                    left: -5,
                    zIndex: 1,
                  }}
                />
              </Box>
            </div>

            <div className="text-start ms-2 my-2">
              <p
                style={{ color: "#8A8A8A", marginBottom: "6px", fontSize: 12 }}
              >
                {item.title}
              </p>
              <h5 style={{ margin: "0", fontWeight: "bold", fontSize: 14 }}>
                {item.amount}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const transactionIcons = {
  credit: <CallReceived style={{ color: "green" }} size={8} />,
  debit: <CallMade style={{ color: "brown" }} size={8} />,
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("en-US", options);
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

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5; // Show 5 per page

  const handleFilterChange = (selected) => setFilterType(selected.value);

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === "all" || txn.indicator === filterType;

    return matchesFilter;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortBy) return 0;
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === "amount") {
      valA = Number(valA);
      valB = Number(valB);
    } else if (sortBy === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);
  const indexOfLastTxn = currentPage * transactionsPerPage;
  const indexOfFirstTxn = indexOfLastTxn - transactionsPerPage;
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
      <div className="transaction-container p-4">
        <label className="fw-600 text-dark py-3 fs-5 border-bottom w-100 mb-2">
          Transaction History
        </label>

        <div className="table-controls">
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

        <div className="d-flex justify-content-start py-2">
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
                  <thead>
                    <tr>
                      <th>Receiver</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Balance</th>
                      <th>Date</th>
                    </tr>
                  </thead>
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
                          className={`transaction-row ${
                            index % 2 === 0 ? "bg-light" : ""
                          }`}
                        >
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="icon">
                                {transactionIcons[txn.indicator]}
                              </div>
                              <span className="receiver-name">
                                {txn.recipient_name}
                              </span>
                            </div>
                          </td>
                          <td
                            className={`fw-600 ${
                              txn.indicator === "debit"
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            {txn.indicator.toUpperCase()}
                          </td>
                          <td
                            className={`fw-600 ${
                              txn.status.toLowerCase() !== "success"
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            {txn.status.toUpperCase()}
                          </td>
                          <td>{`${txn.transaction_id}/${
                            txn.description || txn.details.description
                          }`}</td>
                          <td
                            className={`fw-bold ${
                              txn.indicator === "debit"
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            {`$${Number(txn.amount.value).toFixed(2)}`}
                          </td>
                          <td>{`$${Number(txn.balance.value).toFixed(2)}`}</td>
                          <td>{formatDate(txn.date)}</td>
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

export const Accounts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const account = useSelector((state) => state.account.accountDetails);
  const virtualAccount = useSelector(
    (state) => state.account.virtualAccountDetails
  );

  const accountStatement = useSelector(
    (state) => state.account.accountStatement
  );

  const SetPage = () => {
    dispatch(setActiveTab("Dashboard"));
    navigate("/dashboard");
  };

  useEffect(() => {}, [account, accountStatement]);

  const userDetails = useSelector((state) => state.auth.userDetails);

  const program = useSelector((state) => state.utility.program);
  const type = useSelector((state) => state.auth.type);
  const kybDetails = useSelector((state) => state.auth.kycDetails);

  const [collapsed, setCollapsed] = useState(true);
  const [collapsedVA, setCollapsedVA] = useState(true);

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
    <>
      <div className="d-flex align-items-start justify-content-between flex-column p-2">
        <h5 className="fw-600 mb-4">Account(s)</h5>

        <Card
          className="d-flex justify-content-between align-items-start w-100 border p-4 bg-white"
          style={{ borderRadius: 12 }}
        >
          <div className="d-flex justify-content-between align-items-center w-100">
            <img src="/banks/straitsx.png" alt="" width={100} />

            <div className="d-flex justify-content-start align-items-center gap-2">
              <p className="text-dark">Account Holder:</p>
              <p>
                {type === "individual"
                  ? userDetails?.firstName + " " + userDetails?.lastName
                  : userDetails?.businessName}
              </p>
            </div>
            <div className="d-flex justify-content-start align-items-center gap-2">
              <p className="text-dark">Account Number:</p>
              <p>{`**********${account[0].accountNumber.slice(-4)}`}</p>
            </div>

            <IconButton onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>
          </div>

          {/* Motion div for animation */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: collapsed ? "auto" : 0,
              opacity: collapsed ? 1 : 0,
            }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }} // Smooth effect
            style={{ overflow: "hidden", width: "100%" }} // Prevents abrupt changes
          >
            <div
              className="w-100 pt-4 d-flex align-items-start justify-content-between"
              style={{ gap: "5rem" }}
            >
              <div className="d-flex justify-content-center align-items-between gap-3 flex-column w-50">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-dark">Account Number:</p>

                  <p>{`${account[0].accountNumber}`}</p>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-dark">Account Type:</p>

                  <p>{"Wallet Account"}</p>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-dark">Account Status:</p>

                  <p
                    className={
                      account[0].status.toLowerCase() === "active"
                        ? "text-success fw-bold"
                        : ""
                    }
                  >
                    {account[0].status.toUpperCase()}
                  </p>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-dark">Account Creation Date:</p>

                  <p>{account[0].createdAt}</p>
                </div>
              </div>
              <div className="w-50" style={{ paddingLeft: "6.5rem" }}>
                <div className="d-flex justify-content-start align-items-center gap-2">
                  <p className="text-secondary fs-6">Current Balance:</p>

                  <p className="text-dark fs-6 fw-600">{`$${account[0].availableBalance}`}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </Card>

        {program === "SMMACS0" && (
          <Card
            className="d-flex justify-content-between align-items-start w-100 border p-4 bg-white mt-4"
            style={{ borderRadius: 12 }}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <img src="/banks/matchmove.png" alt="" width={100} />

              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="text-dark">Account Holder:</p>
                <p>{virtualAccount[0].accountHolderName}</p>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <p className="text-dark">Account Number:</p>
                <p>{`**********${virtualAccount[0].accountNumber.slice(
                  -4
                )}`}</p>
              </div>

              <IconButton onClick={() => setCollapsedVA(!collapsedVA)}>
                {collapsedVA ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
              </IconButton>
            </div>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: collapsedVA ? "auto" : 0,
                opacity: collapsedVA ? 1 : 0,
              }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }} // Smooth effect
              style={{ overflow: "hidden", width: "100%" }} // Prevents abrupt changes
            >
              <div
                className="w-100 pt-4 d-flex align-items-start justify-content-between"
                style={{ gap: "5rem" }}
              >
                <div className="d-flex justify-content-center align-items-between gap-3 flex-column w-50">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark">Account Number:</p>

                    <p>{`${virtualAccount[0].accountNumber}`}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark">Account Type:</p>

                    <p>{"Virtual Account"}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark">Account Status:</p>

                    <p
                      className={
                        account[0].status.toLowerCase() === "active"
                          ? "text-success fw-bold"
                          : ""
                      }
                    >
                      {virtualAccount[0].status.toUpperCase()}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark">Account Creation Date:</p>

                    <p>{virtualAccount[0].createdAt}</p>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-center align-items-between gap-3 flex-column w-50"
                  style={{ paddingLeft: "6.5rem" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark">Bank Code:</p>

                    <p>{`${virtualAccount[0].bankCode}`}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark">Bank Name:</p>

                    <p>{`${virtualAccount[0].accountBankName}`}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark">Bank Country:</p>

                    <p>{`${virtualAccount[0].accountBankCountry}`}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-start">
                    <p className="text-dark">Bank Address:</p>

                    <p className="w-60 text-end">{`${virtualAccount[0].accountBankAddress}`}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Card>
        )}

        <div className="w-100 pt-5">
          <LastTransactions transactions={accountStatement} />
        </div>
      </div>
    </>
  );
};

export default Accounts;
