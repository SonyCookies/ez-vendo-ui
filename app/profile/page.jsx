"use client";

import {
  Cake,
  CalendarFold,
  ChevronLeft,
  CircleQuestionMark,
  Mail,
  MapPinHouse,
  MarsStroke,
  Phone,
  Trash2,
  UserRoundPen,
  MessageCircleWarning,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react"; // ⬅️ Import useState
import { useRouter } from "next/navigation";

const STATIC_PASSWORD = "password1"; // Static password for now

export default function Profile() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [globalMessage, setGlobalMessage] = useState(null);

  // --- HANDLERS ---

  //go to edit profile
  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  // 1. Opens the first confirmation modal
  const handleDeactivateClick = () => {
    setShowConfirmModal(true);
  };

  // 2. Closes the first modal
  const handleCancelDeactivate = () => {
    setShowConfirmModal(false);
  };

  // 3. Closes first modal, opens second modal
  const handleProceedToPassword = () => {
    setShowConfirmModal(false);
    setShowPasswordModal(true);
  };

  // 4. Closes the password modal and resets state
  const handleCancelPassword = () => {
    setShowPasswordModal(false);
    setPassword("");
    setError(null);
    setGlobalMessage(null);
  };

  // 5. Handles the final confirmation and validation
  const handleConfirmDeactivation = () => {
    // Reset errors
    setError(null);
    setGlobalMessage(null);

    // Check for empty password
    if (!password) {
      setError("Password required");
      setGlobalMessage("Please correct the errors marked in red.");
      return;
    }

    // Check for correct password
    if (password !== STATIC_PASSWORD) {
      setError("Invalid password");
      setGlobalMessage("Invalid password. Please try again.");
      return;
    }

    // --- SUCCESS ---
    // If password is correct, deactivate the account.
    console.log("SUCCESS: Account deactivated.");
    // For now, we'll just close the modal.
    handleCancelPassword();
    // In a real app, you would call an API and redirect: router.push('/');
  };

  // 6. Handle input changes and focus
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear errors as user is typing
    if (error) setError(null);
    if (globalMessage) setGlobalMessage(null);
  };

  const handlePasswordFocus = () => {
    if (error) setError(null);
    if (globalMessage) setGlobalMessage(null);
  };

  return (
    <div className="min-h-dvh flex justify-center text-sm sm:text-base sm:bg-white">
      <div className="flex flex-col gap-6 p-3 sm:p-4 md:px-0 w-full max-w-md">
        {/* header */}
        <div className="relative flex items-center justify-center w-full pt-2">
          {/* left */}
          <Link
            href="/dashboard"
            className="absolute left-0 rounded-full border border-gray-300/80 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150  p-2"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </Link>
          {/* right */}
          {/* <button className="rounded-full border border-gray-300/80 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150  p-2 sm:p-3">
            <ListFilter className="size-4 sm:size-5" />
          </button> */}
          <span className="text-base sm:text-lg font-semibold">Profile</span>
        </div>
        {/* main */}
        <div className="flex flex-col gap-5">
          {/* profile card */}
          <div className="flex flex-col items-center justify-center gap-3 ">
            {/* Profile image */}
            <div className="w-32 sm:w-36 h-32 sm:h-36 rounded-full overflow-hidden flex items-center justify-center border border-green-500/50">
              <Image
                src="/default-profile-2.jpg"
                alt="User profile"
                width={256}
                height={256}
                className="object-cover w-full h-full block sm:hidden"
              />
              <Image
                src="/default-profile-2.jpg"
                alt="User profile"
                width={256}
                height={256}
                className="object-cover w-full h-full hidden sm:block"
              />
            </div>

            {/* User Main details */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg sm:text-xl font-semibold">
                Edward Gatbonton
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">
                RFID: <span className="font-semibold">123456789</span>
              </span>
            </div>

            {/* Edit Profile button */}
            <button
              onClick={handleEditProfile}
              className="bg-green-500 cursor-pointer text-sm sm:text-base text-white hover:bg-green-500/90 active:bg-green-600 transition-colors duration-150 rounded-full px-4 py-2 flex items-center gap-2"
            >
              Edit profile
            </button>
          </div>
          {/* fields */}
          <div className="flex flex-col gap-2">
            {/* birthday and age */}
            <div className="grid grid-cols-3 gap-2">
              {/* birthday */}
              <div className="relative col-span-2 bg-white hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border border-gray-300 rounded-2xl p-4 sm:p-5">
                <CalendarFold className="size-4 sm:size-5 absolute top-3 sm:top-4 right-3 sm:right-4 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-gray-500">
                    Birthday
                  </span>
                  <span className="text-sm sm:text-base font-semibold">
                    September 26, 2003
                  </span>
                </div>
              </div>
              {/* age */}
              <div className="relative col-span-1 bg-white hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border border-gray-300 rounded-2xl p-4 sm:p-5">
                <Cake className="size-4 sm:size-5 absolute top-3 sm:top-4 right-3 sm:right-4 text-green-500" />

                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-gray-500">Age</span>
                  <span className="text-sm sm:text-base font-semibold">22</span>
                </div>
              </div>
            </div>
            {/* gender and phone */}
            <div className="grid grid-cols-2 gap-2">
              {/* gender */}
              <div className="relative col-span-1 bg-white hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border border-gray-300 rounded-2xl p-4 sm:p-5">
                <MarsStroke className="size-4 sm:size-5 absolute top-3 sm:top-4 right-3 sm:right-4 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-gray-500">
                    Gender
                  </span>
                  <span className="text-sm sm:text-base font-semibold">
                    {/* Male */}
                    N/A
                  </span>
                </div>
              </div>
              {/* phone */}
              <div className="relative col-span-1 bg-white hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border border-gray-300 rounded-2xl p-4 sm:p-5">
                <Phone className="size-4 sm:size-5 absolute top-3 sm:top-4 right-3 sm:right-4 text-green-500" />

                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-gray-500">
                    Phone
                  </span>
                  <span className="text-sm sm:text-base font-semibold">
                    {/* 0916 256 1433 */}
                    N/A
                  </span>
                </div>
              </div>
            </div>
            {/* email */}
            <div className="relative bg-white hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border border-gray-300 rounded-2xl p-4 sm:p-5">
              <Mail className="size-4 sm:size-5 absolute top-3 sm:top-4 right-3 sm:right-4 text-green-500" />

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-500">Email</span>
                <span className="text-sm sm:text-base font-semibold">
                  edwardcastillogatbonton@gmail.com
                </span>
              </div>
            </div>
            {/* address */}
            <div className="relative bg-white hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border border-gray-300 rounded-2xl p-4 sm:p-5">
              <MapPinHouse className="size-4 sm:size-5 absolute top-3 sm:top-4 right-3 sm:right-4 text-green-500" />

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-500">
                  Address
                </span>
                <span className="text-sm sm:text-base font-semibold">
                  {/* Poblacion 4, Victoria, Oriental Mindoro */}
                  N/A
                </span>
              </div>
            </div>
          </div>
          {/* button */}
          <button
            onClick={handleDeactivateClick}
            className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-red-500 bg-red-500 text-white hover:border-red-500/90 hover:bg-red-500/90  active:border-red-600 active:bg-red-600 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
          >
            Deactivate account
          </button>
        </div>

        {/* pre-deactivate modal */}
        {showConfirmModal && (
          <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
            <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
              <div className="bg-red-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
                <Trash2 className="text-red-500 size-6 sm:size-7" />
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col text-center">
                  <span className="text-base sm:text-lg font-semibold">
                    Deactivate Account
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    Are you sure you want to deactivate your account?
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={handleProceedToPassword} // ⬅️ Goes to password modal
                  className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-red-500 hover:bg-red-500 hover:text-white text-red-500 active:bg-red-600 active:text-white transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancelDeactivate} // ⬅️ Closes modal
                  className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-600 hover:bg-green-600 active:border-green-700 active:bg-green-700 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* post-deactivate modal */}
        {showPasswordModal && (
          <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
            <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
              <div className="bg-red-100 size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50">
                <Trash2 className="text-red-500 size-6 sm:size-7" />
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col text-center">
                  <span className="text-base sm:text-lg font-semibold">
                    Deactivate Account
                  </span>
                </div>
              </div>

              {/* Global validation message */}
              {globalMessage && (
                <div className="px-4 py-2 rounded-md flex items-center gap-2 text-sm border-l-3 border-red-500 bg-red-100 text-red-500 w-full">
                  <MessageCircleWarning className="size-6 sm:size-7" />
                  <span className="text-xs sm:text-sm">{globalMessage}</span>
                </div>
              )}

              <form action="" className="w-full">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="text-xs sm:text-sm text-gray-800"
                  >
                    Enter your <span className="font-semibold">password</span>{" "}
                    to confirm
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password" // ⬅️ Changed to "password" type
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={handlePasswordFocus}
                    className={`px-3 py-2 rounded-md outline-none border transition-colors duration-150 placeholder:text-gray-500 ${
                      error
                        ? "border-red-500 focus:border-red-500" // Red border on error
                        : "border-gray-300 focus:border-green-500" // Default border
                    }`}
                    placeholder="Enter password"
                  />
                  {/* Field-level error */}
                  {error && (
                    <span className="text-xs text-red-500">{error}</span>
                  )}
                </div>
              </form>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={handleConfirmDeactivation} // ⬅️ Validates password
                  className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-red-500 hover:bg-red-500 hover:text-white text-red-500 active:bg-red-600 active:text-white transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancelPassword} // ⬅️ Closes modal and resets
                  className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-600 hover:bg-green-600 active:border-green-700 active:bg-green-700 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
