import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { MuiOtpInput } from "mui-one-time-password-input";
import "./new-structure.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { HashLoader } from "react-spinners";
const animatedComponents = makeAnimated();
import CryptoJS from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner, Card, Row, Col } from "react-bootstrap";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import {
  AddBox,
  AddCircleOutline,
  Cancel,
  CancelOutlined,
  Contactless,
  CreditCard,
  CreditCardOutlined,
  Settings,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../@redux/feature/Utility";
import { getCardsDetailsAPI } from "./../@redux/action/account";
import restrict from "../components/utility/restrict";

export const CustomInput = ({
  type,
  id,
  placeholder,
  value,
  onInput,
  className,
  style,
  label,
  helperText,
  required,
  disabled = false,
  max,
  leftIcon, // Accepts an MUI icon component (e.g., <SearchIcon />)
  rightIcon, // Accepts an MUI icon component (e.g., <VisibilityIcon />)
  onRightIconClick, // Function for right icon (e.g., show/hide password)
  regex,
  onEnterPress,
}) => {
  // ✅ Validate input only on blur
  const handleBlur = () => {
    if (value && regex?.pattern && !regex.pattern.test(value)) {
      toast.error(regex.message); // ✅ Use custom error message
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;

    // Allow clearing the field
    if (value === "") {
      onInput("");
      return;
    }

    // Apply character restriction from restrict.js
    if (!restrict[type] || restrict[type].test(value)) {
      onInput(value);
    }
  };

  return (
    <div
      className="input-container"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Label */}
      <label className="input-label">
        {label}{" "}
        {required && <span style={{ color: "brown", fontWeight: 600 }}>*</span>}
      </label>

      {/* Input Field */}
      <div style={{ position: "relative", width: "100%" }}>
        {leftIcon && (
          <span
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          placeholder={placeholder}
          value={value}
          onInput={handleInput}
          className={`custom-input-class full-width ${className && className} ${
            disabled && "opacity-75"
          }`}
          style={{
            ...style,
            paddingLeft: leftIcon ? "55px" : "20px", // Adjust padding if left icon exists
            paddingRight: rightIcon ? "55px" : "20px", // Adjust padding if right icon exists
          }}
          maxLength={max || 100}
          disabled={disabled}
          required={required}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onEnterPress();
            }
          }}
        />

        {rightIcon && (
          <span
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={onRightIconClick} // Handles click event if provided
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper Text */}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

export const CustomPasswordInput = ({
  type,
  id,
  placeholder,
  value,
  onInput,
  className,
  style,
  label,
  helperText,
  required,
  disabled = false,
  max,
  leftIcon, // Accepts an MUI icon component (e.g., <SearchIcon />)
  rightIcon, // Accepts an MUI icon component (e.g., <VisibilityIcon />)
  onRightIconClick, // Function for right icon (e.g., show/hide password)
  regex,
  onEnterPress,
}) => {
  // ✅ Validate input only on blur
  const handleBlur = () => {
    if (value && regex?.pattern && !regex.pattern.test(value)) {
      toast.error(regex.message); // ✅ Use custom error message
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;

    // Allow clearing the field
    if (value === "") {
      onInput("");
      return;
    }

    // Apply character restriction from restrict.js
    if (!restrict[id] || restrict[id].test(value)) {
      onInput(value);
    }
  };

  return (
    <div
      className="input-container"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Label */}
      <label className="input-label">
        {label}{" "}
        {required && <span style={{ color: "brown", fontWeight: 600 }}>*</span>}
      </label>

      {/* Input Field */}
      <div style={{ position: "relative", width: "100%" }}>
        {leftIcon && (
          <span
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onInput={handleInput}
          className={`custom-input-class full-width ${className && className} ${
            disabled && "opacity-75"
          }`}
          style={{
            ...style,
            paddingLeft: leftIcon ? "55px" : "20px", // Adjust padding if left icon exists
            paddingRight: rightIcon ? "55px" : "20px", // Adjust padding if right icon exists
          }}
          maxLength={max || 100}
          disabled={disabled}
          required={required}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onEnterPress();
            }
          }}
        />

        {rightIcon && (
          <span
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={onRightIconClick} // Handles click event if provided
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper Text */}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

// Create a custom theme
const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "9px 20px",
          fontWeight: 500,
        },
      },
    },
  },
});

