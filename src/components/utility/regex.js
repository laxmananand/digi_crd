const regex = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Please enter a valid email address (e.g., abc@xyz.com).",
  },
  alpha: {
    pattern: /^[a-zA-Z\s]+$/,
    message: "Only letters and spaces are allowed (e.g., John Doe).",
  },
  alphanumeric: {
    pattern: /^[a-zA-Z0-9\s]+$/,
    message: "Only letters, numbers, and spaces are allowed (e.g., Abc12345).",
  },
  text: {
    pattern: /^[a-zA-Z0-9 \s]+$/,
    message: "Only letters, numbers, and spaces are allowed (e.g., Abc12345).",
  },
  addressLine: {
    pattern: /^[a-zA-Z0-9\s,.'-]{3,}$/,
    message: "Please enter a valid address. (e.g., Apt-120B, Gale Street)",
  },
  city: {
    pattern: /^[a-zA-Z\s-]+$/,
    message: "Only letters, spaces, and hyphens are allowed (e.g., Westview).",
  },
  state: {
    pattern: /^[a-zA-Z\s-]+$/,
    message: "Only letters, spaces, and hyphens are allowed (e.g., Texas).",
  },
  zipCode: {
    pattern: /^[A-Za-z0-9\- ]{5,8}$/,
    message:
      "Enter a valid zip code under within 5-8 characters long (e.g., 12345, AW12345, A1B 2C3).",
  },
  phoneNumber: {
    pattern: /^\d{8,12}$/, // Fix: Use \d instead of d
    message: "Enter a valid phone number (8 to 12 digits).",
  },
  password: {
    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    message:
      "Password must be 8-50 characters long, include at least 1 uppercase letter, 1 number, and 1 special character.",
  },
  amount: {
    pattern: /^\d+(\.\d{1,2})?$/, // Allows integers and up to 2 decimal places
    message: "Invalid amount. Enter a valid number (e.g., 10 or 10.50).",
  },
  pin: {
    pattern: /^\d{4}$/, // Allows only 4 digits
    message: "Invalid PIN. Enter a 4-digit numeric PIN.",
  },
  cardNumber: {
    pattern: /^[0-9]{8,12}$/,
    message: "Enter a valid proxy number (8 to 12 digits).",
  },
  fourDigits: {
    pattern: /^\d{4}$/, // Allows only 4 digits
    message: "Invalid last 4 digits (e.g., 0064).",
  },
  otp: {
    pattern: /^\d{6}$/, // Allows only 6 digits
    message: "Invalid OTP (e.g., 580064).",
  },
};

export default regex;
