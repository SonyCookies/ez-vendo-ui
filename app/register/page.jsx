"use client";

import {
  Headset,
  Loader2,
  MessageCircleWarning,
  CircleCheckBig,
} from "lucide-react"; // Imported new icons
import { useState } from "react";

// Helper function to validate email format
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rfid: "1234567890", // Pre-filled value from the previous step
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalMessage, setGlobalMessage] = useState({
    type: null,
    text: null,
  });

  // --- 1. Validation Logic ---
  const validateField = (name, value) => {
    let error = null;

    // FIX: Format the name for the error message (e.g., firstName -> First name)
    const displayFieldName = name
      .replace(/([A-Z])/g, " $1") // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

    if (!value.trim()) {
      // Use the correctly formatted field name in the error message
      error = `${displayFieldName} required`;
    } else if (name === "email" && !validateEmail(value)) {
      error = "Invalid email format";
    }
    return error;
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((name) => {
      if (name !== "rfid") {
        const error = validateField(name, formData[name]);
        if (error) {
          newErrors[name] = error;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- 2. Event Handlers (Unchanged) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setGlobalMessage({ type: null, text: null });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFocus = (e) => {
    setGlobalMessage({ type: null, text: null });
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalMessage({ type: null, text: null });

    const isValid = validateAllFields();

    if (!isValid) {
      setGlobalMessage({
        type: "error",
        text: "Please correct the errors marked in red before proceeding.",
      });
      return;
    }

    // Submission Logic
    setIsSubmitting(true);
    setGlobalMessage({
      type: "success",
      text: "Registration successful! Redirecting...",
    });

    setTimeout(() => {
      setIsSubmitting(false);
      // In a real app, you would redirect here: router.push('/dashboard');
    }, 2000);
  };

  const getInputClass = (name) => {
    const base =
      "px-4 py-2 rounded-lg outline-none border transition-colors duration-150 placeholder:text-gray-500";
    if (name === "rfid") {
      return `${base} border-gray-300 bg-gray-100 text-gray-500`;
    }
    const borderClass = errors[name]
      ? "border-red-400 focus:border-red-400"
      : "border-gray-300 focus:border-green-500";
    return `${base} ${borderClass}`;
  };

  return (
    <div className="min-h-screen text-base flex flex-col items-center justify-between p-4 bg-gray-50">
      {/* top */}
      <div className="flex items-center justify-center">Ez-Vendo</div>

      {/* center */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Intro */}
        <div className="flex text-center flex-col gap-1 pt-2">
          <span className="text-2xl font-bold">
            Welcome <span className="text-green-500">New User</span>
          </span>
          <span className="text-gray-500 text-sm">Create your account</span>
        </div>

        {/* Dynamic Global Validation Message - UPDATED WITH ICONS */}
        {globalMessage.text && (
          <div
            className={`px-4 py-2 rounded-lg flex items-center gap-3 text-sm border-l-3 ${
              globalMessage.type === "error"
                ? "bg-red-100 text-red-500 border-red-500"
                : "bg-green-100 text-green-500 border-green-500"
            }`}
          >
            {/* Conditional Icon Rendering */}
            {globalMessage.type === "error" ? (
              <MessageCircleWarning className="size-8" /> // Red Icon for error
            ) : (
              <CircleCheckBig className="size-8" /> // Green Icon for success
            )}

            <span className="text-sm">{globalMessage.text}</span>
          </div>
        )}

        {/* main */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* first and last fields (JSX structure remains the same) */}
          <div className="grid grid-cols-2 gap-4">
            {/* first name */}
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="firstName" className="text-sm text-gray-800">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                className={getInputClass("firstName")}
                placeholder="e.g. Juan"
                disabled={isSubmitting}
              />
              {/* This error message uses the output from validateField */}
              {errors.firstName && (
                <span className="text-xs text-red-400">{errors.firstName}</span>
              )}
            </div>

            {/* last name */}
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="lastName" className="text-sm text-gray-800">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                className={getInputClass("lastName")}
                placeholder="e.g. Dela Cruz"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <span className="text-xs text-red-400">{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={getInputClass("email")}
              placeholder="e.g. name@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="text-xs text-red-400">{errors.email}</span>
            )}
          </div>

          {/* RFID Card No. */}
          <div className="flex flex-col gap-1">
            <label htmlFor="rfid" className="text-sm text-gray-800">
              RFID Card No.
            </label>
            <input
              id="rfid"
              name="rfid"
              type="text"
              value={formData.rfid}
              className={getInputClass("rfid")}
              placeholder="Card number detected"
              readOnly
            />
          </div>

          {/* Register Button (Submission State) */}
          <button
            type="submit"
            className={`flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-lg text-white transition-colors duration-150 ${
              isSubmitting
                ? "bg-green-700 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-8 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>
      </div>

      {/* bottom */}
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="text-gray-500 text-sm">Having trouble?</span>
        <button className="flex items-center gap-1 text-green-500 font-semibold text-sm">
          <Headset className="text-green-500 size-4" />
          Contact Support
        </button>
      </div>
    </div>
  );
}
