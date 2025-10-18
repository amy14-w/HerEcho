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
    // ... other scenarios
  };
  
  export default scenarioData;