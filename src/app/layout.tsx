import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TempAr - Tu comunidad de trabajos temporales',
  description: 'TempAr: Conecta, trabaja y crece en comunidad. La plataforma para trabajos cortos con reputación verificada.',
  keywords: ['trabajo', 'gig economy', 'empleo rápido', 'freelance', 'comunidad', 'tempar'],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
