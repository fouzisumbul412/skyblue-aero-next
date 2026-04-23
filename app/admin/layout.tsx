"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';

const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="/logo-white.png">
    <path d="M55 25 H 40 L 15 50 L 40 75 H 55 L 30 50 Z" fill="#1868A5" />
    <path d="M85 25 H 70 L 45 50 L 70 75 H 85 L 60 50 Z" fill="#F27C22" />
  </svg>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Auth Protection Shield
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center bg-slate-50">Authenticating...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-[#1868A5] text-white z-50 flex flex-col lg:hidden"
          >
            <AdminSidebar isCollapsed={false} isMobileMenuOpen={true} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex bg-[#1868A5] text-white flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} overflow-hidden shrink-0`}>
        <AdminSidebar isCollapsed={isCollapsed} isMobileMenuOpen={false} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-30">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block p-2 text-slate-500 hover:bg-slate-100 rounded-md">
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <Logo className="w-6 h-6" />
              <span className="text-sm font-bold text-[#1868A5] truncate max-w-[120px]">SKYBLUE AERO</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1868A5]/10 flex items-center justify-center text-[#1868A5] font-bold shrink-0">
              {user.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}