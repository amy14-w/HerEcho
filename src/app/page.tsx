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
  const [messages, setMessages] = useState(
    scenarioData[activeScenario].messages
  );
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const fallbackIndexRef = useRef<number>(0);

  const handleStartRecording = async () => {
    try {
      console.log('Browser:', navigator.userAgent); // Add this line
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      transcriptRef.current = ''; // Clear previous transcript

      // Start speech recognition during recording
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          // Get the latest final transcript
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            transcriptRef.current += finalTranscript;
            console.log('Current transcript:', transcriptRef.current);
          }
        };

        recognition.onerror = (event: any) => {
          console.log('Recognition error:', event.error);
        };

        recognition.onend = () => {
          console.log('Recognition ended, final transcript:', transcriptRef.current);
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
          console.log('Speech recognition started');
        } catch (err) {
          console.error('Failed to start recognition:', err);
        }
      } else {
        console.warn('Speech recognition not available in this browser');
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Stop speech recognition and wait a moment for final results
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (err) {
            console.log('Recognition already stopped');
          }
        }

        // Wait 500ms for final recognition results to come through
        await new Promise(resolve => setTimeout(resolve, 500));

        const finalTranscript = transcriptRef.current.trim();
        console.log('Final transcript for this recording:', finalTranscript);

        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        const duration = await estimateBlobDuration(blob);

        const newUserMessage: Message = {
          id: Date.now(),
          sender: "user",
          audioSrc: url,
          duration,
        };

        setMessages((prev) => [...prev, newUserMessage]);

        // Show animated loading bubble for AI response
        const loadingId = Date.now() + 1;
        setMessages(prev => [...prev, {
          id: loadingId,
          sender: 'ai',
          audioSrc: '',
          duration: '',
        }]);

        try {
          const responseText = finalTranscript 
            ? generateSmartResponse(finalTranscript)
            : getFallbackResponse();
          
          console.log('Generating response for:', finalTranscript || '(no transcript)');
          console.log('Response:', responseText);
          
          const aiAudio = await generateBrowserTTS(responseText);
          
          if (aiAudio) {
            // Replace loading bubble with real AI response
            setMessages(prev => prev.map(m =>
              m.id === loadingId
                ? { ...m, audioSrc: aiAudio.url, duration: aiAudio.duration }
                : m
            ));
          } else {
            // Remove loading bubble if failed
            setMessages(prev => prev.filter(m => m.id !== loadingId));
          }
        } catch (err) {
          setMessages(prev => prev.filter(m => m.id !== loadingId));
          console.error('AI voice response failed', err);
        }

        // Clean up recognition reference
        recognitionRef.current = null;
        transcriptRef.current = '';
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
    // Speech recognition will be stopped in mediaRecorder.onstop
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

  // Fallback responses when speech recognition doesn't work
  const getFallbackResponse = (): string => {
    const responses = [
      "Let me share some career advice for women. Building a successful career starts with believing in yourself. Identify your strengths, set clear goals, and don't be afraid to ask for help or mentorship. Networking is key - connect with other women in your field. Keep learning new skills and stay adaptable to change.",
      "Here's some advice about starting a business. Many successful women entrepreneurs started small, often from home. Focus on solving a real problem for your customers. Create a simple business plan, start with minimal investment, and test your ideas before scaling. Your unique perspective as a woman can be your competitive advantage.",
      "Let me talk about financial independence. Start by creating a budget and tracking your expenses. Try to save at least 10 to 20 percent of your income. Learn basic financial literacy - understand credit, savings, and simple investments. Financial freedom gives you choices and security for you and your family.",
      "Education and learning are powerful tools. You don't need expensive degrees to learn valuable skills. Use free online resources, join community programs, and never stop learning. Even 15 to 20 minutes of learning each day can transform your future. Knowledge is power, and it's something no one can take away from you.",
      "Building confidence takes practice. Start with small steps outside your comfort zone. Celebrate your wins, no matter how small. Surround yourself with supportive people. Remember, every successful woman you admire once stood where you are now. You have unique talents - believe in them and share them with the world."
    ];
    
    const response = responses[fallbackIndexRef.current];
    fallbackIndexRef.current = (fallbackIndexRef.current + 1) % responses.length;
    return response;
  };

  // Generate smart responses based on what the user said
  const generateSmartResponse = (transcript: string): string => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Question words detection
    const isQuestion = /^(what|who|when|where|why|how|is|are|can|could|would|should|do|does|did|tell|give)/i.test(transcript);
    
    // Time/date questions
    if (lowerTranscript.match(/what (day|date|time)|today|now|current/)) {
      const today = new Date();
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      const fullDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      return `Today is ${dayName}, ${fullDate}. Is there anything else you'd like to know?`;
    }
    
    // Greetings
    if (lowerTranscript.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return "Hello! I'm HerEcho, your voice assistant. I can answer questions, provide information, and have conversations with you. What would you like to talk about?";
    }
    
    // "What are you doing" type questions
    if (lowerTranscript.match(/what (are you|you are) doing|what do you do/)) {
      return "I'm a voice assistant that can answer your questions and have conversations with you. I can help with information on many topics. What would you like to know?";
    }
    
    // Formula 1 or sports questions
    if (lowerTranscript.match(/formula (one|1)|f1|racing/)) {
      return "Formula One is the highest class of international racing for single-seater formula racing cars. Some popular teams include Red Bull Racing, Mercedes, Ferrari, McLaren, Aston Martin, Alpine, and Williams. Each team has two drivers competing for the championship. Is there anything specific about Formula One you'd like to know?";
    }
    
    // General sports questions
    if (lowerTranscript.match(/sports?|team|game|play/)) {
      return "Sports are a great topic! Whether it's Formula One, football, basketball, soccer, or any other sport, they bring excitement and community together. What sport are you interested in?";
    }
    
    // Weather questions
    if (lowerTranscript.match(/weather|temperature|rain|sunny/)) {
      return "I don't have access to real-time weather data, but you can check weather apps or websites for accurate forecasts. Is there anything else I can help you with?";
    }
    
    // Math questions
    if (lowerTranscript.match(/what is \d+|calculate|plus|minus|times|divided/)) {
      return "I can help with simple questions, but I don't have a calculator built in yet. For math calculations, you can use your phone's calculator or a website like WolframAlpha. What else can I do for you?";
    }
    
    // Music questions
    if (lowerTranscript.match(/music|song|artist|band|singer/)) {
      return "Music is wonderful! Whether you enjoy pop, rock, classical, hip-hop, or any genre, music brings joy and inspiration. What kind of music do you like?";
    }
    
    // Movie/TV questions
    if (lowerTranscript.match(/movie|film|show|tv|series|watch/)) {
      return "Movies and TV shows are great entertainment! There are so many genres to explore - action, drama, comedy, sci-fi, and more. What kind of content do you enjoy watching?";
    }
    
    // Food questions
    if (lowerTranscript.match(/food|recipe|cook|restaurant|eat|hungry/)) {
      return "Food is one of life's great pleasures! Whether you enjoy cooking at home or trying new restaurants, there's always something delicious to discover. What type of cuisine interests you?";
    }
    
    // Travel questions
    if (lowerTranscript.match(/travel|trip|vacation|visit|country|city/)) {
      return "Travel is an amazing way to experience new cultures and create memories. Whether exploring nearby or dreaming of distant destinations, the world has so much to offer. Where would you like to go?";
    }
    
    // Technology questions
    if (lowerTranscript.match(/technology|computer|phone|app|software|digital/)) {
      return "Technology shapes our modern world in fascinating ways. From smartphones to AI, innovation continues to transform how we live and work. What aspect of technology interests you?";
    }
    
    // Books/reading questions
    if (lowerTranscript.match(/book|read|novel|story|author/)) {
      return "Reading is a wonderful way to learn and escape into different worlds. Whether fiction or non-fiction, books open our minds to new ideas and perspectives. What do you like to read?";
    }
    
    // Hobby questions
    if (lowerTranscript.match(/hobby|hobbies|interest|free time|passion/)) {
      return "Hobbies are important for creativity and relaxation. Whether it's art, sports, gaming, crafts, or something else, pursuing what you enjoy enriches your life. What hobbies do you have?";
    }
    
    // Business/entrepreneurship topics
    if (lowerTranscript.match(/start.*business|entrepreneur|own business|small business/)) {
      return "Starting a business begins with identifying a problem you can solve. Research your market, create a simple plan, and start small. Test your idea with real customers before investing heavily. Many successful businesses started from home with minimal investment.";
    }
    
    // Money/finance topics
    if (lowerTranscript.match(/money|save|saving|budget|finance|invest/)) {
      return "Smart money management is important for everyone. Create a budget, track expenses, and try to save regularly. Build an emergency fund and learn about basic investing. Small consistent steps lead to big financial progress over time.";
    }
    
    // Career/job topics
    if (lowerTranscript.match(/career|job|work|employment|skill/)) {
      return "Building a strong career requires continuous learning and networking. Identify in-demand skills, take courses to improve abilities, and build a portfolio. Connect with others in your field and don't be afraid to start with entry-level positions to gain experience.";
    }
    
    // Education/learning topics
    if (lowerTranscript.match(/learn|education|study|course|school|training/)) {
      return "Education opens doors to opportunities. You don't always need formal schooling - explore free online courses from platforms like Coursera, Khan Academy, or YouTube. Set aside time daily for learning. It's never too late to start.";
    }
    
    // Health topics
    if (lowerTranscript.match(/health|wellness|exercise|mental health|stress/)) {
      return "Taking care of your health is essential. Start with small habits like walking daily and drinking water. Mental health is equally important - try meditation, journaling, or talking to someone. Get enough sleep and eat nutritious meals when possible.";
    }
    
    // Confidence/motivation topics
    if (lowerTranscript.match(/confidence|afraid|scared|motivation|believe/)) {
      return "Building confidence comes from taking small steps outside your comfort zone. Celebrate wins and learn from setbacks. Surround yourself with supportive people. Remember that everyone feels fear - courage is acting despite it. You are capable of more than you realize.";
    }
    
    // If it's a question but doesn't match any category, give a friendly response
    if (isQuestion) {
      return "That's an interesting question! I'd love to help, though I might not have all the answers. I can chat about many topics like sports, music, movies, food, travel, technology, and more. What else would you like to know?";
    }
    
    // Default response for general statements
    return "Thanks for sharing! I'm here to chat with you. Feel free to ask me questions about anything - sports, entertainment, hobbies, daily life, or whatever's on your mind. What would you like to talk about?";
  };

  // Generate speech using browser's Web Speech API
  const generateBrowserTTS = async (text: string): Promise<{ url: string, duration: string }> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.error('Browser TTS not supported');
        // Return a placeholder
        resolve({ url: '', duration: '0:05' });
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Wait for voices to load
      let voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          voices = speechSynthesis.getVoices();
          const femaleVoice = voices.find(v => 
            v.name.toLowerCase().includes('female') || 
            v.name.includes('Samantha') || 
            v.name.includes('Victoria') ||
            v.name.includes('Zira')
          );
          if (femaleVoice) utterance.voice = femaleVoice;
        };
      } else {
        const femaleVoice = voices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.includes('Samantha') || 
          v.name.includes('Victoria') ||
          v.name.includes('Zira')
        );
        if (femaleVoice) utterance.voice = femaleVoice;
      }

      // Create a silent audio element that plays during speech
      // This is a workaround since we can't directly record speech synthesis
      const duration = `0:${Math.min(Math.ceil(text.length / 12), 59).toString().padStart(2, '0')}`;
      
      // Store text for later playback
      const ttsUrl = `tts:${btoa(text)}`;
      
      resolve({ url: ttsUrl, duration });
    });
  };

  const handlePlayAudio = (messageId: number) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.audioSrc) return;

    if (playingAudioId === messageId) {
      audioElRef.current?.pause();
      if (message.audioSrc.startsWith('tts:')) {
        speechSynthesis.cancel();
      }
      setPlayingAudioId(null);
      return;
    }

    audioElRef.current?.pause();
    speechSynthesis.cancel();

    // Handle browser TTS playback
    if (message.audioSrc.startsWith('tts:')) {
      const text = atob(message.audioSrc.substring(4));
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingAudioId(null);
      
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.includes('Samantha') || 
        v.name.includes('Victoria') ||
        v.name.includes('Zira')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      speechSynthesis.speak(utterance);
      setPlayingAudioId(messageId);
      return;
    }

    // Handle regular audio playback
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
    setMessages(scenarioData[scenarioId].messages);
  };

  return (
    <IPhoneFrame>
      <div 
        className="flex flex-col bg-gradient-to-b from-slate-50 to-slate-200"
        style={{ 
          width: '374px', 
          height: 'calc(812px - 40px)',
          overflow: 'hidden'
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