export const CustomDatepicker = ({
  selectedDate,
  disabled = false,

  onDateChange,
  label,
  required,
}) => {
  // Calculate the maximum selectable date (today minus 18 years)
  const maxDate = dayjs().subtract(18, "year");

  const [startDate, setStartDate] = useState(
    selectedDate ? dayjs(selectedDate) : null
  );

  useEffect(() => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      const maxDate = dayjs().subtract(18, "year");
      if (date.isAfter(maxDate)) {
        // If the date is invalid (less than 18 years), clear it and show an error

        toast.error(
          `The selected date indicates an age below 18 years. Please select a date on or before ${maxDate.format(
            "DD/MM/YYYY"
          )}.`
        );

        setStartDate(null);
        onDateChange(null);
      } else {
        setStartDate(date);
        onDateChange(date.format("YYYY-MM-DD")); // Format date using dayjs
      }
    } else {
      setStartDate(null);
      onDateChange(null);
    }
  };

  return (
    <div className="input-container" style={{ gap: "2px" }}>
      <label className="input-label">
        {label}{" "}
        {required && (
          <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
        )}
      </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={startDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            maxDate={maxDate} // Disable dates below 18 years
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                padding: "4.5px 20px 4.5px 0",
                marginTop: "6px",
                fontWeight: "bold",
                fontFamily: "'Figtree', sans-serif", // Change fontFamily
                fontSize: "13px", // Change fontSize
                border: "1px solid lightgrey",
                background: "white",
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Figtree', sans-serif", // Ensures the input text also uses the same font
                fontSize: "13px",
                fontWeight: "bold",
              },
              "& .MuiTypography-root": {
                fontFamily: "'Figtree', sans-serif",
                fontSize: "13px",
                fontWeight: "bold",
              },
            }}
            disabled={disabled}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export const CustomPastDatepicker = ({
  selectedDate,
  disabled = false,

  onDateChange,
  label,
  required,
}) => {
  // Set the maximum selectable date to today
  const maxDate = dayjs();

  const [startDate, setStartDate] = useState(
    selectedDate ? dayjs(selectedDate) : null
  );

  useEffect(() => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      if (date.isAfter(maxDate, "day")) {
        // If the date is in the future, clear it and show an error
        toast.error(
          `The selected date cannot be in the future. Please select a date on or before ${maxDate.format(
            "DD/MM/YYYY"
          )}.`
        );

        setStartDate(null);
        onDateChange(null);
      } else {
        setStartDate(date);
        onDateChange(date.format("YYYY-MM-DD")); // Format date using dayjs
      }
    } else {
      setStartDate(null);
      onDateChange(null);
    }
  };

  return (
    <div className="input-container" style={{ gap: "2px" }}>
      <label className="input-label">
        {label}{" "}
        {required && (
          <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
        )}
      </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled={disabled}
            value={startDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            maxDate={maxDate} // Disable future dates
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                padding: "4.5px 20px 4.5px 0",
                marginTop: "6px",
                fontWeight: "bold",
                fontFamily: "'Figtree', sans-serif", // Change fontFamily
                fontSize: "13px", // Change fontSize
                border: "1px solid lightgrey",
                background: "white",
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Figtree', sans-serif", // Ensures the input text also uses the same font
                fontSize: "13px",
                fontWeight: "bold",
              },
              "& .MuiTypography-root": {
                fontFamily: "'Figtree', sans-serif",
                fontSize: "13px",
                fontWeight: "bold",
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export const CustomFutureDatepicker = ({
  selectedDate,
  disabled = false,

  onDateChange,
  label,
  required,
}) => {
  // Set the minimum selectable date to today
  const minDate = dayjs();

  const [startDate, setStartDate] = useState(
    selectedDate ? dayjs(selectedDate) : null
  );

  useEffect(() => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      if (date.isBefore(minDate, "day")) {
        // If the date is invalid (in the past), clear it and show an error
        toast.error(
          `The selected date cannot be in the past. Please select a date on or after ${minDate.format(
            "DD/MM/YYYY"
          )}.`
        );

        setStartDate(null);
        onDateChange(null);
      } else {
        setStartDate(date);
        onDateChange(date.format("YYYY-MM-DD")); // Format date using dayjs
      }
    } else {
      setStartDate(null);
      onDateChange(null);
    }
  };

  return (
    <div className="input-container" style={{ gap: "2px" }}>
      <label className="input-label">
        {label}{" "}
        {required && (
          <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
        )}
      </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled={disabled}
            value={startDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            minDate={minDate} // Disable past dates
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                padding: "4.5px 20px 4.5px 0",
                marginTop: "6px",
                fontWeight: "bold",
                fontFamily: "'Figtree', sans-serif", // Change fontFamily
                fontSize: "13px", // Change fontSize
                border: "1px solid lightgrey",
                background: "white",
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Figtree', sans-serif", // Ensures the input text also uses the same font
                fontSize: "13px",
                fontWeight: "bold",
              },
              "& .MuiTypography-root": {
                fontFamily: "'Figtree', sans-serif",
                fontSize: "13px",
                fontWeight: "bold",
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export const CustomModal = ({
  isOpen,
  handleClose,
  children,
  headerText,
  width,
  height,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width || 800,
    maxHeight: height || 600,
    overflowY: "auto",
    bgcolor: "white",
    border: "none !important",
    borderRadius: "16px",
    boxShadow: 15,
    p: 0,
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="custom-modal-parent">
        <div className="modal-parent p-3">
          <div className="new-modal-header d-flex align-items-center justify-content-between">
            <h4 className="text-center fs-6">{headerText}</h4>{" "}
            <CancelOutlined onClick={handleClose} className="text-secondary" />
          </div>
          {children}
        </div>
      </Box>
    </Modal>
  );
};

export const CustomOTP = ({ otp, handleChange, onEnterPress }) => {
  // Function to handle input restriction
  const handleKeyDown = (event) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
    ];

    // Allow Ctrl+V (Paste)
    if (event.ctrlKey && event.key === "v") {
      return; // Allow paste shortcut
    }

    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("Text");
    if (!/^\d+$/.test(pasteData)) {
      event.preventDefault();
    }
  };
  return (
    <>
      <MuiOtpInput
        value={otp}
        onChange={handleChange}
        length={6}
        TextFieldsProps={{
          onKeyDown: handleKeyDown, // Attach keydown handler
          onPaste: handlePaste, // Attach paste handler
          onEnterPress: onEnterPress, // Attach submit handler
        }}
        sx={{
          "& .MuiOtpInput-TextField": {
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            color: "#333",
            textAlign: "center",
            border: "1px solid lightgrey",
          },
          "& .MuiOtpInput-TextField:focus": {
            borderColor: "#2196f3",
          },

          "& .MuiInputBase-input": {
            padding: "0",
            height: "47px",
            fontSize: "20px",
            fontWeight: 500,
          },
        }}
      />
    </>
  );
};

export const CustomSelect = ({
  id,
  options = [],
  value,
  onChange,
  className,
  style,
  label,
  helperText,
  required,
  disabled = false,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "4px 12px",
      fontSize: "13px",
      borderRadius: "30px",
      border: "2px solid lightgrey",
      outline: state.isFocused ? "1px solid brown" : "none",
      backgroundColor: "white",
      fontWeight: 600,
      ...style, // Merge custom inline styles passed from the parent component
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "black" : null,
      color: state.isSelected ? "white" : null,
      fontWeight: 600,
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "lightgrey",
        color: "black",
      },
    }),
  };

  // Ensure `value` is always an object from `options`
  const selectedValue =
    options.find((option) => option.value === value?.value) || null;

  return (
    <div className={`select-container ${className}`} style={style}>
      {label && (
        <label className="select-label">
          {label}
          {required && (
            <span style={{ color: "brown", marginLeft: "5px" }}>*</span>
          )}
        </label>
      )}
      <Select
        id={id}
        options={options}
        styles={customStyles}
        onChange={onChange}
        value={selectedValue}
        isSearchable={true}
        isDisabled={disabled}
      />
      {helperText && <span className="select-helper-text">{helperText}</span>}
    </div>
  );
};

