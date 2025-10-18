'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { useSettings } from '../context/SettingsContext';

export default function Header() {
  const { data: session } = useSession();
  const { settings } = useSettings();

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
              {session.user.email} (
              {session.user.role === 'MEMBER'
                ? 'Membre'
                : session.user.role === 'ADMIN'
                  ? 'Bureau'
                  : session.user.role === 'SUPER_ADMIN'
                    ? 'Gestionnaire'
                    : session.user.role}
              )
            </span>
            <Button onClick={() => signOut()} variant="destructive">
              Déconnexion
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
