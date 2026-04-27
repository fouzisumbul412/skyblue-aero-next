"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import useSWR from "swr";

import HeroEditor from "@/components/admin/pages/HeroEditor";
import IntroEditor from "@/components/admin/pages/IntroEditor";
import GridEditor from "@/components/admin/pages/GridEditor";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const SLUG = "crew-leasing";

const defaultLayout = {
  heroTitle: "Expert Crew. On Demand.",
  heroSubtitle: "Crew Leasing",
  heroDesc: "Access one of the world’s largest networks of experienced business and commercial aviation professionals for short-term, long-term, and urgent crew requirements.",
  heroImage: "",
  sections: [
    { 
      type: "INTRO", title: "Qualified Aviation Professionals Ready To Support Your Operation", subtitle: "Global Crew Network", 
      description: "Skyblue provides access to over 4,000 experienced aviation professionals worldwide, including pilots, cabin crew, engineers, dispatchers, and operational support staff.\n\nWhether you require temporary crew coverage, urgent AOG support, or long-term placement solutions, we deliver highly qualified personnel quickly and efficiently.", 
      badgeIcon: "Users", badgeTitle: "Aviation Talent Network", badgeDesc: "Supporting operators worldwide with experienced aviation professionals across business aviation and commercial aviation.", 
      buttonText: "Crew Leasing PDF", buttonLink: "/pdf/Crew-Leasing.pdf", image: "", 
      tags: ["CANADA", "USA", "SINGAPORE", "INDIA"], items: [] 
    },
    { 
      type: "GRID", title: "The Skyblue Advantage", subtitle: "Why Skyblue", 
      items: [
        { icon: "Globe2", title: "UNPARALLELED INTERNATIONAL EXPERIENCE", description: "Skyblue has supplied crew for major business and commercial aircraft types in on all 5 continents." },
        { icon: "Users", title: "CULTURAL AWARENESS & SENSITIVITY", description: "Skyblue personnel and pilots are aware and mindful of the varied cultural distinctions around the world." },
      ] 
    },
    { 
      type: "GRID", title: "Pilot Support Services For Short-Term, Long-Term And Full-Time Placement", subtitle: "Pilot Support Services", 
      description: "Skyblue provides experienced pilot support across business aviation, commercial aviation, inspection operations, training environments, and aircraft delivery requirements worldwide.",
      items: [
        { icon: "Plane", subtitle: "Pilot Availability", title: "Pilots Available For", bullets: ["Inspection Flights", "Private Operations", "Commercial Operations", "Pilot Training", "Charter Flights"] },
        { icon: "GraduationCap", subtitle: "Training Captains", title: "Training Captains", bullets: ["CFI Certified Flight Instructor", "TRE Type Rating Examiner", "TRI Type Rating Instructor", "Simulator Instructors"] },
      ] 
    },
    { 
      type: "GRID", title: "Crew Available On All Aircraft Types From The Following Manufacturers", subtitle: "Aircraft Expertise", 
      description: "Skyblue supplies experienced crew for a wide range of business and commercial aircraft platforms across the world’s leading aircraft manufacturers.",
      items: [
        { title: "Airbus", image: "" },
        { title: "Bombardier", image: "" },
      ] 
    },
  ]
};

export default function AdminCrewLeasingPage() {
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
      
      if (result.success) toast.success("Crew Leasing Page saved successfully!");
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
          <h1 className="text-2xl font-bold text-slate-900">Crew Leasing</h1>
          <p className="text-slate-500 text-sm mt-1">Manage global talent networks, pilot support services, and aircraft expertise.</p>
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
                itemFields: ['icon', 'subtitle', 'title', 'bullets']
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