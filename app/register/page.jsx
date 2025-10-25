"use client";

import {
  Headset,
  Loader2,
  MessageCircleWarning,
  CircleCheckBig,
} from "lucide-react"; // Imported new icons
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // For redirection

// Helper function to validate email format
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// --- Timer Constants ---
const REGISTRATION_TIME_LIMIT_SECONDS = 600; // 10 minutes

export default function Register() {
  const router = useRouter();

  // --- Timer State ---
  const [timeLeft, setTimeLeft] = useState(REGISTRATION_TIME_LIMIT_SECONDS);
  const [timerStarted, setTimerStarted] = useState(false); // Tracks if the timer has been initialized

  // --- Form States (Your existing states) ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rfid: "1234567890",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalMessage, setGlobalMessage] = useState({
    type: null,
    text: null,
  });

  // --- Color Interpolation Logic (Adapted from the modal) ---
  const getColorForCountdown = useCallback(() => {
    const maxTime = REGISTRATION_TIME_LIMIT_SECONDS;
    const percentage = timeLeft / maxTime; // 1 (full green) -> 0 (full red)

    // Color Interpolation (Green -> Red)
    const r = Math.floor(255 * (1 - percentage));
    const g = Math.floor(255 * percentage);
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  }, [timeLeft]);

  // --- Timer Logic (useEffect) ---
  useEffect(() => {
    if (!timerStarted) {
      // Initialize timer only once on mount
      setTimerStarted(true);
    }

    if (timeLeft <= 0) {
      // Timer hit 0: Redirect user
      setGlobalMessage({
        type: "error",
        text: "Time limit reached. You will be redirected to the home screen.",
      });
      setTimeout(() => {
        router.push("/"); // Redirect to home page
      }, 2000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup function
  }, [timeLeft, timerStarted, router]);

  // Format time (MM:SS)
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // --- 1. Validation Logic ---
  const validateField = (name, value) => {
    /* ... existing logic ... */
    let error = null;
    const displayFieldName = name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    if (!value.trim()) {
      error = `${displayFieldName} required`;
    } else if (name === "email" && !validateEmail(value)) {
      error = "Invalid email format";
    }
    return error;
  };

  const validateAllFields = () => {
    /* ... existing logic ... */
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
    /* ... existing logic ... */
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setGlobalMessage({ type: null, text: null });
  };

  const handleBlur = (e) => {
    /* ... existing logic ... */
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFocus = (e) => {
    /* ... existing logic ... */
    setGlobalMessage({ type: null, text: null });
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalMessage({ type: null, text: null });

    const isValid = validateAllFields();

    if (!isValid || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setGlobalMessage({
          type: "error",
          text: "Time limit reached. Please try again from the home screen.",
        });
      } else {
        setGlobalMessage({
          type: "error",
          text: "Please correct the errors marked in red before proceeding.",
        });
      }
      return;
    }

    // Submission Logic
    setIsSubmitting(true);
    // Timer should stop on successful submission
    setTimeLeft(0);
    setGlobalMessage({
      type: "success",
      text: "Registration successful! Redirecting...",
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard"); // Example redirection after success
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
    <div className="min-h-screen text-base flex flex-col items-center justify-between p-4 bg-white">
      {/* top */}
      <div className="flex items-center justify-center">Ez-Vendo</div>

      {/* center */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Intro */}
        <div className="flex text-center flex-col gap-1">
          <span className="text-2xl font-bold">
            Welcome <span className="text-green-500">New User</span>
          </span>
          <span className="text-gray-500 text-sm">Create your account</span>
        </div>

        {/* Dynamic Timer Display */}
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-gray-500 text-sm">Time left</span>
          <span
            className="text-lg font-semibold"
            // Apply dynamic color to the timer text
            style={{
              color: getColorForCountdown(),
              transition: "color 0.5s ease-out",
            }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Dynamic Global Validation Message */}
        {globalMessage.text /* ... JSX remains the same ... */ && (
          <div
            className={`px-4 py-2 rounded-lg flex items-center gap-3 text-sm border-l-3 ${
              globalMessage.type === "error"
                ? "bg-red-100 text-red-500 border-red-500"
                : "bg-green-100 text-green-500 border-green-500"
            }`}
          >
            {globalMessage.type === "error" ? (
              <MessageCircleWarning className="size-8" />
            ) : (
              <CheckCircleBig className="size-8" />
            )}
            <span className="text-sm">{globalMessage.text}</span>
          </div>
        )}

        {/* main form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* first and last fields */}
          {/* ... (Your form fields remain here, using event handlers) ... */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="firstName" className="text-sm text-gray-800">First Name</label>
              <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} className={getInputClass("firstName")} placeholder="e.g. Juan" disabled={isSubmitting || timeLeft <= 0} />
              {errors.firstName && (<span className="text-xs text-red-400">{errors.firstName}</span>)}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="lastName" className="text-sm text-gray-800">Last Name</label>
              <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} className={getInputClass("lastName")} placeholder="e.g. Dela Cruz" disabled={isSubmitting || timeLeft <= 0} />
              {errors.lastName && (<span className="text-xs text-red-400">{errors.lastName}</span>)}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-800">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus} className={getInputClass("email")} placeholder="e.g. name@example.com" disabled={isSubmitting || timeLeft <= 0} />
            {errors.email && (<span className="text-xs text-red-400">{errors.email}</span>)}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="rfid" className="text-sm text-gray-800">RFID Card No.</label>
            <input id="rfid" name="rfid" type="text" value={formData.rfid} className={getInputClass("rfid")} placeholder="Card number detected" readOnly disabled={isSubmitting || timeLeft <= 0} />
          </div>

          {/* Register Button (Submission State) */}
          <button 
            type="submit"
            className={`flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-lg text-white transition-colors duration-150 ${
              isSubmitting || timeLeft <= 0 // Disable button if submitting or time is up
                ? 'bg-green-700 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={isSubmitting || timeLeft <= 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
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
