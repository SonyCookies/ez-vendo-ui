"use client";

import {
  Info,
  CircleQuestionMark,
  Headset,
  WifiOff,
  Search,
  CheckCircle,
  UserPlus,
  X,
} from "lucide-react";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRFIDListener } from "@/app/hooks/useRFIDListener";
import { db } from "@/app/config/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  increment,
  serverTimestamp 
} from "firebase/firestore";
import { withTimeoutAndRetry } from "@/app/utils/firebaseRetry";

// Modal states
const MODAL_STATE = {
  HIDDEN: "HIDDEN",
  CHECKING: "CHECKING",
  REGISTERED: "REGISTERED",
  UNREGISTERED: "UNREGISTERED",
  ATTEMPTS_EXCEEDED: "ATTEMPTS_EXCEEDED",
  ERROR: "ERROR",
};

export default function Home() {
  const router = useRouter();
  const MAX_ATTEMPTS = 3;
  const INITIAL_COUNTDOWN = 60; // 1 minute to scan RFID
  const [isOnline, setIsOnline] = useState(true);
  const [scannedCardId, setScannedCardId] = useState(null);
  const [modalState, setModalState] = useState(MODAL_STATE.HIDDEN);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [initialCountdown, setInitialCountdown] = useState(INITIAL_COUNTDOWN);
  const [countdownActive, setCountdownActive] = useState(true);

  // Check if RFID card exists in Firestore and manage attempts
  const checkCardInDatabase = async (cardId) => {
    try {
      // First, check if card is registered in users collection (with timeout and retry)
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("rfidCardId", "==", cardId), where("isRegistered", "==", true));
      
      const querySnapshot = await withTimeoutAndRetry(
        () => getDocs(q),
        30000, // 30 second timeout
        2 // 2 retries
      );

      if (!querySnapshot.empty) {
        // Card is registered
        const userDoc = querySnapshot.docs[0];
        return {
          isRegistered: true,
          userData: {
            id: userDoc.id,
            ...userDoc.data(),
          },
          attempts: 0,
        };
      }

      // Card not registered - check/create unregistered card record
      const unregisteredCardRef = doc(db, "users", cardId);
      const unregisteredCardSnap = await withTimeoutAndRetry(
        () => getDoc(unregisteredCardRef)
      );

      if (unregisteredCardSnap.exists()) {
        // Unregistered card already has attempts recorded
        const cardData = unregisteredCardSnap.data();
        const attempts = cardData.attempts || 0;

        // Increment attempts (with timeout and retry)
        await withTimeoutAndRetry(() =>
          updateDoc(unregisteredCardRef, {
            attempts: increment(1),
            lastAttempt: serverTimestamp(),
          })
        );

        return {
          isRegistered: false,
          userData: null,
          attempts: attempts + 1,
        };
      } else {
        // First time scanning this unregistered card (with timeout and retry)
        await withTimeoutAndRetry(() =>
          setDoc(unregisteredCardRef, {
            rfidCardId: cardId,
            isRegistered: false,
            attempts: 1,
            firstScan: serverTimestamp(),
            lastAttempt: serverTimestamp(),
            status: "pending_registration",
          })
        );

        return {
          isRegistered: false,
          userData: null,
          attempts: 1,
        };
      }
    } catch (error) {
      console.error("Error checking card in database:", error);
      return {
        isRegistered: false,
        userData: null,
        attempts: 0,
        error: error.message,
      };
    }
  };

  // Handle RFID card detection from ESP8266
  const handleCardDetected = useCallback(
    async (cardData) => {
      console.log("RFID Card Detected:", cardData);
      const cardId = cardData.cardId;
      setScannedCardId(cardId);

      // Stop the initial countdown - RFID scanned in time!
      setCountdownActive(false);

      // Show checking modal
      setModalState(MODAL_STATE.CHECKING);

      // Check card in Firestore database
      const result = await checkCardInDatabase(cardId);

      if (result.error) {
        console.error("❌ Database error:", result.error);
        setErrorMessage(result.error);
        setModalState(MODAL_STATE.ERROR);
        // Auto close after 3 seconds
        setTimeout(() => setModalState(MODAL_STATE.HIDDEN), 3000);
        return;
      }

      if (result.isRegistered) {
        console.log("✅ User is registered:", result.userData);
        setUserData(result.userData);
        setCurrentAttempts(0);
        setModalState(MODAL_STATE.REGISTERED);
        
        // Auto redirect to dashboard after 2 seconds
        setTimeout(() => {
          setModalState(MODAL_STATE.HIDDEN);
          router.push(`/dashboard?rfid=${encodeURIComponent(cardId)}`);
        }, 2000);
      } else {
        console.log("❌ User is unregistered");
        const attempts = result.attempts;
        setCurrentAttempts(attempts);

        if (attempts >= MAX_ATTEMPTS) {
          console.log("🔒 Maximum attempts reached");
          setModalState(MODAL_STATE.ATTEMPTS_EXCEEDED);
        } else {
          console.log(`⚠️ Unregistered attempt ${attempts}/${MAX_ATTEMPTS}`);
          setModalState(MODAL_STATE.UNREGISTERED);
          
          // Redirect to registration page with RFID card ID after 2 seconds
          setTimeout(() => {
            setModalState(MODAL_STATE.HIDDEN);
            router.push(`/register?rfid=${encodeURIComponent(cardId)}&attempt=${attempts}`);
          }, 2000);
        }
      }
    },
    []
  );

  // Listen to Firebase Realtime Database for RFID scans from ESP8266
  const { rfidData, loading: rfidLoading, error: rfidError, isConnected } = useRFIDListener(
    "rfid/lastScan", // Change this path to match your ESP8266 database structure
    handleCardDetected,
    true // Always listening
  );

  // Initial 1-minute countdown when user connects
  useEffect(() => {
    if (!countdownActive) return;

    if (initialCountdown <= 0) {
      // Time's up - redirect or show message
      setCountdownActive(false);
      // Optionally show a modal or message
      return;
    }

    const timer = setInterval(() => {
      setInitialCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCountdown, countdownActive]);

  // Online/Offline detection
  useEffect(() => {
    // Set the initial state when component mounts (only runs in browser)
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    // Create event handlers
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline); // Cleanup listeners on component unmount

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
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

            {/* 1-Minute Countdown Warning */}
            {countdownActive && (
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-orange-50 border border-orange-300">
                <div className="flex items-center justify-center min-w-10 min-h-10 bg-orange-500 rounded-full">
                  <span className="text-white font-bold text-lg">
                    {initialCountdown}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-sm text-orange-700">
                    Scan your RFID card within 1 minute
                  </span>
                  <span className="text-gray-600 text-xs">
                    Your free trial internet expires in {initialCountdown} seconds. Scan now to continue.
                  </span>
                </div>
              </div>
            )}
            {/* Main */}
            <div className="bg-white p-4 rounded-2xl border border-gray-300/80 flex flex-col gap-3 items-center">
              <div className="flex flex-col gap-1 text-center pt-2">
                <span className="text-xl sm:text-2xl font-bold  ">
                  {isConnected ? (
                    <>
                      <span className="text-green-500">Listening</span> for Cards
                    </>
                  ) : (
                    <>Connecting to Scanner</>
                  )}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {isConnected
                    ? "Hold your RFID Card near the reader"
                    : "Please wait..."}
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
                <div
                  className="
                    relative                      
                    flex items-center justify-center
                    rounded-full
                    size-38                    
                    bg-green-400
                    text-white
                    text-lg
                    font-semibold
                    shadow
                  "
                >
                  {isConnected ? (
                    <span className="flex items-center gap-2">
                      <span className="size-2 bg-white rounded-full animate-pulse"></span>
                      Listening...
                    </span>
                  ) : (
                    "Connecting..."
                  )}
                </div>
              </div>
              {/* note for unregistered user */}
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full">
                    <Info className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-700 text-xs sm:text-sm font-semibold">
                    How it works:
                  </span>
                  <ul className="text-gray-600 text-xs list-disc list-inside">
                    <li>You have <span className="font-semibold">1 minute</span> free internet to scan your RFID</li>
                    <li>Unregistered: Get <span className="font-semibold">5 minutes</span> to complete registration (3 attempts max)</li>
                    <li>Registered: Access dashboard and start browsing!</li>
                  </ul>
                </div>
              </div>
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

      {/* RFID Detection Modal */}
      {modalState !== MODAL_STATE.HIDDEN && (
        <div className="min-h-dvh flex flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-4 w-full max-w-md relative">
            {/* Close button for attempts exceeded */}
            {modalState === MODAL_STATE.ATTEMPTS_EXCEEDED && (
              <button
                onClick={() => setModalState(MODAL_STATE.HIDDEN)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            )}

            {/* Icon and Content based on state */}
            <div className="relative flex items-center justify-center py-4">
              {/* Pulsing circles for checking state */}
              {modalState === MODAL_STATE.CHECKING && (
                <>
                  <div className="absolute rounded-full size-22 bg-green-200 animate-concentric-pulse [animation-delay:-1s]"></div>
                  <div className="absolute rounded-full size-16 bg-green-300 animate-concentric-pulse [animation-delay:0s]"></div>
                </>
              )}

              {/* Center Icon */}
              {modalState === MODAL_STATE.CHECKING && (
                <div className="bg-green-400 size-12 sm:size-14 flex items-center justify-center relative rounded-full z-50">
                  <Search className="text-white size-7 sm:size-8 animate-pulse" />
                </div>
              )}

              {modalState === MODAL_STATE.REGISTERED && (
                <div className="bg-green-500 size-12 sm:size-14 flex items-center justify-center relative rounded-full z-50">
                  <CheckCircle className="text-white size-7 sm:size-8" />
                </div>
              )}

              {modalState === MODAL_STATE.UNREGISTERED && (
                <div className="bg-orange-500 size-12 sm:size-14 flex items-center justify-center relative rounded-full z-50">
                  <UserPlus className="text-white size-7 sm:size-8" />
                </div>
              )}

              {modalState === MODAL_STATE.ATTEMPTS_EXCEEDED && (
                <div className="bg-red-500 size-12 sm:size-14 flex items-center justify-center relative rounded-full z-50">
                  <X className="text-white size-7 sm:size-8" />
                </div>
              )}

              {modalState === MODAL_STATE.ERROR && (
                <div className="bg-red-500 size-12 sm:size-14 flex items-center justify-center relative rounded-full z-50">
                  <X className="text-white size-7 sm:size-8" />
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="text-center flex flex-col gap-2">
              {modalState === MODAL_STATE.CHECKING && (
                <>
                  <span className="text-lg sm:text-xl font-semibold">
                    Checking Card...
                  </span>
                  <span className="text-gray-500 text-sm">
                    Card ID: {scannedCardId}
                  </span>
                </>
              )}

              {modalState === MODAL_STATE.REGISTERED && userData && (
                <>
                  <span className="text-lg sm:text-xl font-semibold text-green-600">
                    Welcome Back!
                  </span>
                  <span className="text-base sm:text-lg font-medium">
                    {userData.fullName || userData.name || "User"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Redirecting to dashboard...
                  </span>
                </>
              )}

              {modalState === MODAL_STATE.UNREGISTERED && (
                <>
                  <span className="text-lg sm:text-xl font-semibold text-orange-600">
                    Card Not Registered
                  </span>
                  <span className="text-gray-500 text-sm">
                    Card ID: {scannedCardId}
                  </span>
                  <span className="text-gray-500 text-xs">
                    Redirecting to registration page...
                  </span>
                  <span className="text-orange-600 text-xs font-medium">
                    Attempt: {currentAttempts}/{MAX_ATTEMPTS}
                  </span>
                </>
              )}

              {modalState === MODAL_STATE.ATTEMPTS_EXCEEDED && (
                <>
                  <span className="text-lg sm:text-xl font-semibold text-red-600">
                    Maximum Attempts Reached
                  </span>
                  <span className="text-gray-500 text-sm">
                    You have used all {MAX_ATTEMPTS} attempts
                  </span>
                  <span className="text-gray-500 text-xs">
                    Please contact administrator for assistance
                  </span>
                </>
              )}

              {modalState === MODAL_STATE.ERROR && (
                <>
                  <span className="text-lg sm:text-xl font-semibold text-red-600">
                    Error
                  </span>
                  <span className="text-gray-500 text-sm">
                    {errorMessage || "Failed to check card"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offline Modal */}
      {!isOnline && (
        <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
          <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
            <div className="bg-red-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
              <WifiOff className="text-red-500 size-6 sm:size-7" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 ">
              <div className="flex flex-col text-center">
                <span className="text-base sm:text-lg font-semibold">
                  Internet Unavailable
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  Internet is currently unavailable. We are working to restore
                  service.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
