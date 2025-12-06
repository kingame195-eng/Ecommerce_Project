// Full name validation
export const validateFullName = (fullName) => {
  if (!fullName || fullName.trim().length === 0) {
    return { isValid: false, error: "Full name is required" };
  }
  if (fullName.trim().length < 2) {
    return { isValid: false, error: "Full name must be at least 2 characters" };
  }
  if (fullName.trim().length > 50) {
    return { isValid: false, error: "Full name must not exceed 50 characters" };
  }
  return { isValid: true, error: "" };
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }
  return { isValid: true, error: "" };
};

// Password strength validation
export const validatePassword = (password) => {
  const errors = [];
  let strength = "weak";

  if (!password) {
    return {
      isValid: false,
      strength: "weak",
      errors: ["Password is required"],
    };
  }

  // Length-based strength classification
  // 6-7 characters = "weak"
  // 8-11 characters = "average"
  // 12+ characters = "strong"
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (password.length >= 8 && password.length < 12) {
    strength = "average";
  } else if (password.length >= 12) {
    strength = "strong";
  }

  // Regex checks
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  const isValid = errors.length === 0 && password.length >= 6;

  return {
    isValid,
    strength,
    errors: errors.length > 0 ? errors : [],
  };
};

// Password match validation
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }
  return { isValid: true, error: "" };
};

// Full form validation for registration
export const validateRegisterForm = (formData) => {
  const errors = {};

  // Validate full name
  const fullNameValidation = validateFullName(formData.fullName);
  if (!fullNameValidation.isValid) {
    errors.fullName = fullNameValidation.error;
  }

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }

  // Validate password match
  const passwordMatchValidation = validatePasswordMatch(
    formData.password,
    formData.confirmPassword
  );
  if (!passwordMatchValidation.isValid) {
    errors.confirmPassword = passwordMatchValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Full form validation for login
export const validateLoginForm = (formData) => {
  const errors = {};

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  // Validate password (only check if empty)
  if (!formData.password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Input sanitization (XSS Prevention)
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  // Replace special HTML characters with HTML entities
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
