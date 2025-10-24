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
  // useEffect(() => {
  //   if (tapState === TAP_PHASE.REGISTERED) {
  //     const redirectTimer = setTimeout(() => {
  //       router.push("/dashboard");
  //     }, 3000);
  //     return () => clearTimeout(redirectTimer);
  //   }
  // }, [tapState, router]);

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
          className="size-12 flex items-center justify-center relative rounded-full z-50 bg-white"
          style={{
            borderColor: countdownColor, // Dynamic border color
            transition: "0.5s ease-out",
          }}
        >
          <span
            className="text-xl font-semibold"
            // DYNAMIC COLOR APPLIED TO THE TEXT
            style={{ color: countdownColor, transition: "color 0.5s ease-out" }}
          >
            {countdown}
          </span>
        </div>
      );

      content = (
        <span className="text-gray-500 animate-pulse">
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
        <div className="bg-green-400 size-12 flex items-center justify-center relative rounded-full z-50">
          <Search className="text-white size-8" />
        </div>
      );

      content = (
        <span className="text-gray-500 animate-pulse">
          Reading RFID Card...
        </span>
      );

      iconElement = null; // No simulate tap needed here

      break;

    case TAP_PHASE.REGISTERED:
      // Center element is the Success Icon

      centerElement = (
        <div className="bg-green-400 size-12 flex items-center justify-center relative rounded-full z-50">
          <CheckCircle className="text-white size-8" />
        </div>
      );

      content = (
        <span className="text-gray-500 font-semibold text-base text-center">
          Welcome back, (Name)!
        </span>
      );

      iconElement = null;

      break;

    case TAP_PHASE.UNREGISTERED:
      // Center element is the Error/Add User Icon
      centerElement = (
        <div className="bg-green-400 size-12 flex items-center justify-center relative rounded-full z-50">
          <UserPlus className="text-white size-8" />
        </div>
      );
      content = (
        <div className="text-center text-gray-500 flex flex-col gap-1">
          <span className="font-semibold text-base">RFID Card Unregistered</span>
          <span className="text-sm ">Redirecting to register page</span>
        </div>
      );
      iconElement = null;
      break;
    default:
      return null;
  }

  // --- FINAL RENDER ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-4 z-50">
      <div className="bg-white rounded-2xl py-8 px-4 flex flex-col items-center justify-center gap-4 w-full max-w-md">
        {/* Dynamic Center Element (Timer/Icon) */}
        <div className="relative flex items-center justify-center py-4">
          {/* Pulsing Circles (Fixed Colors) */}
          <div className="absolute rounded-full size-24 bg-green-200 animate-concentric-pulse [animation-delay:-1s]"></div>
          <div className="absolute rounded-full size-18 bg-green-300 animate-concentric-pulse [animation-delay:0s]"></div>

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
  const router = useRouter(); // Initialize router

  const handleStartScan = () => {
    setTapState(TAP_PHASE.SCANNING);
  };

  const handleTimeout = useCallback(() => {
    // Phase 1: Close modal on timeout
    setTapState(TAP_PHASE.CLOSED);
  }, []); // Empty dependency array means this function reference never changes

  const handleCardDetected = () => {
    // Phase 2: Card tapped, switch to Reading phase
    setTapState(TAP_PHASE.READING);

    // Simulate the data reading process (e.g., 3 seconds)
    setTimeout(() => {
      // Logic to determine registered/unregistered status
      const isRegistered = Math.random() > 0.5; // 50/50 chance for demo

      if (isRegistered) {
        // Phase 3a: Registered user
        setTapState(TAP_PHASE.REGISTERED);

        // Close modal after 2 seconds
        setTimeout(() => setTapState(TAP_PHASE.CLOSED), 2000);

        // In a real app, you'd redirect to the shop/dashboard here
        // router.push("/shop");
      } else {
        // Phase 3b: Unregistered user (Modal handles redirection via useEffect)
        setTapState(TAP_PHASE.UNREGISTERED);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-base">
      {/* Main */}
      <div className="flex flex-col gap-8 p-4">
        {/* Header */}
        <div className="hidden items-center justify-between w-full ">
          {/* Left */}
          logo here
          {/* Right */}
          <div className="flex items-center justify-center flex-col gap-1">
            toggle?
          </div>
        </div>
        {/* Center */}
        <div className="flex flex-col gap-4 w-full ">
          {/* main */}
          <div className="flex flex-col gap-6 w-full">
            {/* Intro */}
            <div className="flex text-center flex-col gap-1 pt-2">
              <span className="text-2xl font-bold">Welcome to EZ-Vendo</span>
              <span className="text-gray-500 text-sm">
                Secure and convenient vending experience.
              </span>
            </div>
            {/* Main */}
            <div className="bg-white p-4 rounded-2xl shadow flex flex-col gap-4 items-center">
              <div className="flex flex-col gap-1 pt-4 pb-2 text-center">
                <span className="text-2xl font-bold  ">
                  Tap Your <span className="text-green-500">RFID Card</span>
                </span>
                <span className="text-gray-500 text-sm">
                  Tap your RFID Card to Start or Register
                </span>
              </div>
              {/* insert the scan now button with animation here */}
              <div className="relative flex items-center justify-center size-62 mb-2">
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
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full">
                    <Info className="text-white" />
                  </div>
                </div>
                <div className="flex">
                  <span className="text-gray-500 text-sm">
                    <span className="font-bold">Note: </span> For unregistered
                    user, only 3 attempts blah blah blah
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* how to use */}
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col gap-4 items-center">
            {/* header */}
            <div className="flex items-center gap-3 pt-4 pb-2">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full">
                  <CircleQuestionMark className="text-white" />
                </div>
              </div>
              <span className="text-lg font-bold">How to use?</span>
            </div>

            {/* instructions */}
            <div className="flex flex-col gap-2 mb-2">
              {/* #1 */}
              <div className="flex items-center gap-3">
                {/* number */}
                <div className="flex items-center justify-center text-center bg-green-500 size-6 rounded-full">
                  <span className="text-white text-xs">1</span>
                </div>
                {/* information */}
                <span className="text-sm text-gray-800">
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
                <span className="text-sm text-gray-800">
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
                <span className="text-sm text-gray-800">
                  Follow on-screen instructions
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Contact admin */}
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-gray-500 text-sm">Having trouble?</span>
          <button className="flex items-center gap-1 text-green-500 font-semibold text-sm">
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
