import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CustomInput,
  CustomButton,
  CustomSelect,
  CustomPasswordInput,
} from "../../@component_v2/CustomComponents";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Login as LoginIcon,
  Email,
  LockReset,
  Send,
  Password,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { forgotPassword, sendResetCode } from "../../@redux/action/Auth";
import regex from "./../utility/regex";

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
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
    }, 10000);
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
          <h3 className="fw-bold text-center mb-0" style={{ color: "#212529" }}>
            Forgot your password?
          </h3>
          <div></div>
        </div>

        <div className="fs-7 fw-bold opacity-75 text-center my-5">
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
            />
          </>
        ) : (
          <>
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
            />
          </>
        )}

        <Divider className="my-4" />

        <div
          className="text-center fw-bold"
          style={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}
        >
          Already reset your password? <Link to="/">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
