"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { 
  Save, Loader2, Image as ImageIcon, 
  Plus, Trash2, AlignLeft, AlignRight, FileText 
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type GridItem = {
  id?: string;
  label: string;
  value: string;
};

export default function AdminCharterFalcon() {
  const [isSaving, setIsSaving] = useState(false);
  
  // Text Content State
  const [content, setContent] = useState({
    title: "DASSAULT FALCON",
    planeModel: "900EX",
    subtitle: "LONG-RANGE PRIVATE AIRCRAFT",
    description: "",
    leftGridTitle: "FEATURES",
    rightGridTitle: "NSOP",
  });

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Grid Items State
  const [leftItems, setLeftItems] = useState<GridItem[]>([]);
  const [rightItems, setRightItems] = useState<GridItem[]>([]);

  const { data, error, isLoading, mutate } = useSWR("/api/charter/falcon", fetcher, {
    revalidateOnFocus: false,
  });

  // Populate state on load
  useEffect(() => {
    if (data?.success && data.data) {
      const d = data.data;
      setContent({
        title: d.title || "",
        planeModel: d.planeModel || "",
        subtitle: d.subtitle || "",
        description: d.description || "",
        leftGridTitle: d.leftGridTitle || "",
        rightGridTitle: d.rightGridTitle || "",
      });
      setImagePreview(d.backgroundImage || null);
      setLeftItems(d.leftItems || []);
      setRightItems(d.rightItems || []);
    }
  }, [data]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Grid Item Handlers
  const addGridItem = (side: "LEFT" | "RIGHT") => {
    const newItem = { label: "", value: "" };
    if (side === "LEFT") setLeftItems([...leftItems, newItem]);
    else setRightItems([...rightItems, newItem]);
  };

  const updateGridItem = (side: "LEFT" | "RIGHT", index: number, field: "label" | "value", val: string) => {
    if (side === "LEFT") {
      const newItems = [...leftItems];
      newItems[index][field] = val;
      setLeftItems(newItems);
    } else {
      const newItems = [...rightItems];
      newItems[index][field] = val;
      setRightItems(newItems);
    }
  };

  const removeGridItem = (side: "LEFT" | "RIGHT", index: number) => {
    if (side === "LEFT") {
      setLeftItems(leftItems.filter((_, i) => i !== index));
    } else {
      setRightItems(rightItems.filter((_, i) => i !== index));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview && !imageFile) {
      toast.error("A background image is required.");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      
      // Append text content
      Object.entries(content).forEach(([key, val]) => {
        formData.append(key, val);
      });

      // Append Image
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Format and append Grid Items
      const formattedGridItems = [
        ...leftItems.map((item, index) => ({ side: "LEFT", label: item.label, value: item.value, order: index })),
        ...rightItems.map((item, index) => ({ side: "RIGHT", label: item.label, value: item.value, order: index }))
      ];
      
      formData.append("gridItems", JSON.stringify(formattedGridItems));

      const res = await fetch("/api/admin/charter/falcon", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Charter section updated successfully!");
        mutate();
      } else {
        toast.error(result.message || "Failed to save changes.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (error) toast.error("Failed to load Falcon section data.");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Charter Page (Falcon)</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the aircraft overview and specifications.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#1868A5]" size={32} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Header Content & Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
                <FileText size={20} />
                <h2 className="text-lg font-semibold text-slate-900">Header Content</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company / Main Title</label>
                  <input
                    required name="title" value={content.title} onChange={handleTextChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plane Model</label>
                  <input
                    required name="planeModel" value={content.planeModel} onChange={handleTextChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                <input
                  required name="subtitle" value={content.subtitle} onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  required name="description" value={content.description} onChange={handleTextChange} rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] resize-none"
                />
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col">
              <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
                <ImageIcon size={20} />
                <h2 className="text-lg font-semibold text-slate-900">Background Image</h2>
              </div>
              
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-1 min-h-[200px] flex items-center justify-center">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                        <ImageIcon size={16} /> Change Image
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                    <ImageIcon className="h-10 w-10 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-600">Click to upload image</span>
                    <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </section>
          </div>

          {/* Specifications Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Grid */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
                <AlignLeft size={20} />
                <h2 className="text-lg font-semibold text-slate-900 flex-1">Left Specification Grid</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grid Heading</label>
                <input
                  required name="leftGridTitle" value={content.leftGridTitle} onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-medium text-slate-700">List Items</label>
                {leftItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      placeholder="Label (e.g. Range)" value={item.label}
                      onChange={(e) => updateGridItem("LEFT", index, "label", e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                    />
                    <input
                      placeholder="Value (e.g. 4000 nm)" value={item.value}
                      onChange={(e) => updateGridItem("LEFT", index, "value", e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                    />
                    <button type="button" onClick={() => removeGridItem("LEFT", index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addGridItem("LEFT")} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-[#1868A5] hover:border-[#1868A5] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <Plus size={16} /> Add Item
                </button>
              </div>
            </section>

            {/* Right Grid */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
                <AlignRight size={20} />
                <h2 className="text-lg font-semibold text-slate-900 flex-1">Right Specification Grid</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grid Heading</label>
                <input
                  required name="rightGridTitle" value={content.rightGridTitle} onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-medium text-slate-700">List Items</label>
                {rightItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      placeholder="Label (e.g. Passenger)" value={item.label}
                      onChange={(e) => updateGridItem("RIGHT", index, "label", e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                    />
                    <input
                      placeholder="Value (e.g. Up to 14)" value={item.value}
                      onChange={(e) => updateGridItem("RIGHT", index, "value", e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                    />
                    <button type="button" onClick={() => removeGridItem("RIGHT", index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addGridItem("RIGHT")} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-[#1868A5] hover:border-[#1868A5] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <Plus size={16} /> Add Item
                </button>
              </div>
            </section>

          </div>
        </form>
      )}
    </div>
  );
}