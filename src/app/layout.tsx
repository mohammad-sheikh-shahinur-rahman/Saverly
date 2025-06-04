import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { PinLockProvider } from '@/contexts/PinLockContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'সেভারলি - ব্যক্তিগত অর্থ ট্র্যাকার',
  description: 'সেভারলি দিয়ে আপনার দৈনন্দিন খরচ, আয় ট্র্যাক করুন এবং আপনার অর্থ পরিচালনা করুন।',
  manifest: '/manifest.json', // Added manifest link for PWA
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
        {/* PWA Meta Tags */}
        <meta name="application-name" content="সেভারলি" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="সেভারলি" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" /> 
        <meta name="msapplication-TileColor" content="#5A38E8" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#5A38E8" />

        {/* Apple Touch Icons (using placeholders) */}
        <link rel="apple-touch-icon" href="https://placehold.co/180x180.png" data-ai-hint="app icon apple" />
        <link rel="apple-touch-icon" sizes="152x152" href="https://placehold.co/152x152.png" data-ai-hint="app icon apple small" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://placehold.co/180x180.png" data-ai-hint="app icon apple medium" />
        <link rel="apple-touch-icon" sizes="167x167" href="https://placehold.co/167x167.png" data-ai-hint="app icon apple large" />

        {/* Placeholder for browserconfig.xml content, ideally this would be a separate file */}
        {/* <link rel="icon" type="image/png" sizes="32x32" href="https://placehold.co/32x32.png" data-ai-hint="favicon small" /> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="https://placehold.co/16x16.png" data-ai-hint="favicon tiny" /> */}
        {/* <link rel="mask-icon" href="https://placehold.co/safari-pinned-tab.svg" color="#5A38E8" data-ai-hint="safari pinned tab" /> */}
        <link rel="shortcut icon" href="/favicon.ico" />
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
