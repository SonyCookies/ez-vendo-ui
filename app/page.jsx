export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-base">
      <div className="flex flex-col gap-8 p-4">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          {/* Left */}
          logo here
          {/* Right */}
          <div className="flex items-center justify-center flex-col gap-1">
            toggle?
          </div>
        </div>
        {/* Center */}
        <div className="flex flex-col gap-6 w-full">

          {/* main */}
          <div className="flex flex-col gap-6 w-full">
            {/* Intro */}
            <div className="flex text-center flex-col gap-2">
              <span className="text-2xl font-bold">Welcome to EZ-Vendo</span>
              <span className="text-gray-500">
                Secure and convenient vending experience.
              </span>
            </div>
            {/* Main */}
            <div className="bg-white p-4 rounded-2xl shadow flex flex-col gap-4 items-center">
              <div className="flex flex-col gap-2 py-4 text-center">
                <span className="text-2xl font-bold  ">Tap Your RFID Card</span>
                <span className="text-gray-500 text-sm">
                  Tap your RFID Card to Start or Register
                </span>
              </div>
              {/* animate pulse */}
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full size-62 bg-green-500/20 flex items-center justify-center animate-scan-ring">
                  <div className="rounded-full size-54 bg-green-500/15 flex items-center justify-center animate-scan-core">
                    <button className="rounded-full px-6 py-18 bg-green-500 font-semibold text-white text-3xl animate-scan-cta">
                      Scan Now
                    </button>
                  </div>
                </div>
              </div>
              {/* note for unregistered user */}
              <div className="flex">
                <span className="text-gray-500 text-sm">
                  <span className="font-bold">Note: </span> For unregistered
                  user, only 3 attempts blah blah blah
                </span>
              </div>
            </div>
          </div>

          {/* how to use */}
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col gap-4 items-center">
            {/* header */}
            <span className="text-lg font-bold">How to use?</span>
          </div>
        </div>

        {/* Contact admin */}
      </div>
    </div>
  );
}
