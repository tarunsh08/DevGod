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
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Features",
      link: "/features",
    },
    {
      name: "Pricing",
      link: "/pricing",
    },
    {
      name: "Dashboard",
      link: "/dashboard",
    },
  ];

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      router.push("/login");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-20 w-full">
      <NavbarWrapper>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <span className="text-sm font-medium text-neutral-700">
                Welcome, {user.name}
              </span>
            )}
            <NavbarButton 
              variant={isAuthenticated ? "destructive" : "secondary"} 
              onClick={handleAuthAction}
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </NavbarButton>
            {!isAuthenticated && (
              <NavbarButton 
                variant="primary" 
                onClick={() => router.push("/register")}
              >
                Sign Up
              </NavbarButton>
            )}
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
            {isAuthenticated && user && (
              <div className="px-4 py-2 text-sm text-neutral-600">
                Welcome, {user.name}
              </div>
            )}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={handleAuthAction}
                variant={isAuthenticated ? "destructive" : "primary"}
                className="w-full"
              >
                {isAuthenticated ? 'Logout' : 'Login'}
              </NavbarButton>
              {!isAuthenticated && (
                <NavbarButton
                  onClick={() => {
                    router.push("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Sign Up
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarWrapper>
    </div>
  );
}