"use client";

import React from "react";
import { Activity } from "lucide-react";

interface Counter {
  label: string;
  endValue: number;
  suffix: string | null;
  order: number;
}

interface Props {
  counters: Counter[];
  handleCounterChange: (index: number, field: string, value: string | number) => void;
}

export default function CountersSectionAbout({ counters, handleCounterChange }: Props) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
        <Activity size={20} />
        <h2 className="text-lg font-semibold text-slate-900">Performance Metrics </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {counters.map((counter, index) => (
          <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Card {index + 1}</div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Label (e.g. Personnel)</label>
              <input
                type="text" value={counter.label || ""} onChange={(e) => handleCounterChange(index, "label", e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Number</label>
                <input
                  type="number" value={counter.endValue || 0} onChange={(e) => handleCounterChange(index, "endValue", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Suffix (e.g. +)</label>
                <input
                  type="text" value={counter.suffix || ""} onChange={(e) => handleCounterChange(index, "suffix", e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}