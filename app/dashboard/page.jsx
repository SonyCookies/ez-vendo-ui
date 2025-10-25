import {
  Plus,
  Bell,
  Eye,
  ScrollText,
  Moon,
  Sun,
  BanknoteX,
  CircleQuestionMark,
  ChevronRight,
  BanknoteArrowUp,
} from "lucide-react";

export default function Dashboard() {
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
          {/* Stop Session */}
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center size-62">
              {/* 1. Outermost Circle (ANIMATING) */}
              <div
                className="
                    absolute
                    rounded-full
                    size-60                       
                    bg-red-100
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
                    size-48                      
                    bg-red-200
                    animate-concentric-pulse      
                    [animation-delay:0s] 
                    transition-all
                    ease-out         
                  "
              ></div>

              {/* 3. Inner button (STATIC) - Must be positioned after the animated divs to sit on top */}
              <button
                className="
                    relative                      
                    flex items-center justify-center
                    rounded-full
                    size-34                    
                    bg-red-400
                    text-white
                    text-xl
                    font-semibold
                    shadow
                    hover:bg-green-500
                    transition-colors
                    duration-150
                    cursor-pointer
                  "
              >
                Stop
              </button>
            </div>
          </div>

          {/* information */}
          <div className="grid grid-cols-2 gap-3">
            {/* available credits */}
            <div className="col-span-2 flex items-center bg-green-500 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-gray-50 text-sm">Available credits</span>
                <span className="font-semibold text-lg text-white">
                  P120.00
                </span>
              </div>
              <div className="flex items-center">
                <button className="bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 text-green-500 rounded-full px-4 py-2 flex items-center gap-2">
                  <Plus className="size-5" />
                  Top up
                </button>
              </div>
            </div>
            {/*  */}
            <div className="col-span-1 flex items-center bg-yellow-400 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-gray-700 text-sm">Elapsed time</span>
                <span className="font-semibold">10:00:20</span>
              </div>
            </div>
            {/*  */}
            <div className="col-span-1 flex items-center bg-blue-500 px-5 py-5 rounded-2xl">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-gray-50 text-sm">Billing rate</span>
                <span className="font-semibold text-white">P5.00 / 10mins</span>
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
      <div className="hidden min-h-screen flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-4 z-50">
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

          <button className="w-full my-2 px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-600 hover:bg-green-600 active:border-green-700 active:bg-green-700 transition-colors duration-150 rounded-full flex items-center justify-center gap-2">
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}
