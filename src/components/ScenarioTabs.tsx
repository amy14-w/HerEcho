"use client";

import React from "react";

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

const ScenarioTabs: React.FC<ScenarioTabsProps> = ({
  scenarios,
  activeScenario,
  onScenarioChange,
}) => {
  return (
    <div
      className="fixed left-0 top-0 w-20 backdrop-blur-sm border-r flex flex-col py-2 z-10"
      style={{
        height: "calc(812px - 40px)",
        backgroundColor: "rgba(255, 234, 214, 0.95)",
        borderColor: "rgba(196, 76, 24, 0.2)",
      }}
    >
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onScenarioChange(scenario.id)}
          className="flex flex-col items-center justify-center p-2 m-1 rounded-lg transition-all duration-300"
          style={{
            background:
              activeScenario === scenario.id
                ? "linear-gradient(135deg, #C44C18 0%, #F0A224 100%)"
                : "transparent",
            color: activeScenario === scenario.id ? "white" : "#562915",
            boxShadow:
              activeScenario === scenario.id
                ? "0 4px 12px rgba(196, 76, 24, 0.3)"
                : "none",
            transform:
              activeScenario === scenario.id ? "scale(1.05)" : "scale(1)",
          }}
          onMouseEnter={(e) => {
            if (activeScenario !== scenario.id) {
              e.currentTarget.style.backgroundColor = "rgba(196, 76, 24, 0.1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeScenario !== scenario.id) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
          title={scenario.title}
        >
          <span className="text-lg mb-1">{scenario.icon}</span>
          <span className="text-xs font-medium text-center leading-tight">
            {scenario.title.split(" ")[0]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ScenarioTabs;