export const CustomButton = ({
  type,
  label,
  icon,
  onClick,
  style,
  isLoading,
  theme,
  divClass,
  buttonClass,
  leftIcon,
  buttonStyle,
}) => {
  return (
    <div className={`input-container ${divClass}`} style={style}>
      <button
        onClick={onClick}
        className={`button-base full-width primary-button ${buttonClass}`} // Concatenate with the custom classnames
        style={buttonStyle} // Apply custom inline styles
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <HashLoader color={"white"} size={20} />
          </>
        ) : (
          <>
            {leftIcon} {label} {icon}
          </>
        )}
      </button>
    </div>
  );
};

export const CustomButtonSecondary = ({
  type,
  label,
  icon,
  onClick,
  style,
  isLoading,
  theme,
  divClass,
  buttonClass,
  leftIcon,
}) => {
  return (
    <div className={`input-container ${divClass}`} style={style}>
      <button
        onClick={onClick}
        className={`button-base full-width secondary-button ${buttonClass}`} // Concatenate with the custom classnames
        style={style} // Apply custom inline styles
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <HashLoader color={"white"} size={25} />
          </>
        ) : (
          <>
            {leftIcon} {label} {icon}
          </>
        )}
      </button>
    </div>
  );
};

export const SECRET_KEY = process.env.VITE_zpk;

