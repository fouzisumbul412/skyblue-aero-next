"use client";

import React from "react";
import { PlaneTakeoff, MessageSquare, PenTool, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back to the Skyblue Aero management portal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <PlaneTakeoff size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Charter Requests</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">New Quotes</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <PenTool size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Published Blogs</p>
            <p className="text-2xl font-bold text-slate-900">6</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Gallery Images</p>
            <p className="text-2xl font-bold text-slate-900">4</p>
          </div>
        </div>
      </div>
    </div>
  );
}