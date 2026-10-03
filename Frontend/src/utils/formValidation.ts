export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errors?: string[];
}

const valid = (): ValidationResult => ({ isValid: true });

const invalid = (...errors: string[]): ValidationResult => ({
  isValid: false,
  error: errors.join("\n"),
  errors,
});

const combine = (...results: ValidationResult[]): ValidationResult => {
  const errors = results.flatMap((result) => result.errors ?? []);
  return errors.length ? invalid(...errors) : valid();
};

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
  return combine(validateEmail(email), validatePassword(password));
}

export function validateRegisterForm(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
): ValidationResult {
  const results = [
    validateName(firstName, "First name", 2),
    validateName(lastName, "Last name", 1),
    validateEmail(email),
    validatePassword(password),
  ];

  if (!confirmPassword) {
    results.push(invalid("Please confirm your password"));
  } else if (password && password !== confirmPassword) {
    results.push(invalid("Passwords do not match"));
  }

  return combine(...results);
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
  const results = [
    validateEmail(email),
    validateOtp(otp, "Reset OTP"),
    validatePassword(newPassword),
  ];

  if (!confirmPassword) {
    results.push(invalid("Please confirm your password"));
  } else if (newPassword && newPassword !== confirmPassword) {
    results.push(invalid("Passwords do not match"));
  }

  return combine(...results);
}

export function validateVerifyEmailForm(userId: string, otp: string): ValidationResult {
  return combine(
    userId.trim() ? valid() : invalid("User ID is required"),
    validateOtp(otp, "Verification code"),
  );
}