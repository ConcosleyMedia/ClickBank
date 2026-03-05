import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#14b8a6',
}

export const metadata: Metadata = {
  title: {
    default: 'BrainRank - Discover Your Real IQ Score',
    template: '%s | BrainRank',
  },
  description:
    'Take our accurate online IQ test in just 15 minutes. Get your instant IQ score, detailed analysis, and percentile ranking. Professionally designed intelligence assessment.',
  keywords: [
    'IQ test',
    'intelligence test',
    'brain training',
    'cognitive assessment',
    'IQ score',
    'online IQ test',
    'free IQ test',
    'brain games',
    'cognitive skills',
  ],
  authors: [{ name: 'BrainRank' }],
  creator: 'BrainRank',
  publisher: 'BrainRank',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'BrainRank - Discover Your Real IQ Score',
    description:
      'Take our accurate online IQ test in just 15 minutes. Get your instant IQ score, detailed analysis, and percentile ranking.',
    type: 'website',
    locale: 'en_US',
    siteName: 'BrainRank',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainRank - Discover Your Real IQ Score',
    description:
      'Take our accurate online IQ test in just 15 minutes. Get your instant IQ score, detailed analysis, and percentile ranking.',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
