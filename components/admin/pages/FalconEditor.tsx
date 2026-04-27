"use client";

import React from "react";
import { 
  Plane, Image as ImageIcon, Plus, Trash2, 
  AlignLeft, AlignRight, FileText, Type, UploadCloud 
} from "lucide-react";

interface GridItem {
  label: string;
  value: string;
}

interface FalconData {
  content: {
    title: string;
    planeModel: string;
    subtitle: string;
    description: string;
    leftGridTitle: string;
    rightGridTitle: string;
  };
  imagePreview: string | null;
  imageFile: File | null;
  leftItems: GridItem[];
  rightItems: GridItem[];
}

interface Props {
  data: FalconData;
  updateContent: (field: string, value: string) => void;
  updateImage: (file: File | null) => void;
  updateGrid: (side: "LEFT" | "RIGHT", items: GridItem[]) => void;
}

export default function FalconEditor({ data, updateContent, updateImage, updateGrid }: Props) {
  
  const handleItemChange = (side: "LEFT" | "RIGHT", index: number, field: "label" | "value", val: string) => {
    const items = side === "LEFT" ? [...data.leftItems] : [...data.rightItems];
    items[index] = { ...items[index], [field]: val };
    updateGrid(side, items);
  };

  const addItem = (side: "LEFT" | "RIGHT") => {
    const items = side === "LEFT" ? [...data.leftItems] : [...data.rightItems];
    updateGrid(side, [...items, { label: "", value: "" }]);
  };

  const removeItem = (side: "LEFT" | "RIGHT", index: number) => {
    const items = side === "LEFT" ? [...data.leftItems] : [...data.rightItems];
    updateGrid(side, items.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10 mt-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 text-[#1868A5] border-b border-slate-100 pb-6">
        <div className="p-2.5 bg-blue-50 rounded-2xl"><Plane size={24} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Featured Aircraft (Falcon 900EX)</h2>
          <p className="text-sm text-slate-500 font-medium">Manage the specialized aircraft specifications section</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* TEXT CONTENT */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Company Title</label>
              <input type="text" value={data.content.title} onChange={(e) => updateContent("title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1868A5] transition-all font-bold" placeholder="DASSAULT FALCON" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Plane Model</label>
              <input type="text" value={data.content.planeModel} onChange={(e) => updateContent("planeModel", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1868A5] transition-all font-bold text-[#1868A5]" placeholder="900EX" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><Type size={14} className="text-blue-500" /> Subtitle</label>
            <input type="text" value={data.content.subtitle} onChange={(e) => updateContent("subtitle", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1868A5] outline-none" placeholder="LONG-RANGE PRIVATE AIRCRAFT" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><FileText size={14} className="text-blue-500" /> Description</label>
            <textarea rows={5} value={data.content.description} onChange={(e) => updateContent("description", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1868A5] outline-none resize-none leading-relaxed" />
          </div>
        </div>

        {/* MEDIA */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Background Image</label>
          <div className="relative group h-full min-h-[300px] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-blue-300">
            {data.imageFile || data.imagePreview ? (
              <>
                <img src={data.imageFile ? URL.createObjectURL(data.imageFile) : data.imagePreview!} className="w-full h-full object-cover" alt="aircraft" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <label className="cursor-pointer bg-white text-slate-900 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
                    <UploadCloud size={18} /> Replace Image
                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => e.target.files?.[0] && updateImage(e.target.files[0])} />
                  </label>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3 hover:text-[#1868A5] transition-colors">
                <ImageIcon size={40} className="text-slate-300 group-hover:text-[#1868A5]" />
                <span className="text-sm font-bold text-slate-400 group-hover:text-[#1868A5]">Upload Aircraft Image</span>
                <input type="file" className="sr-only" accept="image/*" onChange={(e) => e.target.files?.[0] && updateImage(e.target.files[0])} />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* DUAL SPEC GRIDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { side: "LEFT" as const, label: "Left Spec Grid", title: data.content.leftGridTitle, titleKey: "leftGridTitle", items: data.leftItems, icon: <AlignLeft size={16} /> },
          { side: "RIGHT" as const, label: "Right Spec Grid", title: data.content.rightGridTitle, titleKey: "rightGridTitle", items: data.rightItems, icon: <AlignRight size={16} /> }
        ].map((grid) => (
          <div key={grid.side} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                {grid.icon}
                <input type="text" value={grid.title} onChange={(e) => updateContent(grid.titleKey, e.target.value)} className="bg-transparent border-b border-dashed border-slate-300 focus:border-[#1868A5] outline-none w-32 p-1" placeholder="Grid Heading" />
              </div>
              <button type="button" onClick={() => addItem(grid.side)} className="text-[10px] font-black uppercase text-[#1868A5] hover:underline">Add Item</button>
            </div>

            <div className="space-y-3">
              {grid.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 group">
                  <input type="text" placeholder="Label (e.g. Range)" value={item.label} onChange={(e) => handleItemChange(grid.side, idx, "label", e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1868A5] outline-none" />
                  <input type="text" placeholder="Value (e.g. 4000 nm)" value={item.value} onChange={(e) => handleItemChange(grid.side, idx, "value", e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-[#1868A5] outline-none" />
                  <button onClick={() => removeItem(grid.side, idx)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                </div>
              ))}
              {grid.items.length === 0 && (
                 <p className="text-xs text-slate-400 italic text-center py-2">No items added to this grid.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}