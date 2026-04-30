"use client";

import React, { useState } from "react";
import { 
  LayoutGrid, Plus, Trash2, GripHorizontal, 
  Image as ImageIcon, X, ListPlus, ChevronDown, ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";
import { MAX_FILE_SIZE } from "@/lib/constants";

interface Props {
  section: any;
  sIndex: number;
  config?: { sectionFields: string[], itemFields: string[] };
  updateSection: (index: number, field: string, value: any) => void;
}

export default function GridEditor({ section, sIndex, config, updateSection }: Props) {
  // Accordion state: tracks the index of the currently open item (null if all closed)
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const sFields = config?.sectionFields || ['subtitle', 'title', 'description'];
  const iFields = config?.itemFields || ['icon', 'title', 'subtitle', 'description', 'bullets', 'image'];

  const updateItem = (iIndex: number, field: string, value: any) => {
    const newItems = [...section.items];
    newItems[iIndex] = { ...newItems[iIndex], [field]: value };
    updateSection(sIndex, "items", newItems);
  };

  const addItem = () => {
    const newIndex = section.items.length;
    updateSection(sIndex, "items", [
      ...section.items, 
      { title: "", description: "", icon: "", subtitle: "", bullets: [], order: newIndex }
    ]);
    // Automatically expand the newly added item
    setExpandedItem(newIndex);
  };

  const removeItem = (iIndex: number) => {
    updateSection(sIndex, "items", section.items.filter((_: any, i: number) => i !== iIndex));
    // Reset expanded state if the deleted item was open
    if (expandedItem === iIndex) setExpandedItem(null);
  };

  const toggleExpand = (iIndex: number) => {
    setExpandedItem(prev => prev === iIndex ? null : iIndex);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, iIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File is too large. Please select an image smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        e.target.value = '';
        return;
      }
      updateItem(iIndex, "newImageFile", file);
    }
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

      {/* ACCORDION ITEMS LIST */}
      <div className="flex flex-col gap-4">
        {section.items.map((item: any, iIndex: number) => {
          const isExpanded = expandedItem === iIndex;
          
          return (
            <div key={iIndex} className={`group flex flex-col bg-white border rounded-2xl transition-all duration-300 ${isExpanded ? 'border-blue-300 shadow-md ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-200 hover:shadow-sm'}`}>
              
              {/* Accordion Header (Clickable) */}
              <div 
                className={`px-5 py-4 flex items-center justify-between cursor-pointer select-none transition-colors ${isExpanded ? 'bg-blue-50/50 rounded-t-2xl' : 'bg-slate-50 hover:bg-slate-100 rounded-2xl'}`}
                onClick={() => toggleExpand(iIndex)}
              >
                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                  <div 
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-blue-600"
                    onClick={(e) => e.stopPropagation()} // Prevent expand when dragging
                  >
                    <GripHorizontal size={20} />
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 w-16">
                    Item {iIndex + 1}
                  </span>
                  {/* Dynamic Title Preview */}
                  <span className="text-sm font-bold text-slate-800 truncate pr-4">
                    {item.title || item.subtitle || <span className="text-slate-400 italic">Empty Item</span>}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeItem(iIndex); }} 
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Item"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className={`p-1 transition-transform duration-300 ${isExpanded ? 'text-blue-600' : 'text-slate-400'}`}>
                    {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                  </div>
                </div>
              </div>

              {/* Accordion Body (Expanded Form) */}
              {isExpanded && (
                <div className="p-6 space-y-8 border-t border-blue-100 bg-white rounded-b-2xl animate-in slide-in-from-top-2 duration-200">
                  
                  {/* Image Upload Area */}
                  {iFields.includes('image') && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visual Media</label>
                      <div className="relative group/img h-48 w-full md:w-1/2 lg:w-1/3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:bg-blue-50/30 hover:border-blue-200">
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
                                  onChange={(e) => handleFileChange(e, iIndex)}
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
                              onChange={(e) => handleFileChange(e, iIndex)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Icon & Subtitle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {iFields.includes('icon') && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lucide Icon Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. ShieldCheck" 
                          value={item.icon || ""} 
                          onChange={(e) => updateItem(iIndex, "icon", e.target.value)} 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none" 
                        />
                      </div>
                    )}
                    {iFields.includes('subtitle') && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badge / Stat Label</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 60+ Cities" 
                          value={item.subtitle || ""} 
                          onChange={(e) => updateItem(iIndex, "subtitle", e.target.value)} 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none" 
                        />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  {iFields.includes('title') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Card Heading</label>
                      <input 
                        type="text" 
                        placeholder="Enter item title..." 
                        value={item.title || ""} 
                        onChange={(e) => updateItem(iIndex, "title", e.target.value)} 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none" 
                      />
                    </div>
                  )}
                  
                  {/* Description */}
                  {iFields.includes('description') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Body Text</label>
                      <textarea 
                        rows={4} 
                        placeholder="Enter detailed description..." 
                        value={item.description || ""} 
                        onChange={(e) => updateItem(iIndex, "description", e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:bg-white transition-all outline-none resize-y" 
                      />
                    </div>
                  )}

                  {/* Dynamic Bullets List */}
                  {iFields.includes('bullets') && (
                    <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Feature Checklist</label>
                        <button 
                          type="button" 
                          onClick={() => addBullet(iIndex)}
                          className="text-xs flex items-center gap-1 text-[#1868A5] font-bold hover:underline"
                        >
                          <ListPlus size={14} /> Add Point
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {(item.bullets || []).length === 0 && (
                          <p className="text-xs text-slate-400 italic text-center py-2">No checklist points added.</p>
                        )}
                        {(item.bullets || []).map((bullet: string, bIndex: number) => (
                          <div key={bIndex} className="flex items-center gap-3 group/bullet bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                            <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 ml-2" />
                            <input 
                              type="text"
                              value={bullet}
                              onChange={(e) => updateBulletValue(iIndex, bIndex, e.target.value)}
                              className="flex-1 text-sm bg-transparent border-none outline-none py-1 transition-all font-medium text-slate-700"
                              placeholder="Type checklist point..."
                            />
                            <button 
                              type="button" 
                              onClick={() => removeBullet(iIndex, bIndex)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {section.items.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
            <LayoutGrid size={40} className="mb-3 opacity-20" />
            <p className="text-sm font-semibold">No items added to this grid yet.</p>
            <p className="text-xs mt-1 opacity-70">Click "Add Element" to create your first card.</p>
          </div>
        )}
      </div>
    </section>
  );
}