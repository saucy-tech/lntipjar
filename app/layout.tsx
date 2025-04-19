import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lightning Tip Jar | ATL BitLab",
  description: "Leave us a tip in bitcoin -- or deploy this code to run your own lightning tip jar!",
  icons: {
    icon: "/atl-bitlab-favicon.png",
    apple: "/atl-bitlab-favicon.png",
  },
  openGraph: {
    title: "Lightning Tip Jar | ATL BitLab",
    description: "Leave us a tip in bitcoin -- or deploy this code to run your own lightning tip jar!",
    images: ['/lightning-tip-jar.jpg'],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lightning Tip Jar | ATL BitLab",
    description: "Leave us a tip in bitcoin -- or deploy this code to run your own lightning tip jar!",
    images: ['/lightning-tip-jar.jpg'],
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
      </body>
    </html>
  );
}