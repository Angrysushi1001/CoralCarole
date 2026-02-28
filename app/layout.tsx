import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import your Navbar component
import Navbar from "@/components/NavBar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coral Carole | Singapore Reef Market",
  description: "Buy and sell coral frags in Singapore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}
      >
        {/* 2. Place the Navbar here */}
        <Navbar /> 
        
        {/* 3. The rest of your pages load here */}
        {children}
      </body>
    </html>
  );
}