"use client";
import React from "react";

export default function ScanNowButton({ onScanNowTap }) {
  return (
    // The main container is relative, centering the children.
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
        "
      ></div>

      {/* 3. Inner button (STATIC) - Must be positioned after the animated divs to sit on top */}
      <button
        onClick={onStartTap}
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
  );
}
