import React, { createContext, useContext, useState } from 'react';

type GlassSettings = {
  intensity: number;
  bgOpacity: number;
  borderOpacity: number;
  highlightOpacity: number;
  layers: number;
};

type GlassContextType = {
  settings: GlassSettings;
  updateSetting: (key: keyof GlassSettings, value: number) => void;
};

const defaultSettings: GlassSettings = {
  intensity: 100,
  bgOpacity: 0.5,
  borderOpacity: 0.25,
  highlightOpacity: 0.1,
  layers: 1,
};

const GlassContext = createContext<GlassContextType | null>(null);

export function GlassProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GlassSettings>(defaultSettings);

  const updateSetting = (key: keyof GlassSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <GlassContext.Provider value={{ settings, updateSetting }}>
      {children}
    </GlassContext.Provider>
  );
}

export function useGlass() {
  const context = useContext(GlassContext);
  if (!context) throw new Error('useGlass must be used within GlassProvider');
  return context;
}
