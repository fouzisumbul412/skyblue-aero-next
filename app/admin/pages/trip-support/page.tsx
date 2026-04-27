"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import useSWR from "swr";
import HeroEditor from "@/components/admin/pages/HeroEditor";
import IntroEditor from "@/components/admin/pages/IntroEditor";
import GridEditor from "@/components/admin/pages/GridEditor";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const SLUG = "trip-support";

const defaultLayout = {
  heroTitle: "International Trip Support Services",
  heroSubtitle: "Flight Operations",
  heroDesc: "Comprehensive global flight operations, from complex routing and diplomatic clearances to flawless on-ground coordination for VIP operators globally.",
  heroImage: "",
  sections: [
    { 
      type: "INTRO", title: "Seamless Global Operations Supported Anywhere", subtitle: "Overview", 
      description: "Executing international missions often involves navigating complex regulatory hurdles, unpredictable weather patterns, and shifting logistical challenges. Skyblue provides turnkey flight operations support designed to alleviate the burden on flight departments and operators.\n\nBacked by our 24/7 Global Operations Center, we bring unrivaled regional expertise to ensure every detail of your itinerary is executed with absolute precision and discretion.", 
      badgeIcon: "Globe2", badgeTitle: "24/7 Availability", badgeDesc: "Our dispatch teams across global hubs are monitoring weather, NOTAMs, and flight statuses around the clock.", 
      buttonText: "Trip Support PDF", buttonLink: "/pdf/Trip-Support.pdf", image: "", 
      tags: ["AFRICA", "MIDDLE EAST", "ASIA PACIFIC", "EUROPE", "AMERICAS"], items: [] 
    },
    { 
      type: "GRID", title: "Uncompromising Standard of Service", subtitle: "Why Skyblue", 
      items: [
        { icon: "Globe2", title: "PERMITS - HONORING DEADLINES, DELIVERING PROMISES", description: "Whether you are operating to Africa, Asia, Russia, the Americas or beyond, the Skyblue Permits Team will secure your landing and over flight permits quickly and efficiently." },
        { icon: "Clock", title: "FLIGHT PLANNING - GLITCH FREE AIRLINE - STANDARD", description: "By using the latest technologies in computerized flight planning, the Skyblue Ops Team is committed to getting you the most direct and cost-effective route." },
      ] 
    },
    { 
      type: "GRID", title: "Why Operators Trust Skyblue For Every Mission", subtitle: "Skyblue USP", 
      description: "Every trip is supported by proven systems, transparent pricing, operational expertise, and a worldwide knowledge network designed to remove complexity from mission planning.",
      items: [
        { subtitle: "01", title: "Team Trip Ownership System", description: "Dedicated Trip Coordinators with over 5+ years of experience manage every trip personally." },
        { subtitle: "02", title: "Quality Control", description: "Every trip is processed through a detailed 30-step quality control checklist to ensure precision." },
      ] 
    },
    { 
      type: "GRID", title: "Comprehensive Trip Support Services Covering Every Corner Of The Globe", subtitle: "Global Coverage", 
      description: "Skyblue supports operators, crews, and missions across all major aviation markets with deep regional expertise and trusted local partnerships.",
      items: [
        { title: "Asia", image: "" },
        { title: "Africa", image: "" },
      ] 
    },
  ]
};

export default function AdminTripSupportPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState<any>(null);

  const { data, isLoading } = useSWR(`/api/pages/${SLUG}`, fetcher, { revalidateOnFocus: false });

  useEffect(() => {
    if (data?.success && data?.data) {
      setPageData({
        ...data.data,
        heroImagePreview: data.data.heroImage,
        newHeroImage: null,
        sections: data.data.sections.map((s: any) => ({
          ...s, 
          newImageFile: null,
          items: s.items.map((i: any) => ({ ...i, newImageFile: null }))
        }))
      });
    } else if (data && !data.success) {
      setPageData(defaultLayout);
    }
  }, [data]);

  const updatePage = (field: string, value: any) => setPageData({ ...pageData, [field]: value });
  
  const updateSection = (sIndex: number, field: string, value: any) => {
    const updatedSections = [...pageData.sections];
    updatedSections[sIndex] = { ...updatedSections[sIndex], [field]: value };
    setPageData({ ...pageData, sections: updatedSections });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      const cleanDataToSave = {
        heroTitle: pageData.heroTitle, heroSubtitle: pageData.heroSubtitle, heroDesc: pageData.heroDesc, heroImage: pageData.heroImage,
        sections: pageData.sections.map((s: any) => ({
          type: s.type, order: s.order, title: s.title, subtitle: s.subtitle, description: s.description, image: s.image,
          badgeIcon: s.badgeIcon, badgeTitle: s.badgeTitle, badgeDesc: s.badgeDesc, buttonText: s.buttonText, buttonLink: s.buttonLink,
          tags: s.tags,
          items: s.items.map((i: any, order: number) => ({ ...i, order, image: i.image })) 
        }))
      };

      formData.append("pageData", JSON.stringify(cleanDataToSave));

      // Append physical files
      if (pageData.newHeroImage) formData.append("heroImage", pageData.newHeroImage);
      
      pageData.sections.forEach((sec: any, sIndex: number) => {
        if (sec.newImageFile) formData.append(`section_${sIndex}_image`, sec.newImageFile);
        
        // Ensure item images (like Global Coverage country flags) are appended!
        sec.items.forEach((item: any, iIndex: number) => {
          if (item.newImageFile) formData.append(`item_${sIndex}_${iIndex}_image`, item.newImageFile);
        });
      });

      const res = await fetch(`/api/admin/pages/${SLUG}`, { method: "POST", body: formData });
      const result = await res.json();
      
      if (result.success) toast.success("Trip Support Page saved successfully!");
      else toast.error(result.message || "Failed to save.");
      
    } catch (error) {
      toast.error("An error occurred during save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !pageData) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#1868A5]" size={32} /></div>;
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8 pb-20">
      <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md pb-4 pt-4 border-b border-slate-200 flex items-center justify-between shadow-sm -mx-6 px-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trip Support</h1>
          <p className="text-slate-500 text-sm mt-1">Manage operations content, USP cards, and global coverage maps.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md disabled:opacity-50">
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <HeroEditor data={pageData} onChange={updatePage} onImageChange={(f) => updatePage("newHeroImage", f)} />

      {pageData.sections.map((section: any, sIndex: number) => {
        
        if (sIndex === 0) {
          return (
            <IntroEditor 
              key={sIndex} sIndex={sIndex} section={section} updateSection={updateSection} 
              onImageChange={(idx, f) => updateSection(idx, "newImageFile", f)} 
              config={{ fields: ['subtitle', 'title', 'description', 'badge', 'button', 'image', 'tags'] }} 
            />
          );
        }
        
        if (sIndex === 1) {
          return (
            <GridEditor 
              key={sIndex} sIndex={sIndex} section={section} updateSection={updateSection} 
              config={{
                sectionFields: ['subtitle', 'title'],
                itemFields: ['icon', 'title', 'description']
              }}
            />
          );
        }

        if (sIndex === 2) {
          return (
            <GridEditor 
              key={sIndex} sIndex={sIndex} section={section} updateSection={updateSection} 
              config={{
                sectionFields: ['subtitle', 'title', 'description'],
                itemFields: ['subtitle', 'title', 'description']
              }}
            />
          );
        }

        if (sIndex === 3) {
          return (
            <GridEditor 
              key={sIndex} sIndex={sIndex} section={section} updateSection={updateSection} 
              config={{
                sectionFields: ['subtitle', 'title', 'description'],
                itemFields: ['title', 'image'] 
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}