// Generate the AES-128 key
export const generateKey = () => {
  const sha256Hash = CryptoJS.SHA256(SECRET_KEY); // Generate SHA-256 hash
  const keyBytes = CryptoJS.lib.WordArray.create(sha256Hash.words.slice(0, 4)); // Use the first 16 bytes (128-bit)
  return keyBytes;
};

// Decrypt function
export const decryptData = (encryptedData) => {
  const key = generateKey();
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, {
    mode: CryptoJS.mode.ECB, // Equivalent to Java AES with no IV (ECB mode)
    padding: CryptoJS.pad.Pkcs7, // Default padding
  });
  return decryptedBytes.toString(CryptoJS.enc.Utf8); // Convert to string
};

export const getDates = (days = 30) => {
  const today = new Date();

  // Start date: 25 days before today
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);

  // End date: Today's date
  const endDate = today;

  return {
    startDate: startDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
  };
};

export const detectCardType = (cardNumber) => {
  const cardPatterns = [
    {
      type: "Visa",
      pattern: /^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/,
      length: [13, 16, 19],
    },
    {
      type: "MasterCard",
      pattern: /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-7][0-9]{13}))$/,
      length: [16],
    },
    { type: "Amex", pattern: /^3[47][0-9]{13}$/, length: [15] },
    // {
    //   type: "Discover",
    //   pattern:
    //     /^(6011[0-9]{12}|65[0-9]{14}|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9([01][0-9]|2[0-5]))[0-9]{10})$/,
    //   length: [16, 19],
    // },
    // {
    //   type: "Diners Club",
    //   pattern: /^3(0[0-5][0-9]{11}|[68][0-9]{12})$/,
    //   length: [14],
    // },
    // { type: "JCB", pattern: /^35[0-9]{14}$/, length: [16] },
  ];

  for (const card of cardPatterns) {
    if (
      card.pattern.test(cardNumber) &&
      card.length.includes(cardNumber.length)
    ) {
      return card.type;
    }
  }

  return "Other";
};

