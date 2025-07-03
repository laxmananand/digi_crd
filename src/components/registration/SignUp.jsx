import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CustomInput,
  CustomButton,
  CustomSelect,
} from "../../@component_v2/CustomComponents";
import { Checkbox, Divider, FormGroup } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  AccountCircle,
  Call,
  Email,
  Password,
  PasswordOutlined,
  TravelExplore,
  Visibility,
  VisibilityOff,
  MergeType,
  Business,
} from "@mui/icons-material";
import { register } from "../../@redux/action/Auth";
import Form from "react-bootstrap/Form";
import regex from "./../utility/regex";
import { setLoginEmail, setType } from "../../@redux/feature/Auth";

export const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const loginEmail = useSelector((state) => state.auth.loginEmail);

  const [email, setEmail] = useState(loginEmail || "");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [name, setName] = useState("");
  const [nameHelperText, setNameHelperText] = useState("");
  const [cc, setCC] = useState(null);
  const [ccHelperText, setCCHelperText] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneHelperText, setPhoneHelperText] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessNameHelperText, setBusinessNameHelperText] = useState("");

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const [loginIcon, setLoginIcon] = useState(<LoginIcon size={20} />);

  const [errorText, setErrorText] = useState("");
  const [typeHelperText, setTypeHelperText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setErrorText("");
    }, 10000);
  }, [errorText]);

  const mobileCountryCodeList = useSelector(
    (state) => state.utility.mobileCountryCodeList
  );

  const program = useSelector((state) => state.utility.program);
  const [type, setType] = useState("individual");

  const handleSignup = async () => {
    if (!email) {
      setEmailHelperText("Email is required.");
      return;
    }

    if (type === "individual" && !name) {
      setNameHelperText("Full name is required.");
      return;
    }

    if (type === "business" && !businessName) {
      setBusinessNameHelperText("Business name is required.");
      return;
    }

    if (!cc) {
      setCCHelperText("Country code is required.");
      return;
    }
    if (!phone) {
      setPhoneHelperText("Phone number is required.");
      return;
    }

    if (!password) {
      setPasswordHelperText("Password is required.");
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordHelperText("Please confirm your password.");
      return;
    }

    if (!regex.email.pattern.test(email)) {
      setEmailHelperText(regex.email.message);
      return;
    }

    if (!regex.phoneNumber.pattern.test(phone)) {
      setPhoneHelperText(regex.phoneNumber.message);
      return;
    }

    if (!regex.alpha.pattern.test(type === "business" ? businessName : name)) {
      type === "business"
        ? setBusinessNameHelperText(regex.alpha.message)
        : setNameHelperText(regex.alpha.message);
      return;
    }

    if (!regex.password.pattern.test(password)) {
      setPasswordHelperText(regex.password.message);
      return;
    }

    if (!regex.password.pattern.test(confirmPassword)) {
      setConfirmPasswordHelperText(regex.password.message);
      return;
    }

    if (password !== confirmPassword) {
      setErrorText("Passwords do not match. Please try again.");
      return;
    }

    if (!isChecked) {
      setErrorText("Agree to the terms and conditions before submitting.");
      return;
    }

    console.log(
      "sign-up request-body: ",
      email,
      password,
      cc?.value,
      phone,
      name,
      type
    );

    try {
      let response = await dispatch(
        register({
          email,
          password,
          cc: cc?.value,
          phoneNumber: phone,
          fullName: name,
          type: type,
          setLoading,
        })
      );

      if (response.success) {
        dispatch(setLoginEmail(email));
        navigate("/verification");
      } else {
        // Display error message returned from the login action
        if (result.data.errorCode && result.data.msg) {
          setErrorText(result.data.msg.split("operation: ")[1]);
        } else {
          setErrorText("Something went wrong, please try again later.");
        }
      }
    } catch (e) {
      console.error("Error during registration:", e.message);
      setErrorText("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rightIcon, setRightIcon] = useState(<Visibility size={20} />);

  // Function to toggle password visibility
  const showPassword = () => {
    setIsPasswordVisible((prev) => !prev); // Toggle visibility state

    // Update right icon dynamically
    setRightIcon(
      isPasswordVisible ? <Visibility size={20} /> : <VisibilityOff size={20} />
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
    <div className="auth-parent d-flex flex-column justify-content-center align-items-center h-100 px-5 py-3">
      <img src="/auth/logo.png" alt="" className="logo-img" />

      <div className="form-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <ArrowBackIosIcon
            size={25}
            style={{ color: "#212529", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <h5 className="fw-bold text-center mb-0" style={{ color: "#212529" }}>
            Create your account
          </h5>
          <div></div>
        </div>

        <CustomInput
          type={"email"}
          id="email"
          placeholder="Enter your email address..."
          value={email}
          onInput={setEmail}
          label="Email Address"
          helperText={emailHelperText}
          required
          leftIcon={<Email />}
          regex={regex.email}
          setHelperText={setEmailHelperText}
        />

        {program === "SMMACS0" && (
          <CustomSelect
            options={[
              { label: "Individual", value: "individual" },
              { label: "Business", value: "business" },
            ]}
            id="userType"
            value={
              type
                ? {
                    label: type === "individual" ? "Individual" : "Business",
                    value: type,
                  }
                : { label: "Individual", value: "individual" } // Default to Individual
            }
            onChange={(selectedOption) => setType(selectedOption.value)}
            className=""
            style={{}}
            label="Account Type"
            helperText={typeHelperText}
            required
            leftIcon={<MergeType />}
          />
        )}

        {type === "business" ? (
          <>
            <CustomInput
              type={"alphanumeric"}
              id="businessname"
              placeholder="Enter your Business' name..."
              value={businessName}
              onInput={setBusinessName}
              label="Business Name"
              helperText={businessNameHelperText}
              required
              leftIcon={<Business />}
              max={80}
              setHelperText={setBusinessNameHelperText}
            />
          </>
        ) : (
          <>
            <CustomInput
              type={"alpha"}
              id="fullname"
              placeholder="Enter your full name..."
              value={name}
              onInput={setName}
              label="Full Name"
              helperText={nameHelperText}
              required
              leftIcon={<AccountCircle />}
              max={80}
              setHelperText={setNameHelperText}
            />
          </>
        )}

        <div className="d-flex justify-content-center align-items-center gap-2">
          <CustomSelect
            options={mobileCountryCodeList}
            id="cc"
            value={cc}
            onChange={setCC}
            className=""
            style={{}}
            label="Country Code"
            helperText={ccHelperText}
            required
            leftIcon={<TravelExplore />}
            setHelperText={setCCHelperText}
          />

          <CustomInput
            type={"number"}
            id="phone"
            placeholder="Mobile number..."
            value={phone}
            onInput={setPhone}
            label="Mobile Number"
            helperText={phoneHelperText}
            max={12}
            required
            leftIcon={<Call />}
            regex={regex.phoneNumber}
            setHelperText={setPhoneHelperText}
          />
        </div>

        <div className="d-flex justify-content-center align-items-center gap-2">
          <CustomInput
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Password..."
            value={password}
            onInput={setPassword}
            label="Password"
            helperText={passwordHelperText}
            required
            leftIcon={<Password />}
            rightIcon={password && rightIcon}
            onRightIconClick={showPassword}
            regex={regex.password}
            setHelperText={setPasswordHelperText}
          />

          <CustomInput
            type={isPasswordVisibleConfirm ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onInput={setConfirmPassword}
            label="Confirm Password"
            helperText={confirmPasswordHelperText}
            required
            leftIcon={<PasswordOutlined />}
            rightIcon={confirmPassword && rightIconConfirm}
            onRightIconClick={showPasswordConfirm}
            regex={regex.password}
            setHelperText={setConfirmPasswordHelperText}
          />
        </div>

        <div>
          <Checkbox
            color="success"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="" className="fs-7">
            I agree to the{" "}
            <a
              className="fw-bold"
              onClick={() =>
                window.open(process.env.VITE_privacyPolicy, "_blank")
              }
            >
              Terms & Conditions
            </a>
          </label>
        </div>

        {errorText && (
          <div className="text-danger fs-8 text-start fw-bold py-2 w-100">
            {errorText}
          </div>
        )}

        <CustomButton
          type={""}
          label={"Create an account"}
          icon={loginIcon}
          onClick={handleSignup}
          style={{}}
          isLoading={isLoading}
        />

        <Divider className="mb-2" />

        <div
          className="text-center fw-bold"
          style={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}
        >
          Already have an account? <Link to="/">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
