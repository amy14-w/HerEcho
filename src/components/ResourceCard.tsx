'use client';

import React from 'react';
import { Play } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  img: string;
  audioSrc: string;
  onPlay: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, img, audioSrc, onPlay }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/20 mb-4" style={{ maxWidth: '320px' }}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-her-teal-400 to-her-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">📚</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800 mb-1">
            {title}
          </h3>
          
          <button
            onClick={onPlay}
            className="flex items-center gap-2 text-xs text-her-teal-600 hover:text-her-teal-700 transition-colors"
          >
            <Play size={12} />
            <span>Tap to Listen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
