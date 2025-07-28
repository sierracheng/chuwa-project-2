"use client";
import { NavigationBar } from './NavigationBar';
import React from "react";
import { Toaster } from 'sonner';

export function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-screen h-screen overflow-hidden border border-gray-200 rounded-md">
        <NavigationBar />
        <Toaster position="top-center" expand={true} />
        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
