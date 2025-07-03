import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CustomInput,
  CustomPasswordInput,
  CustomButton,
} from "./../../@component_v2/CustomComponents";
import { Divider } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Email,
  KeyboardDoubleArrowRight,
  Password,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { cognitoGetUser, login } from "./../../@redux/action/Auth";
import regex from "./../utility/regex";

export const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const loginEmail = useSelector((state) => state.auth.loginEmail);

  const [email, setEmail] = useState(loginEmail || "");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [errorText, setErrorText] = useState("");

  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setErrorText("");
    }, 10000);
  }, [errorText]);

  const handleGetUser = async () => {
    if (!email) {
      setEmailHelperText("Email must not be empty.");
      return;
    }
    if (!regex.email.pattern.test(email)) {
      toast.error(regex.email.message);
      return;
    }

    try {
      const result = await dispatch(cognitoGetUser({ email, setLoading }));

      if (result.success) {
        if (result?.userStatus === "CONFIRMED") {
          // Login successful
          setShowPasswordField(true);
        } else if (result?.userStatus === "UNCONFIRMED") {
          // Email not verified
          // toast.warn("Check your inbox! Verify your email before signing in.");
          navigate("/verification");
        } else if (result?.userStatus === "FORCE_CHANGE_PASSWORD") {
          // Email not verified
          // toast.warn(
          //   "Check your inbox! Reset your password before signing in."
          // );
          navigate("/resettemppassword");
        }
      } else {
        // Display error message returned from the login action
        if (result.errorCode && result.message) {
          setErrorText(result.message.split("operation: ")[1]);

          if (result.errorCode === "UserNotFoundException") {
            setTimeout(() => {
              navigate("/sign-up");
            }, 2000);
          }
        } else {
          setErrorText("Something went wrong, please try again later.");
        }
      }
    } catch (error) {
      // Catch unexpected errors
      console.error("Unexpected error during login:", error);
      setErrorText(
        "We're facing some technical issues right now. Please try again later."
      );
    }
  };

  const handleLogin = async () => {
    if (!email) {
      setEmailHelperText("Email must not be empty.");
      return;
    }
    if (!regex.email.pattern.test(email)) {
      setEmailHelperText(regex.email.message);
      return;
    }

    if (!password) {
      setPasswordHelperText("Password must not be empty.");
      return;
    }
    if (!regex.password.pattern.test(password)) {
      setPasswordHelperText(regex.password.message);
      return;
    }

    try {
      const result = await dispatch(login({ email, password, setLoading }));

      if (result.success) {
        navigate("/dashboard");
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

  return (
    <div className="auth-parent d-flex flex-column justify-content-start align-items-center h-100 px-5 py-3 gap-5 w-100">
      <div className="d-flex flex-column justify-content-start align-items-center gap-3">
        <img src="/auth/logo.png" alt="" style={{ width: 150 }} />
        <h3 className="fw-bold text-center text-primary">Welcome, back!</h3>
      </div>

      <div className="form-content">
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
          onEnterPress={showPasswordField ? handleLogin : handleGetUser}
          max={100}
          setHelperText={setEmailHelperText}
        />
        {showPasswordField && (
          <CustomPasswordInput
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Enter your password..."
            value={password}
            onInput={setPassword}
            label="Password"
            helperText={passwordHelperText}
            required
            leftIcon={<Password />}
            rightIcon={password && rightIcon}
            onRightIconClick={showPassword}
            regex={regex.password}
            onEnterPress={handleLogin}
            max={64}
            setHelperText={setPasswordHelperText}
          />
        )}

        <div className="text-end mb-2 fw-bold" style={{ fontSize: 13 }}>
          <Link to="/forgotpassword">Forgot password?</Link>
        </div>

        {errorText && (
          <div className="text-danger fs-8 text-start fw-bold py-2 w-100">
            {errorText}
          </div>
        )}

        <CustomButton
          type={""}
          label={showPasswordField ? "Sign In" : "Continue"}
          icon={
            showPasswordField ? (
              <LoginIcon size={20} />
            ) : (
              <KeyboardDoubleArrowRight size={20} />
            )
          }
          onClick={showPasswordField ? handleLogin : handleGetUser}
          style={{}}
          isLoading={isLoading}
        />

        <Divider className="my-4" />

        <div
          className="text-center fw-bold"
          style={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}
        >
          Don't have an account? <Link to="/sign-up">Create an account</Link>
        </div>
      </div>

      <div
        className="footer text-secondary fs-8"
        style={{ position: "absolute", bottom: 20 }}
      >
        © {new Date().getFullYear()} Stylopay. All rights reserved.
      </div>
    </div>
  );
};

export default SignIn;
