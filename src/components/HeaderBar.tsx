'use client';

import React from 'react';
import { Mic, Wifi } from 'lucide-react';

const HeaderBar: React.FC = () => {
  return (
    <div className="px-4 py-3" style={{ backgroundColor: '#562915' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold flex items-center gap-1">
            <span 
              style={{ 
                color: '#FFEAD5',
                fontFamily: 'Crimson Text, serif'
              }}
            >
              HER
            </span>
            <span 
              style={{ 
                color: '#D23955',
                fontFamily: 'Agbalumo, cursive'
              }}
            >
              ECHO
            </span>
            <span 
              style={{ 
                fontSize: '20px',
                marginLeft: '4px'
              }}
            >
              🎤
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
          <Wifi size={16} className="text-white/70" />
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
