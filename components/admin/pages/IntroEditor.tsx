"use client";

import React, { useState } from "react";
import { 
  FileText, Image as ImageIcon, X, Plus, 
  Type, BadgeInfo, ExternalLink, Hash 
} from "lucide-react";
import { MAX_FILE_SIZE } from "@/lib/constants";
import toast from "react-hot-toast";

interface Props {
  section: any;
  sIndex: number;
  config?: { fields: string[] };
  updateSection: (index: number, field: string, value: any) => void;
  onImageChange: (index: number, file: File | null) => void;
}

export default function IntroEditor({ section, sIndex, config, updateSection, onImageChange }: Props) {
  const [tagInput, setTagInput] = useState("");
  const fields = config?.fields || ['subtitle', 'title', 'description', 'badge', 'button', 'image', 'tags'];
  const hasCol2 = fields.includes('image') || fields.includes('badge') || fields.includes('button');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File is too large. Please select an image smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        e.target.value = '';
        return;
      }
      onImageChange(sIndex, file);
    }
  };

  // Tag Management Logic
  const addTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = section.tags || [];
    if (!currentTags.includes(tagInput.trim().toUpperCase())) {
      updateSection(sIndex, "tags", [...currentTags, tagInput.trim().toUpperCase()]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = (section.tags || []).filter((t: string) => t !== tagToRemove);
    updateSection(sIndex, "tags", newTags);
  };

  return (
    <section className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 text-[#1868A5] border-b border-slate-100 pb-6">
        <div className="p-2.5 bg-blue-50 rounded-xl">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Content Block Editor</h2>
          <p className="text-sm text-slate-500 font-medium">Configure primary section text and media</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${hasCol2 ? 'lg:grid-cols-2' : ''} gap-12`}>
        {/* COLUMN 1: TEXT CONTENT */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.includes('subtitle') && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                   <Type size={14} className="text-blue-500" /> Subtitle
                </label>
                <input
                  type="text" 
                  value={section.subtitle || ""} 
                  onChange={(e) => updateSection(sIndex, "subtitle", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1868A5] focus:bg-white transition-all outline-none"
                  placeholder="e.g. Global Operations"
                />
              </div>
            )}
            {fields.includes('title') && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Main Heading</label>
                <input
                  type="text" 
                  value={section.title || ""} 
                  onChange={(e) => updateSection(sIndex, "title", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1868A5] focus:bg-white transition-all outline-none font-bold"
                  placeholder="e.g. Seamless Support"
                />
              </div>
            )}
          </div>

          {fields.includes('description') && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Detailed Description</label>
              <textarea
                rows={10} 
                value={section.description || ""} 
                onChange={(e) => updateSection(sIndex, "description", e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1868A5] focus:bg-white transition-all outline-none resize-none leading-relaxed text-slate-700"
                placeholder="Compose the primary content for this section..."
              />
            </div>
          )}

          {/* DYNAMIC TAGS SYSTEM */}
          {fields.includes('tags') && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Hash size={14} className="text-blue-500" /> Regional Markets / Tags
              </label>
              <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[60px]">
                {(section.tags || []).map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1.5 bg-white border border-blue-100 text-[#1868A5] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-2 ml-1">
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="bg-transparent border-b border-slate-300 text-xs py-1 focus:border-[#1868A5] outline-none w-24"
                  />
                  <button onClick={addTag} className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COLUMN 2: MEDIA & ADD-ONS */}
        {hasCol2 && (
          <div className="space-y-8">
            {fields.includes('image') && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <ImageIcon size={14} className="text-blue-500" /> Featured Media
                </label>
                <div className="relative group h-[380px] w-full bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-blue-300 hover:bg-blue-50/20">
                  {section.newImageFile || section.image ? (
                    <>
                      <img 
                        src={section.newImageFile ? URL.createObjectURL(section.newImageFile) : section.image} 
                        className="w-full h-full object-cover" 
                        alt="section preview"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <label className="cursor-pointer bg-white text-slate-900 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl hover:scale-105 transition-all">
                          Replace Media
                          <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-3">
                      <div className="p-4 bg-white rounded-full shadow-md text-slate-400">
                        <ImageIcon size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">Upload Section Image</p>
                        <p className="text-xs text-slate-400">High resolution recommended</p>
                      </div>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {fields.includes('badge') && (
                <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-100 space-y-5">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <BadgeInfo size={18} className="text-[#1868A5]" />
                    Floating Badge Configuration
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Icon Name</label>
                      <input type="text" placeholder="e.g. Globe2" value={section.badgeIcon || ""} onChange={(e) => updateSection(sIndex, "badgeIcon", e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Badge Title</label>
                      <input type="text" placeholder="e.g. 24/7 Ops" value={section.badgeTitle || ""} onChange={(e) => updateSection(sIndex, "badgeTitle", e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Overlay Text</label>
                    <textarea rows={2} value={section.badgeDesc || ""} onChange={(e) => updateSection(sIndex, "badgeDesc", e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium resize-none" placeholder="Enter brief badge description..." />
                  </div>
                </div>
              )}

              {fields.includes('button') && (
                <div className="p-6 bg-[#1868A5]/5 rounded-3xl border border-blue-100 space-y-5">
                  <div className="flex items-center gap-2 text-[#1868A5] font-bold text-sm">
                    <ExternalLink size={18} />
                    Action Button (Brochure/PDF)
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-blue-400 ml-1">Label</label>
                      <input type="text" placeholder="Download PDF" value={section.buttonText || ""} onChange={(e) => updateSection(sIndex, "buttonText", e.target.value)} className="w-full px-3 py-2.5 border border-blue-100 rounded-xl text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-blue-400 ml-1">Target URL</label>
                      <input type="text" placeholder="/path/to/file.pdf" value={section.buttonLink || ""} onChange={(e) => updateSection(sIndex, "buttonLink", e.target.value)} className="w-full px-3 py-2.5 border border-blue-100 rounded-xl text-xs font-bold" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}