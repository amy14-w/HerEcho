'use client';

import React from 'react';
import Link from 'next/link';
import Waveform from '../components/Waveform';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 overflow-hidden">
      {/* Header - EXACTLY like your app */}
      <header 
        className="px-4 py-4 flex-shrink-0"
        style={{ backgroundColor: "#562915", minHeight: "75px" }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Left Side - App Branding (exactly like your app) */}
          <div className="flex items-center">
            {/* App Branding */}
            <div className="flex items-center gap-4">
              {/* Mic Icon as Avatar - BIGGER */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#FCA6AF" }}
              >
                <span style={{ fontSize: "24px" }}>🎤</span>
              </div>

              {/* App Name - EXACT same styling */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <span
                    style={{
                      color: "#FFEAD5",
                      fontFamily: "Crimson Text, serif",
                    }}
                  >
                    HER
                  </span>
                  <span
                    style={{
                      color: "#D23955",
                      fontFamily: "Agbalumo, cursive",
                    }}
                  >
                    ECHO
                  </span>
                </h1>
                <p className="text-sm" style={{ color: "#FFEAD5", opacity: 0.8 }}>
                  Voice Learning Assistant
                </p>
              </div>
            </div>
            </div>

          {/* Right Side - Navigation Links */}
          <nav className="flex gap-6">
            <a href="#features" className="text-white hover:text-white/80 transition-colors text-sm">Features</a>
            <a href="#about" className="text-white hover:text-white/80 transition-colors text-sm">About</a>
          </nav>
        </div>
      </header>

      {/* Main Content - Full Height */}
      {/* Main Content - Full Height */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start h-full">
          {/* Left Side - Content */}
          <div className="flex-1 space-y-6 lg:space-y-8">
            <div className="space-y-4 lg:space-y-6">
              {/* Main Title with Gradient */}
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span 
                  className="block"
                  style={{
                    background: "linear-gradient(135deg, #FCA6AF 0%, #D13955 50%, #EE6F34 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "0 4px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  HerEcho
                </span>
                <span 
                  className="block text-2xl lg:text-3xl xl:text-4xl font-semibold mt-2"
                  style={{
                    background: "linear-gradient(135deg, #C44C18 0%, #F0A224 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  Voice Learning Assistant
                </span>
              </h1>
              
              {/* Impactful Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-700 font-semibold leading-relaxed">
                🚀 <span className="font-bold">Transform</span> your voice into <span className="font-bold text-pink-600">power</span>
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Break barriers. Build confidence. Create change. <br/>
                <span className="font-semibold text-orange-600">One conversation at a time.</span>
              </p>
            </div>

            {/* Innovative CTA Section */}
            <div className="space-y-4 lg:space-y-6">
              {/* Primary CTA */}
              <div className="relative group">
                <Link 
                  href="/demo"
                  className="relative inline-block text-white px-8 lg:px-12 py-4 lg:py-5 rounded-full text-lg lg:text-xl font-bold hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #C44C18 0%, #F0A224 100%)",
                    boxShadow: "0 15px 35px rgba(196, 76, 24, 0.4)"
                  }}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Button Content */}
                  <span className="relative flex items-center gap-3">
                    <span className="text-2xl">🎤</span>
                    <span>Start Your Voice Journey</span>
                    <span className="text-xl">→</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Features as Written Text */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">✨ Key Features</h3>
              <ul className="space-y-2 text-gray-700 text-base">
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span>
                  <span>Voice-Only Interaction: Engage in conversations using just your voice.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span>
                  <span>AI-Powered Responses: Get intelligent and empathetic feedback.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Scenario-Based Learning: Practice in various real-life situations.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Resource Integration: Access helpful information and support.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Confidential & Safe: A secure space for women to learn and grow.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Phone Mockup */}
          <div className="flex-1 flex justify-center items-start pt-8">
            <div className="relative">
              {/* Phone Frame - More Realistic */}
              <div 
                className="bg-black rounded-[2.5rem] p-1 shadow-2xl"
                style={{
                  width: "300px",
                  height: "600px",
                  maxWidth: "100%",
                  maxHeight: "100%"
                }}
              >
                <div 
                  className="bg-white rounded-[2rem] overflow-hidden relative h-full"
                  style={{
                    width: "calc(100% - 8px)",
                    height: "calc(100% - 8px)"
                  }}
                >
                  {/* Dynamic Island */}
                  <div 
                    className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black rounded-full z-50"
                    style={{
                      width: "min(120px, 20vw)",
                      height: "min(30px, 4vh)",
                    }}
                  />
                  
                  {/* App Preview - Using Real Components */}
                  <div className="w-full h-full pt-12 bg-gradient-to-b from-slate-50 to-slate-200">
                    <div className="p-4 space-y-4">
                      {/* Header - Exact Copy from Your App */}
                      <div 
                        className="px-4 py-4"
                        style={{ backgroundColor: "#562915", minHeight: "75px" }}
                      >
                        <div className="flex items-center justify-between h-full">
                          <div className="flex items-center">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "#FCA6AF" }}
                              >
                                <span style={{ fontSize: "14px" }}>🎤</span>
                              </div>
                              <div className="flex flex-col">
                                <h1 className="text-sm font-bold flex items-center gap-1">
                                  <span
                                    style={{
                                      color: "#FFEAD5",
                                      fontFamily: "Crimson Text, serif",
                                    }}
                                  >
                                    HER
                                  </span>
                                  <span
                                    style={{
                                      color: "#D23955",
                                      fontFamily: "Agbalumo, cursive",
                                    }}
                                  >
                                    ECHO
                                  </span>
                                </h1>
                                <p className="text-xs" style={{ color: "#FFEAD5", opacity: 0.8 }}>
                                  Voice Learning Assistant
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Chat Area */}
                      <div className="px-4 py-2 space-y-3">
                        {/* User Message - Real AudioBubble Style */}
                        <div className="flex justify-end mb-4 relative w-full px-2">
                          <div
                            className="rounded-2xl p-3 shadow-md text-white flex items-center gap-3 cursor-pointer w-full max-w-full"
                            style={{
                              background: "linear-gradient(135deg, #D13955 0%, #FCA6AF 100%)"
                            }}
                          >
                            <button className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                              <span className="text-white text-xs">▶</span>
                            </button>
                            <Waveform isPlaying={false} className="flex-1 min-w-0" />
                            <span className="text-xs opacity-80 font-medium">0:15</span>
                          </div>
                        </div>
                        
                        {/* AI Message - Real AudioBubble Style */}
                        <div className="flex justify-start mb-4 relative w-full px-2">
                          <div
                            className="rounded-2xl p-3 shadow-md text-white flex items-center gap-3 cursor-pointer w-full max-w-full"
                            style={{
                              background: "linear-gradient(135deg, #C44C18 0%, #EE6F34 100%)"
                            }}
                          >
                            <button className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                              <span className="text-white text-xs">▶</span>
                            </button>
                            <Waveform isPlaying={true} className="flex-1 min-w-0" />
                            <span className="text-xs opacity-80 font-medium">0:24</span>
                          </div>
                        </div>

                      
                      {/* Mic Button Preview */}
                      <div className="flex justify-center pt-2 lg:pt-3">
                        <div 
                          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-lg"
                          style={{
                            background: "linear-gradient(135deg, #C44C18 0%, #F0A224 100%)",
                            boxShadow: "0 10px 25px rgba(196, 76, 24, 0.3)"
                          }}
                        >
                          <span className="text-white text-sm lg:text-base">🎤</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                            
              {/* Floating Demo Button */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <Link 
                  href="/demo"
                  className="text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                  style={{
                    background: "linear-gradient(135deg, #C44C18 0%, #F0A224 100%)",
                    boxShadow: "0 10px 25px rgba(196, 76, 24, 0.3)"
                  }}
                >
                  Try Demo →
                </Link>
              </div>
              

            </div>
        </div>
        </div>
        </div>
      </div>
      </div>
  );
}
