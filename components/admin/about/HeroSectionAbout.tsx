"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";

interface Props {
  formData: { heroTitle: string; heroSubtitle: string };
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  heroPreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "story") => void;
}

export default function HeroSectionAbout({ formData, handleTextChange, heroPreview, handleImageChange }: Props) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
        <ImageIcon size={20} />
        <h2 className="text-lg font-semibold text-slate-900">Hero Section</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
            <input
              type="text" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleTextChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
            <input
              type="text" name="heroTitle" value={formData.heroTitle} onChange={handleTextChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-slate-700 mb-2">Hero Background Image</p>
          <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
            {heroPreview ? (
              <>
                <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                    <ImageIcon size={16} />
                    Change Image
                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageChange(e, "hero")} />
                  </label>
                </div>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                <ImageIcon className="h-10 w-10 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-600">Click to upload hero image</span>
                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageChange(e, "hero")} />
              </label>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}