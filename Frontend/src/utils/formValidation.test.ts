import { describe, expect, it } from "vitest";

import {
  validateForgotPasswordForm,
  validateLoginForm,
  validateRegisterForm,
  validateResetPasswordForm,
  validateVerifyEmailForm,
} from "./formValidation";

describe("login validation", () => {
  it("rejects empty fields", () => {
    expect(validateLoginForm("", "").error).toBe("Email is required");
  });

  it("rejects malformed email addresses", () => {
    expect(validateLoginForm("not-an-email", "password123").error).toContain(
      "valid email",
    );
  });

  it("rejects short passwords", () => {
    expect(validateLoginForm("user@example.com", "short").error).toContain(
      "at least 8",
    );
  });

  it("accepts valid credentials", () => {
    expect(validateLoginForm("user@example.com", "password123").isValid).toBe(
      true,
    );
  });
});

describe("registration validation", () => {
  const validForm = [
    "Jane",
    "Doe",
    "jane@example.com",
    "password123",
    "password123",
  ] as const;

  it("rejects empty required fields", () => {
    expect(
      validateRegisterForm(
        "",
        validForm[1],
        validForm[2],
        validForm[3],
        validForm[4],
      ).error,
    ).toBe(
      "First name is required",
    );
    expect(
      validateRegisterForm(
        validForm[0],
        "",
        validForm[2],
        validForm[3],
        validForm[4],
      ).error,
    ).toBe("Last name is required");
  });

  it("rejects invalid email and short password", () => {
    expect(
      validateRegisterForm("Jane", "Doe", "invalid", "password123", "password123")
        .error,
    ).toContain("valid email");
    expect(
      validateRegisterForm("Jane", "Doe", "jane@example.com", "short", "short")
        .error,
    ).toContain("at least 8");
  });

  it("rejects mismatching passwords", () => {
    expect(
      validateRegisterForm(
        validForm[0],
        validForm[1],
        validForm[2],
        validForm[3],
        "different",
      ).error,
    ).toBe("Passwords do not match");
  });

  it("accepts a complete registration", () => {
    expect(
      validateRegisterForm(
        validForm[0],
        validForm[1],
        validForm[2],
        validForm[3],
        validForm[4],
      ).isValid,
    ).toBe(true);
  });
});

describe("password reset validation", () => {
  it("rejects empty fields, invalid OTP, short password, and mismatch", () => {
    expect(validateResetPasswordForm("", "", "", "").error).toBe(
      "Email is required",
    );
    expect(
      validateResetPasswordForm(
        "user@example.com",
        "123",
        "password123",
        "password123",
      ).error,
    ).toContain("exactly 6");
    expect(
      validateResetPasswordForm(
        "user@example.com",
        "123456",
        "short",
        "short",
      ).error,
    ).toContain("at least 8");
    expect(
      validateResetPasswordForm(
        "user@example.com",
        "123456",
        "password123",
        "different",
      ).error,
    ).toBe("Passwords do not match");
  });

  it("accepts valid reset details", () => {
    expect(
      validateResetPasswordForm(
        "user@example.com",
        "123456",
        "password123",
        "password123",
      ).isValid,
    ).toBe(true);
  });
});

describe("email and OTP validation", () => {
  it("validates forgot-password email", () => {
    expect(validateForgotPasswordForm("").isValid).toBe(false);
    expect(validateForgotPasswordForm("invalid").isValid).toBe(false);
    expect(validateForgotPasswordForm("user@example.com").isValid).toBe(true);
  });

  it("validates verification user ID and exactly six numeric digits", () => {
    expect(validateVerifyEmailForm("", "123456").error).toBe(
      "User ID is required",
    );
    expect(validateVerifyEmailForm("user-id", "").error).toBe(
      "Verification code is required",
    );
    expect(validateVerifyEmailForm("user-id", "12a456").error).toContain(
      "exactly 6",
    );
    expect(validateVerifyEmailForm("user-id", "123456").isValid).toBe(true);
  });
});