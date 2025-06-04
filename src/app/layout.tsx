import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { PinLockProvider } from '@/contexts/PinLockContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'সেভারলি - ব্যক্তিগত অর্থ ট্র্যাকার',
  description: 'সেভারলি দিয়ে আপনার দৈনন্দিন খরচ, আয় ট্র্যাক করুন এবং আপনার অর্থ পরিচালনা করুন।',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap" rel="stylesheet" />
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
