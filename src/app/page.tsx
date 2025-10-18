'use client';

import React, { useState } from 'react';
import HeaderBar from '../components/HeaderBar';
import ChatWindow from '../components/ChatWindow';
import ScenarioTabs from '../components/ScenarioTabs';
import scenarioData from '../components/ScenarioContent';
import MicButton from '../components/MicButton';

// Add scenarios data
const scenarios = [
  { id: 'finance', title: '💰 Finance', icon: '💳', color: 'green' },
  { id: 'health', title: '🏥 Health', icon: '❤️', color: 'red' },
  { id: 'career', title: '💼 Career', icon: '📈', color: 'blue' },
  { id: 'safety', title: '🛡️ Safety', icon: '🔒', color: 'purple' },
  { id: 'success', title: '🌟 Success Stories', icon: '✨', color: 'yellow' }
];

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
  const [isRecording, setIsRecording] = useState(false);
  const [activeScenario, setActiveScenario] = useState('finance');
  const [messages, setMessages] = useState(scenarioData[activeScenario].messages);

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
      
      <div className="flex flex-1">
        <ScenarioTabs 
          scenarios={scenarios}
          activeScenario={activeScenario}
          onScenarioChange={setActiveScenario}
        />
        
        <div className="flex-1 ml-20">
          <ChatWindow 
            messages={messages}
            scenario={activeScenario}
            onPlayAudio={handlePlayAudio}
            onPlayResource={handlePlayResource}
          />
        </div>
      </div>
      
      <MicButton
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
      />
    </div>
  );
}
