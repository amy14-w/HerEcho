'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';
import Waveform from './Waveform';

interface AudioBubbleProps {
  isUser: boolean;
  audioSrc: string;
  duration: string;
  isPlaying?: boolean;
  onPlayPause: () => void;
}

const AudioBubble: React.FC<AudioBubbleProps> = ({ 
  isUser, 
  audioSrc, 
  duration, 
  isPlaying = false, 
  onPlayPause 
}) => {
  const gradientClass = isUser 
    ? 'bg-gradient-to-r from-her-purple-500 to-her-pink-500' 
    : 'bg-gradient-to-r from-her-teal-400 to-her-emerald-500';
  
  const glowClass = !isUser && isPlaying ? 'animate-glow' : '';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`${gradientClass} ${glowClass} rounded-2xl p-3 shadow-md text-white flex items-center gap-3 max-w-xs`}
      >
        <button
          onClick={onPlayPause}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          {isPlaying ? (
            <Pause size={16} className="text-white" />
          ) : (
            <Play size={16} className="text-white ml-0.5" />
          )}
        </button>
        
        <Waveform isPlaying={isPlaying} />
        
        <span className="text-xs opacity-80 font-medium">
          {duration}
        </span>
      </div>
    </div>
  );
};

export default AudioBubble;
