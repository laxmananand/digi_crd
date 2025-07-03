import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CustomInput,
  CustomButton,
  CustomSelect,
} from "../../@component_v2/CustomComponents";
import { Divider } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Email } from "@mui/icons-material";
import regex from "../utility/regex";
import { confirmSignup } from "../../@redux/action/Auth";

export const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const loginEmail = useSelector((state) => state.auth.loginEmail);
  const [email, setEmail] = useState(loginEmail || "");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [otp, setOTP] = useState("");
  const [otpHelperText, setOTPHelperText] = useState("");

  const [loginIcon, setLoginIcon] = useState(<LoginIcon size={20} />);

  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setErrorText("");
      setSuccessText("");
    }, 10000);
  }, [errorText]);

  const handleVerification = async () => {
    if (!email) {
      setEmailHelperText("Email must not be empty.");
      return;
    }
    if (!regex.email.pattern.test(email)) {
      setEmailHelperText(regex.email.message);
      return;
    }

    if (!otp) {
      setOTPHelperText("OTP must not be empty.");
      return;
    }
    if (!regex.otp.pattern.test(otp)) {
      setOTPHelperText(regex.otp.message);
      return;
    }

    try {
      const result = await dispatch(confirmSignup({ email, otp, setLoading }));

      if (result.success) {
        setSuccessText(
          "Email verified successfully, please sign-in with your credentials to continue."
        );

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // Display error message returned from the login action
        if (result.data.errorCode && result.data.msg) {
          setErrorText(result.data.msg.split("operation: ")[1]);
        } else {
          setErrorText("Something went wrong, please try again later.");
        }
      }
    } catch (error) {
      // Catch unexpected errors
      console.error("Unexpected error during login:", error);
      setErrorText("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="auth-parent d-flex flex-column justify-content-center align-items-center h-100 px-5 py-3">
      <img src="/auth/logo.png" alt="" className="logo-img" />

      <div className="form-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <ArrowBackIosIcon
            size={25}
            style={{ color: "#212529", cursor: "pointer" }}
            onClick={() => navigate("/sign-up")}
          />
          <h3 className="fw-bold text-center mb-0" style={{ color: "#212529" }}>
            Verify your account
          </h3>
          <div></div>
        </div>

        <div className="fs-6 fw-bold opacity-75 text-center my-5">
          We have sent a verification code to your email address. Enter it below
          to verify your account.
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
          disabled
        />

        <CustomInput
          type={"number"}
          id="otp"
          placeholder="Enter your code address..."
          value={otp}
          onInput={setOTP}
          label="Verification Code"
          helperText={otpHelperText}
          required
          max={6}
          regex={regex.otp}
          setHelperText={setOTPHelperText}
        />

        {errorText && (
          <div className="text-danger fs-8 text-start fw-bold py-2 w-100">
            {errorText}
          </div>
        )}

        {successText && (
          <div className="text-danger fs-8 text-start fw-bold py-2 w-100">
            {successText}
          </div>
        )}

        <CustomButton
          type={""}
          label={"Verify"}
          icon={loginIcon}
          onClick={handleVerification}
          style={{}}
          isLoading={isLoading}
        />

        <Divider className="my-4" />

        <div
          className="text-center fw-bold"
          style={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}
        >
          Already verified your account? <Link to="/">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
