'use client';

import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

const StatusBar: React.FC = () => {
  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="bg-white px-4 py-2 flex items-center justify-between text-black text-sm font-semibold">
      {/* Left side - Time */}
      <div className="flex items-center">
        <span className="text-black font-medium">
          {getCurrentTime()}
        </span>
      </div>
      
      {/* Right side - Signal, Wifi, Battery */}
      <div className="flex items-center gap-1">
        {/* Signal bars */}
        <Signal size={16} className="text-black" />
        
        {/* Wifi */}
        <Wifi size={16} className="text-black" />
        
        {/* Battery */}
        <Battery size={16} className="text-black" />
        
        {/* Battery percentage */}
        <span className="text-black text-xs ml-1">100%</span>
      </div>
    </div>
  );
};

export default StatusBar;