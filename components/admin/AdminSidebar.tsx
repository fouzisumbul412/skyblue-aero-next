"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Home, FileText, Image as ImageIcon, 
  PenTool, PlaneTakeoff, MessageSquare, Users, Settings, 
  LogOut, X, Plane, Fuel, Globe2, TrendingUp, Wrench 
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, isCollapsed, isMobileMenuOpen }: any) => {
  const pathname = usePathname();
  const isActive = pathname === to || (to !== '/admin' && pathname.startsWith(to));
  
  return (
    <Link 
      href={to} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/20' 
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      }`}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
      {(!isCollapsed || isMobileMenuOpen) && (
        <span className="text-[13px] font-semibold tracking-wide">{label}</span>
      )}
    </Link>
  );
};

export default function AdminSidebar({ isCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }: any) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Header / Logo */}
      <div className="p-6 flex items-center justify-between border-b border-white/5 h-20 shrink-0">
        <div className="flex items-center">
          <motion.div 
            initial={{ x: -10, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <img 
              src="/logo-white.png" 
              alt="Skyblue Aero" 
              className={`transition-all duration-500 ease-in-out ${
                isCollapsed && !isMobileMenuOpen 
                  ? 'w-8 h-8 object-left opacity-0' // Hide logo text when collapsed
                  : 'w-40 h-auto'
              }`} 
            />
          </motion.div>
        </div>
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-white/50 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
        {/* Sections */}
        <div>
          {(!isCollapsed || isMobileMenuOpen) && (
            <p className="px-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Overview</p>
          )}
          <nav className="space-y-1.5">
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
          </nav>
        </div>

        <div>
          {(!isCollapsed || isMobileMenuOpen) && (
            <p className="px-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Core Pages</p>
          )}
          <nav className="space-y-1.5">
            <NavItem to="/admin/home" icon={Home} label="Home Page" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/about" icon={FileText} label="About Page" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/gallery" icon={ImageIcon} label="Gallery" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/blog" icon={PenTool} label="Insights & Blog" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
          </nav>
        </div>

        <div>
          {(!isCollapsed || isMobileMenuOpen) && (
            <p className="px-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Services</p>
          )}
          <nav className="space-y-1.5">
            <NavItem to="/admin/pages/charters" icon={Plane} label="Charters" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/pages/contract-fuel" icon={Fuel} label="Contract Fuel" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/pages/trip-support" icon={Globe2} label="Trip Support" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/pages/brokerage" icon={TrendingUp} label="Brokerage" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/pages/maintenance" icon={Wrench} label="Maintenance" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/pages/crew-leasing" icon={Users} label="Crew Leasing" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
          </nav>
        </div>
        
        <div>
          {(!isCollapsed || isMobileMenuOpen) && (
            <p className="px-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Inquiries</p>
          )}
          <nav className="space-y-1.5">
            <NavItem to="/admin/charters" icon={PlaneTakeoff} label="Charter Requests" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
            <NavItem to="/admin/quotes" icon={MessageSquare} label="Contact Quotes" isCollapsed={isCollapsed} isMobileMenuOpen={isMobileMenuOpen} />
          </nav>
        </div>
      </div>
      
      {/* Footer / User Profile */}
      <div className="p-6 border-t border-white/5 bg-black/10">
        {(!isCollapsed || isMobileMenuOpen) && (
          <div className="mb-6 px-1">
            <p className="text-sm font-bold text-white tracking-tight">{user?.name}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">{user?.role}</p>
          </div>
        )}
        <button 
          onClick={logout} 
          className={`flex items-center gap-3 text-sm font-semibold text-white/50 hover:text-red-400 transition-colors w-full ${(isCollapsed && !isMobileMenuOpen) ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!isCollapsed || isMobileMenuOpen) && <span>Sign Out</span>}
        </button>
      </div>

      {/* Global CSS for hiding scrollbar */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </>
  );
}