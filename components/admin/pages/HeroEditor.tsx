"use client";

import React from "react";
import { Image as ImageIcon, LayoutTemplate, Type, AlignLeft, UploadCloud } from "lucide-react";
import { MAX_FILE_SIZE } from "@/lib/constants";
import toast from "react-hot-toast";

interface HeroData {
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  heroImagePreview: string | null;
  newHeroImage?: File | null;
}

interface Props {
  data: HeroData;
  onChange: (field: string, value: string) => void;
  onImageChange: (file: File | null) => void;
}

export default function HeroEditor({ data, onChange, onImageChange }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File is too large. Please select an image smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        e.target.value = '';
        return;
      }
      onImageChange(file);
    }
  };

  return (
    <section className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 text-[#1868A5] border-b border-slate-100 pb-6">
        <div className="p-2.5 bg-blue-50 rounded-2xl">
          <LayoutTemplate size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hero Banner Configuration</h2>
          <p className="text-sm text-slate-500 font-medium">Manage the primary landing visual and headline</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* TEXT CONTENT INPUTS */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Type size={14} className="text-blue-500" /> Subtitle / Badge text
            </label>
            <input
              type="text" 
              value={data.heroSubtitle || ""} 
              onChange={(e) => onChange("heroSubtitle", e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1868A5] focus:bg-white transition-all outline-none"
              placeholder="e.g. Contract Fuel"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Main Headline</label>
            <input
              type="text" 
              value={data.heroTitle || ""} 
              onChange={(e) => onChange("heroTitle", e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1868A5] focus:bg-white transition-all outline-none font-bold text-lg"
              placeholder="e.g. Flexibility, Control and Convenience."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <AlignLeft size={14} className="text-blue-500" /> Hero Description
            </label>
            <textarea
              rows={6} 
              value={data.heroDesc || ""} 
              onChange={(e) => onChange("heroDesc", e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1868A5] focus:bg-white transition-all outline-none resize-none leading-relaxed text-slate-600"
              placeholder="Enter the supporting text for the hero section..."
            />
          </div>
        </div>

        {/* IMAGE UPLOAD ZONE */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
            <ImageIcon size={14} className="text-blue-500" /> Background Media
          </label>
          
          <div className="relative group flex-grow min-h-[350px] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-blue-300 hover:bg-blue-50/20">
            
            {data.newHeroImage || data.heroImagePreview ? (
              <>
                <img 
                  src={data.newHeroImage ? URL.createObjectURL(data.newHeroImage) : data.heroImagePreview!} 
                  alt="Hero Preview" 
                  className="w-full h-full object-cover" 
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <label className="cursor-pointer bg-white text-slate-900 px-7 py-3 rounded-2xl text-sm font-bold shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                    <UploadCloud size={18} />
                    Replace Background
                    <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-4 p-10 text-center">
                <div className="p-5 bg-white rounded-full shadow-md text-slate-400 group-hover:text-[#1868A5] transition-colors">
                  <ImageIcon size={40} />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-700">Upload Hero Image</p>
                  <p className="text-sm text-slate-400 mt-1">Drag and drop or click to browse<br/>(1920x1080 recommended)</p>
                </div>
                <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
              </label>
            )}

            {/* Sublte Indicator */}
            {data.newHeroImage && (
              <div className="absolute bottom-4 left-4 bg-[#1868A5] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                New Selection Ready
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}