"use client";
import React, { useState } from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { useUser, useAuth, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function Welcome() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"DEVELOPER" | "USER" | null>(null);

  const registerAs = async (type: "DEVELOPER" | "USER") => {
    if (!isSignedIn) return router.push("/sign-in");
    setLoading(true);
    setSelectedRole(type);
    try {
      const token = await getToken();
      await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        }),
        cache: "no-store",
      });
      router.push(type === "DEVELOPER" ? "/dashboard" : "/");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 py-4">
            Welcome to DevGod
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-lg mx-auto my-6">
            Choose your role to get started
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <SignUpButton
              className={`px-8 py-3 rounded-full cursor-pointer font-medium transition-all duration-200 ${
                selectedRole === "DEVELOPER"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              {"I'm a Developer"}
            </SignUpButton>
            <SignUpButton
              className={`px-8 py-3 rounded-full cursor-pointer font-medium transition-all duration-200 ${
                selectedRole === "USER"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              {"I'm a User"}
            </SignUpButton>
          </div>
          {!isSignedIn && (
            <p className="mt-6 text-sm text-neutral-400">
              You'll be asked to sign in after selecting your role
            </p>
          )}
        </div>
      </div>
      <HeroParallax products={products} />
    </div>
  );
}

export const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
  },

  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editorially.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editrix.png",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png",
  },

  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/algochurn.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
  },

  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cremedigital.png",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/invoker.png",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];
