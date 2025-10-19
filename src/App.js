import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Simple Blog Platform - Share your thoughts with the world" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <a href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                    SimpleBlog
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <a 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Home
                  </a>
                  <a 
                    href="/posts" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Posts
                  </a>
                  <a 
                    href="/posts/new" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    New Post
                  </a>
                  <a 
                    href="/login" 
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </a>
                  <a 
                    href="/register" 
                    className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Register
                  </a>
                </div>
              </div>
            </nav>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Simple Blog Platform. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    default: 'Simple Blog Platform',
    template: '%s | Simple Blog Platform'
  },
  description: 'A modern blogging platform built with Next.js',
  keywords: ['blog', 'nextjs', 'typescript', 'react'],
  authors: [{ name: 'Simple Blog Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://simple-blog-platform.com',
    siteName: 'Simple Blog Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simple Blog Platform',
    description: 'Share your thoughts with the world',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};