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
  CircleStop,
  CircleCheckBig,
  Minus,
  BanknoteArrowDown,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// CONSTANTS
const INITIAL_BALANCE = 0.0;
const BILLING_RATE = 5.0; // P5.00
const BILLING_INTERVAL_SECONDS = 30; //600 for 10 minutes
const LOW_BALANCE_THRESHOLD = 10.0;
const PING_INTERVAL_MS = 1000;
const TRANSACTION_TYPE = {
  TOP_UP: "Top-up",
  DEDUCTION: "Deducted",
};

export default function Dashboard() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [userBalance, setUserBalance] = useState(INITIAL_BALANCE);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Modal Control States
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [showLowCreditWarning, setShowLowCreditWarning] = useState(false);
  const [isZeroModalDismissed, setIsZeroModalDismissed] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showStopSuccess, setShowStopSuccess] = useState(false);
  const [showTopUpInstructions, setShowTopUpInstructions] = useState(false);

  // --- CALCULATED STATE / DYNAMIC STYLES ---
  const isLowBalance = userBalance <= 0;
  const isWarningLevel =
    userBalance > 0 && userBalance <= LOW_BALANCE_THRESHOLD;
  const showNoCreditModal = isLowBalance && !isZeroModalDismissed;
  const disableControlButtons = isLowBalance;

  const sessionButtonText = isSessionActive ? "Stop" : "Start";
  const pulsingBaseColor = isSessionActive ? "bg-red" : "bg-green";
  const sessionBaseColor = isSessionActive
    ? "bg-red-400 hover:bg-red-500"
    : "bg-green-400 hover:bg-green-500";
  const sessionButtonFinalClasses = disableControlButtons
    ? `bg-gray-400 text-white cursor-not-allowed`
    : `${sessionBaseColor} text-white cursor-pointer`;

  const handleStartStopSession = () => {
    if (isSessionActive) {
      setShowStopConfirm(true); // This is fine
    } else {
      // START LOGIC
      if (userBalance >= BILLING_RATE) {
        // 🛑 CRITICAL FIX: Update states sequentially, NOT nested.

        // 1. Update Balance
        setUserBalance((prevBalance) => prevBalance - BILLING_RATE);

        // 2. Update History
        setTransactionHistory((currentHistory) => [
          {
            type: TRANSACTION_TYPE.DEDUCTION,
            amount: BILLING_RATE,
            date: new Date(),
          },
          ...currentHistory,
        ]);

        // 3. Set Timer
        setSessionTimer(BILLING_INTERVAL_SECONDS);

        // 4. Activate Session (This triggers the re-render)
        setIsSessionActive(true);
      }
    }
  };
  const finalizeStopSession = () => {
    setIsSessionActive(false);
    setSessionTimer(0);
    setShowStopConfirm(false);

    setShowStopSuccess(true); // Show success modal (which redirects after 3s)
  };

  const handleContinueSession = () => {
    setShowStopConfirm(false); // Close confirmation modal and resume
  };

  // 4. Top-up / Dismissal Handlers
  const handleTopUp = () => {
    setShowTopUpInstructions(true);
  };

  const finalizeTopUp = () => {
    const topUpAmount = 15.0;

    // 🛑 FIX: Use the functional update form for setTransactionHistory
    setTransactionHistory((currentHistory) => [
      { type: TRANSACTION_TYPE.TOP_UP, amount: topUpAmount, date: new Date() },
      ...currentHistory,
    ]);

    setUserBalance((prev) => prev + topUpAmount);
    setShowTopUpInstructions(false);

    // Reset dismissal states
    setIsZeroModalDismissed(false);
    setShowLowCreditWarning(false);
  };

  // ⬅️ NEW HANDLER: Closes the instruction modal without adding credit (optional)
  const handleCancelTopUp = () => {
    setShowTopUpInstructions(false);
  };

  const handleModalClose = () => {
    // Used by P0.00 Modal and Session Expired Modal
    setIsZeroModalDismissed(true);
    setShowSessionExpiredModal(false);
  };

  const handleWarningDismiss = () => {
    setShowLowCreditWarning(false);
  };
  // Timer and Effect loops
  // Session Timer Loop (Decrements sessionTimer)
  useEffect(() => {
    if (!isSessionActive) {
      return;
    }
    const sessionLoop = setInterval(() => {
      setSessionTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(sessionLoop);
          setIsSessionActive(false);
          setShowSessionExpiredModal(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, PING_INTERVAL_MS);

    return () => clearInterval(sessionLoop);
  }, [isSessionActive, setIsSessionActive]);

  // Elapsed Time Loop (Runs constantly)
  useEffect(() => {
    const elapsedLoop = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(elapsedLoop);
  }, []);

  // Low Credit Warning Display Logic (Debounced)
  useEffect(() => {
    let timer;
    if (isWarningLevel) {
      timer = setTimeout(() => {
        setShowLowCreditWarning(true);
      }, 500);
    } else if (!isWarningLevel) {
      setShowLowCreditWarning(false);
    }
    return () => clearTimeout(timer);
  }, [isWarningLevel]);

  // Redirection Logic (Session Expired or Stop Confirmed)
  useEffect(() => {
    if (showSessionExpiredModal || showStopSuccess) {
      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [showSessionExpiredModal, showStopSuccess, router]);

  // Utilities
  const recentTransactions = transactionHistory.slice(0, 3);

  const formatDate = (date) => {
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

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

  const getTimerColor = () => {
    const redThreshold = BILLING_INTERVAL_SECONDS * 0.2;
    if (sessionTimer > redThreshold) {
      return "rgb(16, 185, 129)"; // green-500
    } else {
      return "rgb(239, 68, 68)"; // red-500
    }
  };

  const getTransactionDetails = (type) => {
    if (type === TRANSACTION_TYPE.TOP_UP) {
      return {
        Icon: BanknoteArrowUp,
        colorClass: "text-green-500", // Tailwind Text Color
        bgColorClass: "bg-green-500", // Tailwind BG Color
        SignIcon: Plus,
      };
    }
    return {
      Icon: BanknoteArrowDown,
      colorClass: "text-red-500", // Tailwind Text Color
      bgColorClass: "bg-red-500", // Tailwind BG Color
      SignIcon: Minus,
    };
  };

  const knownPulsingClasses = [
    "bg-green-200",
    "bg-green-300",
    "bg-red-200",
    "bg-red-300",
    "bg-gray-100",
    "bg-gray-200",
  ];

  return (
    <div className="min-h-dvh flex justify-center text-sm sm:text-base">
      <div className="flex flex-col gap-6 p-3 sm:p-4 md:px-0 w-full max-w-md">
        {/* header */}
        <div className="flex items-center justify-between">
          {/* left */}
          <div className="flex items-center gap-3">
            {/* profile */}
            <Link href="/profile" className="">
              <img
                src="/default-profile.png"
                alt="Profile"
                className="size-9 sm:size-10 rounded-full"
              />
            </Link>
            <div className="flex flex-col">
              {/* name */}
              <span className="text-gray-800 text-sm sm:text-base">
                Hello,{" "}
                <span className="text-green-500 font-semibold">Edward</span>
              </span>
              <span className="text-gray-500 text-xs">
                <span className="font-semibold">RFID:</span> 123456789
              </span>
            </div>
          </div>
          {/* right */}
          <div className="flex items-center gap-2">
            {/* dark and light mode */}
            <button className="rounded-full border border-gray-300/80 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150  p-2 sm:p-3">
              <Moon className="size-4 sm:size-5" />
            </button>
            {/* notification */}
            <button className="rounded-full border border-gray-300/80 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150  p-2 sm:p-3">
              <Bell className="size-4 sm:size-5" />
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
          <div className="flex items-center justify-center mb-2">
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
                className={`relative text-xl sm:text-2xl flex items-center justify-center rounded-full size-34 font-semibold shadow transition-colors duration-150 ${sessionButtonFinalClasses}`}
              >
                {isLowBalance ? "N/A" : sessionButtonText}
              </button>
            </div>
          </div>

          {/* information (Cards) */}
          <div className="grid grid-cols-2 gap-3">
            {/* available credits (uses live state) */}
            <div className="col-span-2 flex items-center bg-green-500 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap- flex-1">
                <span className="text-gray-50 text-sm">Available credits</span>
                <span className="font-semibold text-lg text-white">
                  P{userBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleTopUp}
                  className="bg-white cursor-pointer  text-sm sm:text-base hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 text-green-500 rounded-full px-4 py-2 flex items-center gap-2"
                >
                  <Plus className="size-5" />
                  Top up
                </button>
              </div>
            </div>
            {/* Elapsed time */}
            <div className="col-span-1 flex items-center bg-yellow-400 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap- flex-1">
                <span className="text-gray-700 text-sm">Elapsed time</span>
                <span className="font-semibold">
                  {formatTime(elapsedSeconds, true)}
                </span>{" "}
                {/* ⬅️ Shows HH:MM:SS */}
              </div>
            </div>
            {/* Billing rate (Static) */}
            <div className="col-span-1 flex items-center bg-blue-500 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap- flex-1">
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
              <Link
                href="/transactions"
                className=" text-gray-500  hover:text-green-500 active:text-green-600 transition-colors duration-150 flex items-center justify-center rounded-full gap-1"
              >
                <span className="text-sm">View all</span>
                <ChevronRight className="size-5" />
              </Link>
            </div>
            {/* 🛑 CONDITIONAL RENDERING FOR TRANSACTION LIST / EMPTY STATE */}
            {recentTransactions.length > 0 ? (
              // --- TRANSACTION CARDS ---
              <div className="flex flex-col gap-2">
                {recentTransactions.map((tx, index) => {
                  // FIX 1: Destructure new classes
                  const {
                    Icon,
                    SignIcon,
                    colorClass,
                    bgColorClass,
                  } = getTransactionDetails(tx.type);
                  const dateString = formatDate(tx.date);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-gray-300 bg-white"
                    >
                      {/* left */}
                      <div className="flex items-center gap-3">
                        {/* 🛑 FIX 2: Apply bgColorClass to the background circle */}
                        <div
                          className={`flex items-center text-white rounded-full p-2 justify-center ${bgColorClass}`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">{tx.type}</span>
                          <span className="text-sm text-gray-500">
                            {dateString}
                          </span>
                        </div>
                      </div>

                      {/* right - Dynamic Sign Icon and Amount */}
                      <div
                        // 🛑 FIX 3: Apply text color class directly
                        className={`flex items-center gap-1 ${colorClass}`}
                      >
                        <SignIcon className="size-4" />
                        <span className=" font-bold">
                          P{tx.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // --- NO TRANSACTIONS EMPTY STATE ---
              // ... (JSX for No Transactions remains here) ...
              <div className="flex flex-col items-center justify-center p-6 gap-5 bg-white rounded-2xl border border-gray-300 ">
                <div className="bg-gray-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full">
                  <ScrollText className="text-gray-500 size-6 sm:size-7" />
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex flex-col text-center">
                    <span className="text-lg sm:text-xl font-semibold">
                      No Transactions
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      There are no transactions made.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for No credits */}
      {showNoCreditModal && (
        <div className="flex min-h-screen flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-40">
          <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
            <div className="bg-red-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
              <BanknoteX className="text-red-500 size-6 sm:size-7" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex flex-col text-center">
                <span className="text-lg sm:text-xl font-semibold">
                  No Available Credits
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  Please add funds to your account first
                </span>
              </div>
            </div>

            <button
              onClick={handleTopUp}
              className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-500/90 hover:bg-green-500/90  active:border-green-600 active:bg-green-600 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
            >
              Top-up instructions
            </button>
          </div>
        </div>
      )}

      {/* Modal for Top-up Instructions */}
      {showTopUpInstructions && (
        <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
          <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
            <div className="bg-green-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
              <CircleQuestionMark className="text-green-500 size-6 sm:size-7" />
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex flex-col text-center">
                <span className="text-base sm:text-lg font-semibold">
                  Top-up instructions
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  Follow the instructions to add credits to your account.
                </span>
              </div>
            </div>

            {/* top-up instructions */}
            <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-50 py-4 px-4 w-full">
              <div className="flex flex-col gap-2 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center text-center bg-green-500 size-5 rounded-full">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <span className="text-sm text-gray-800">
                    Instructions to be processed. (Simulated Top-up: P15.00)
                  </span>
                </div>
              </div>
            </div>

            {/* buttons */}
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleCancelTopUp} // ⬅️ New handler to cancel/close
                className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={finalizeTopUp} // ⬅️ New handler to ADD credit and close
                className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-600 hover:bg-green-600 active:border-green-700 active:bg-green-700 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Low Credit Warning (Persistent) */}
      {showLowCreditWarning && (
        <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
          <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
            {/* Warning Icon */}
            <div className="bg-yellow-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
              <TriangleAlert className="text-yellow-400 size-6 sm:size-7" />
            </div>

            {/* Warning Text */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex flex-col text-center">
                <span className="text-lg sm:text-xl font-semibold">
                  Low Credits
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  Your available credits (P{userBalance.toFixed(2)}) are low.
                  Top-up again to ensure uninterrupted session.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full">
              {/* Do it later: Closes the modal temporarily */}
              <button
                onClick={handleWarningDismiss}
                className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
              >
                Do it later
              </button>

              {/* top up: Tops up and closes all modals */}
              <button
                onClick={handleTopUp}
                className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-600 hover:bg-green-600 active:border-green-700 active:bg-green-700 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
              >
                Top-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Session Expired/Insufficient Funds */}
      {showSessionExpiredModal && (
        <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-40">
          <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
            <div className="bg-red-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
              <TimerOff className="text-red-500 size-6 sm:size-7" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 ">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col text-center">
                  <span className="text-base sm:text-lg font-semibold">
                    Session Expired
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    Connect again by tapping your RFID Card
                  </span>
                </div>

                <div className="flex items-center justify-center py-2">
                  <span className="text-gray-500 text-xs sm:text-sm animate-pulse">
                    Redirecting to portal...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Stop Session Confirmation */}
      {showStopConfirm && (
        <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
          <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
            <div className="bg-yellow-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
              <CircleStop className="text-yellow-400 size-6 sm:size-7" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col text-center">
                  <span className="text-base sm:text-lg font-semibold">
                    Stop Session Confirmation
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    Are you sure you want to stop the session?
                  </span>
                </div>
              </div>
              {/* remaining time */}
              <div className="flex items-center justify-center py-2">
                <span className="text-gray-500 text-sm sm:text-base">
                  Time remaining:{" "}
                  <span className="font-semibold">
                    {formatTime(sessionTimer)}
                  </span>
                </span>
              </div>
            </div>
            {/* buttons */}
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={finalizeStopSession} // ⬅️ Confirms and proceeds to success modal
                className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
              >
                Confirm
              </button>

              <button
                onClick={handleContinueSession} // ⬅️ Closes modal and resumes
                className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-600 hover:bg-green-600 active:border-green-700 active:bg-green-700 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Post-Stop Session */}
      {showStopSuccess && (
        <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
          <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
            <div className="bg-green-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
              <CircleCheckBig className="text-green-500 size-6 sm:size-7" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col text-center">
                  <span className="text-base sm:text-lg font-semibold">
                    Stop Session Confirmed
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    You're remaining credits are{" "}
                    <span className="font-semibold">
                      P{userBalance.toFixed(2)}.
                    </span>{" "}
                    Tap your RFID card to continue.
                  </span>
                </div>
              </div>
              {/* remaining time */}
              <div className="flex items-center justify-center py-2">
                <span className="text-gray-500 text-xs sm:text-sm animate-pulse">
                  Redirecting to portal...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
