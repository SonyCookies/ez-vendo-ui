import ScanNowButton from "./components/ScanNowButton";
import { Info, CircleQuestionMark, Headset } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-base">
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
              <span className="text-gray-500">
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
              <ScanNowButton />
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
          <button className="flex items-center gap-1 text-green-500 font-semibold">
            <Headset className="text-green-500 size-5" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
