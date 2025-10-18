'use client';

import React, { useState } from 'react';
import HeaderBar from '../components/HeaderBar';
import ChatWindow from '../components/ChatWindow';
import MicButton from '../components/MicButton';
import { sampleMessages } from '../data/sampleMessages';

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording for demo
    setTimeout(() => {
      handleStopRecording();
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Add new user message with proper ID
    const newUserMessage: Message = {
      id: Date.now(), // Use timestamp for unique ID
      sender: 'user',
      audioSrc: '/audio/user-new.mp3',
      duration: '0:08'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Simulate AI response after 2 seconds
    setTimeout(() => {
      const newAIMessage: Message = {
        id: Date.now() + 1, // Ensure unique ID
        sender: 'ai',
        audioSrc: '/audio/ai-response.mp3',
        duration: '0:24',
        resource: Math.random() > 0.5 ? {
          title: '🎓 Learning Resources',
          img: '/img/resource-new.jpg',
          audioSrc: '/audio/resource-new.mp3'
        } : undefined
      };
      
      setMessages(prev => [...prev, newAIMessage]);
    }, 2000);
  };

  const handlePlayAudio = (messageId: number) => {
    console.log('Playing audio for message:', messageId);
    // In a real app, this would control actual audio playback
  };

  const handlePlayResource = (messageId: number) => {
    console.log('Playing resource for message:', messageId);
    // In a real app, this would play resource audio
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-200">
      <HeaderBar />
      
      <ChatWindow 
        messages={messages}
        onPlayAudio={handlePlayAudio}
        onPlayResource={handlePlayResource}
      />
      
      <MicButton
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
      />
    </div>
  );
}
