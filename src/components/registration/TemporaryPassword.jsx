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
  Visibility,
  VisibilityOff,
  Password,
} from "@mui/icons-material";
import { forgotPassword, resetPassword } from "../../@redux/action/Auth";
import regex from "../utility/regex";

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const loginEmail = useSelector((state) => state.auth.loginEmail);
  const [email, setEmail] = useState(loginEmail || "");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    useState("");

  const [loginIcon, setLoginIcon] = useState(<LockReset size={20} />);

  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setErrorText("");
      setSuccessText("");
    }, 10000);
  }, [errorText]);

  const handleResetPassword = async () => {
    if (!email) {
      setEmailHelperText("Email must not be empty.");
      return;
    }

    if (!password) {
      setPasswordHelperText("Temporary Password is required.");
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordHelperText("Create a strong password to continue.");
      return;
    }

    if (!regex.email.pattern.test(email)) {
      setEmailHelperText(regex.email.message);
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

    try {
      const result = await dispatch(
        resetPassword({ email, password, confirmPassword, setLoading })
      );

      if (result.success) {
        setSuccessText(
          "Temporary password reset successfully. Enter your new password to login again."
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
      console.error("Error resetting password:", error.message);
      setErrorText(
        "Failed to reset temporary password. Please try again later."
      );
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
          <h3 className="fw-bold text-center mb-0" style={{ color: "#212529" }}>
            Reset Temporary Password
          </h3>
          <div></div>
        </div>

        <div className="fs-6 fw-bold opacity-75 text-center my-5">
          {`We have sent a temporary password to your email (${email}), enter it below and create a strong password to secure your account.`}
        </div>

        {/* <CustomInput
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
              disabled
              setHelperText={setEmailHelperText}
            /> */}

        <CustomPasswordInput
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          placeholder="Temporary Password..."
          value={password}
          onInput={setPassword}
          label="Temporary Password"
          helperText={passwordHelperText}
          required
          leftIcon={<Password />}
          rightIcon={password && rightIcon}
          onRightIconClick={showPassword}
          regex={regex.password}
          setHelperText={setPasswordHelperText}
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
          icon={loginIcon}
          onClick={handleResetPassword}
          style={{}}
          isLoading={isLoading}
        />

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
