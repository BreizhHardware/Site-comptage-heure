'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '../context/SettingsContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

function PasswordResetGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user.passwordResetRequired && pathname !== '/change-password') {
      router.push('/change-password');
    }
  }, [session, status, router, pathname]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsProvider>
          <PasswordResetGuard>{children}</PasswordResetGuard>
        </SettingsProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
