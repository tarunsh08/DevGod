"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import useAxios from "@/hooks/useAxios"
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const axios = useAxios();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/login`, { 
        email, 
        password 
      }, {
        withCredentials: true
      });

      console.log("Login response:", response.data);
      
      if (response.data.data?.user) {
        const { user } = response.data.data;
        await login({
          name: user.name,
          email: user.email,
          role: user.role,
          id: user.id
        });
        router.push("/dashboard");
      } else {
        throw new Error(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.' || error.message);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-neutral-100 transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">DG</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">Welcome back to DevGod</h2>
          <p className="text-neutral-500">Sign in to continue your journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="text-neutral-400 fas fa-user"></i>
              </div>
              <input
                type="email"
                placeholder="Email"
                className="pl-10 w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="text-neutral-400 fas fa-lock"></i>
              </div>
              <input
                type="password"
                placeholder="Password"
                className="pl-10 w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all duration-200 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-neutral-600">
              <input type="checkbox" className="rounded text-neutral-600 focus:ring-neutral-500" />
              <span className="ml-2">Remember me</span>
            </label>
            <Link href="#" className="text-neutral-600 hover:text-neutral-800 transition-colors duration-200">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-neutral-800 text-white py-3 rounded-lg font-medium hover:bg-neutral-900 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-700 shadow-md hover:shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center text-neutral-500 text-sm">
          <p>Don't have an account? <Link href="/register" className="text-neutral-700 font-medium hover:text-neutral-900 transition-colors duration-200">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;