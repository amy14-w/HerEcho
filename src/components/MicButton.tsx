'use client';

import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface MicButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ isRecording, onStartRecording, onStopRecording }) => {
  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center">
      <motion.button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center shadow-lg
          transition-all duration-300 transform hover:scale-105 active:scale-95
          ${isRecording 
            ? 'bg-red-500 animate-pulse-slow shadow-red-500/50' 
            : 'bg-gradient-to-r from-her-purple-500 to-her-pink-500 hover:shadow-purple-500/50'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isRecording ? (
          <MicOff size={24} className="text-white" />
        ) : (
          <Mic size={24} className="text-white" />
        )}
      </motion.button>
      
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium"
        >
          Recording...
        </motion.div>
      )}
    </div>
  );
};

export default MicButton;
