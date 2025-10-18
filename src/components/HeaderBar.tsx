"use client";

import React from "react";
import { Mic2, Wifi } from "lucide-react";

const HeaderBar: React.FC = () => {
  return (
    <div
      className="px-4 py-4"
      style={{ backgroundColor: "#562915", minHeight: "75px" }}
    >
      <div className="flex items-center justify-between h-full">
        {/* Left Side - Back Button + App Branding */}
        <div className="flex items-center">
          {/* Back Button */}
          <button
            className="flex items-center justify-center w-8 h-8 mr-4 text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => window.history.back()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* App Branding */}
          <div className="flex items-center gap-3">
            {/* Mic Icon as Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#FCA6AF" }}
            >
              <span style={{ fontSize: "18px" }}>🎤</span>
            </div>

            {/* App Name */}
            <div className="flex flex-col">
              <h1 className="text-lg font-bold flex items-center gap-1">
                <span
                  style={{
                    color: "#FFEAD5",
                    fontFamily: "Crimson Text, serif",
                  }}
                >
                  HER
                </span>
                <span
                  style={{
                    color: "#D23955",
                    fontFamily: "Agbalumo, cursive",
                  }}
                >
                  ECHO
                </span>
              </h1>
              <p className="text-xs" style={{ color: "#FFEAD5", opacity: 0.8 }}>
                Voice Learning Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - 3-Dot Menu */}
        <button
          className="flex items-center justify-center w-8 h-8 text-white hover:bg-white/10 rounded-full transition-colors"
          onClick={() => console.log("Menu clicked")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;
