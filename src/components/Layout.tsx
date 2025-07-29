"use client";
import { NavigationBar } from './NavigationBar';
import React from "react";
import { Toaster } from 'sonner';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen h-screen bg-gray-50 dark:bg-neutral-900 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <NavigationBar />
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40">
        <NavigationBar />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-auto pt-10 md:pt-4 px-4 bg-white">
        {children}
      </div>

      <Toaster position="top-center" expand={true} />
    </div>
  );
}
