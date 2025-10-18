'use client';

import React from 'react';

interface ScenarioTab {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface ScenarioTabsProps {
  scenarios: ScenarioTab[];
  activeScenario: string;
  onScenarioChange: (scenario: string) => void;
}

const ScenarioTabs: React.FC<ScenarioTabsProps> = ({ scenarios, activeScenario, onScenarioChange }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white/90 backdrop-blur-sm border-r border-white/20 flex flex-col py-4 z-10">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onScenarioChange(scenario.id)}
          className={`flex flex-col items-center justify-center p-3 m-2 rounded-xl transition-all duration-300 ${
            activeScenario === scenario.id
              ? 'bg-her-purple-500 text-white shadow-lg transform scale-105'
              : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
          }`}
          title={scenario.title}
        >
          <span className="text-2xl mb-1">{scenario.icon}</span>
          <span className="text-xs font-medium text-center leading-tight">
            {scenario.title.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ScenarioTabs;