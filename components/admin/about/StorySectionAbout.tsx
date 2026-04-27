"use client";

import React from "react";
import { FileText, Image as ImageIcon } from "lucide-react";

interface Props {
  formData: { title: string; storyHeading: string; content: string };
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  storyPreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "story") => void;
}

export default function StorySectionAbout({ formData, handleTextChange, storyPreview, handleImageChange }: Props) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
        <FileText size={20} />
        <h2 className="text-lg font-semibold text-slate-900">Our Story</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleTextChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Story Heading</label>
            <textarea
              name="storyHeading" value={formData.storyHeading} onChange={handleTextChange} rows={2}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content (Paragraphs)</label>
            <textarea
              name="content" value={formData.content} onChange={handleTextChange} rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
            />
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-slate-700 mb-2">Story Image</p>
          <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-full min-h-[300px] flex items-center justify-center">
            {storyPreview ? (
              <>
                <img src={storyPreview} alt="Story" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                    <ImageIcon size={16} />
                    Change Image
                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageChange(e, "story")} />
                  </label>
                </div>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                <ImageIcon className="h-10 w-10 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-600">Click to upload story image</span>
                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageChange(e, "story")} />
              </label>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}