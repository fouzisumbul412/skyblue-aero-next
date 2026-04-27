"use client";

import React from "react";

interface Props {
  title: string;
  setTitle: (val: string) => void;
}

export default function ServicesTitleSection({ title, setTitle }: Props) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
        Main Header
      </h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Section Title
        </label>
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
          placeholder="e.g. AVIATION SOLUTIONS, PRECISELY TAILORED TO EVERY JOURNEY"
        />
      </div>
    </section>
  );
}