export default function TapLoadingModal() {
  return (
    <div className="min-h-screen bg-black/20 opacity-20">
      <div className="flex items-centerjustify-center">
        <div className="bg-white rounded-2xl py-8 px-4 flex flex-col gap-4">
          {/* Loading spinner here */}
          <span className="text-gray-500 animate-pulse">
            Scanning RFID Card...
          </span>
        </div>
      </div>
    </div>
  );
}