export const CreditCardView = ({
  item,
  dispatch,
  handleOpen,
  hide = false,
}) => {
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const cardLogos = {
    Mastercard: (
      <img
        src="/banks/mastercard-logo.png"
        alt="Others"
        style={{ width: 60 }}
      />
    ),
    Others: (
      <img src="/banks/matchmove.png" alt="Others" style={{ width: 80 }} />
    ),
  };

  const cardCovers = ["/cover/card-cover-1.png"];

  const randomImage = cardCovers[Math.floor(Math.random() * cardCovers.length)];

  const formatCardNumber = (cardNumber) => {
    return cardNumber.replace(/(\d{4})(?=\d)/g, "$1  ");
  };

  const userDetails = useSelector((state) => state.auth.userDetails);

  const showCard = async () => {
    if (item?.cardStatus === "active") {
      try {
        setLoading(true);

        const cardsData = await dispatch(getCardsDetailsAPI(item.cardid));

        if (cardsData.status === "SUCCESS") {
          let encData = decryptData(cardsData.encryptData);
          const cardDetails = JSON.parse(encData);
          if (cardDetails) {
            setCardNumber(formatCardNumber(cardDetails.number));
            setCVV(cardDetails.cvv);
            setExpiryDate(`${cardDetails.month}/${cardDetails.year.slice(2)}`);
            setHolderName(
              `${userDetails?.firstName} ${userDetails?.middleName || ""} ${
                userDetails?.lastName
              }`
            );
            setCardType(detectCardType(cardDetails.number));
            setShow(true);
          }
        } else {
          //toast.error(cardsData.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error(
        "Card details not available for suspended or locked cards. Please activate your card to see it's details."
      );
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 5000); // Reverts after 5s

      return () => clearTimeout(timer); // Cleanup on re-renders
    }
  }, [show]);

  return (
    <>
      {isLoading ? (
        <>
          <Card
            style={{
              backgroundImage: `url(${randomImage})`,
              backgroundSize: "cover",
              borderRadius: "8px",
              height: "200px",
              width: "325px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              color: "white",
            }}
          >
            <Spinner
              animation="border"
              role="status"
              variant="light"
              size="small"
            />
            <label style={{ marginTop: "20px", fontSize: 12 }}>
              Fetching your card details, please wait...
            </label>
          </Card>
        </>
      ) : (
        <div className="d-flex justify-content-start align-items-start">
          {!item ? (
            <>
              <Card
                style={{
                  background: `linear-gradient(90deg, lightgrey, white)`,
                  borderRadius: "8px",
                  border: "2px solid rgba(0,0,0,0.45)",
                  borderStyle: "dashed",
                  height: "200px",
                  width: "325px",
                  padding: "1.5rem",
                  color: "black",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center mx-auto my-auto gap-2 flex-column"
                  onClick={() => {
                    dispatch(setActiveTab("Cards"));
                    navigate("/cards");
                  }}
                >
                  <AddCircleOutline className="fs-2" />

                  <label htmlFor="" className="fs-7">
                    Add Your First Card
                  </label>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card
                style={{
                  backgroundImage: `url(${randomImage})`,
                  backgroundSize: "cover",
                  borderRadius: "8px",
                  height: "200px",
                  width: "325px",
                  padding: "0.5rem",
                  color: "white",
                  justifyContent: "space-between",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  {!show ? (
                    <>
                      {/* {cardLogos["Others"]} */}
                      <div className="d-flex">
                        <p
                          className="pb-0 mb-0 text-white text-lowercase"
                          style={{
                            transform: "rotate(-90deg)",
                            position: "absolute",
                            left: "-8px",
                            top: "35px",
                          }}
                        >
                          BUSINESS
                        </p>
                        <div
                          className="d-flex flex-column gap-3 justify-content-between"
                          style={{
                            position: "absolute",
                            top: "-2px",
                            left: "40px",
                          }}
                        >
                          <img
                            src="/cover/contactless.png"
                            alt=""
                            width={50}
                            style={{ transform: "rotate(-90deg)" }}
                          />
                          <img
                            src="/cover/chip.png"
                            alt=""
                            width={60}
                            style={{ transform: "rotate(90deg)" }}
                          />

                          <div class="dots-container" style={{ gap: 5 }}>
                            <div
                              className="d-flex flex-column"
                              style={{ gap: 5, marginTop: 7 }}
                            >
                              <div class="dot"></div>
                              <div class="dot"></div>
                            </div>
                            <div
                              className="d-flex flex-column"
                              style={{ gap: 5 }}
                            >
                              <div class="dot"></div>
                              <div class="dot"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="d-flex align-items-center"
                        style={{ position: "absolute", left: "140px" }}
                      >
                        <div
                          style={{
                            backgroundColor:
                              item.cardStatus === "active"
                                ? "green"
                                : item.cardStatus === "suspended"
                                ? "red"
                                : "yellow",
                            borderRadius: "50%",
                            width: "8px",
                            height: "8px",
                            marginRight: "6px",
                          }}
                        ></div>
                        <span style={{ fontWeight: "600", fontSize: 10 }}>
                          {item.cardStatus.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ transform: "rotate(-90deg)" }}>
                        {cardLogos["Mastercard"]}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <div className="d-flex align-items-center">
                          <img
                            src="/auth/logo-white.png"
                            alt=""
                            width={30}
                            height={30}
                          />
                          <p className="pb-0 mb-0 fw-600 fs-9 text-white">
                            Stylopay
                          </p>
                        </div>
                        <img src="/banks/matchmove.png" alt="" width={100} />
                      </div>
                    </>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    textAlign: "center",
                  }}
                >
                  {!show ? "" : cardNumber || "XXXX XXXX XXXX XXXX"}
                </div>

                <div
                  className={`d-flex align-items-center justify-content-${
                    !show ? "end me-3" : "center"
                  } gap-5 mb-2`}
                >
                  {!show ? (
                    <>
                      <div>
                        <label className="fs-9">Card Type</label>
                        <div style={{ fontWeight: "600", fontSize: 12 }}>
                          {item?.type?.toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <label className="fs-9">Last 4 Digits</label>
                        <div style={{ fontWeight: "600", fontSize: 12 }}>
                          {item?.last4 || "****"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="fs-9">Card Holder</div>
                        <div style={{ fontWeight: "600", fontSize: 12 }}>
                          {holderName || "John Doe"}
                        </div>
                      </div>
                      <div>
                        <div className="fs-9">Valid Thru</div>
                        <div style={{ fontWeight: "600", fontSize: 12 }}>
                          {expiryDate || "MM/YY"}
                        </div>
                      </div>
                      <div className="fs-9">
                        <div>CVV</div>
                        <div style={{ fontWeight: "600", fontSize: 12 }}>
                          {cvv || "***"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </>
          )}

          <div className="d-flex flex-column justify-content-center align-items-center ms-2 gap-2">
            {location.pathname === "/cards" && !hide && (
              <div className="border rounded-pill bg-white">
                <Tooltip
                  title="Card Settings"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                  PopperProps={{
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "window",
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "Poppins",
                        fontSize: 12,
                        backgroundColor: "black",
                        color: "white",
                        padding: "6px 12px",
                      },
                    },
                  }}
                  slots={{
                    transition: Zoom,
                  }}
                >
                  <IconButton onClick={handleOpen}>
                    <Settings className="text-dark" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            )}

            {item.type === "virtual" &&
              location.pathname === "/cards" &&
              !hide && (
                <div className="border rounded-pill bg-white">
                  <Tooltip
                    title="View Card Details"
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -14],
                            },
                          },
                        ],
                      },
                    }}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "preventOverflow",
                          options: {
                            boundary: "window",
                          },
                        },
                      ],
                    }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontFamily: "Poppins",
                          fontSize: 12,
                          backgroundColor: "black",
                          color: "white",
                          padding: "6px 12px",
                        },
                      },
                    }}
                    slots={{
                      transition: Zoom,
                    }}
                  >
                    <IconButton variant="outline-light" onClick={showCard}>
                      <Visibility className="text-dark" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};
