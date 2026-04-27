"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import useSWR from "swr";
import HeroEditor from "@/components/admin/pages/HeroEditor";
import IntroEditor from "@/components/admin/pages/IntroEditor";
import GridEditor from "@/components/admin/pages/GridEditor";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const SLUG = "brokerage";

const defaultLayout = {
  heroTitle: "Global Aircraft Brokerage For Elite Buyers & Sellers",
  heroSubtitle: "Aircraft Brokerage",
  heroDesc: "Strategic aircraft acquisition, sales, valuation, and advisory services for discerning buyers, operators, and fleet owners worldwide.",
  heroImage: "",
  sections: [
    { 
      type: "INTRO", title: "Trusted Aircraft Advisory Across Global Markets", subtitle: "Who We Are", 
      description: "Skyblue is a specialist aircraft brokerage providing highly personalised advisory services for corporate buyers, high-net-worth individuals, and fleet operators.\n\nWe combine decades of international relationships, real-world transaction experience, and a deeply confidential process to help clients buy and sell aircraft with complete confidence.", 
      badgeIcon: "Globe2", badgeTitle: "International Expertise", badgeDesc: "Operating across 4 global markets with a single mission — delivering world-class aircraft transaction advisory.", 
      buttonText: "Aircraft Brokerage PDF", buttonLink: "/pdf/Aircraft-Brokerage.pdf", image: "", 
      tags: ["CANADA", "USA", "SINGAPORE", "INDIA"], items: [] 
    },
    { 
      type: "GRID", title: "The Skyblue Advantage", subtitle: "Why Skyblue", 
      items: [
        { icon: "Globe2", title: "KEY RELATIONSHIPS AND INTERNATIONAL EXPERTISE", description: "Extensive global network including aircraft owners and operators, major aircraft manufacturers as well as aviation brokers." },
        { icon: "TrendingUp", title: "Accurate Aircraft Appraisal", description: "Our strategic tie-up with Ascend enables us to provide objective, accurate and highly professional aircraft appraisals." },
      ] 
    },
    { 
      type: "GRID", title: "Every Detail Managed From Start To Finish", subtitle: "Transaction Process", 
      description: "Our proven six-stage process ensures a seamless transaction experience — from the first conversation to aircraft delivery.",
      items: [
        { subtitle: "01", title: "Sales Representation & Acquisition", description: "Sales representation and acquisition service for new or pre-owned business aircraft." },
        { subtitle: "02", title: "Aircraft Appraisals", description: "Independent aircraft appraisal services provided through Bond Aviation." },
      ] 
    },
    { 
      type: "GRID", title: "Experience Across Leading Aircraft Manufacturers", subtitle: "Aircraft Manufacturers", 
      description: "Extensive experience representing aircraft from the world’s most recognised business aviation manufacturers.",
      items: [
        { title: "Airbus", image: "" },
        { title: "Gulfstream", image: "" },
      ] 
    },
  ]
};

export default function AdminBrokeragePage() {
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

      if (pageData.newHeroImage) formData.append("heroImage", pageData.newHeroImage);
      
      pageData.sections.forEach((sec: any, sIndex: number) => {
        if (sec.newImageFile) formData.append(`section_${sIndex}_image`, sec.newImageFile);
        
        sec.items.forEach((item: any, iIndex: number) => {
          if (item.newImageFile) formData.append(`item_${sIndex}_${iIndex}_image`, item.newImageFile);
        });
      });

      const res = await fetch(`/api/admin/pages/${SLUG}`, { method: "POST", body: formData });
      const result = await res.json();
      
      if (result.success) toast.success("Brokerage Page saved successfully!");
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
          <h1 className="text-2xl font-bold text-slate-900">Aircraft Brokerage</h1>
          <p className="text-slate-500 text-sm mt-1">Manage acquisition services, transaction processes, and manufacturer listings.</p>
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