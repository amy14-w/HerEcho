"use client";

import React from "react";

interface IPhoneFrameProps {
  children: React.ReactNode;
}

const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  return (
    <div
      className="flex justify-center items-center min-h-screen p-8"
      style={{ backgroundColor: "#562915" }}
    >
      {/* iPhone Frame Container */}
      <div className="relative">
        {/* iPhone Body */}
        <div
          className="relative bg-black rounded-[3rem] p-2 shadow-2xl"
          style={{
            width: "390px",
            height: "844px",
          }}
        >
          {/* Screen */}
          <div
            className="bg-white rounded-[2.5rem] overflow-hidden relative"
            style={{
              width: "374px",
              height: "812px",
            }}
          >
            {/* Dynamic Island */}
            <div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black rounded-full z-50"
              style={{
                width: "126px",
                height: "30px",
              }}
            />

            {/* App Content */}
            <div className="w-full h-full pt-10">{children}</div>
          </div>
        </div>

        {/* Side Buttons */}
        {/* Volume Up */}
        <div
          className="absolute left-0 bg-black rounded-r-md"
          style={{
            top: "140px",
            width: "4px",
            height: "32px",
            marginLeft: "-2px",
          }}
        />

        {/* Volume Down */}
        <div
          className="absolute left-0 bg-black rounded-r-md"
          style={{
            top: "180px",
            width: "4px",
            height: "32px",
            marginLeft: "-2px",
          }}
        />

        {/* Power Button */}
        <div
          className="absolute right-0 bg-black rounded-l-md"
          style={{
            top: "160px",
            width: "4px",
            height: "48px",
            marginRight: "-2px",
          }}
        />
      </div>
    </div>
  );
};

export default IPhoneFrame;
