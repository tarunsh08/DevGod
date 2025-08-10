'use client';

import { Welcome } from "./screens/Welcome";
import { NavbarDemo } from "@/components/Navbar";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignedOut>
        <Welcome />
      </SignedOut>
      <SignedIn>
        <NavbarDemo />
      </SignedIn>
    </>
  );
}
