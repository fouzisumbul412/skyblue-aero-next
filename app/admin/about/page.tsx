"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import HeroSectionAbout from "@/components/admin/about/HeroSectionAbout";
import StorySectionAbout from "@/components/admin/about/StorySectionAbout";
import CountersSectionAbout from "@/components/admin/about/CountersSectionAbout";
import ValuesSectionAbout from "@/components/admin/about/ValuesSectionAbout";

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

  const [counters, setCounters] = useState(
    Array(4).fill({ label: "", endValue: 0, suffix: "", order: 0 })
  );
  const [values, setValues] = useState(
    Array(3).fill({ title: "", description: "", order: 0 })
  );

  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [storyImage, setStoryImage] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [storyPreview, setStoryPreview] = useState<string | null>(null);

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
      Object.entries(formData).forEach(([key, val]) => formPayload.append(key, val));
      formPayload.append("counters", JSON.stringify(counters));
      formPayload.append("values", JSON.stringify(values));
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
    } catch {
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
      
      <HeroSectionAbout 
        formData={formData} 
        handleTextChange={handleTextChange} 
        heroPreview={heroPreview} 
        handleImageChange={handleImageChange} 
      />

      <StorySectionAbout 
        formData={formData} 
        handleTextChange={handleTextChange} 
        storyPreview={storyPreview} 
        handleImageChange={handleImageChange} 
      />

      <CountersSectionAbout 
        counters={counters} 
        handleCounterChange={handleCounterChange} 
      />

      <ValuesSectionAbout 
        values={values} 
        handleValueChange={handleValueChange} 
      />
    </div>
  );
}