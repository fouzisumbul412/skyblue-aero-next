"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import useSWR from "swr";
import HeroEditor from "@/components/admin/pages/HeroEditor";
import IntroEditor from "@/components/admin/pages/IntroEditor";
import GridEditor from "@/components/admin/pages/GridEditor";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const SLUG = "contract-fuel";

const defaultLayout = {
  heroTitle: "Flexibility, Control and Convenience.",
  heroSubtitle: "Contract Fuel",
  heroDesc: "We provide you with a single source global fuel supply at over 4000 world-wide locations, at discounted rates.",
  heroImage: "",
  sections: [
    { type: "INTRO", title: "Every Uplift Coordinated By Our 24x7 Ops Team", subtitle: "Global Supply", description: "", badgeIcon: "TrendingDown", badgeTitle: "Maximum Cost Efficiency", badgeDesc: "", buttonText: "Contract Fuel PDF", buttonLink: "/pdf/contract-fuel.pdf", image: "", items: [] },
    { type: "GRID", title: "WHY CHOOSE OUR FUEL CARD", subtitle: "Why Skyblue", items: [] },
    { type: "GRID", title: "Reliability Meets Incredible Value", subtitle: "The Skyblue Promise", items: [] },
  ]
};

export default function AdminContractFuelPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState<any>(null);

  const { data, isLoading } = useSWR(`/api/pages/${SLUG}`, fetcher, { revalidateOnFocus: false });

  useEffect(() => {
    if (data?.success && data?.data) {
      setPageData({
        ...data.data,
        heroImagePreview: data.data.heroImage,
        newHeroImage: null,
        sections: data.data.sections.map((s: any) => ({ ...s, newImageFile: null }))
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
          items: s.items.map((i: any, order: number) => ({ ...i, order })) 
        }))
      };

      formData.append("pageData", JSON.stringify(cleanDataToSave));

      if (pageData.newHeroImage) formData.append("heroImage", pageData.newHeroImage);
      pageData.sections.forEach((sec: any, sIndex: number) => {
        if (sec.newImageFile) formData.append(`section_${sIndex}_image`, sec.newImageFile);
      });

      const res = await fetch(`/api/admin/pages/${SLUG}`, { method: "POST", body: formData });
      const result = await res.json();
      
      if (result.success) toast.success("Contract Fuel Page saved successfully!");
      else toast.error(result.message || "Failed to save.");
      
    } catch {
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
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md pb-4 pt-4 border-b border-slate-200 flex items-center justify-between shadow-sm -mx-6 px-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contract Fuel</h1>
          <p className="text-slate-500 text-sm mt-1">Manage content, images, and feature cards.</p>
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
              config={{ fields: ['subtitle', 'title', 'description', 'badge', 'button', 'image'] }} 
            />
          );
        }
        
        if (sIndex === 1) {
          return (
            <GridEditor 
              key={sIndex} sIndex={sIndex} section={section} updateSection={updateSection} 
              config={{
                sectionFields: ['subtitle', 'title'],
                itemFields: ['icon', 'subtitle', 'title', 'description'] 
              }}
            />
          );
        }

        if (sIndex === 2) {
          return (
            <GridEditor 
              key={sIndex} sIndex={sIndex} section={section} updateSection={updateSection} 
              config={{
                sectionFields: ['subtitle', 'title'],
                itemFields: ['icon', 'title', 'description', 'bullets']
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}