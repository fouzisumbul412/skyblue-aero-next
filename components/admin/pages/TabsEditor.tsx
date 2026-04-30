"use client";

import React, { useState } from "react";
import { 
  TableProperties, Plus, Trash2, GripHorizontal, 
  Image as ImageIcon, Type, BadgeInfo, LayoutGrid, 
  AlignLeft, Settings2, X
} from "lucide-react";
import { MAX_FILE_SIZE } from "@/lib/constants";
import toast from "react-hot-toast";

interface Props {
  section: any;
  sIndex: number;
  updateSection: (index: number, field: string, value: any) => void;
}

export default function TabsEditor({ section, sIndex, updateSection }: Props) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const updateItem = (iIndex: number, field: string, value: any) => {
    const newItems = [...section.items];
    newItems[iIndex] = { ...newItems[iIndex], [field]: value };
    updateSection(sIndex, "items", newItems);
  };

  const updateExtra = (iIndex: number, field: string, value: any) => {
    const currentExtra = section.items[iIndex].extraData || {};
    updateItem(iIndex, "extraData", { ...currentExtra, [field]: value });
  };

  const addTab = () => {
    const newItem = {
      title: "New Tab Content",
      subtitle: "New Tab Label",
      description: "",
      image: "",
      extraData: {
        mainHeading: "Enter Heading",
        badge: { icon: "ShieldCheck", title: "Badge Title", desc: "Badge text" },
        features: [{ icon: "Star", title: "Feature", desc: "Feature desc" }]
      },
      order: section.items.length
    };
    updateSection(sIndex, "items", [...section.items, newItem]);
    setActiveTabIdx(section.items.length);
  };

  const removeTab = (idx: number) => {
    const newItems = section.items.filter((_: any, i: number) => i !== idx);
    updateSection(sIndex, "items", newItems);
    if (activeTabIdx >= newItems.length) setActiveTabIdx(Math.max(0, newItems.length - 1));
  };

  // Feature logic inside tab
  const updateFeature = (fIndex: number, field: string, value: string) => {
    const features = [...(section.items[activeTabIdx].extraData?.features || [])];
    features[fIndex] = { ...features[fIndex], [field]: value };
    updateExtra(activeTabIdx, "features", features);
  };

  const addFeature = () => {
    const features = [...(section.items[activeTabIdx].extraData?.features || [])];
    features.push({ icon: "Star", title: "New Feature", desc: "Description" });
    updateExtra(activeTabIdx, "features", features);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File is too large. Please select an image smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        e.target.value = '';
        return;
      }
      updateItem(activeTabIdx, "newImageFile", file);
    }
  };

  const currentTab = section.items[activeTabIdx];

  return (
    <section className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3 text-[#1868A5]">
          <div className="p-2.5 bg-blue-50 rounded-2xl">
            <TableProperties size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Tabbed Content Configuration</h2>
            <p className="text-sm text-slate-500 font-medium">Manage multiple content views within this section</p>
          </div>
        </div>
        <button type="button" onClick={addTab} className="flex items-center gap-2 bg-[#1868A5] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#145a8d] transition-all shadow-md">
          <Plus size={18} /> Add Tab
        </button>
      </div>

      {/* TAB NAVIGATION ADMIN */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
        {section.items.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center group">
            <button
              onClick={() => setActiveTabIdx(idx)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTabIdx === idx ? "bg-white text-[#1868A5] shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {item.subtitle || `Tab ${idx + 1}`}
            </button>
            {section.items.length > 1 && (
              <button onClick={() => removeTab(idx)} className="p-1 -ml-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {currentTab && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
          {/* LEFT: MEDIA & BADGE */}
          <div className="space-y-8">
             <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ImageIcon size={16} className="text-blue-500" /> Featured Media & Badge
                </label>
                <div className="relative group h-[400px] bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center">
                  {currentTab.newImageFile || currentTab.image ? (
                    <>
                      <img src={currentTab.newImageFile ? URL.createObjectURL(currentTab.newImageFile) : currentTab.image} className="w-full h-full object-cover" alt="preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <label className="cursor-pointer bg-white text-slate-900 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl">
                          Change Image
                          <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <ImageIcon size={32} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-400">Upload Media</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                </div>

                {/* Badge Editor */}
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400">
                    <BadgeInfo size={14} /> Floating Badge Config
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Icon (ShieldCheck)" value={currentTab.extraData?.badge?.icon || ""} onChange={(e) => updateExtra(activeTabIdx, "badge", { ...currentTab.extraData.badge, icon: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium" />
                    <input type="text" placeholder="Badge Title" value={currentTab.extraData?.badge?.title || ""} onChange={(e) => updateExtra(activeTabIdx, "badge", { ...currentTab.extraData.badge, title: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium" />
                  </div>
                  <textarea rows={2} value={currentTab.extraData?.badge?.desc || ""} onChange={(e) => updateExtra(activeTabIdx, "badge", { ...currentTab.extraData.badge, desc: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium resize-none" placeholder="Badge description..." />
                </div>
             </div>
          </div>

          {/* RIGHT: TEXT & FEATURES */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tab Button Label</label>
                <input type="text" value={currentTab.subtitle || ""} onChange={(e) => updateItem(activeTabIdx, "subtitle", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white transition-all text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Inner Tagline</label>
                <input type="text" value={currentTab.title || ""} onChange={(e) => updateItem(activeTabIdx, "title", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white transition-all text-sm font-bold text-orange-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><Type size={14} className="text-blue-500" /> Main Content Heading</label>
              <input type="text" value={currentTab.extraData?.mainHeading || ""} onChange={(e) => updateExtra(activeTabIdx, "mainHeading", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-lg" placeholder="e.g. A Strict Regime of Airworthiness" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><AlignLeft size={14} className="text-blue-500" /> Body Text</label>
              <textarea rows={8} value={currentTab.description || ""} onChange={(e) => updateItem(activeTabIdx, "description", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm leading-relaxed resize-none" placeholder="Enter multi-paragraph content..." />
            </div>

            {/* Sub-Features List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><LayoutGrid size={16} className="text-blue-500" /> Highlight Features</label>
                <button type="button" onClick={addFeature} className="text-xs font-black uppercase text-[#1868A5] hover:underline">Add Feature</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(currentTab.extraData?.features || []).map((feat: any, fIdx: number) => (
                  <div key={fIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group/feat">
                    <button onClick={() => updateExtra(activeTabIdx, "features", currentTab.extraData.features.filter((_: any, i: number) => i !== fIdx))} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/feat:opacity-100 transition-all"><Trash2 size={14} /></button>
                    <div className="space-y-2">
                       <input type="text" placeholder="Icon" value={feat.icon || ""} onChange={(e) => updateFeature(fIdx, "icon", e.target.value)} className="w-full bg-transparent text-[10px] font-bold text-blue-500 uppercase outline-none" />
                       <input type="text" placeholder="Title" value={feat.title || ""} onChange={(e) => updateFeature(fIdx, "title", e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none" />
                       <textarea rows={2} placeholder="Desc" value={feat.desc || ""} onChange={(e) => updateFeature(fIdx, "desc", e.target.value)} className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}