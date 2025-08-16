"use client";
import {
  Navbar as NavbarWrapper,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Home } from "./Home";

export function Navbar() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <NavbarWrapper>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <SignedIn>
            <NavItems items={navItems} />
          </SignedIn>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <NavbarButton variant="primary">Sign In</NavbarButton>
              </SignInButton>
              <SignUpButton>
                <NavbarButton variant="primary">Sign Up</NavbarButton>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <SignedIn>
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
            </SignedIn>
            <div className="flex w-full flex-col gap-4 mt-4">
              <SignedOut>
                <SignInButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Sign In
                  </NavbarButton>
                </SignInButton>
                <SignUpButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Sign Up
                  </NavbarButton>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarWrapper>
      <DummyContent />
    </div>
  );
}

const DummyContent = () => {
  return <Home />;
};
