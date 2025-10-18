# HerEcho - Voice-Only Chat Interface

A Next.js + Tailwind CSS application that simulates a WhatsApp-style voice chat interface for women in low-literacy communities. All communication is via audio — no text messages.

## Features

- 🎤 **Voice-Only Interface**: No text input, only audio communication
- 🎨 **Beautiful Design**: Clean, warm, WhatsApp-inspired interface with soft purples and teals
- 🔊 **Audio Bubbles**: Play/pause controls with animated waveforms
- 📚 **Resource Cards**: AI can share learning resources with audio content
- 🎯 **Accessibility**: Large microphone button and intuitive design
- ✨ **Animations**: Smooth transitions and visual feedback using Framer Motion
- 🚀 **Next.js Ready**: Built with Next.js for future API integration

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
/her-echo-frontend
 ├── /src
 │    ├── /app
 │    │     ├── globals.css        # Global styles
 │    │     ├── layout.tsx         # Root layout
 │    │     └── page.tsx            # Main page component
 │    ├── /components
 │    │     ├── HeaderBar.tsx      # Top navigation with title and status
 │    │     ├── ChatWindow.tsx     # Main chat container
 │    │     ├── AudioBubble.tsx    # Voice message bubbles
 │    │     ├── MicButton.tsx      # Recording button
 │    │     ├── ResourceCard.tsx   # Learning resource cards
 │    │     └── Waveform.tsx       # Animated audio visualization
 │    └── /data
 │         └── sampleMessages.ts   # Mock conversation data
 ├── next.config.js                # Next.js configuration
 ├── tailwind.config.js            # Tailwind CSS configuration
 └── package.json                  # Dependencies
```

## Design Philosophy

- **Audio-First**: Every interaction is designed around voice communication
- **Empowering**: Warm colors and friendly interface to build confidence
- **Accessible**: Large touch targets and clear visual feedback
- **Intuitive**: Familiar WhatsApp-style layout adapted for voice

## Technology Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React (icons)

## Future API Integration

This Next.js setup is ready for:
- Audio file uploads (`/api/upload`)
- AI response generation (`/api/chat`)
- User authentication (`/api/auth`)
- Resource management (`/api/resources`)

## Mock Features

This is a frontend demo with placeholder functionality:
- Audio playback simulation
- Mock recording states
- Sample conversation data
- Simulated AI responses with resources

## Contributing

This project is designed to empower women in low-literacy communities through accessible voice-based learning. Contributions that improve accessibility, usability, or educational value are especially welcome.