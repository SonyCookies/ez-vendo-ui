"use client";

import {
  Plus,
  Bell,
  Eye,
  ScrollText,
  Moon,
  BanknoteX,
  CircleQuestionMark,
  ChevronRight,
  BanknoteArrowUp,
  TimerOff,
  TriangleAlert,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// --- BILLING CONSTANTS ---
const INITIAL_BALANCE = 0.0;
const BILLING_RATE = 5.0; // P5.00
const BILLING_INTERVAL_SECONDS = 30; // 10 minutes (600 seconds)
const PING_INTERVAL_MS = 1000; // Check every 1 second
const LOW_BALANCE_THRESHOLD = 10.0; // ⬅️ NEW CONSTANT: P10.00 warning level

export default function Dashboard() {
  const router = useRouter(); // ⬅️ Initialize router

  // --- Session/Balance States ---
  const [userBalance, setUserBalance] = useState(INITIAL_BALANCE);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0); // Countdown in seconds
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // --- Modal Dismissal States ---
  const isLowBalance = userBalance <= 0;
  const [isModalDismissed, setIsModalDismissed] = useState(false);
  const disableControlButtons = isLowBalance;

  // --- Handlers ---
  // ⬅️ Core Debit Logic (Callback for stability in useEffect)
  const debitAndResetTimer = useCallback(() => {
    setUserBalance((prevBalance) => {
      // Only debit IF the session is starting (not during the timer loop)
      const newBalance = prevBalance - BILLING_RATE;

      if (newBalance >= 0) {
        setSessionTimer(BILLING_INTERVAL_SECONDS); // Sets initial timer
        return newBalance;
      } else {
        // This path should ideally only be hit if a malicious attempt bypasses the "N/A" button state
        setIsSessionActive(false);
        setShowSessionExpiredModal(true);
        return prevBalance;
      }
    });
  }, []); // No need for dependencies here, as it's only called on button click

  const handleStartStopSession = () => {
    if (isSessionActive) {
      // Stop Session (Reset everything)
      setIsSessionActive(false);
      setSessionTimer(0);
    } else {
      // Start Session (Initiate first debit)
      if (userBalance >= BILLING_RATE) {
        setIsSessionActive(true);
        debitAndResetTimer(); // ⬅️ Start the session by debiting the first interval
      }
      // Note: If userBalance < BILLING_RATE, the button is disabled (N/A) anyway.
    }
  };

  const handleModalClose = (/* ... existing logic ... */) => {
    setShowSessionExpiredModal(false);
    setIsModalDismissed(true);
  };
  const handleTopUp = (/* ... existing logic ... */) => {
    setUserBalance((prev) => prev + 100.0);
    setIsModalDismissed(true);
  };

  // --- Session Timer Loop (useEffect) ---
  useEffect(() => {
    if (!isSessionActive) {
      return;
    }

    const sessionLoop = setInterval(() => {
      setSessionTimer((prevTimer) => {
        if (prevTimer <= 1) {
          // 🛑 NEW LOGIC: Timer hit zero. STOP EVERYTHING and show modal.
          clearInterval(sessionLoop);

          // Immediately set session to inactive
          setIsSessionActive(false);

          // Show the Session Expired Modal (which handles the redirect)
          setShowSessionExpiredModal(true);

          return 0; // Ensure timer display hits 00:00
        }
        return prevTimer - 1; // Decrement timer
      });
    }, PING_INTERVAL_MS);

    return () => clearInterval(sessionLoop);
  }, [isSessionActive, setIsSessionActive]); // ⬅️ Dependencies simplified

  //   Elapsed time
  useEffect(() => {
    const elapsedLoop = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000); // Increments every second

    return () => clearInterval(elapsedLoop); // Cleanup on unmount
  }, []); // Empty dependency array ensures it runs once on mount

  // --- NEW: Redirect Logic for Session Expired Modal ---
  useEffect(() => {
    if (showSessionExpiredModal) {
      const redirectTimer = setTimeout(() => {
        router.push("/"); // ⬅️ THIS SHOULD FIRE
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [showSessionExpiredModal, router]);

  // --- Utility Functions ---
  const formatTime = (totalSeconds, showHours = false) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (showHours || hours > 0) {
      return `${hours < 10 ? "0" : ""}${hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  // Dynamic coloring for the session timer
  const getTimerColor = () => {
    const redThreshold = BILLING_INTERVAL_SECONDS * 0.2; // Red when 20% time remains
    const percentage = sessionTimer / BILLING_INTERVAL_SECONDS;

    // Simple color logic: Green when high, Red when low
    if (sessionTimer > redThreshold) {
      return "rgb(16, 185, 129)"; // Tailwind green-500 equivalent
    } else {
      return "rgb(239, 68, 68)"; // Tailwind red-500 equivalent
    }
  };

  // --- Dynamic Session Button Content (Remains the same) ---
  const sessionButtonText = isSessionActive ? "Stop" : "Start";
  const sessionBaseColor = isSessionActive
    ? "bg-red-400 hover:bg-red-500"
    : "bg-green-400 hover:bg-green-500";
  const pulsingBaseColor = isSessionActive ? "bg-red" : "bg-green";
  const sessionButtonFinalClasses = disableControlButtons
    ? `bg-gray-400 text-white cursor-not-allowed`
    : `${sessionBaseColor} text-white cursor-pointer`;
  const showNoCreditModal = isLowBalance && !isModalDismissed;

  return (
    <div className="min-h-screen bg-gray-50 text-base">
      <div className="flex flex-col gap-6 p-4">
        {/* header */}
        <div className="flex items-center justify-between">
          {/* left */}
          <div className="flex items-center gap-2">
            {/* profile */}
            <div className="">
              <img
                src="/default-profile.png"
                alt="Profile"
                className="size-9 rounded-full"
              />
            </div>
            {/* name */}
            <span className="text-gray-800 text-lg">
              Hello,{" "}
              <span className="text-green-500 font-semibold">Edward</span>
            </span>
          </div>
          {/* right */}
          <div className="flex items-center gap-2">
            {/* dark and light mode */}
            <button className="rounded-full bg-white active:bg-gray-100 transition-colors duration-150 shadow p-3">
              <Moon className="size-4" />
            </button>
            {/* notification */}
            <button className="rounded-full bg-white active:bg-gray-100 transition-colors duration-150 shadow p-3">
              <Bell className="size-4" />
            </button>
          </div>
        </div>
        {/* main */}
        <div className="flex flex-col gap-4">
          {/* Time remaining display */}
          {isSessionActive && (
            <div className="flex items-center justify-center">
              <div className="col-span-1 flex flex-col items-center justify-center">
                <span className="text-gray-500 text-sm">Time remaining</span>
                <span
                  className="font-bold text-lg"
                  style={{
                    color: getTimerColor(),
                    transition: "color 0.5s ease-out",
                  }}
                >
                  {formatTime(sessionTimer)}
                </span>
              </div>
            </div>
          )}

          {/* Start / Stop Session / N/A */}
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center size-62">
              {/* Pulsing Circles: Now dynamic based on session state */}
              <div
                className={`absolute rounded-full size-60 ${
                  isLowBalance ? "bg-gray-100" : `${pulsingBaseColor}-200`
                } animate-concentric-pulse [animation-delay:-1s] transition-all ease-out`}
              ></div>
              <div
                className={`absolute rounded-full size-48 ${
                  isLowBalance ? "bg-gray-200" : `${pulsingBaseColor}-300`
                } animate-concentric-pulse [animation-delay:0s] transition-all ease-out`}
              ></div>

              {/* Inner button */}
              <button
                onClick={handleStartStopSession}
                disabled={isLowBalance}
                className={`relative flex items-center justify-center rounded-full size-34 font-semibold shadow transition-colors duration-150 ${sessionButtonFinalClasses}`}
              >
                {isLowBalance ? "N/A" : sessionButtonText}
              </button>
            </div>
          </div>

          {/* information (Cards) */}
          <div className="grid grid-cols-2 gap-3">
            {/* available credits (uses live state) */}
            <div className="col-span-2 flex items-center bg-green-500 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-gray-50 text-sm">Available credits</span>
                <span className="font-semibold text-lg text-white">
                  P{userBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleTopUp}
                  className="bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 text-green-500 rounded-full px-4 py-2 flex items-center gap-2"
                >
                  <Plus className="size-5" />
                  Top up
                </button>
              </div>
            </div>
            {/* Elapsed time */}
            <div className="col-span-1 flex items-center bg-yellow-400 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-gray-700 text-sm">Elapsed time</span>
                <span className="font-semibold">
                  {formatTime(elapsedSeconds, true)}
                </span>{" "}
                {/* ⬅️ Shows HH:MM:SS */}
              </div>
            </div>
            {/* Billing rate (Static) */}
            <div className="col-span-1 flex items-center bg-blue-500 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-gray-50 text-sm">Billing rate</span>
                <span className="font-semibold text-white">
                  P{BILLING_RATE.toFixed(2)} / {BILLING_INTERVAL_SECONDS / 60}
                  mins
                </span>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="flex flex-col gap-4 mt-2">
            {/* header */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Recent transactions</span>
              <button className=" text-gray-500  hover:text-green-500 active:text-green-600 transition-colors duration-150 flex items-center justify-center rounded-full gap-1">
                <span className="text-sm">View all</span>
                <ChevronRight className="size-5" />
              </button>
            </div>
            {/* recent transactions */}
            <div className="flex flex-col gap-2">
              {/* *1 */}
              <div className="flex items-center justify-between gap-4 p-5 rounded-2xl shadow bg-white">
                {/* left */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-green-500 text-white rounded-full p-2 justify-center">
                    <BanknoteArrowUp className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Deposit</span>
                    <span className="text-sm text-gray-500">Oct 23</span>
                  </div>
                </div>
                {/* right */}
                <div className="flex items-center text-green-500 gap-2">
                  <Plus className="size-4" />
                  <span className=" font-bold">P50.00</span>
                </div>
              </div>
              {/* *2 */}
              <div className="flex items-center justify-between gap-4 p-5 rounded-2xl shadow bg-white">
                {/* left */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-green-500 text-white rounded-full p-2 justify-center">
                    <BanknoteArrowUp className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Deposit</span>
                    <span className="text-sm text-gray-500">Oct 24</span>
                  </div>
                </div>
                {/* right */}
                <div className="flex items-center text-green-500 gap-2">
                  <Plus className="size-4" />
                  <span className=" font-bold">P50.00</span>
                </div>
              </div>
              {/* *3 */}
              <div className="flex items-center justify-between gap-4 p-5 rounded-2xl shadow bg-white">
                {/* left */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-green-500 text-white rounded-full p-2 justify-center">
                    <BanknoteArrowUp className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Deposit</span>
                    <span className="text-sm text-gray-500">Oct 24</span>
                  </div>
                </div>
                {/* right */}
                <div className="flex items-center text-green-500 gap-2">
                  <Plus className="size-4" />
                  <span className=" font-bold">P50.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for no credits */}
      {showNoCreditModal && (
        <div className="flex min-h-screen flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-4 z-40">
          <div className="bg-white rounded-2xl pt-6 px-4 pb-4 flex flex-col items-center justify-center gap-4 w-full max-w-md">
            <div className="bg-red-100 size-13 flex items-center justify-center relative rounded-full z-50">
              <BanknoteX className="text-red-500 size-7" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex flex-col gap-1 text-center">
                <span className="text-lg font-semibold">
                  No Available Credits
                </span>
                <span className="text-gray-500 text-sm">
                  Please add funds to your account first
                </span>
              </div>
            </div>

            {/* how to add funds */}
            <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-100 py-4 px-4 w-full mt-2">
              {/* header */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full">
                    <CircleQuestionMark className="text-white" />
                  </div>
                </div>
                <span className="font-semibold">How to add funds?</span>
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
                    Instructions to be processed.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleModalClose} // ⬅️ Closes modal, sets isModalDismissed=true
              className="w-full my-2 px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-600 hover:bg-green-600 active:border-green-700 active:bg-green-700 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
            >
              I understand
            </button>
          </div>
        </div>
      )}

      {/* ⬅️ NEW MODAL: Session Expired/Insufficient Funds */}
      {showSessionExpiredModal && (
        <div className="flex min-h-screen flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-4 z-40">
          <div className="bg-white rounded-2xl pt-6 px-4 pb-4 flex flex-col items-center justify-center gap-4 w-full max-w-md">
            <div className="bg-red-100 size-13 flex items-center justify-center relative rounded-full z-50">
              <TimerOff className="text-red-500 size-7" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 pb-4">
              <div className="flex flex-col gap-1 text-center">
                <span className="text-lg font-semibold">Session Expired</span>
                <span className="text-gray-500 text-sm">
                  Connect again by tapping your RFID Card
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-4 z-40">
        <div className="bg-white rounded-2xl pt-6 px-4 pb-4 flex flex-col items-center justify-center gap-4 w-full max-w-md">
          <div className="bg-red-100 size-13 flex items-center justify-center relative rounded-full z-50">
            <TimerOff className="text-red-500 size-7" />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 pb-4">
            <div className="flex flex-col gap-1 text-center">
              <span className="text-lg font-semibold">No Available Credits</span>
              <span className="text-gray-500 text-sm">
                Your available credit is P0.00. Top-up again to continue
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
