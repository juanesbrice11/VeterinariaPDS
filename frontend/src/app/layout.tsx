import './globals.css';
import { Instrument_Sans, Noto_Sans_JP } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const instrumentSans = Instrument_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-instrument-sans',
});

const otomanopee = Noto_Sans_JP({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-otomanopee',
});

export const metadata = {
  title: 'Fluffy Paws',
  description: 'Veterinaria',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${instrumentSans.variable} ${otomanopee.variable}`}>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
