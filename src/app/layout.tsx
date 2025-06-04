import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { PinLockProvider } from '@/contexts/PinLockContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Saverly - Personal Finance Tracker',
  description: 'Track your daily expenses, income, and manage your finances with Saverly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PinLockProvider>
            {children}
            <Toaster />
          </PinLockProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
