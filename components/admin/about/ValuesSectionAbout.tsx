"use client";

import React from "react";
import { Star } from "lucide-react";

interface ValueItem {
  title: string;
  description: string;
  order: number;
}

interface Props {
  values: ValueItem[];
  handleValueChange: (index: number, field: string, value: string) => void;
}

export default function ValuesSectionAbout({ values, handleValueChange }: Props) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
        <Star size={20} />
        <h2 className="text-lg font-semibold text-slate-900">Core Values </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Value {index + 1}</div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
              <input
                type="text" value={value.title || ""} onChange={(e) => handleValueChange(index, "title", e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <textarea
                rows={3} value={value.description || ""} onChange={(e) => handleValueChange(index, "description", e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5] resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}