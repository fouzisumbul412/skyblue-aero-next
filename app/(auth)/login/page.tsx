"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#1868A5]" size={40} />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto flex items-center justify-center"
          >
            {/* Replaced SVG with Image Tag */}
            <img 
              src="/logo.png" 
              alt="Skyblue Aero" 
              className="h-20 w-auto object-contain" 
              // If you only have the white logo, use src="/logo-white.png" and add a background color to the img or div like className="h-20 w-auto object-contain bg-slate-900 p-2 rounded"
            />
          </motion.div>
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
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#1868A5] hover:bg-[#145a8d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1868A5] disabled:opacity-50 transition-all shadow-sm"
          >
            {isSubmitting ? (
               <div className="flex items-center gap-2">
                 <Loader2 size={18} className="animate-spin" />
                 Authenticating...
               </div>
            ) : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}