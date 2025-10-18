"use client";

import React from "react";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface MicButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  return (
    <div className="flex justify-center py-3 relative">
      <motion.button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        style={{
          background: isRecording
            ? "#D13955"
            : "linear-gradient(135deg, #C44C18 0%, #F0A224 100%)",
          boxShadow: isRecording
            ? "0 10px 25px rgba(209, 57, 85, 0.5)"
            : "0 10px 25px rgba(196, 76, 24, 0.3)",
          animation: isRecording
            ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            : "none",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isRecording ? (
          <MicOff size={22} className="text-white" />
        ) : (
          <Mic size={22} className="text-white" />
        )}
      </motion.button>

      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white px-2 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: "#D13955" }}
        >
          Recording...
        </motion.div>
      )}
    </div>
  );
};

export default MicButton;
