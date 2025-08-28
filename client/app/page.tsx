"use client"

import Image from "next/image";
import { BackgroundLines } from "@/components/ui/background-lines";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } 
  };
  return (
    <>
    <Navbar />
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight selection:text-red-500">
        DevGod, <br /> Helping hand for devs.
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        An initiative taken to help developers get the reach they deserve.
      </p>
      <div className="flex items-center justify-center w-full mt-10">
        {!isAuthenticated ? <Link onClick={handleAuthAction} href="/register" className="btn btn-primary bg-neutral-700 text-white border-neutral-700 hover:bg-neutral-800 hover:border-neutral-800 hover:text-neutral-100 transition-colors px-5 py-3 rounded-lg shadow-lg active:scale-95 cursor-pointer z-20">Get Started</Link> : null}
      </div>
    </BackgroundLines>
    </>
  );
}
