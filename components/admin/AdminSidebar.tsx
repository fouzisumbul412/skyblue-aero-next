"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Home, FileText, Image as ImageIcon, 
  PenTool, PlaneTakeoff, MessageSquare, Users, Settings, LogOut, X, Plane 
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, isCollapsed, isMobileMenuOpen }: any) => {
  const pathname = usePathname();
  const isActive = pathname === to || (to !== '/admin' && pathname.startsWith(to));
  
  return (
    <Link 
      href={to} 
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {(!isCollapsed || isMobileMenuOpen) && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export default function AdminSidebar({ isCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }: any) {
  const { user, logout } = useAuth();

  return (
    <>
      <div className="p-4 flex items-center justify-between border-b border-white/10 h-16 shrink-0">
        <div className="flex items-center">
          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <img 
              src="/logo-white.png" 
              alt="Skyblue Aero" 
              className={`transition-all duration-300 ${
                isCollapsed && !isMobileMenuOpen 
                  ? 'w-10 h-10 object-cover object-left' 
                  : 'w-44 h-auto object-contain'
              }`} 
            />
          </motion.div>
        </div>
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          {(!isCollapsed || isMobileMenuOpen) && <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Overview</p>}
          <nav className="space-y-1">
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
          </nav>
        </div>

        <div>
          {(!isCollapsed || isMobileMenuOpen) && <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Website Content</p>}
          <nav className="space-y-1">
            <NavItem to="/admin/home" icon={Home} label="Home Page" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/charter-falcon" icon={Plane} label="Charter Page" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/about" icon={FileText} label="About Page" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/gallery" icon={ImageIcon} label="Gallery" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/blog" icon={PenTool} label="Insights & Blog" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
          </nav>
        </div>
        
        <div>
          {(!isCollapsed || isMobileMenuOpen) && <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Leads & Inquiries</p>}
          <nav className="space-y-1">
            <NavItem to="/admin/charters" icon={PlaneTakeoff} label="Charter Requests" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/quotes" icon={MessageSquare} label="Contact Quotes" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
          </nav>
        </div>

        <div>
          {(!isCollapsed || isMobileMenuOpen) && <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">System</p>}
          <nav className="space-y-1">
            <NavItem to="/admin/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10">
        {(!isCollapsed || isMobileMenuOpen) && (
          <div className="mb-4">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-white/50 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        )}
        <button onClick={logout} className={`flex items-center gap-2 text-sm text-white/70 hover:text-white w-full ${(isCollapsed && !isMobileMenuOpen) ? 'justify-center' : ''}`}>
          <LogOut className="w-5 h-5 shrink-0" />
          {(!isCollapsed || isMobileMenuOpen) && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );
}