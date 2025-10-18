'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioBubble from './AudioBubble';
import ResourceCard from './ResourceCard';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  audioSrc: string;
  duration: string;
  resource?: {
    title: string;
    img: string;
    audioSrc: string;
  };
}

interface ChatWindowProps {
  messages: Message[];
  scenario?: string;
  onPlayAudio?: (messageId: number) => void;
  onPlayResource?: (messageId: number) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, scenario, onPlayAudio, onPlayResource }) => {
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [playingResourceId, setPlayingResourceId] = useState<number | null>(null);

  const handlePlayPause = (messageId: number) => {
    if (playingAudioId === messageId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(messageId);
    }
    onPlayAudio?.(messageId);
  };

  const handlePlayResource = (messageId: number) => {
    if (playingResourceId === messageId) {
      setPlayingResourceId(null);
    } else {
      setPlayingResourceId(messageId);
    }
    onPlayResource?.(messageId);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-slate-50 to-slate-200">
      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AudioBubble
                isUser={message.sender === 'user'}
                audioSrc={message.audioSrc}
                duration={message.duration}
                isPlaying={playingAudioId === message.id}
                onPlayPause={() => handlePlayPause(message.id)}
              />
              
              {message.resource && message.sender === 'ai' && (
                <div className="flex justify-start">
                  <ResourceCard
                    title={message.resource.title}
                    img={message.resource.img}
                    audioSrc={message.resource.audioSrc}
                    onPlay={() => handlePlayResource(message.id)}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatWindow;
