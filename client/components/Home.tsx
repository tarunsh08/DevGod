'use client';

import React from 'react';
import { useUser } from "@clerk/nextjs";

export function Home() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome{user ? `, ${user.firstName || 'User'}` : ''}!
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-2xl">
        You have successfully signed in to your account. Start exploring the platform!
      </p>
    </div>
  );
}