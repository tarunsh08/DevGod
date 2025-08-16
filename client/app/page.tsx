'use client';

import { Welcome } from "./screens/Welcome";
import { Home } from "@/components/Home";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignedOut>
        <Welcome />
      </SignedOut>
      <SignedIn>
        <Home />
      </SignedIn>
    </>
  );
}
