"use client";

import React, { useState, useRef } from "react";
import CombinedHeader from "../../components/CombinedHeader";
import ChatWindow from "../../components/ChatWindow";
import ScenarioTabs from "../../components/ScenarioTabs";
import scenarioData from "../../components/ScenarioContent";
import MicButton from "../../components/MicButton";
import IPhoneFrame from "../../components/IPhoneFrame";

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
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const fallbackIndexRef = useRef<number>(0);
  const lastLangRef = useRef<"es" | "en" | null>(null);

    // Helpers: fallback responses, smart responses, and browser TTS
    const getFallbackResponse = (): string => {
        const responses = [
          "Let me share some career advice. Believe in yourself, set clear goals, and seek mentorship. Keep learning and build supportive networks.",
          "Thinking about starting a business? Start small, solve a real problem, test your idea, and iterate with feedback.",
          "For financial wellbeing, track spending, budget, save regularly, and learn basic investing once you have an emergency fund.",
          "Learning never stops. Use free resources and make small daily progress—consistency compounds.",
          "Confidence grows with action. Take small steps outside your comfort zone, celebrate wins, and learn from setbacks.",
        ];
        const i = fallbackIndexRef.current;
        fallbackIndexRef.current = (i + 1) % responses.length;
        return responses[i];
      };
    
      const generateSmartResponse = (transcript: string): string => {
        const lower = transcript.toLowerCase();
        // Accent-insensitive version for Spanish matching
        const lowerNoAcc = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
        // Helper to test both accented and unaccented forms
        const hasES = (acc: RegExp, noAcc: RegExp) => acc.test(lower) || noAcc.test(lowerNoAcc);
    
        // Detect Spanish: accented chars/punctuation OR common words (supports unaccented typing like 'pelicula')
        const isSpanish =
          /[áéíóúñü¿¡]/.test(lower) ||
          /\b(qué|como|hola|buenos días|buenas tardes|buenas noches|dinero|trabajo|salud|confianza|educación|aprender|comida|viajar|película|música|artista|libro|hobby|finanzas|ahorrar|invertir|presupuesto|familia|amigos|ayuda|consejo|emprender|empresa|negocio|motivar|creer|futuro|éxito|felicidad|problema|solución|apoyo|red|mujer|mujeres)\b/.test(lower) ||
          /\b(que|como|hola|buenos dias|buenas tardes|buenas noches|dinero|trabajo|salud|confianza|educacion|aprender|comida|viajar|pelicula|musica|artista|libro|hobby|finanzas|ahorrar|invertir|presupuesto|familia|amigos|ayuda|consejo|emprender|empresa|negocio|motivar|creer|futuro|exito|felicidad|problema|solucion|apoyo|red|mujer|mujeres)\b/.test(lowerNoAcc);
    
        // Detect strong English signals (common English-only words)
        const isEnglish = /\b(money|save|saving|budget|invest|career|job|work|health|wellness|confidence|afraid|scared|movie|film|music|song|food|recipe|travel|trip|technology|computer|phone|book|read|hobby)\b/.test(lower);
    
        // Update language memory based on current input
        if (isSpanish) {
          lastLangRef.current = "es";
        } else if (isEnglish) {
          lastLangRef.current = "en";
        }
    
        // Use Spanish if current input is Spanish OR (last was Spanish AND current is not clearly English)
        if (isSpanish || (lastLangRef.current === "es" && !isEnglish)) {
          // Spanish topic responses
          if (hasES(/\b(dinero|finanzas|ahorrar|invertir|presupuesto|gastar|ingreso|deuda|crédito|banco|riqueza)\b/, /\b(dinero|finanzas|ahorrar|invertir|presupuesto|gastar|ingreso|deuda|credito|banco|riqueza)\b/)) {
            return "Para el bienestar financiero, lleva un registro de tus gastos, haz un presupuesto, ahorra regularmente y aprende lo básico sobre inversiones. Si quieres consejos sobre ahorro, inversión o manejo de dinero, ¡pregúntame!";
          }
          if (hasES(/\b(trabajo|carrera|empleo|habilidad|profesión)\b/, /\b(trabajo|carrera|empleo|habilidad|profesion)\b/)) {
            return "Desarrolla tu carrera aprendiendo habilidades en demanda, creando un portafolio y haciendo networking intencional.";
          }
          if (hasES(/\b(empresa|negocio|emprender)\b/, /\b(empresa|negocio|emprender)\b/)) {
            return "¿Quieres emprender? Identifica un problema real, valida con clientes, empieza pequeño y mejora constantemente.";
          }
          if (hasES(/\b(educación|aprender|estudio|curso|escuela|formación)\b/, /\b(educacion|aprender|estudio|curso|escuela|formacion)\b/)) {
            return "Usa cursos gratuitos en línea; 15–20 minutos al día suman mucho.";
          }
          if (hasES(/\b(salud|bienestar|ejercicio|mental|estrés)\b/, /\b(salud|bienestar|ejercicio|mental|estres)\b/)) {
            return "Empieza con pequeños hábitos: caminatas diarias, hidratación, sueño y mindfulness sencillo ayudan mucho.";
          }
          if (hasES(/\b(confianza|miedo|motivación|creer)\b/, /\b(confianza|miedo|motivacion|creer)\b/)) {
            return "La confianza se construye con acción. Da un pequeño paso hoy y sigue avanzando.";
          }
          if (hasES(/\b(música|canción|artista|banda|cantante)\b/, /\b(musica|cancion|artista|banda|cantante)\b/)) {
            return "¡La música es maravillosa! ¿Qué géneros o artistas te gustan?";
          }
          if (hasES(/\b(película|cine|serie|ver)\b/, /\b(pelicula|cine|serie|ver)\b/)) {
            return "¡Las películas y series son geniales! ¿Qué género te gusta últimamente?";
          }
          if (hasES(/\b(comida|receta|cocinar|restaurante|comer|hambre)\b/, /\b(comida|receta|cocinar|restaurante|comer|hambre)\b/)) {
            return "Hablar de comida es lo mejor—¿qué tipo de cocina te gusta?";
          }
          if (hasES(/\b(viajar|viaje|vacaciones|visitar|país|ciudad)\b/, /\b(viajar|viaje|vacaciones|visitar|pais|ciudad)\b/)) {
            return "Viajar abre la mente—¿a dónde te gustaría ir?";
          }
          if (hasES(/\b(tecnología|computadora|teléfono|app|software|digital)\b/, /\b(tecnologia|computadora|telefono|app|software|digital)\b/)) {
            return "La tecnología avanza rápido—¿qué parte te interesa?";
          }
          if (hasES(/\b(libro|leer|novela|historia|autor)\b/, /\b(libro|leer|novela|historia|autor)\b/)) {
            return "A mí también me encanta leer—¿qué tipo de libros disfrutas?";
          }
          if (hasES(/\b(hobby|afición|interés|tiempo libre|pasión)\b/, /\b(hobby|aficion|interes|tiempo libre|pasion)\b/)) {
            return "Los hobbies alimentan la creatividad—¿qué te gusta hacer para divertirte?";
          }
          if (hasES(/^(qué|quién|cuándo|dónde|por qué|cómo|es|son|puedo|podría|debería|hago|haces|haz|dime|da)\b/, /^(que|quien|cuando|donde|por que|como|es|son|puedo|podria|deberia|hago|haces|haz|dime|da)\b/)) {
            return "¡Buena pregunta! Puedo conversar sobre muchos temas—¿qué te gustaría explorar?";
          }
          return "¡Gracias por compartir! Pregúntame lo que quieras—estoy aquí para conversar.";
        }
    
        // English responses (as before)
        // ...existing code...
        if (/(what (day|date|time)|today|now|current)/.test(lower)) {
          const d = new Date();
          const day = d.toLocaleDateString("en-US", { weekday: "long" });
          const full = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
          return `Today is ${day}, ${full}. Anything else you'd like to know?`;
        }
        if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(lower)) {
          return "Hello! I can answer questions and chat about lots of topics. What’s on your mind?";
        }
        if (/what (are you|you are) doing|what do you do/.test(lower)) {
          return "I'm your voice companion—I can listen, respond, and share helpful info. Ask me anything!";
        }
        if (/formula (one|1)|\bf1\b|racing/.test(lower)) {
          return "Some F1 teams include Red Bull Racing, Mercedes, Ferrari, McLaren, Aston Martin, Alpine, and Williams.";
        }
    
        // Finance topics
        if (/money|save|saving|budget|financ(e|es|ial|ing)?|invest|expense|spend|income|debt|credit|bank|wealth/.test(lower)) {
          return "For financial wellbeing, track spending, budget, save regularly, and learn basic investing once you have an emergency fund. If you want tips on saving, investing, or managing money, just ask!";
        }
        if (/career|job|work|employment|skill/.test(lower)) {
          return "Grow your career by learning in-demand skills, creating a small portfolio, and networking intentionally.";
        }
        if (/learn|education|study|course|school|training/.test(lower)) {
          return "Use free online courses; 15–20 minutes a day adds up fast.";
        }
        if (/health|wellness|exercise|mental health|stress/.test(lower)) {
          return "Start small: daily walks, hydration, sleep, and simple mindfulness help a lot.";
        }
        if (/confidence|afraid|scared|motivation|believe/.test(lower)) {
          return "Confidence comes from action. Take a small step today and build momentum.";
        }
        
        // Technology topics
        if (/technology|tech|computer|phone|app|software|digital|coding|programming|ai|artificial intelligence/.test(lower)) {
          return "Tech is moving fast—what part of it interests you? I can chat about AI, programming, apps, or general tech topics!";
        }
        
        // AI-specific questions
        if (/ai.*improv|artificial intelligence.*improv|ai.*lately|ai.*recent|ai.*advance|ai.*progress|ai.*development/.test(lower)) {
          return "AI has made huge strides lately! We've seen major improvements in language models like GPT and Claude, better image generation, AI coding assistants, and more practical AI tools for everyday tasks. Multimodal AI that understands both text and images is becoming mainstream. What aspect of AI interests you most?";
        }
        
        // Entertainment
        if (/music|song|artist|band|singer/.test(lower)) {
          return "Some popular music artists right now include Taylor Swift, BTS, Billie Eilish, Drake, and Olivia Rodrigo. What genres or artists do you enjoy?";
        }
        if (/movie|film|show|tv|series|watch/.test(lower)) {
          return "Some of the most popular movies and shows right now include 'Oppenheimer', 'Barbie', 'The Last of Us', and 'Succession'. What are you watching these days?";
        }
        if (/food|recipe|cook|restaurant|eat|hungry/.test(lower)) {
          return "Some popular Italian dishes include pasta, pizza, risotto, and tiramisu. What’s your favorite cuisine?";
        }
        if (/travel|trip|vacation|visit|country|city/.test(lower)) {
          return "Some of the most visited travel destinations recently include Paris, Bali, Tokyo, New York City, and Rome. Where would you like to go?";
        }
        if (/technology|computer|phone|app|software|digital/.test(lower)) {
          return "Tech is moving fast—what part of it interests you?";
        }
        if (/book|read|novel|story|author/.test(lower)) {
          return "I love reading too—what kinds of books do you enjoy?";
        }
        if (/hobby|hobbies|interest|free time|passion/.test(lower)) {
          return "When it comes to hobbies, a lot of people enjouy activities like painting, hiking, cooking, playing musical instruments, or gardening. What do you like to do for fun?";
        }
    
        // Generic question fallback
        if (/^(what|who|when|where|why|how|is|are|can|could|would|should|do|does|did|tell|give)\b/i.test(transcript)) {
          return "Good question! I can chat about lots of topics—what would you like to explore?";
        }
        return "Thanks for sharing! Ask me anything—I'm here to chat.";
      };
    
      // UTF-8 safe Base64 helpers
      const toBase64 = (str: string) => {
        try {
          return btoa(unescape(encodeURIComponent(str)));
        } catch {
          // Fallback using TextEncoder if available
          const bytes = new TextEncoder().encode(str);
          let binary = "";
          bytes.forEach((b) => (binary += String.fromCharCode(b)));
          return btoa(binary);
        }
      };
      const fromBase64 = (b64: string) => {
        try {
          return decodeURIComponent(escape(atob(b64)));
        } catch {
          const binary = atob(b64);
          const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
          return new TextDecoder().decode(bytes);
        }
      };
    
      const generateBrowserTTS = async (
        text: string
      ): Promise<{ url: string; duration: string }> => {
        return new Promise((resolve) => {
          if (!("speechSynthesis" in window)) {
            console.error("Browser TTS not supported");
            resolve({ url: "", duration: "0:05" });
            return;
          }
          const duration = `0:${Math.min(Math.ceil(text.length / 12), 59)
            .toString()
            .padStart(2, "0")}`;
          // Encode text into a pseudo-URL and speak it later via SpeechSynthesis (UTF-8 safe)
          const ttsUrl = `tts:${toBase64(text)}`;
          resolve({ url: ttsUrl, duration });
        });
      };

  const handleStartRecording = async () => {
    try {
      console.log("Browser:", navigator.userAgent); // Add this line
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      transcriptRef.current = "";

      // Start speech recognition during recording (if available)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          if (finalTranscript) {
            transcriptRef.current += finalTranscript;
            console.log("Current transcript:", transcriptRef.current);
          }
        };

        recognition.onerror = (event: any) => {
          console.log("Recognition error:", event.error);
        };

        recognition.onend = () => {
          console.log("Recognition ended, final transcript:", transcriptRef.current);
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
          console.log("Speech recognition started");
        } catch (err) {
          console.error("Failed to start recognition:", err);
        }
      } else {
        console.warn("Speech recognition not available in this browser");
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
            console.log("Recognition already stopped");
          }
        }

        // small delay for final recognition results
        await new Promise((resolve) => setTimeout(resolve, 500));

        const finalTranscript = transcriptRef.current.trim();
        console.log("Final transcript for this recording:", finalTranscript);

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
        setTimeout(async () => {
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
  
          // Add a temporary AI loading bubble to mimic previous UX
          const loadingId = Date.now() + 1;
          setScenarioMessages((prev) => ({
            ...prev,
            [activeScenario]: [
              ...prev[activeScenario],
              { id: loadingId, sender: "ai", audioSrc: "", duration: "" },
            ],
          }));
  
          try {
            const responseText = finalTranscript
              ? generateSmartResponse(finalTranscript)
              : getFallbackResponse();
            console.log("Generating response for:", finalTranscript || "(no transcript)");
            console.log("Response:", responseText);
  
            const aiAudio = await generateBrowserTTS(responseText);
            // Replace loading bubble with real AI response
            setScenarioMessages((prev) => ({
              ...prev,
              [activeScenario]: prev[activeScenario].map((m) =>
                m.id === loadingId
                  ? { ...m, audioSrc: aiAudio.url, duration: aiAudio.duration }
                  : m
              ),
            }));
          } catch (err) {
            console.error("AI voice response failed", err);
          } finally {
            recognitionRef.current = null;
            transcriptRef.current = "";
          }
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
      if (!message || !message.audioSrc) return;
  
      // Toggle off
      if (playingAudioId === messageId) {
        audioElRef.current?.pause();
        if (message.audioSrc.startsWith("tts:")) {
          speechSynthesis.cancel();
        }
        setPlayingAudioId(null);
        return;
      }
  
      // Stop anything currently playing
      audioElRef.current?.pause();
      speechSynthesis.cancel();
  
      // Handle browser TTS pseudo-URL
      if (message.audioSrc.startsWith("tts:")) {
        const text = fromBase64(message.audioSrc.substring(4));
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onend = () => setPlayingAudioId(null);
  
        const chooseSpanishVoice = (): SpeechSynthesisVoice | undefined => {
          const voices = speechSynthesis.getVoices();
          return (
            voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("es")) ||
            voices.find((v) => /spanish|español/i.test(v.name))
          );
        };
  
        // Detect if the TTS text is Spanish (accent-insensitive too)
        const textLower = text.toLowerCase();
        const textLowerNoAcc = textLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const isSpanishTTS = /[áéíóúñü¿¡]|\b(qué|como|hola|dinero|trabajo|salud|confianza|educación|aprender|comida|viajar|película|música|artista|finanzas|ahorrar|invertir|presupuesto|empresa|negocio|emprender)\b/i.test(textLower) ||
          /\b(que|como|hola|dinero|trabajo|salud|confianza|educacion|aprender|comida|viajar|pelicula|musica|artista|finanzas|ahorrar|invertir|presupuesto|empresa|negocio|emprender)\b/i.test(textLowerNoAcc);
  
        const speakNow = () => {
          if (isSpanishTTS) {
            const v = chooseSpanishVoice();
            if (v) {
              utterance.voice = v;
              utterance.lang = v.lang || "es-ES";
            } else {
              utterance.lang = "es-ES";
            }
          } else {
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(
              (v) =>
                v.name.toLowerCase().includes("female") ||
                v.name.includes("Samantha") ||
                v.name.includes("Victoria") ||
                v.name.includes("Zira")
            );
            if (femaleVoice) utterance.voice = femaleVoice;
          }
          speechSynthesis.speak(utterance);
        };
  
        // Some browsers load voices asynchronously
        if (!speechSynthesis.getVoices().length) {
          const prev = speechSynthesis.onvoiceschanged;
          speechSynthesis.onvoiceschanged = () => {
            speechSynthesis.onvoiceschanged = prev || null;
            speakNow();
          };
        } else {
          speakNow();
        }
  
        setPlayingAudioId(messageId);
        return;
      }
  
      // Regular audio playback
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