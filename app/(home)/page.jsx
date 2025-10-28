"use client";

import {
  Info,
  CircleQuestionMark,
  Headset,
  Loader2,
  Search,
  CheckCircle,
  UserPlus,
} from "lucide-react"; // Added new icons

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // For redirection

// Enum for clarity
const TAP_PHASE = {
  SCANNING: "SCANNING",
  READING: "READING",
  REGISTERED: "REGISTERED",
  UNREGISTERED: "UNREGISTERED",
  ATTEMPTS_USED: "ATTEMPTS_USED",
  CLOSED: "CLOSED",
};

const TapLoadingModal = ({ tapState, onTimeout, onDetected, setTapState }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  // Function to interpolate color from green to red based on countdown

  const getColorForCountdown = useCallback(() => {
    const maxTime = 30;

    const percentage = countdown / maxTime; // 1 (full green) -> 0 (full red)

    // Color Interpolation (Green -> Red)
    // As countdown decreases, R increases and G decreases.
    const r = Math.floor(255 * (1 - percentage));
    const g = Math.floor(255 * percentage);
    const b = 0;

    return `rgb(${r}, ${g}, ${b})`;
  }, [countdown]); // Recalculate only when countdown changes

  // --- PHASE 1: SCANNING (with 30s Countdown) ---
  const handleTimeout = useCallback(() => {
    setTapState(TAP_PHASE.CLOSED);
    onTimeout();
  }, [setTapState, onTimeout]);

  useEffect(() => {
    if (tapState !== TAP_PHASE.SCANNING) {
      setCountdown(30);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tapState, handleTimeout]);

  // --- PHASE 2: REDIRECTION REGISTErED ---
  useEffect(() => {
    if (tapState === TAP_PHASE.REGISTERED) {
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [tapState, router]);

  // --- PHASE 3: REDIRECTION UNREGISTERED ---
  useEffect(() => {
    if (tapState === TAP_PHASE.UNREGISTERED) {
      const redirectTimer = setTimeout(() => {
        router.push("/register");
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [tapState, router]);

  if (tapState === TAP_PHASE.CLOSED) return null;

  let content;
  let iconElement;
  let centerElement;

  const countdownColor = getColorForCountdown();

  // --- RENDER LOGIC ---
  switch (tapState) {
    case TAP_PHASE.SCANNING:
      // Center element is the dynamic timer circle
      centerElement = (
        <div
          // Removed static bg-green-500 from the class
          className="size-10 flex items-center justify-center relative rounded-full z-50 bg-white"
          style={{
            borderColor: countdownColor, // Dynamic border color
            transition: "0.5s ease-out",
          }}
        >
          <span
            className="text-lg sm:text-xl font-semibold"
            // DYNAMIC COLOR APPLIED TO THE TEXT
            style={{ color: countdownColor, transition: "color 0.5s ease-out" }}
          >
            {countdown}
          </span>
        </div>
      );

      content = (
        <span className="text-gray-500 animate-pulse py-3 text-sm sm:text-base">
          Scanning RFID Card...
        </span>
      );
      iconElement = (
        <button
          onClick={onDetected}
          className="mt-2 text-sm text-blue-500 underline"
        >
          Simulate Tap
        </button>
      );
      break;

    case TAP_PHASE.READING:
      // Center element is the Searching Icon

      centerElement = (
        <div className="bg-green-400 size-10 sm:size-11 flex items-center justify-center relative rounded-full z-50">
          <Search className="text-white size-6 sm:size-7" />
        </div>
      );

      content = (
        <span className="text-gray-500 animate-pulse py-3 text-sm sm:text-base">
          Reading RFID Card...
        </span>
      );

      iconElement = null; // No simulate tap needed here

      break;

    case TAP_PHASE.REGISTERED:
      // Center element is the Success Icon

      centerElement = (
        <div className="bg-green-400 size-10 sm:size-11 flex items-center justify-center relative rounded-full z-50">
          <CheckCircle className="text-white size-6 sm:size-7" />
        </div>
      );

      content = (
        <span className="text-gray-500 py-3 text-base sm:text-lg">
          Welcome back, <span className="font-semibold">Full name</span> !
        </span>
      );

      iconElement = null;

      break;

    case TAP_PHASE.UNREGISTERED:
      // Center element is the Error/Add User Icon
      centerElement = (
        <div className="bg-green-400 size-10 sm:size-11 flex items-center justify-center relative rounded-full z-50">
          <UserPlus className="text-white size-6 sm:size-7" />
        </div>
      );
      content = (
        <div className="text-center text-gray-500 flex flex-col py-3">
          <span className="font-semibold text-base sm:text-lg">
            Unregistered User Detected
          </span>
          <span className="text-xs sm:text-sm ">
            Redirecting to register page
          </span>
        </div>
      );
      iconElement = null;
      break;

    case TAP_PHASE.ATTEMPTS_USED: // ⬅️ NEW PHASE IMPLEMENTATION
      centerElement = (
        <div className="bg-red-500 size-10 sm:size-11 flex items-center justify-center relative rounded-full z-50">
          <TicketX className="text-white size-6 sm:size-7" />
        </div>
      );
      content = (
        <div className="text-center text-gray-500 flex flex-col py-3">
          <span className="font-semibold text-base sm:text-lg">
            Attempts Already Used
          </span>
          <span className="text-xs sm:text-sm">
            You have used your attempts. Contact administrator for help.
          </span>
        </div>
      );
      iconElement = (
        // Add a button to close the modal and maybe link to support
        <button
          onClick={() => setTapState(TAP_PHASE.CLOSED)}
          className="mt-2 text-sm text-blue-500 underline"
        >
          Close
        </button>
      );
      break;
    default:
      return null;
  }

  // --- FINAL RENDER ---
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
      <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap- w-full max-w-md">
        {/* Dynamic Center Element (Timer/Icon) */}
        <div className="relative flex items-center justify-center py-6">
          {/* Pulsing Circles (Fixed Colors) */}
          <div className="absolute rounded-full size-22 bg-green-200 animate-concentric-pulse [animation-delay:-1s]"></div>
          <div className="absolute rounded-full size-16 bg-green-300 animate-concentric-pulse [animation-delay:0s]"></div>

          {/* Inner Center Element (Timer or Icon) */}
          {centerElement}
        </div>

        {/* Dynamic Content and Action Button */}
        {content}
        {iconElement}
      </div>
    </div>
  );
};

export default function Home() {
  const [tapState, setTapState] = useState(TAP_PHASE.CLOSED);
  const [failedAttempts, setFailedAttempts] = useState(0); // ⬅️ NEW STATE
  const MAX_ATTEMPTS = 3; // ⬅️ NEW CONSTANT
  const router = useRouter();

  const handleStartScan = () => {
    // If attempts are exhausted, go straight to the lockout message
    if (failedAttempts >= MAX_ATTEMPTS) {
      setTapState(TAP_PHASE.ATTEMPTS_USED); // ⬅️ NEW PHASE
      return;
    }
    setTapState(TAP_PHASE.SCANNING);
  };

  const handleTimeout = useCallback(() => {
    setTapState(TAP_PHASE.CLOSED);
  }, []);

  const handleCardDetected = () => {
    setTapState(TAP_PHASE.READING);

    setTimeout(() => {
      const isRegistered = Math.random() > 0.5;

      if (isRegistered) {
        setTapState(TAP_PHASE.REGISTERED);
        setFailedAttempts(0); // Reset attempts on successful registration/login
        setTimeout(() => setTapState(TAP_PHASE.CLOSED), 2000);
      } else {
        // User is UNREGISTERED
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          // Lockout phase
          setTapState(TAP_PHASE.ATTEMPTS_USED); // ⬅️ Go to new phase
        } else {
          // Normal unregistered flow (redirect to register)
          setTapState(TAP_PHASE.UNREGISTERED);
        }
      }
    }, 3000);
  };
  return (
    <div className="min-h-dvh container mx-auto w-full max-w-md text-xs sm:text-base">
      {/* Main */}
      <div className="flex flex-col gap-6 p-3 sm:p-4 md:px-0">
        {/* Header */}
        <div className="hidden items-center justify-between w-full">
          {/* Left */}
          logo here
          {/* Right */}
          <div className="flex items-center justify-center flex-col gap-1">
            toggle?
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-col gap-3 sm:gap-4 w-full">
          {/* main */}
          <div className="flex flex-col gap-4 w-full">
            {/* Intro */}
            <div className="flex text-center flex-col py-1">
              <span className="text-xl sm:text-2xl font-bold">
                Welcome to EZ-Vendo
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">
                Secure and convenient vending experience.
              </span>
            </div>
            {/* Main */}
            <div className="bg-white p-4 rounded-2xl border border-gray-300/80 flex flex-col gap-3 items-center">
              <div className="flex flex-col gap-1 text-center pt-2">
                <span className="text-xl sm:text-2xl font-bold  ">
                  Ready to <span className="text-green-500">Scan</span>
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  Tap your RFID Card to Start or Register
                </span>
              </div>
              {/* insert the scan now button with animation here */}
              <div className="relative flex items-center justify-center size-62 my-3">
                {/* 1. Outermost Circle (ANIMATING) */}
                <div
                  className="
                    absolute
                    rounded-full
                    size-64                       
                    bg-green-200
                    animate-concentric-pulse      
                    [animation-delay:-1s]   
                    transition-all
                    ease-out
                  "
                ></div>

                {/* 2. Middle Circle (ANIMATING) */}
                <div
                  className="
                    absolute
                    rounded-full
                    size-52                      
                    bg-green-300
                    animate-concentric-pulse      
                    [animation-delay:0s] 
                    transition-all
                    ease-out         
                  "
                ></div>

                {/* 3. Inner button (STATIC) - Must be positioned after the animated divs to sit on top */}
                <button
                  onClick={handleStartScan} // <-- START the process
                  disabled={tapState !== TAP_PHASE.CLOSED} // Disable button while modal is active
                  className="
                    relative                      
                    flex items-center justify-center
                    rounded-full
                    size-38                    
                    bg-green-400
                    text-white
                    text-lg
                    font-semibold
                    shadow-lg
                    hover:bg-green-500
                    transition-colors
                    duration-150
                    cursor-pointer
                  "
                >
                  Scan Now
                </button>
              </div>
              {/* note for unregistered user */}
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full">
                    <Info className="text-white" />
                  </div>
                </div>
                <div className="flex">
                  <span className="text-gray-500 text-xs sm:text-sm">
                    <span className="font-bold">Note: </span> Unregisterd user
                    can only attempt 3 times before being locked out
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* statuses */}
          <div className="grid grid-cols-2 gap-3">
            {/* online users */}
            <div className="col-span-1 rounded-2xl border border-gray-300/80 p-4 bg-white flex items-center gap-3">
              <div className="flex flex-col flex-1 sm:gap-1">
                <span className="text-gray-500 text-xs sm:text-sm">
                  Online users
                </span>
                <span className=" text-sm sm:text-base font-semibold">10</span>
              </div>
              <CircleQuestionMark className="text-gray-500 size-5" />
            </div>
            {/* connection status */}
            <div className="col-span-1 rounded-2xl border border-gray-300/80 p-4 bg-white flex items-center gap-3">
              <div className="flex flex-col flex-1 sm:gap-1">
                <span className="text-gray-500 text-xs sm:text-sm">Status</span>
                <span className=" text-sm sm:text-base font-semibold text-green-500">
                  Connected
                </span>
              </div>
              <CircleQuestionMark className="text-gray-500 size-5" />
            </div>
          </div>

          {/* how to use */}
          <div className="bg-white p-3 sm:p-4 border border-gray-300/80 rounded-2xl flex flex-col gap-3 sm:gap-4 items-center">
            {/* header */}
            <div className="flex items-center gap-2 py-2">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full">
                  <CircleQuestionMark className="text-white" />
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold">
                How to use?
              </span>
            </div>

            {/* instructions */}
            <div className="flex flex-col gap-3 sm:gap-4 pb-2">
              {/* #1 */}
              <div className="flex items-center gap-3">
                {/* number */}
                <div className="flex items-center justify-center text-center bg-green-500 size-6 rounded-full">
                  <span className="text-white text-xs">1</span>
                </div>
                {/* information */}
                <span className="text-sm text-gray-700">
                  Hold your RFID Card near the reader
                </span>
              </div>
              {/* #2 */}
              <div className="flex items-center gap-3">
                {/* number */}
                <div className="flex items-center justify-center text-center bg-green-500 size-6 rounded-full">
                  <span className="text-white text-xs">2</span>
                </div>
                {/* information */}
                <span className="text-sm text-gray-700">
                  Wait for card recognition
                </span>
              </div>
              {/* #3 */}
              <div className="flex items-center gap-3">
                {/* number */}
                <div className="flex items-center justify-center text-center bg-green-500 size-6 rounded-full">
                  <span className="text-white text-xs">3</span>
                </div>
                {/* information */}
                <span className="text-sm text-gray-700">
                  Follow on-screen instructions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact admin */}
        <div className="flex flex-col items-center justify-center gap-1 mb-2">
          <span className="text-gray-500 text-xs sm:text-sm">
            Having trouble?
          </span>
          <button className="flex items-center gap-1 text-green-500 font-semibold text-xs sm:text-sm">
            <Headset className="text-green-500 size-4" />
            Contact Support
          </button>
        </div>
      </div>

      {/* Tap Loading States Modal - RENDERED conditionally */}
      <TapLoadingModal
        tapState={tapState}
        setTapState={setTapState}
        onTimeout={handleTimeout}
        onDetected={handleCardDetected}
      />
    </div>
  );
}
