'use client';
// src/components/ScenarioContent.tsx
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
  
  interface Resource {
    id: number;
    title: string;
    img: string;
    audioSrc: string;
    description: string;
  }
  
  interface ScenarioData {
    id: string;
    title: string;
    description: string;
    messages: Message[];
    resources: Resource[];
    colorTheme: string;
  }
  
  const scenarioData: Record<string, ScenarioData> = {
    finance: {
      id: 'finance',
      title: 'Financial Empowerment',
      description: 'Learn about savings, budgeting, and starting a business',
      messages: [], // Finance-specific messages
      resources: [], // Finance resources
      colorTheme: 'green'
    },
    health: {
        id: 'health',
        title: 'Health & Wellness',
        description: 'Learn about health, nutrition, and wellness',
        messages: [],
        resources: [],
        colorTheme: 'red'
      },
      career: {
        id: 'career',
        title: 'Career Development',
        description: 'Learn about job skills and career growth',
        messages: [],
        resources: [],
        colorTheme: 'blue'
      },
      safety: {
        id: 'safety',
        title: 'Safety & Security',
        description: 'Learn about personal safety and security',
        messages: [],
        resources: [],
        colorTheme: 'purple'
      },
      success: {
        id: 'success',
        title: 'Success Stories',
        description: 'Learn from inspiring success stories',
        messages: [],
        resources: [],
        colorTheme: 'yellow'
      }
  };
  
  
  export default scenarioData;