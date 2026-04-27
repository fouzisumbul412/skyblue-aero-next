"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import useSWR from "swr";
import HeroEditor from "@/components/admin/pages/HeroEditor";
import TabsEditor from "@/components/admin/pages/TabsEditor";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const SLUG = "maintenance";

const defaultLayout = {
  heroTitle: "Maintenance & Pilot Excellence.",
  heroSubtitle: "Uncompromising Safety",
  heroDesc: "Maintained to the highest standards of airworthiness and operated by elite DGCA-approved examiners and senior captains.",
  heroImage: "",
  sections: [
    { 
      type: "TABS", 
      items: [
        { 
          subtitle: "Maintenance History", title: "Maintenance History", 
          description: "All scheduled and unscheduled maintenance is carried out by DGCA-approved maintenance organizations...",
          image: "",
          extraData: {
            mainHeading: "A Strict Regime of Airworthiness",
            badge: { icon: "ShieldCheck", title: "DGCA Compliant", desc: "Ensuring complete traceability..." },
            features: [
                { icon: "Wrench", title: "C-Check Complete", desc: "Comprehensive program approved" },
                { icon: "ClipboardCheck", title: "Total Traceability", desc: "100% up-to-date aircraft logs" }
            ]
          }
        }
      ] 
    }
  ]
};

export default function AdminMaintenancePage() {
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
          type: s.type, order: s.order,
          items: s.items.map((i: any, order: number) => ({
            ...i, order, extraData: i.extraData 
          })) 
        }))
      };

      formData.append("pageData", JSON.stringify(cleanDataToSave));
      if (pageData.newHeroImage) formData.append("heroImage", pageData.newHeroImage);
      
      pageData.sections.forEach((sec: any, sIndex: number) => {
        sec.items.forEach((item: any, iIndex: number) => {
          if (item.newImageFile) formData.append(`item_${sIndex}_${iIndex}_image`, item.newImageFile);
        });
      });

      const res = await fetch(`/api/admin/pages/${SLUG}`, { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) toast.success("Maintenance Page saved successfully!");
      else toast.error(result.message || "Failed to save.");
    } catch (error) {
      toast.error("An error occurred during save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !pageData) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#1868A5]" size={32} /></div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8 pb-20">
      <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md pb-4 pt-4 border-b border-slate-200 flex items-center justify-between shadow-sm -mx-6 px-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance & Pilot Excellence</h1>
          <p className="text-slate-500 text-sm mt-1">Manage safety standards, tab content, and elite pilot highlights.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md">
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <HeroEditor data={pageData} onChange={updatePage} onImageChange={(f) => updatePage("newHeroImage", f)} />

      {pageData.sections.map((section: any, sIndex: number) => {
        if (section.type === "TABS") {
          return <TabsEditor key={sIndex} sIndex={sIndex} section={section} updateSection={updateSection} />;
        }
        return null;
      })}
    </div>
  );
}