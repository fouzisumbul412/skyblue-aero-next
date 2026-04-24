"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Image as ImageIcon, FileText, Activity, Star, Loader2 } from "lucide-react";

export default function AdminAboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    heroTitle: "Built on Trust. Driven by Excellence.",
    heroSubtitle: "About Us",
    title: "Our Story",
    storyHeading: "Aviation Expertise,\nDelivered with Precision.",
    content: "",
  });

  // Array States (Fixed lengths based on your Zod schema)
  const [counters, setCounters] = useState(
    Array(4).fill({ label: "", endValue: 0, suffix: "", order: 0 })
  );
  const [values, setValues] = useState(
    Array(3).fill({ title: "", description: "", order: 0 })
  );

  // File States & Previews
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [storyImage, setStoryImage] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [storyPreview, setStoryPreview] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/about");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const pageData = json.data;

            setFormData({
              heroTitle: pageData.heroTitle || "",
              heroSubtitle: pageData.heroSubtitle || "",
              title: pageData.title || "",
              storyHeading: pageData.storyHeading || "",
              content: pageData.content || "",
            });

            if (pageData.heroImage) setHeroPreview(pageData.heroImage);
            if (pageData.image) setStoryPreview(pageData.image);
            
            if (pageData.counters && pageData.counters.length > 0) {
              const fetchedCounters = [...pageData.counters].sort((a: any, b: any) => a.order - b.order);
              const mergedCounters = Array(4).fill(null).map((_, i) => fetchedCounters[i] || { label: "", endValue: 0, suffix: "", order: i + 1 });
              setCounters(mergedCounters);
            }

            if (pageData.values && pageData.values.length > 0) {
              const fetchedValues = [...pageData.values].sort((a: any, b: any) => a.order - b.order);
              const mergedValues = Array(3).fill(null).map((_, i) => fetchedValues[i] || { title: "", description: "", order: i + 1 });
              setValues(mergedValues);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch about data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "story") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "hero") {
        setHeroImage(file);
        setHeroPreview(URL.createObjectURL(file));
      } else {
        setStoryImage(file);
        setStoryPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleCounterChange = (index: number, field: string, value: string | number) => {
    const newCounters = [...counters];
    newCounters[index] = { ...newCounters[index], [field]: value, order: index + 1 };
    setCounters(newCounters);
  };

  const handleValueChange = (index: number, field: string, value: string) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: value, order: index + 1 };
    setValues(newValues);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formPayload = new FormData();
      
      // Append text fields
      Object.entries(formData).forEach(([key, val]) => formPayload.append(key, val));
      
      // Append arrays as JSON
      formPayload.append("counters", JSON.stringify(counters));
      formPayload.append("values", JSON.stringify(values));

      // Append files
      if (heroImage) formPayload.append("heroImage", heroImage);
      if (storyImage) formPayload.append("storyImage", storyImage);

      const res = await fetch("/api/admin/about", {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("About page updated successfully!");
      } else {
        toast.error(data.message || "Failed to update page.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-[#1868A5]" size={32} /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md pb-4 pt-2 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage About Page</h1>
          <p className="text-slate-500 text-sm mt-1">Update hero sections, story content, and company metrics.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>
      
      {/* Hero Section */}
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

          {/* Improved Image Upload */}
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

      {/* Our Story Section */}
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

          {/* Image Upload */}
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

      {/* Counters Section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
          <Activity size={20} />
          <h2 className="text-lg font-semibold text-slate-900">Performance Metrics </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {counters.map((counter, index) => (
            <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Card {index + 1}</div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Label (e.g. Personnel)</label>
                <input
                  type="text" value={counter.label || ""} onChange={(e) => handleCounterChange(index, "label", e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Number</label>
                  <input
                    type="number" value={counter.endValue || 0} onChange={(e) => handleCounterChange(index, "endValue", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Suffix (e.g. +)</label>
                  <input
                    type="text" value={counter.suffix || ""} onChange={(e) => handleCounterChange(index, "suffix", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-[#1868A5] border-b border-slate-100 pb-3">
          <Star size={20} />
          <h2 className="text-lg font-semibold text-slate-900">Core Values </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Value {index + 1}</div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                <input
                  type="text" value={value.title || ""} onChange={(e) => handleValueChange(index, "title", e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3} value={value.description || ""} onChange={(e) => handleValueChange(index, "description", e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1868A5] resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}