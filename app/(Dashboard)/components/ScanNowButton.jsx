export default function ScanNowButton() {
  return (
    // The main container is relative, centering the children.
    <div className="relative flex items-center justify-center size-62 mb-2">
      {/* 1. Outermost Circle (ANIMATING) */}
      <div
        className="
          absolute
          rounded-full
          size-64                       /* Largest size */
          bg-green-200
          animate-concentric-pulse      /* <-- ANIMATION APPLIED HERE */
          [animation-delay:-1s]         
        "
      ></div>

      {/* 2. Middle Circle (ANIMATING) */}
      <div
        className="
          absolute
          rounded-full
          size-52                       /* Medium size */
          bg-green-300
          animate-concentric-pulse      /* <-- ANIMATION APPLIED HERE */
          [animation-delay:0s]          
        "
      ></div>

      {/* 3. Inner button (STATIC) - Must be positioned after the animated divs to sit on top */}
      <button
        className="
          relative                      /* Keep relative to sit on top of absolutes */
          flex items-center justify-center
          rounded-full
          size-38                    /* Smallest size (the actual button) */
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
