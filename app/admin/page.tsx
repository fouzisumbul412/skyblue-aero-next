"use client";

import React from "react";
import useSWR from "swr";
import { 
  PlaneTakeoff, MessageSquare, PenTool, Image as ImageIcon, Loader2 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const { data, error, isLoading } = useSWR("/api/admin/dashboard", fetcher);

  const stats = data?.data?.counts || { charters: 0, quotes: 0, blogs: 0, gallery: 0 };
  const chartData = data?.data?.chartData || [];

  if (error) {
    return <div className="p-6 text-red-500">Failed to load dashboard data.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back to the Skyblue Aero management portal.</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#1868A5]" size={32} />
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <PlaneTakeoff size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Charter Requests</p>
                <p className="text-2xl font-bold text-slate-900">{stats.charters}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Quotes</p>
                <p className="text-2xl font-bold text-slate-900">{stats.quotes}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <PenTool size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Blogs</p>
                <p className="text-2xl font-bold text-slate-900">{stats.blogs}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ImageIcon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Gallery Images</p>
                <p className="text-2xl font-bold text-slate-900">{stats.gallery}</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            
            {/* Main Lead Graph */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Lead Generation ({new Date().getFullYear()})</h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Charters" fill="#1868A5" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Quotes" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Summary / Side Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Summary</h2>
              
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-500">Total Leads Handled</span>
                    <span className="text-sm font-bold text-slate-900">{stats.charters + stats.quotes}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-[#1868A5] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-500">Charters vs Quotes</span>
                    <span className="text-sm font-bold text-slate-900">
                      {stats.charters + stats.quotes > 0 
                        ? Math.round((stats.charters / (stats.charters + stats.quotes)) * 100) 
                        : 0}% / {stats.charters + stats.quotes > 0 
                        ? Math.round((stats.quotes / (stats.charters + stats.quotes)) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-amber-400 rounded-full h-2 flex overflow-hidden">
                    <div 
                      className="bg-[#1868A5] h-2" 
                      style={{ width: `${stats.charters + stats.quotes > 0 ? (stats.charters / (stats.charters + stats.quotes)) * 100 : 50}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center">
                  Data reflects total records currently in the database. Deleting records will remove them from these counts.
                </p>
              </div>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}