import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Profile() {
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
          <span className="text-base sm:text-lg font-semibold">
            Profile
          </span>
        </div>
        {/* main */}
        <div className="flex flex-col gap-4">
            asd
        </div>
      </div>
    </div>
  );
}
