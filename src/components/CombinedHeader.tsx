"use client";

import React from "react";
import StatusBar from "./StatusBar";
import HeaderBar from "./HeaderBar";

const CombinedHeader: React.FC = () => {
  return (
    <div className="w-full">
      {/* Top 25% - Status Bar */}
      <div style={{ height: "25px" }}>
        <StatusBar />
      </div>

      {/* Bottom 75% - App Header */}
      <div style={{ height: "75px" }}>
        <HeaderBar />
      </div>
    </div>
  );
};

export default CombinedHeader;
