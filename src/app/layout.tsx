import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Glenn Geraghty - Developer Blog',
    template: '%s | Glenn Geraghty'
  },
  description: 'A modern developer blog showcasing projects, tutorials, and insights into web development, software engineering, and technology.',
  keywords: [
    'developer blog',
    'web development',
    'software engineering',
    'programming',
    'tutorials',
    'projects',
    'technology',
    'Next.js',
    'React',
    'TypeScript'
  ],
  authors: [{ name: 'Glenn Geraghty' }],
  creator: 'Glenn Geraghty',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Glenn Geraghty - Developer Blog',
    description: 'A modern developer blog showcasing projects, tutorials, and insights into web development.',
    siteName: 'Glenn Geraghty Blog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Glenn Geraghty - Developer Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glenn Geraghty - Developer Blog',
    description: 'A modern developer blog showcasing projects, tutorials, and insights into web development.',
    images: ['/og-image.jpg'],
    creator: '@yourhandle'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}