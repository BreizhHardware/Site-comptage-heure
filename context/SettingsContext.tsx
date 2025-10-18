'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  name: string;
  logo: string;
}

interface SettingsContextType {
  settings: Settings;
  refetchSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({ name: '', logo: '' });

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refetchSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
