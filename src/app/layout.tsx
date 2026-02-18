import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TempAr - Tu comunidad de trabajos temporales',
  description: 'TempAr: Conecta, trabaja y crece en comunidad. La plataforma para trabajos cortos con reputación verificada.',
  keywords: ['trabajo', 'gig economy', 'empleo rápido', 'freelance', 'comunidad', 'tempar'],
  themeColor: '#0f172a',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Sensación de app nativa
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
