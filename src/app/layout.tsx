import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | AI System Design Builder",
    default: "AI System Design Builder",
  },

  description: "Build your system architecture with AI",
  openGraph:{
    title: "AI System Design Builder",
    description: "Build your system architecture with AI",
    url: "https://systemdesign.avikmukherjee.me",
    siteName: "AI System Design Builder",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AI System Design Builder",
      },
    ],
    type: "website",
  },
  twitter:{
    card: "summary_large_image",
    title: "AI System Design Builder",
    description: "Build your system architecture with AI",
    images: ["/logo.png"],
  },
  icons:{
    icon: "/logo.png",
  },
  alternates: {
    canonical: "https://systemdesign.avikmukherjee.me",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
