"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/me`, {
          withCredentials: true,
        });
        
        if (response.status === 200) {
          const userData = response.data.data.user;
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}