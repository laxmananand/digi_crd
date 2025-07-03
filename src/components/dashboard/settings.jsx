import React, { useState, useEffect } from "react";
import SettingsSidebar from "../../@component_v2/SettingsSidebar";
import {
  Card,
  CardContent,
  IconButton,
  Box,
  Avatar,
  Divider,
  Switch,
  CircularProgress,
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
  Delete,
  EmailOutlined,
  LockReset,
  DeleteOutline,
  Upload,
  CloudUpload,
  NoteAdd,
  Save,
  Publish,
  Business,
  BusinessCenter,
  PointOfSale,
  BorderColor,
  ResetTv,
  Password,
  Visibility,
  VisibilityOff,
  LockResetOutlined,
} from "@mui/icons-material";
import {
  CustomDatepicker,
  CustomInput,
  CustomSelect,
  CustomButton,
  CustomPastDatepicker,
  CustomFutureDatepicker,
} from "../../@component_v2/CustomComponents";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteUserDetails,
  fetchKyb,
  forgotPassword,
  updateBusinessDetails,
  updateUserDetails,
} from "../../@redux/action/Auth";
import {
  Form,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Image,
  Table,
} from "react-bootstrap";
import regex from "./../utility/regex";
import axios from "axios";
import axiosInstance from "../../@redux/axiosInstance";
import { setActiveTab as moveTo } from "../../@redux/feature/Utility";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const dispatch = useDispatch();

  const email =
    useSelector((state) => state.auth?.loginEmail) || "alexmercerweb@gmail.com";
  const isOnboarded = useSelector((state) => state.auth?.isOnboarded);
  const kycStatus = useSelector((state) => state.auth?.kycDetails?.kycStatus);
  const userDetails = useSelector((state) => state.auth?.userDetails);
  const authUser = useSelector((state) => state.auth?.user);

  const [isSubmitting, setSubmitting] = useState(false);
  const [edit, setEdit] = useState(true);

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

  const [isEnabled, setIsEnabled] = useState(false);

  //Form variables
  const [title, setTitle] = useState(
    titleList.find((option) => option.value === userDetails?.title || "")
  );
  const [firstName, setFirstName] = useState(userDetails?.firstName || "");
  const [middleName, setMiddleName] = useState(userDetails?.middleName || "");
  const [lastName, setLastName] = useState(userDetails?.lastName || "");
  const [gender, setGender] = useState(
    genderList.find((option) => option.value === userDetails?.gender || "")
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    userDetails?.dateOfBirth || ""
  );
  const [mobileCountryCode, setMobileCountryCode] = useState(
    mobileCountryCodeList.find(
      (option) => option.value === userDetails?.mobileCountryCode || ""
    )
  );
  const [mobile, setMobile] = useState(userDetails?.mobile || "");
  const [nationality, setNationality] = useState(
    nationalityList.find(
      (option) => option.label === userDetails?.nationality || ""
    )
  );
  const [deliveryAddress1, setDeliveryAddress1] = useState(
    userDetails?.deliveryAddress1 || userDetails?.foundationAddress1 || ""
  );
  const [deliveryAddress2, setDeliveryAddress2] = useState(
    userDetails?.deliveryAddress2 || userDetails?.foundationAddress2 || ""
  );
  const [deliveryCity, setDeliveryCity] = useState(
    userDetails?.deliveryCity || userDetails?.foundationCity || ""
  );
  const [deliveryState, setDeliveryState] = useState(
    userDetails?.deliveryState || userDetails?.foundationState || ""
  );
  const [deliveryCountry, setDeliveryCountry] = useState(
    countryList.find(
      (option) =>
        option.label === userDetails?.deliveryCountry ||
        option.label === userDetails?.foundationCountry ||
        ""
    )
  );
  const [deliveryZipCode, setDeliveryZipCode] = useState(
    userDetails?.deliveryZipCode || userDetails?.foundationZipcode || ""
  );
  const [billingAddress1, setBillingAddress1] = useState(
    userDetails?.billingAddress1 || userDetails?.operationalAddress1 || ""
  );
  const [billingAddress2, setBillingAddress2] = useState(
    userDetails?.billingAddress2 || userDetails?.operationalAddress2 || ""
  );
  const [billingCity, setBillingCity] = useState(
    userDetails?.billingCity || userDetails?.operationalCity || ""
  );
  const [billingState, setBillingState] = useState(
    userDetails?.billingState || userDetails?.operationalState || ""
  );
  const [billingCountry, setBillingCountry] = useState(
    countryList.find(
      (option) =>
        option.label === userDetails?.billingCountry ||
        option.label === userDetails?.operationalCountry ||
        ""
    )
  );
  const [billingZipCode, setBillingZipCode] = useState(
    userDetails?.billingZipCode || userDetails?.operationalZipcode || ""
  );

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

  // Function to create the `data` object with changed values
  const getUpdatedData = () => {
    const updatedData = {};

    // Check each field and compare with `userDetails`
    if (title?.value !== userDetails?.title) {
      updatedData.title = title?.value;
    }
    if (firstName !== userDetails?.firstName) {
      updatedData.firstName = firstName;
    }
    if (middleName !== userDetails?.middleName) {
      updatedData.middleName = middleName;
    }
    if (lastName !== userDetails?.lastName) {
      updatedData.lastName = lastName;
    }
    if (gender?.value !== userDetails?.gender) {
      updatedData.gender = gender?.value;
    }
    if (dateOfBirth !== userDetails?.dateOfBirth) {
      updatedData.dateOfBirth = dateOfBirth;
    }
    if (mobileCountryCode?.value !== userDetails?.mobileCountryCode) {
      updatedData.mobileCountryCode = mobileCountryCode?.value;
    }
    if (mobile !== userDetails?.mobile) {
      updatedData.mobile = mobile;
    }
    if (nationality?.label !== userDetails?.nationality) {
      updatedData.nationality = nationality?.label;
    }
    if (deliveryAddress1 !== userDetails?.deliveryAddress1) {
      updatedData.deliveryAddress1 = deliveryAddress1;
    }
    if (deliveryAddress2 !== userDetails?.deliveryAddress2) {
      updatedData.deliveryAddress2 = deliveryAddress2;
    }
    if (deliveryCity !== userDetails?.deliveryCity) {
      updatedData.deliveryCity = deliveryCity;
    }
    if (deliveryState !== userDetails?.deliveryState) {
      updatedData.deliveryState = deliveryState;
    }
    if (deliveryCountry?.label !== userDetails?.deliveryCountry) {
      updatedData.deliveryCountry = deliveryCountry?.label;
    }
    if (deliveryZipCode !== userDetails?.deliveryZipCode) {
      updatedData.deliveryZipCode = deliveryZipCode;
    }
    if (billingAddress1 !== userDetails?.billingAddress1) {
      updatedData.billingAddress1 = billingAddress1;
    }
    if (billingAddress2 !== userDetails?.billingAddress2) {
      updatedData.billingAddress2 = billingAddress2;
    }
    if (billingCity !== userDetails?.billingCity) {
      updatedData.billingCity = billingCity;
    }
    if (billingState !== userDetails?.billingState) {
      updatedData.billingState = billingState;
    }
    if (billingCountry?.label !== userDetails?.billingCountry) {
      updatedData.billingCountry = billingCountry?.label;
    }
    if (billingZipCode !== userDetails?.billingZipCode) {
      updatedData.billingZipCode = billingZipCode;
    }

    return updatedData;
  };

  const updateUser = async () => {
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

    const updatedData = getUpdatedData();

    try {
      setSubmitting(true);

      // Send `updatedData` to the server or API if not empty
      if (Object.keys(updatedData).length > 0) {
        await dispatch(updateUserDetails({ body: updatedData }));
      } else {
        toast.error(
          "All fields match the current data. Please make changes to proceed."
        );
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong, please try again later!");
    } finally {
      setSubmitting(false);
    }
  };

  //BAAS

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

  //BAAS
  const [businessName, setBusinessName] = useState(
    userDetails?.businessName || ""
  );
  const [preferredName, setPreferredName] = useState(
    userDetails?.preferredName || ""
  );
  const [foundationDate, setFoundationDate] = useState(
    userDetails?.foundationDate || ""
  );
  const [sourceOfFunds, setSourceOfFunds] = useState(
    sourceOfFundsOptions.find(
      (option) => option.value === userDetails?.sourceOfFunds || ""
    )
  );
  const [purposeOfAccountOpening, setPurposeOfAccountOpening] = useState(
    purposeOfAccountOpeningOptions.find(
      (option) => option.value === userDetails?.purposeOfAccountOpening || ""
    )
  );

  const [taxIdType, setTaxIdType] = useState(
    taxIdTypeOptions.find(
      (option) => option.value === userDetails?.taxIdType || ""
    )
  );
  const [taxIdNumber, setTaxIdNumber] = useState(
    userDetails?.taxIdNumber || ""
  );
  const [taxIdNationality, setTaxIdNationality] = useState(
    countryList.find(
      (option) => option.label === userDetails?.taxIdNationality || ""
    )
  );
  const [taxIdDateIssued, setTaxIdDateIssued] = useState(
    userDetails?.taxIdDateIssued || ""
  );
  const [taxIdDateExpiry, setTaxIdDateExpiry] = useState(
    userDetails?.taxIdDateExpiry || ""
  );

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

  const getUpdatedDataBusiness = () => {
    const updatedData = {};

    // Check each field and compare with `userDetails`

    if (businessName !== userDetails?.businessName) {
      updatedData.businessName = businessName;
    }

    if (preferredName !== userDetails?.preferredName) {
      updatedData.preferredName = preferredName;
    }

    if (foundationDate !== userDetails?.foundationDate) {
      updatedData.foundationDate = foundationDate;
    }

    if (taxIdType?.value !== userDetails?.taxIdType) {
      updatedData.taxIdType = taxIdType?.value;
    }

    if (taxIdNumber !== userDetails?.taxIdNumber) {
      updatedData.taxIdNumber = taxIdNumber;
    }

    if (taxIdNationality?.label !== userDetails?.taxIdNationality) {
      updatedData.taxIdNationality = taxIdNationality?.value;
    }

    if (taxIdDateIssued !== userDetails?.taxIdDateIssued) {
      updatedData.taxIdDateIssued = taxIdDateIssued;
    }

    if (taxIdDateExpiry !== userDetails?.taxIdDateExpiry) {
      updatedData.taxIdDateExpiry = taxIdDateExpiry;
    }

    if (mobileCountryCode?.value !== userDetails?.mobileCountryCode) {
      updatedData.mobileCountryCode = mobileCountryCode?.value;
    }
    if (mobile !== userDetails?.mobile) {
      updatedData.mobile = mobile;
    }

    if (deliveryAddress1 !== userDetails?.foundationAddress1) {
      updatedData.foundationAddress1 = deliveryAddress1;
    }
    if (deliveryAddress2 !== userDetails?.foundationAddress2) {
      updatedData.foundationAddress2 = deliveryAddress2;
    }
    if (deliveryCity !== userDetails?.foundationCity) {
      updatedData.foundationCity = deliveryCity;
    }
    if (deliveryState !== userDetails?.foundationState) {
      updatedData.foundationState = deliveryState;
    }
    if (deliveryCountry?.label !== userDetails?.foundationCountry) {
      updatedData.foundationCountry = deliveryCountry?.value;
    }
    if (deliveryZipCode !== userDetails?.foundationZipcode) {
      updatedData.foundationZipcode = deliveryZipCode;
    }

    if (billingAddress1 !== userDetails?.operationalAddress1) {
      updatedData.operationalAddress1 = billingAddress1;
    }
    if (billingAddress2 !== userDetails?.operationalAddress2) {
      updatedData.operationalAddress2 = billingAddress2;
    }
    if (billingCity !== userDetails?.operationalCity) {
      updatedData.operationalCity = billingCity;
    }
    if (billingState !== userDetails?.operationalState) {
      updatedData.operationalState = billingState;
    }
    if (billingCountry?.label !== userDetails?.operationalCountry) {
      updatedData.operationalCountry = billingCountry?.value;
    }
    if (billingZipCode !== userDetails?.operationalZipcode) {
      updatedData.operationalZipcode = billingZipCode;
    }

    return updatedData;
  };

  const updateBusiness = async () => {
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

    const updatedData = getUpdatedDataBusiness();

    console.log(updatedData);

    try {
      setSubmitting(true);

      // Send `updatedData` to the server or API if not empty
      if (Object.keys(updatedData).length > 0) {
        await dispatch(updateBusinessDetails({ body: updatedData }));
      } else {
        toast.error(
          "All fields match the current data. Please make changes to proceed."
        );
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong, please try again later!");
    } finally {
      setSubmitting(false);
    }
  };

  const type = useSelector((state) => state.auth.type);
  return (
    <>
      <div className="px-4 mb-3">
        <h5 className="text-dark fw-600 pb-3">
          {type === "individual" ? "My" : "Business"} Profile
        </h5>

        <Card
          className="mb-4 p-3 d-flex align-items-center justify-content-between border"
          style={{ borderRadius: 12 }}
        >
          <div className="d-flex align-items-center gap-3">
            <Avatar className="bg-dark" sx={{ width: 50, height: 50 }}>
              {firstName.slice(0, 1)}
            </Avatar>{" "}
            <div>
              <label htmlFor="" className="fw-600 fs-5">
                {type === "individual"
                  ? `${firstName} ${middleName && middleName} ${lastName}`
                  : `${businessName}`}
              </label>
              <p>{`${billingCity}, ${billingCountry?.label}`}</p>
            </div>
          </div>

          <div
            className="text-secondary border py-2 px-4"
            style={{ borderRadius: 30, fontSize: 12, cursor: "pointer" }}
            onClick={() => setEdit(!edit)}
          >
            {edit ? "Edit" : "Reset"}{" "}
            {edit ? (
              <BorderColor sx={{ fontSize: 14 }} />
            ) : (
              <ResetTv sx={{ fontSize: 14 }} />
            )}
          </div>
        </Card>

        {type === "individual" ? (
          <>
            <div className="w-100 vh-80">
              <Card className="mb-4 p-4 border" style={{ borderRadius: 12 }}>
                <h5 className="text-primary fw-600 text-start fs-6 pb-3">
                  Personal Information
                </h5>

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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
                    value={middleName}
                    onInput={setMiddleName}
                    leftIcon={<AccountCircle />}
                    label={"Middle Name"}
                    max={25}
                    regex={regex.alpha}
                    type={"alpha"}
                  />

                  <CustomInput
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
                  />

                  <CustomSelect
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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

              <Card className="mb-4 p-4 border" style={{ borderRadius: 12 }}>
                <h5 className="text-primary fw-600 text-start fs-6 pb-3">
                  Delivery Address Information
                </h5>

                <div className="onboarding-form">
                  <CustomInput
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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

              <Card className="mb-4 p-4 border" style={{ borderRadius: 12 }}>
                <div className="d-flex align-items-end justify-content-between">
                  <h5 className="text-primary fw-600 text-start fs-6 pb-3">
                    Billing Address Information
                  </h5>
                </div>

                <div className="onboarding-form">
                  <CustomInput
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
                    value={billingCity}
                    onInput={setBillingCity}
                    leftIcon={<LocationCity />}
                    label={"Billing City"}
                    max={20}
                    required
                    regex={regex.city}
                    type={"city"}
                  />

                  <CustomInput
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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

                {!edit && (
                  <div className="d-flex justify-content-center align-items-center my-3">
                    <CustomButton
                      label={"Update your details"}
                      icon={<AppRegistration />}
                      style={{ width: 350 }}
                      isLoading={isSubmitting}
                      onClick={updateUser}
                    />
                  </div>
                )}
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="w-100 vh-80">
              <Card className="mb-4 p-4 border" style={{ borderRadius: 12 }}>
                <h5 className="text-primary fw-600 text-start fs-6 pb-3">
                  Business Details
                </h5>

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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
                    selectedDate={foundationDate}
                    onDateChange={setFoundationDate}
                    label="Foundation Date"
                    required
                  />

                  <CustomSelect
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
                    options={sourceOfFundsOptions}
                    id="sourceOfFunds"
                    value={sourceOfFunds}
                    onChange={setSourceOfFunds}
                    className=""
                    style={{}}
                    label="Source Of Funds"
                  />

                  <CustomSelect
                    disabled={edit}
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

              <Card className="mb-4 p-4 border" style={{ borderRadius: 12 }}>
                <h5 className="text-primary fw-600 text-start fs-6 pb-3">
                  Tax Details
                </h5>

                <div className="onboarding-form">
                  <CustomSelect
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
                  />
                </div>
              </Card>

              <Card className="mb-4 p-4 border" style={{ borderRadius: 12 }}>
                <h5 className="text-primary fw-600 text-start fs-6 pb-3">
                  Foundation Address Details
                </h5>

                <div className="onboarding-form">
                  <CustomInput
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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

              <Card className="mb-4 p-4 border" style={{ borderRadius: 12 }}>
                <div className="d-flex align-items-end justify-content-between">
                  <h5 className="text-primary fw-600 text-start fs-6 pb-3">
                    Operational Address Details
                  </h5>

                  {/* <div>
                  <label htmlFor="" className="fs-8 fw-600 text-secondary">
                    Is Operational Address same as Foundation Address?
                  </label>

                  <Switch
                    size="small"
                    className="me-3 ms-2"
                    onClick={onToggleSwitch}
                  />
                </div> */}
                </div>

                <div className="onboarding-form">
                  <CustomInput
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
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

                <CustomButton
                  label={"Update your business Details"}
                  icon={<AppRegistration />}
                  style={{ width: 350, margin: "1.5rem auto 0 auto" }}
                  isLoading={isSubmitting}
                  onClick={updateBusiness}
                />
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export const Kyc = () => {
  const kycDetails = useSelector((state) => state.auth.kycDetails);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const type = useSelector((state) => state.auth.type);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const dispatch = useDispatch();

  const snakeToSentence = (str) => {
    return str
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  const [files, setFiles] = useState({});

  const handleFileChange = (event, documentType) => {
    const uploadedFile = event.target.files[0]; // Get the selected file
    setFiles((prevFiles) => ({
      ...prevFiles,
      [documentType]: uploadedFile, // Store file with document type as key
    }));
  };

  const UploadDoc = async (type, file) => {
    if (!file) {
      toast.error(
        snakeToSentence(type) + ": " + "Please select a file before uploading."
      );
      return;
    }

    try {
      setUploadLoading(true);

      // Create FormData to send the file as multipart/form-data
      const formData = new FormData();
      formData.append("documentType", type);
      formData.append("document", file); // Append the file directly

      const response = await axiosInstance.post(
        `${process.env.VITE_apiurl}/baas/kyb/upload/${userDetails?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "SUCCESS") {
        await dispatch(fetchKyb(userDetails?.id, "update"));
        toast.success(snakeToSentence(type) + " uploaded successfully!");
      } else {
        toast.error("Failed to upload " + snakeToSentence(type) + ".");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("An error occurred while uploading.");
    } finally {
      setUploadLoading(false);
    }
  };

  const SubmitDoc = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.post(
        `${process.env.VITE_apiurl}/baas/kyb/submit/${userDetails?.id}`,
        {}
      );

      if (response.data.status === "SUCCESS") {
        await dispatch(fetchKyb(userDetails?.id, "update"));
        toast.success("Document(s) submitted successfully!");
      } else {
        toast.error("Failed to submit document(s).");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ padding: 15, backgroundColor: "transparent", borderRadius: 8 }}
    >
      {type === "business" &&
        kycDetails?.kybStatus.toLowerCase() !== "completed" && (
          <Card className="mb-4 p-4 border" style={{ borderRadius: 15 }}>
            <label
              htmlFor=""
              className="text-center fs-3 fw-600 text-primary text-center w-100"
            >
              Upload your KYB documents
              <img src="/kyc.png" alt="" width={100} className="ps-3" />
            </label>

            <div className="w-100 ps-3 pb-4 text-secondary text-center">
              (Note: You need to upload atleast 4 or more documents before
              submitting them for verification.)
            </div>

            {kycDetails?.kybStatus !== "completed" ? (
              <>
                <div className="document-upload-form">
                  {kycDetails?.DocumentTypeDetails?.filter(
                    (item) =>
                      !kycDetails?.KYBDocumentsUplodedDetails?.some(
                        (uploaded) =>
                          uploaded.document_type === item.documentType
                      )
                  )?.map((item, index) => (
                    <Form.Group
                      controlId={`formFile-${index}`}
                      className="mb-3"
                      key={index}
                    >
                      <Form.Label className="fs-7 text-secondary">
                        {snakeToSentence(item?.documentType)}
                      </Form.Label>
                      <div className="d-flex align-items-center gap-3">
                        <Form.Control
                          type="file"
                          onChange={(e) =>
                            handleFileChange(e, item?.documentType)
                          } // Detect file change
                        />

                        <CustomButton
                          label={"Upload"}
                          icon={<CloudUpload />}
                          onClick={() =>
                            UploadDoc(
                              item?.documentType,
                              files[item?.documentType]
                            )
                          }
                          isLoading={uploadLoading}
                          style={{ width: 220 }}
                        />
                      </div>
                    </Form.Group>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </Card>
        )}

      {type === "individual" ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="fs-6 text-center text-primary py-3 fw-600">
                  KYC Status
                </th>
                <th className="fs-6 text-center text-primary py-3 fw-600">
                  Compliance Status
                </th>
                <th className="fs-6 text-center text-primary py-3 fw-600">
                  Document Type
                </th>
                {kycDetails?.kycStatus !== "CLEARED" &&
                  kycDetails?.kycStatus !== "COMPLETED" && (
                    <th className="fs-6 text-center text-primary py-3 fw-600">
                      Action
                    </th>
                  )}
              </tr>
            </thead>
            <tbody className="bg-light">
              <tr>
                <td className="fs-7 text-center text-secondary py-3">
                  {kycDetails?.kycStatus}
                </td>
                <td className="fs-7 text-center text-secondary py-3">
                  {kycDetails?.complianceStatus}
                </td>
                <td className="fs-7 text-center text-secondary py-3">
                  {kycDetails?.documentType}
                </td>
                {kycDetails?.kycLink && (
                  <td className="fs-7 text-center text-secondary py-3">
                    <a
                      href={kycDetails?.kycLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "blue",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      Complete your KYC now ➤
                    </a>
                  </td>
                )}
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="fs-7 text-center text-primary py-2 fw-600">
                  KYB Status
                </th>
                <th className="fs-7 text-center text-primary py-2 fw-600">
                  Document Count
                </th>
                <th className="fs-7 text-center text-primary py-2 fw-600">
                  Document(s) Uploaded
                </th>
                <th className="fs-7 text-center text-primary py-2 fw-600">
                  Supported Documents
                </th>
              </tr>
            </thead>
            <tbody className="bg-light">
              <tr>
                <td className="fs-7 text-center text-secondary py-3">
                  {kycDetails?.kybStatus?.toUpperCase()}
                </td>
                <td className="fs-7 text-center text-secondary py-3">
                  {kycDetails?.kybDocumentCount}
                </td>
                <td className="fs-7 text-start text-secondary py-3">
                  <ul>
                    {kycDetails?.KYBDocumentsUplodedDetails?.map((item) => {
                      return <li>{snakeToSentence(item?.document_type)}</li>;
                    })}
                  </ul>

                  {type === "business" &&
                  kycDetails?.kybDocumentCount >= 4 &&
                  kycDetails?.kybStatus.toLowerCase() !== "completed" ? (
                    <div className="w-100 px-5 pt-4">
                      <CustomButton
                        label={"Submit Document(s) For Verification"}
                        icon={<Publish />}
                        onClick={SubmitDoc}
                        isLoading={loading}
                      />
                    </div>
                  ) : (
                    <div className="w-100 ps-3 pt-4">
                      (Note: You need to upload atleast 4 or more documents
                      before submitting them for verification.)
                    </div>
                  )}
                </td>

                <td className="fs-7 text-start text-secondary py-3">
                  <ul>
                    {kycDetails?.DocumentTypeDetails?.map((item) => {
                      return <li>{snakeToSentence(item?.documentType)}</li>;
                    })}
                  </ul>
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export const Security = () => {
  const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const email = useSelector((state) => state.auth.loginEmail);
    const [emailHelperText, setEmailHelperText] = useState("");
    const [password, setPassword] = useState("");
    const [passwordHelperText, setPasswordHelperText] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
      useState("");
    const [otp, setOTP] = useState("");
    const [otpHelperText, setOTPHelperText] = useState("");

    const [stage, setStage] = useState(0);

    const [errorText, setErrorText] = useState("");
    const [successText, setSuccessText] = useState("");

    useEffect(() => {
      setTimeout(() => {
        setErrorText("");
        setSuccessText("");
      }, 5000);
    }, [errorText]);

    const handleSendMail = async () => {
      if (!email) {
        setEmailHelperText("Email must not be empty.");
        return;
      }

      if (!regex.email.pattern.test(email)) {
        setEmailHelperText(regex.email.message);
        return;
      }

      try {
        const response = await dispatch(sendResetCode({ email, setLoading }));

        if (response.success) {
          setSuccessText("Password reset email sent successfully.");
        } else {
          // Display error message returned from the login action
          if (result.data.errorCode && result.data.msg) {
            setErrorText(result.data.msg.split("operation: ")[1]);
          } else {
            setErrorText("Something went wrong, please try again later.");
          }
        }
      } catch (error) {
        console.error("Error resetting password:", error.message);
        setErrorText("Failed to send password reset email.");
      }
    };

    const handleForgotPassword = async () => {};

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [rightIcon, setRightIcon] = useState(<Visibility size={20} />);

    // Function to toggle password visibility
    const showPassword = () => {
      setIsPasswordVisible((prev) => !prev); // Toggle visibility state

      // Update right icon dynamically
      setRightIcon(
        isPasswordVisible ? (
          <Visibility size={20} />
        ) : (
          <VisibilityOff size={20} />
        )
      );
    };

    const [isPasswordVisibleConfirm, setIsPasswordVisibleConfirm] =
      useState(false);
    const [rightIconConfirm, setRightIconConfirm] = useState(
      <Visibility size={20} />
    );

    // Function to toggle password visibility
    const showPasswordConfirm = () => {
      setIsPasswordVisibleConfirm((prev) => !prev); // Toggle visibility state

      // Update right icon dynamically
      setRightIconConfirm(
        isPasswordVisibleConfirm ? (
          <Visibility size={20} />
        ) : (
          <VisibilityOff size={20} />
        )
      );
    };

    return (
      <Card
        className="d-flex flex-column justify-content-center align-items-center h-100 w-50 border p-4"
        style={{ borderRadius: 15 }}
      >
        <img src="/reset-password.jpg" alt="reset-password" className="w-30" />

        <div className="form-content">
          <div className="d-flex justify-content-center align-items-center">
            <h3
              className="fw-bold text-center mb-0"
              style={{ color: "#212529" }}
            >
              Reset Password
            </h3>
          </div>

          <div className="fs-7 fw-bold opacity-75 text-center mb-4 mt-2">
            {stage === 1
              ? `We have sent a verification code to your email (${email}), now, enter it below and create a strong password to secure your account.`
              : `To reset your password, first, we will send you a password reset code to
            your registered email.`}
          </div>

          {stage === 1 ? (
            <>
              <CustomInput
                type={"number"}
                id="otp"
                placeholder="Enter your code..."
                value={otp}
                onInput={setOTP}
                label="Verification Code"
                helperText={otpHelperText}
                required
                max={6}
                regex={regex.otp}
                setHelperText={setOTPHelperText}
              />

              <CustomPasswordInput
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="Create a strong password..."
                value={password}
                onInput={setPassword}
                label="New Password"
                helperText={passwordHelperText}
                required
                leftIcon={<Password />}
                rightIcon={password && rightIcon}
                onRightIconClick={showPassword}
                regex={regex.password}
                setHelperText={setPasswordHelperText}
                max={64}
              />

              <CustomPasswordInput
                type={isPasswordVisibleConfirm ? "text" : "password"}
                id="password"
                placeholder="New Password..."
                value={confirmPassword}
                onInput={setConfirmPassword}
                label="New Password"
                helperText={confirmPasswordHelperText}
                required
                leftIcon={<Password />}
                rightIcon={confirmPassword && rightIconConfirm}
                onRightIconClick={showPasswordConfirm}
                regex={regex.password}
                setHelperText={setConfirmPasswordHelperText}
                max={64}
              />

              {errorText && (
                <div className="text-danger fs-8 text-start fw-bold py-2 w-100">
                  {errorText}
                </div>
              )}

              {successText && (
                <div className="text-success fs-8 text-start fw-bold py-2 w-100">
                  {successText}
                </div>
              )}

              <CustomButton
                type={""}
                label={"Reset Password"}
                icon={<LockReset size={20} />}
                onClick={handleForgotPassword}
                style={{}}
                isLoading={isLoading}
                divClass={`mt-3`}
              />
            </>
          ) : (
            <>
              <CustomInput
                type={"email"}
                id="email"
                placeholder="Enter your email address..."
                value={email}
                label="Email Address"
                helperText={emailHelperText}
                required
                leftIcon={<Email />}
                regex={regex.email}
                disabled={stage === 1}
                max={100}
              />

              {errorText && (
                <div className="text-danger fs-8 text-start fw-bold py-2 w-100">
                  {errorText}
                </div>
              )}

              {successText && (
                <div className="text-success fs-8 text-start fw-bold py-2 w-100">
                  {successText}
                </div>
              )}

              <CustomButton
                type={""}
                label={"Send password reset code"}
                icon={<Send size={20} />}
                onClick={handleSendMail}
                style={{}}
                isLoading={isLoading}
                divClass={`mt-3`}
              />
            </>
          )}
        </div>
      </Card>
    );
  };

  const TwoFactor = () => {
    return (
      <>
        <Card
          className="d-flex flex-column justify-content-center align-items-center w-50 border p-4"
          style={{ borderRadius: 15, height: 440 }}
        >
          <img src="/2fa.jpg" alt="" width={200} />
          <h5 className="mt-2 fw-600">2FA Coming Soon!</h5>
        </Card>
      </>
    );
  };

  return (
    <div className="d-flex justify-content-between align-items-start px-4 gap-4">
      <ForgotPassword />
      <TwoFactor />
    </div>
  );
};

export const DeleteAccount = ({ navigate }) => {
  const userDetails = useSelector((state) => state.auth?.userDetails);
  const [email, setEmail] = useState(userDetails?.email || "");
  const [isSubmitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const type = useSelector((state) => state.auth.type);

  const deleteUser = async () => {
    try {
      setSubmitting(true);
      await dispatch(deleteUserDetails({ navigate }));
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong, please try again later!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-start px-5">
      <Row className="text-center">
        <Col>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <Image
              src="/delete.png"
              alt="Delete Account"
              style={{ width: "10%" }}
            />{" "}
            <h2 className="mb-0 text-primary fw-600">Delete Your Account</h2>
          </div>

          <label className="text-secondary text-center w-50 py-3 px-5">
            Are you sure you want to delete your account? This action is
            irreversible and will permanently remove all your data.
          </label>
        </Col>
      </Row>

      <Row className="w-50 mt-4 px-5">
        <Col>
          <Form>
            <CustomInput
              value={email}
              disabled
              label={"Email Address"}
              leftIcon={<Email />}
              required
              regex={regex.email}
            />

            <CustomButton
              label={"Delete Your account"}
              icon={<DeleteOutline />}
              onClick={deleteUser}
              isLoading={isSubmitting}
            />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes("kyb")
      ? "KYB"
      : location.pathname.includes("kyc")
      ? "KYC"
      : "Profile"
  );

  const RenderScreen = () => {
    if (activeTab === "Profile") {
      return <Profile />;
    } else if (activeTab === "KYC" || activeTab === "KYB") {
      return <Kyc />;
    } else if (activeTab === "Security") {
      return <Security />;
    } else {
      return <Profile />;
    }

    // else if (activeTab === "Delete Your Account") {
    //   return <DeleteAccount />;
    // }
  };

  const userDetails = useSelector((state) => state.auth.userDetails);

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
            dispatch(moveTo("Dashboard"));
            navigate("/dashboard");
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="label d-flex flex-column justify-content-start align-items-start mb-3">
        <h4 htmlFor="" className="title text-primary fw-600 fs-4">
          Account Settings
        </h4>
      </div>

      <div
        className="d-flex align-items-start bg-white p-4"
        style={{ borderRadius: 12 }}
      >
        {/* Sidebar remains static */}
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* RenderScreen is scrollable */}
        <div
          style={{
            flex: 1, // Takes remaining width
            overflowY: "auto",
            padding: "1rem 0",
            width: "100%",
            minHeight: "100vh",
          }}
        >
          {RenderScreen()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
