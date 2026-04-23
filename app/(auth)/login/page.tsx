"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="/logo-white.png">
    <path d="M55 25 H 40 L 15 50 L 40 75 H 55 L 30 50 Z" fill="#1868A5" />
    <path d="M85 25 H 70 L 45 50 L 70 75 H 85 L 60 50 Z" fill="#F27C22" />
  </svg>
);

export default function Login() {
  const { user, refreshUser, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ADMIN") router.push("/admin");
      else router.push("/");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Login successful!");
        await refreshUser(); 
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-[#1868A5]/10"
          >
            <Logo className="h-12 w-12" />
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            SKYBLUE GALLEY
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Admin Management Portal
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1868A5] focus:border-[#1868A5] sm:text-sm"
              placeholder="Email address"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1868A5] focus:border-[#1868A5] sm:text-sm"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#1868A5] hover:bg-[#145a8d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1868A5] disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}