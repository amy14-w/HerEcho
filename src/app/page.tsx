"use client";

import React, { useState, useRef } from "react";
import CombinedHeader from "../components/CombinedHeader";
import ChatWindow from "../components/ChatWindow";
import ScenarioTabs from "../components/ScenarioTabs";
import scenarioData from "../components/ScenarioContent";
import MicButton from "../components/MicButton";
import IPhoneFrame from "../components/IPhoneFrame";

// Add scenarios data
const scenarios = [
  { id: "finance", title: "💰 Finance", icon: "💳", color: "green" },
  { id: "health", title: "🏥 Health", icon: "❤️", color: "red" },
  { id: "career", title: "💼 Career", icon: "📈", color: "blue" },
  { id: "safety", title: "🛡️ Safety", icon: "🔒", color: "purple" },
  { id: "success", title: "🌟 Success Stories", icon: "✨", color: "yellow" },
];

interface Message {
  id: number;
  sender: "user" | "ai";
  audioSrc: string;
  duration: string;
  resource?: {
    title: string;
    img: string;
    audioSrc: string;
    description: string;
  };
}

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [activeScenario, setActiveScenario] = useState("finance");
  const [scenarioMessages, setScenarioMessages] = useState<Record<string, Message[]>>({
    finance: scenarioData.finance.messages,
    health: scenarioData.health.messages,
    career: scenarioData.career.messages,
    safety: scenarioData.safety.messages,
    success: scenarioData.success.messages,
  });
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  // Get current messages for active scenario
  const messages = scenarioMessages[activeScenario] || [];

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const handleStartRecording = async () => {
    try {
      console.log("Browser:", navigator.userAgent); // Add this line
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);

        const duration = await estimateBlobDuration(blob);

        const newUserMessage: Message = {
          id: Date.now(),
          sender: "user",
          audioSrc: url,
          duration,
        };

        setScenarioMessages(prev => ({
          ...prev,
          [activeScenario]: [...prev[activeScenario], newUserMessage]
        }));

        // Simulate AI response after 2 seconds (can be replaced by real API)
        setTimeout(() => {
          const newAIMessage: Message = {
            id: Date.now() + 1,
            sender: "ai",
            audioSrc: "/audio/ai-response.mp3",
            duration: "0:24",
            resource:
              Math.random() > 0.5
                ? {
                    title: "🎓 Learning Resources",
                    img: "/img/resource-new.jpg",
                    audioSrc: "/audio/resource-new.mp3",
                    description: "Learn more about this topic",
                  }
                : undefined,
          };
          setScenarioMessages(prev => ({
            ...prev,
            [activeScenario]: [...prev[activeScenario], newAIMessage]
          }));
        }, 2000);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Could not start recording", err);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      // Stop all tracks to release mic
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
    }
  };

  // Estimate duration of audio blob by loading into an audio element
  const estimateBlobDuration = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const tempUrl = URL.createObjectURL(blob);
      const audio = new Audio(tempUrl);
      const cleanup = () => {
        URL.revokeObjectURL(tempUrl);
      };
      audio.addEventListener("loadedmetadata", () => {
        const seconds = Math.round(audio.duration || 0);
        const mm = Math.floor(seconds / 60);
        const ss = seconds % 60;
        cleanup();
        resolve(`${mm}:${ss.toString().padStart(2, "0")}`);
      });
      audio.addEventListener("error", () => {
        cleanup();
        resolve("0:00");
      });
    });
  };

  const handlePlayAudio = (messageId: number) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    if (playingAudioId === messageId) {
      // pause
      audioElRef.current?.pause();
      setPlayingAudioId(null);
      return;
    }

    // If another audio was playing, pause it first
    audioElRef.current?.pause();

    // Create or reuse audio element
    if (!audioElRef.current) {
      audioElRef.current = new Audio();
      audioElRef.current.onended = () => setPlayingAudioId(null);
    }

    audioElRef.current.src = message.audioSrc;
    audioElRef.current.play().catch((err) => console.error("Play failed", err));
    setPlayingAudioId(messageId);
  };

  const handlePlayResource = (messageId: number) => {
    console.log("Playing resource for message:", messageId);
    // In a real app, this would play resource audio
  };

  const handleScenarioChange = (scenarioId: string) => {
    setActiveScenario(scenarioId);
  };

  return (
    <IPhoneFrame>
      <div
        className="flex flex-col bg-gradient-to-b from-slate-50 to-slate-200"
        style={{
          width: "374px",
          height: "calc(812px - 40px)",
          overflow: "hidden",
        }}
      >
        <CombinedHeader />

        <div className="flex flex-1 min-h-0 relative">
          {/* Scenario tabs overlay - doesn't take up layout space */}
          <ScenarioTabs
            scenarios={scenarios}
            activeScenario={activeScenario}
            onScenarioChange={handleScenarioChange}
          />

          {/* Chat window uses full width */}
          <div className="flex-1 w-full">
            <ChatWindow
              messages={messages}
              scenario={activeScenario}
              onPlayAudio={handlePlayAudio}
              onPlayResource={handlePlayResource}
              playingAudioId={playingAudioId}
            />
          </div>
        </div>

        <MicButton
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
      </div>
    </IPhoneFrame>
  );
}
