export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const valid = (): ValidationResult => ({ isValid: true });

const invalid = (error: string): ValidationResult => ({
  isValid: false,
  error,
});

export function validateEmail(email: string): ValidationResult {
  const value = email.trim();

  if (!value) return invalid("Email is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return invalid("Please enter a valid email address");
  }

  return valid();
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return invalid("Password is required");
  if (password.length < 8) {
    return invalid("Password must be at least 8 characters");
  }
  if (password.length > 100) {
    return invalid("Password must be at most 100 characters");
  }

  return valid();
}

function validateName(value: string, fieldName: string, minimumLength: number) {
  const trimmedValue = value.trim();

  if (!trimmedValue) return invalid(`${fieldName} is required`);
  if (trimmedValue.length < minimumLength) {
    return invalid(`${fieldName} must be at least ${minimumLength} characters`);
  }
  if (trimmedValue.length > 50) {
    return invalid(`${fieldName} must be at most 50 characters`);
  }

  return valid();
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.isValid) return emailResult;

  return validatePassword(password);
}

export function validateRegisterForm(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
): ValidationResult {
  const firstNameResult = validateName(firstName, "First name", 2);
  if (!firstNameResult.isValid) return firstNameResult;

  const lastNameResult = validateName(lastName, "Last name", 1);
  if (!lastNameResult.isValid) return lastNameResult;

  const emailResult = validateEmail(email);
  if (!emailResult.isValid) return emailResult;

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) return passwordResult;

  if (!confirmPassword) return invalid("Please confirm your password");
  if (password !== confirmPassword) {
    return invalid("Passwords do not match");
  }

  return valid();
}

export function validateForgotPasswordForm(email: string): ValidationResult {
  return validateEmail(email);
}

export function validateOtp(otp: string, label: string): ValidationResult {
  if (!otp.trim()) return invalid(`${label} is required`);
  if (!/^\d{6}$/.test(otp.trim())) {
    return invalid(`${label} must be exactly 6 digits`);
  }

  return valid();
}

export function validateResetPasswordForm(
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string,
): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.isValid) return emailResult;

  const otpResult = validateOtp(otp, "Reset OTP");
  if (!otpResult.isValid) return otpResult;

  const passwordResult = validatePassword(newPassword);
  if (!passwordResult.isValid) return passwordResult;

  if (!confirmPassword) return invalid("Please confirm your password");
  if (newPassword !== confirmPassword) {
    return invalid("Passwords do not match");
  }

  return valid();
}

export function validateVerifyEmailForm(userId: string, otp: string): ValidationResult {
  if (!userId.trim()) return invalid("User ID is required");
  return validateOtp(otp, "Verification code");
}