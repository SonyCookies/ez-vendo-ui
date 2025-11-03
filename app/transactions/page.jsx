// app/transactions/page.jsx
"use client";

import {
  ChevronLeft,
  ScrollText,
  Plus,
  Minus,
  BanknoteArrowUp,
  BanknoteArrowDown,
  CircleQuestionMark,
  Moon,
  ListFilter, // Keep this if used in the modal
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// --- Constants ---
const TRANSACTION_TYPE = {
  TOP_UP: "Top-up",
  DEDUCTION: "Deducted",
};

// --- Static Data Generation ---
const today = new Date();
const yesterday = new Date(Date.now() - 86400000); // 1 day ago
const lastWeek = new Date(Date.now() - 5 * 86400000); // 5 days ago

// Static data for demonstration
const allTransactions = [
  {
    id: `D-${Date.now()}`,
    type: TRANSACTION_TYPE.DEDUCTION,
    amount: 5.0,
    date: today,
  },
  {
    id: `T-${Date.now() - 1000}`,
    type: TRANSACTION_TYPE.TOP_UP,
    amount: 50.0,
    date: today,
  },
  {
    id: `D-${Date.now() - 90000000}`,
    type: TRANSACTION_TYPE.DEDUCTION,
    amount: 5.0,
    date: yesterday,
  },
  {
    id: `T-${Date.now() - 400000000}`,
    type: TRANSACTION_TYPE.TOP_UP,
    amount: 15.0,
    date: lastWeek,
  },
];
// To test the empty state, use: const allTransactions = [];

// --- Helper Functions ---

const getTransactionDetails = (type) => {
  if (type === TRANSACTION_TYPE.TOP_UP) {
    return {
      Icon: BanknoteArrowUp,
      colorClass: "text-green-500",
      bgColorClass: "bg-green-500",
      SignIcon: Plus,
    };
  }
  return {
    Icon: BanknoteArrowDown,
    colorClass: "text-red-500",
    bgColorClass: "bg-red-500",
    SignIcon: Minus,
  };
};

const formatDate = (date) => {
  const options = { month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const formatModalDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
};

// --- Grouping Logic ---
const groupTransactions = (transactions) => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const last7DaysStart = new Date(todayStart.getTime() - 7 * 86400000);

  const todayTxs = [];
  const yesterdayTxs = [];
  const last7DaysTxs = [];

  transactions.forEach((tx) => {
    const txDate = tx.date;
    if (txDate >= todayStart) {
      todayTxs.push(tx);
    } else if (txDate >= yesterdayStart) {
      yesterdayTxs.push(tx);
    } else if (txDate >= last7DaysStart) {
      last7DaysTxs.push(tx);
    }
  });

  return { todayTxs, yesterdayTxs, last7DaysTxs };
};

// =================================================================
// 🖥️ TRANSACTION PAGE COMPONENT START
// =================================================================
export default function Transactions() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { todayTxs, yesterdayTxs, last7DaysTxs } = groupTransactions(
    allTransactions
  );

  // --- Helper Components (Defined inside the page) ---

  const NoTransactionsEmptyState = () => (
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
  );

  const TransactionCard = ({ tx, onClick }) => {
    const { Icon, SignIcon, colorClass, bgColorClass } = getTransactionDetails(
      tx.type
    );
    const dateString = formatDate(tx.date);

    return (
      <div
        onClick={onClick}
        className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 cursor-pointer"
      >
        {/* left */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center text-white rounded-full p-2 justify-center ${bgColorClass}`}
          >
            <Icon className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{tx.type}</span>
            <span className="text-sm text-gray-500">{dateString}</span>
          </div>
        </div>
        {/* right */}
        <div className={`flex items-center gap-1 ${colorClass}`}>
          <SignIcon className="size-4" />
          <span className=" font-bold">P{tx.amount.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-dvh flex justify-center text-sm sm:text-base sm:bg-white">
      <div className="flex flex-col gap-6 p-3 sm:p-4 md:px-0 w-full max-w-md">
        {/* Header */}
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
          <span className="text-base sm:text-lg font-semibold">Transactions</span>
        </div>

        {/* Main */}
        <div className="flex flex-col gap-4">
          {/* Today's Transaction */}
          <div className="flex flex-col gap-2">
            <span className="text-sm sm:text-base font-semibold">Today</span>
            <div className="flex flex-col gap-2">
              {todayTxs.length > 0 ? (
                todayTxs.map((tx, index) => (
                  <TransactionCard
                    key={index}
                    tx={tx}
                    onClick={() => setSelectedTransaction(tx)}
                  />
                ))
              ) : (
                <NoTransactionsEmptyState />
              )}
            </div>
          </div>

          {/* Yesterday's Transaction */}
          <div className="flex flex-col gap-2">
            <span className="text-sm sm:text-base font-semibold">
              Yesterday
            </span>
            <div className="flex flex-col gap-2">
              {yesterdayTxs.length > 0 ? (
                yesterdayTxs.map((tx, index) => (
                  <TransactionCard
                    key={index}
                    tx={tx}
                    onClick={() => setSelectedTransaction(tx)}
                  />
                ))
              ) : (
                <NoTransactionsEmptyState />
              )}
            </div>
          </div>

          {/* Last 7 Day Transactions */}
          <div className="flex flex-col gap-2">
            <span className="text-sm sm:text-base font-semibold">
              Last 7 Days
            </span>
            <div className="flex flex-col gap-2">
              {last7DaysTxs.length > 0 ? (
                last7DaysTxs.map((tx, index) => (
                  <TransactionCard
                    key={index}
                    tx={tx}
                    onClick={() => setSelectedTransaction(tx)}
                  />
                ))
              ) : (
                <NoTransactionsEmptyState />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal for Specific Transaction Log --- */}
      {selectedTransaction && (
        <div className="flex min-h-dvh flex-col items-center justify-center fixed inset-0 w-full bg-black/50 p-3 sm:p-4 md:px-0 z-50">
          <div className="bg-white rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-5 w-full max-w-md">
            {(() => {
              // Get details for the *selected* transaction
              const { Icon, SignIcon, colorClass } = getTransactionDetails(
                selectedTransaction.type
              );

              return (
                <>
                  <div
                    className={`size-12 sm:size-13 flex items-center justify-center relative rounded-full z-50 ${
                      colorClass.includes("green")
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Icon className={`size-6 sm:size-7 ${colorClass}`} />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 ">
                    <div className="flex flex-col text-center">
                      <span className="text-base sm:text-lg font-semibold">
                        {selectedTransaction.type} Transaction
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        {formatModalDate(selectedTransaction.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-gray-500 text-xs sm:text-sm">
                      Amount
                    </span>
                    <span
                      className={`flex items-center font-semibold text-base sm:text-lg ${colorClass}`}
                    >
                      <SignIcon className="size-4 sm:size-5" />P
                      {selectedTransaction.amount.toFixed(2)}
                    </span>
                  </div>
                </>
              );
            })()}

            {/* Details */}
            <div className="flex w-full items-center justify-between rounded-lg p-4 bg-gray-100">
              {/* left */}
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold">
                  Edward Gatbonton
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  123456789
                </span>
              </div>
              {/* right */}
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold">
                  Transaction ID:
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {selectedTransaction.id}
                </span>
              </div>
            </div>

            {/* close specific transaction log modal */}
            <button
              onClick={() => setSelectedTransaction(null)}
              className="cursor-pointer text-sm sm:text-base w-full px-4 py-2 border border-green-500 bg-green-500 text-white hover:border-green-500/90 hover:bg-green-500/90  active:border-green-600 active:bg-green-600 transition-colors duration-150 rounded-full flex items-center justify-center gap-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
