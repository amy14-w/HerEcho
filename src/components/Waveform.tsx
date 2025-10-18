'use client';

import React, { useState, useEffect } from 'react';

interface WaveformProps {
  isPlaying?: boolean;
  className?: string;
}

const Waveform: React.FC<WaveformProps> = ({ isPlaying = false, className = "" }) => {
  const [heights, setHeights] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate random heights only on client side
    const bars = Array.from({ length: 12 }, (_, i) => i);
    setHeights(bars.map(() => Math.random() * 12 + 4));
  }, []);
  
  const bars = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className={`flex gap-1 items-end h-4 ${className}`}>
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-1 bg-white rounded-full transition-all duration-300 ${
            isPlaying 
              ? 'animate-wave' 
              : 'animate-pulse'
          }`}
          style={{
            height: heights[bar] ? `${heights[bar]}px` : '8px',
            animationDelay: `${bar * 0.1}s`,
            animationDuration: isPlaying ? '1.5s' : '2s'
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
