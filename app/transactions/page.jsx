import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Transactions() {
  return (
    <div className="min-h-dvh flex justify-center text-sm sm:text-base">
      <div className="flex flex-col gap-6 p-3 sm:p-4 md:px-0 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* left */}
          <Link href="/dashboard" className="rounded-full border border-gray-300/80 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150  p-2 sm:p-3">
            <ChevronLeft className="size-4 sm:size-5" />
          </Link>
          {/* right */}
        </div>
        {/* Main */}
      </div>
    </div>
  );
}
