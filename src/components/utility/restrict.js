const restrict = {
  email: /^[a-zA-Z0-9._%+-@]+$/, // Allows typing valid email characters
  alpha: /^[a-zA-Z\s]*$/, // Only letters & spaces (allows empty input)
  alphanumeric: /^[a-zA-Z0-9\s]*$/, // Letters, numbers & spaces
  addressLine: /^[a-zA-Z0-9\s,.'-]*$/, // No minimum length restriction
  city: /^[a-zA-Z\s-]*$/, // Allows city names with hyphens
  state: /^[a-zA-Z\s-]*$/,
  zipCode: /^\d*-?$/, // Allows numbers & hyphen for ZIP input
  phoneNumber: /^\d*$/, // Allows typing only numbers (length validated elsewhere)
  password: /^[A-Za-z\d@$!%*?&]*$/, // Allows valid password chars
  amount: /^\d*\.?\d{0,2}$/, // Allows numbers & max 2 decimals
  pin: /^\d*$/, // Allows typing only digits
  cardNumber: /^\d*$/, // Allows only digits (length validated elsewhere)
  fourDigits: /^\d*$/,
  otp: /^\d*$/,
};

export default restrict;
