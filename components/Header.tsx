'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface Settings {
  name: string;
  logo: string;
}

export default function Header() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>({ name: '', logo: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
  };

  return (
    <header className="bg-white dark:bg-stone-950 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {settings.logo && (
            <img src={settings.logo} alt="Logo" className="h-10 mr-4" />
          )}
          <h1 className="hidden md:block text-xl font-bold text-gray-900 dark:text-white">
            {settings.name || 'Club Scolaire'}
          </h1>
        </div>
        {session && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 dark:text-white">
              {session.user.email} ({session.user.role})
            </span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
