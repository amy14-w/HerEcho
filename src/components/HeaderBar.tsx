'use client';

import React from 'react';
import { Wifi } from 'lucide-react';

const HeaderBar: React.FC = () => {
  return (
    <div className="bg-white/70 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">
            HerEcho 💬
          </h1>
          <p className="text-xs text-gray-600">
            Accessible Voice Learning
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
          <Wifi size={16} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
