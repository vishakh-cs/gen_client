"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/page';
import { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from './provider';
import { EdgeStoreProvider } from '@/lib/edgestore';
import useStore from '@/Stores/store';

const inter = Inter({ subsets: ['latin'] });

// RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const setDarkMode = useStore((state)=>state.setDarkMode)

  const darkMode = useStore(state => state.darkMode);
 
 

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkmode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode)); 
    }
  }, [setDarkMode]);

  const pathname = usePathname();
  const showNavbar = pathname === '/';

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <html lang="en">
      <body className={`${inter.className} `}>
      <NextAuthProvider>
      <EdgeStoreProvider>
          {showNavbar && <Navbar />}
          {children}
          </EdgeStoreProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
