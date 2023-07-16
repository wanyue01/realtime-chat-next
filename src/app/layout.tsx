import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthContext from './context/AuthContext';
import ActiveStatus from './components/ActiveStatus';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'realtime chat',
  description: 'realtime chat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AuthContext>
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
