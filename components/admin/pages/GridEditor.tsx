"use client";

import React from "react";
import { 
  LayoutGrid, Plus, Trash2, GripHorizontal, 
  Image as ImageIcon, X, ListPlus, Type 
} from "lucide-react";

interface Props {
  section: any;
  sIndex: number;
  config?: { sectionFields: string[], itemFields: string[] };
  updateSection: (index: number, field: string, value: any) => void;
}

export default function GridEditor({ section, sIndex, config, updateSection }: Props) {
  const sFields = config?.sectionFields || ['subtitle', 'title', 'description'];
  const iFields = config?.itemFields || ['icon', 'title', 'subtitle', 'description', 'bullets', 'image'];

  const updateItem = (iIndex: number, field: string, value: any) => {
    const newItems = [...section.items];
    newItems[iIndex] = { ...newItems[iIndex], [field]: value };
    updateSection(sIndex, "items", newItems);
  };

  const addItem = () => {
    updateSection(sIndex, "items", [
      ...section.items, 
      { title: "", description: "", icon: "", subtitle: "", bullets: [], order: section.items.length }
    ]);
  };

  const removeItem = (iIndex: number) => {
    updateSection(sIndex, "items", section.items.filter((_: any, i: number) => i !== iIndex));
  };

  // Bullet Point Logic
  const addBullet = (iIndex: number) => {
    const currentBullets = section.items[iIndex].bullets || [];
    updateItem(iIndex, "bullets", [...currentBullets, ""]);
  };

  const updateBulletValue = (iIndex: number, bIndex: number, value: string) => {
    const newBullets = [...(section.items[iIndex].bullets || [])];
    newBullets[bIndex] = value;
    updateItem(iIndex, "bullets", newBullets);
  };

  const removeBullet = (iIndex: number, bIndex: number) => {
    const newBullets = (section.items[iIndex].bullets || []).filter((_: any, i: number) => i !== bIndex);
    updateItem(iIndex, "bullets", newBullets);
  };

  return (
    <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3 text-[#1868A5]">
          <div className="p-2 bg-blue-50 rounded-xl">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Grid Configuration</h2>
            <p className="text-sm text-slate-500 font-medium">{section.title || "Untitled Section"}</p>
          </div>
        </div>
        <button 
          type="button" 
          onClick={addItem} 
          className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Add Element
        </button>
      </div>

      {/* SECTION GLOBAL FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        {sFields.includes('subtitle') && (
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Section Subtitle</label>
            <input 
              type="text" 
              value={section.subtitle || ""} 
              onChange={(e) => updateSection(sIndex, "subtitle", e.target.value)} 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1868A5] outline-none transition-all shadow-sm" 
              placeholder="e.g. Our Services"
            />
          </div>
        )}
        {sFields.includes('title') && (
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Section Heading</label>
            <input 
              type="text" 
              value={section.title || ""} 
              onChange={(e) => updateSection(sIndex, "title", e.target.value)} 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1868A5] outline-none transition-all shadow-sm" 
              placeholder="e.g. Why Choose Us"
            />
          </div>
        )}
        {sFields.includes('description') && (
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Main Description</label>
            <textarea 
              rows={4} 
              value={section.description || ""} 
              onChange={(e) => updateSection(sIndex, "description", e.target.value)} 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1868A5] outline-none transition-all shadow-sm resize-none leading-relaxed" 
              placeholder="Enter detailed section description..."
            />
          </div>
        )}
      </div>

      {/* GRID ITEMS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {section.items.map((item: any, iIndex: number) => (
          <div key={iIndex} className="group flex flex-col bg-white border border-slate-200 rounded-2xl transition-all hover:shadow-xl hover:border-blue-200">
            {/* Card Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <GripHorizontal className="text-slate-300 cursor-grab active:text-blue-500" size={20} />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Item {iIndex + 1}</span>
              </div>
              <button 
                type="button" 
                onClick={() => removeItem(iIndex)} 
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-6">
              
              {/* Image Upload Area */}
              {iFields.includes('image') && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visual Media</label>
                  <div className="relative group/img h-48 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:bg-blue-50/30 hover:border-blue-200">
                    {item.newImageFile || item.image ? (
                      <>
                        <img 
                          src={item.newImageFile ? URL.createObjectURL(item.newImageFile) : item.image} 
                          className="w-full h-full object-cover" 
                          alt="preview"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-all">
                            Change Image
                            <input 
                              type="file" 
                              className="sr-only" 
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && updateItem(iIndex, "newImageFile", e.target.files[0])}
                            />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2">
                        <div className="p-3 bg-white rounded-full shadow-sm text-slate-400">
                          <ImageIcon size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-500">Upload Image</p>
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && updateItem(iIndex, "newImageFile", e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {iFields.includes('icon') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lucide Icon</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Shield" 
                      value={item.icon || ""} 
                      onChange={(e) => updateItem(iIndex, "icon", e.target.value)} 
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all" 
                    />
                  </div>
                )}
                {iFields.includes('subtitle') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badge / Label</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 100+ Clients" 
                      value={item.subtitle || ""} 
                      onChange={(e) => updateItem(iIndex, "subtitle", e.target.value)} 
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all" 
                    />
                  </div>
                )}
              </div>

              {iFields.includes('title') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Heading</label>
                  <input 
                    type="text" 
                    placeholder="Enter item title..." 
                    value={item.title || ""} 
                    onChange={(e) => updateItem(iIndex, "title", e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none" 
                  />
                </div>
              )}
              
              {iFields.includes('description') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Body Text</label>
                  <textarea 
                    rows={4} 
                    placeholder="Enter detailed description..." 
                    value={item.description || ""} 
                    onChange={(e) => updateItem(iIndex, "description", e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:bg-white transition-all outline-none resize-none" 
                  />
                </div>
              )}

              {/* Dynamic Bullets List */}
              {iFields.includes('bullets') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feature Highlights</label>
                    <button 
                      type="button" 
                      onClick={() => addBullet(iIndex)}
                      className="text-xs flex items-center gap-1 text-[#1868A5] font-bold hover:underline"
                    >
                      <ListPlus size={14} /> Add Point
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {(item.bullets || []).length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-2 bg-slate-50 rounded-lg">No points added yet.</p>
                    )}
                    {(item.bullets || []).map((bullet: string, bIndex: number) => (
                      <div key={bIndex} className="flex items-center gap-2 group/bullet">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                        <input 
                          type="text"
                          value={bullet}
                          onChange={(e) => updateBulletValue(iIndex, bIndex, e.target.value)}
                          className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-blue-200 outline-none py-1 transition-all"
                          placeholder="Type point..."
                        />
                        <button 
                          type="button" 
                          onClick={() => removeBullet(iIndex, bIndex)}
                          className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/bullet:opacity-100 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}