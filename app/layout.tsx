import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthLoader } from "./_components/AuthLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cues - Task Management for Devs",
  description: "Cues is a task and project management platform where you can manage your projects and tasks directly from the terminal. Cues also provides a web frontend for users who prefer to use a web version.",
  keywords: ['task', 'project', 'tasks', 'projects', 'manage', 'management', 'cli', 'tool', 'productivity', 'developer', 'cues', 'terminal', 'rust'],
  icons: {
    icon: "/logos/cues_ico.png",
  },
  openGraph: {
    title: "Cues - Task Management for Devs",
    description: "Track and manage your tasks and projects directly from your terminal, and on the web for those who prefer that.",
    url: "https://cues-web.vercel.app",
    siteName: "Cues",
    images: [
      {
        url: "/metadata/og-img.png",
        width: 1200,
        height: 630,
        alt: "Cues - Task Management for Devs"
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Cues - Task Management for Devs",
    description: "Powerful and efficient task management for developers. CLI + Web.",
    images: ["/metadata/twitter-img.png"],
    creator: '@aetheros__',
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Cues",
      "url": "https://cues-web.vercel.app",
      "description": "Cues is a task and project management platform where you can manage your projects and tasks directly from the terminal. Cues also provides a web frontend for users who prefer to use a web version.",
      "publisher": {
        "@type": "Organization",
        "name": "Cues",
      }
    })
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="wHBP3UY22MdwxHj2dr8PMLMDNjB3UOYFWdnziByyppg" />
        <meta name="apple-mobile-web-app-title" content="Cues" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="e146d63d-f86e-446e-acc5-efc8a336a651"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthLoader />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
