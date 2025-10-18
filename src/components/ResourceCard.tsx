"use client";

import React from "react";
import { Play } from "lucide-react";

interface ResourceCardProps {
  title: string;
  img: string;
  audioSrc: string;
  onPlay: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  img,
  audioSrc,
  onPlay,
}) => {
  return (
    <div
      className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/20 mb-4"
      style={{ maxWidth: "320px" }}
    >
      {/* Image Section */}
      <div className="w-full h-28 mb-3 rounded-lg overflow-hidden relative bg-gradient-to-br from-teal-400 to-emerald-500">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=320&h=112&fit=crop"
          alt="African women learning finance and business skills"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // If image fails to load, hide it and show gradient background
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <span className="text-2xl block">👩🏾‍💼</span>
            <span className="text-xs font-medium">Finance Training</span>
          </div>
        </div>
        <button
          onClick={onPlay}
          className="absolute bottom-2 left-2 flex items-center gap-1 bg-teal-500 text-white px-2 py-1 rounded-md text-xs hover:bg-teal-600 transition-colors z-10"
        >
          <Play size={10} />
          <span>Listen</span>
        </button>
      </div>

      {/* Content Section */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">🎓</span>
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        </div>
        <p className="text-xs text-gray-600">
          Training by Women in Business Kenya
        </p>
      </div>
    </div>
  );
};

export default ResourceCard;
