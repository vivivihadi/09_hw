import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import React from "react";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ['400', '500', '600', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NoteHub Homepage",
  description: "Homework 9",
  openGraph: {
    title: "NoteHub Homepage",
    description: "App for managing notes",
    url: 'https://09-auth-kappa-five.vercel.app/',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: "Note Hub Logo",
      },
    ],
    type: 'article',
  }
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TanStackProvider>
        <AuthProvider>
          <body className={roboto.variable}>
            <Header />
            {children}
            {modal}
            <Footer />
          </body>
        </AuthProvider>
      </TanStackProvider>
    </html>
  );
};
