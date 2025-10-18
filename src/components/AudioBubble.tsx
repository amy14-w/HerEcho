"use client";

import React, { useState } from "react";
import { Play, Pause, Users, X, Check, Share2, Mic } from "lucide-react";
import Waveform from "./Waveform";

// TypeScript declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface AudioBubbleProps {
  isUser: boolean;
  audioSrc: string;
  duration: string;
  isPlaying?: boolean;
  onPlayPause: () => void;
  onResendToContacts?: () => void;
}

const AudioBubble: React.FC<AudioBubbleProps> = ({
  isUser,
  audioSrc,
  duration,
  isPlaying = false,
  onPlayPause,
  onResendToContacts,
}) => {
  const [showResendMenu, setShowResendMenu] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showSentAnimation, setShowSentAnimation] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const gradientStyle = isUser
    ? { background: "linear-gradient(135deg, #D13955 0%, #FCA6AF 100%)" }
    : { background: "linear-gradient(135deg, #C44C18 0%, #EE6F34 100%)" };

  const glowClass = !isUser && isPlaying ? "animate-glow" : "";

  const handleDoubleClick = () => {
    if (onResendToContacts) {
      setShowResendMenu(true);
    }
  };

  const handleResend = () => {
    setShowResendMenu(false);
    setShowContactPicker(true);
  };

  const handleSendToContact = (contactName: string) => {
    console.log(`Sending to ${contactName}`);
    onResendToContacts?.();
    setShowContactPicker(false);
    // Show sent animation
    setShowSentAnimation(true);
    setTimeout(() => {
      setShowSentAnimation(false);
    }, 2000);
  };

  const handleVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setRecognizedText('');
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setRecognizedText(transcript);
        
        // Find matching contact
        const contactMap = {
          'mom': 'Mom',
          'mother': 'Mom',
          'sister': 'Sister',
          'brother': 'Brother',
          'situationship': 'Situationship',
          'best friend': 'Best Friend',
          'friend': 'Best Friend',
          'mentor': 'Mentor'
        };
        
        const matchedContact = Object.keys(contactMap).find(key => 
          transcript.includes(key)
        );
        
        if (matchedContact) {
          const contactName = contactMap[matchedContact];
          handleSendToContact(contactName);
        } else {
          alert('Contact not recognized. Please say: Mom, Sister, Brother, Situationship, Best Friend, or Mentor');
        }
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        alert('Speech recognition failed. Please try again.');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const contacts = [
    { name: "Mom", color: "bg-pink-100 text-pink-700" },
    { name: "Sister", color: "bg-purple-100 text-purple-700" },
    { name: "Brother", color: "bg-blue-100 text-blue-700" },
    { name: "Situationship", color: "bg-red-100 text-red-700" },
    { name: "Best Friend", color: "bg-green-100 text-green-700" },
    { name: "Mentor", color: "bg-yellow-100 text-yellow-700" },
  ];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 relative`}>
      <div
        className={`${glowClass} rounded-2xl p-3 shadow-md text-white flex items-center gap-3 cursor-pointer`}
        style={{
          maxWidth: "320px",
          ...gradientStyle,
        }}
        onDoubleClick={handleDoubleClick}
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

        <span className="text-xs opacity-80 font-medium">{duration}</span>
      </div>
      {/* Resend Menu Popup */}
      {showResendMenu && (
        <div className="absolute top-0 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-20">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <Share2 size={16} />
            <span className="text-sm font-medium">Resend to Contacts</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResend}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center gap-1"
            >
              <Users size={14} />
              Choose Contact
            </button>
            <button
              onClick={() => setShowResendMenu(false)}
              className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Contact Picker Modal */}
      {showContactPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Send to Contact</h3>
              <button
                onClick={() => setShowContactPicker(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-2">
              {contacts.map((contact) => (
                <button
                  key={contact.name}
                  onClick={() => handleSendToContact(contact.name)}
                  className={`w-full p-3 rounded-xl ${contact.color} hover:opacity-80 transition-all flex items-center justify-center text-left`}
                >
                  <span className="font-medium">{contact.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowContactPicker(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVoiceRecognition}
                  className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  <Mic size={14} />
                  {isListening ? 'Listening...' : 'Say Contact'}
                </button>
              </div>
              {recognizedText && (
                <div className="mt-2 text-center text-sm text-gray-600">
                  Heard: "{recognizedText}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Sent Animation */}
      {showSentAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <Check size={20} />
            <span className="font-semibold">Sent to {recognizedText || 'Contact'}!</span>
          </div>
          
          {/* Explosion particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-50px)`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioBubble;
