"use client";

import { useState } from "react";
import Image from "next/image";

interface Theme {
  id: string;
  name: string;
  image: string;
}

interface SliderProps {
  themes: Theme[];
  onThemeSelect: (themeId: string) => void;
}

export function ThemeSlider({ themes, onThemeSelect }: SliderProps) {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]?.id);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeSelect(themeId);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {themes.map((theme) => (
        <div
          key={theme.id}
          className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
            selectedTheme === theme.id
              ? "ring-2 ring-blue-500 scale-105"
              : "hover:scale-105"
          }`}
          onClick={() => handleThemeSelect(theme.id)}
        >
          <Image
            src={theme.image}
            alt={theme.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <p className="text-white text-sm text-center">{theme.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 