"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import useSWR from "swr";
import HeroEditor from "@/components/admin/pages/HeroEditor";
import IntroEditor from "@/components/admin/pages/IntroEditor";
import FalconEditor from "@/components/admin/pages/FalconEditor";

type GridItem = {
  label: string;
  value: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SLUG = "charters";

const defaultChartersLayout = {
  heroTitle: "Luxury in Air. Personalised.", heroSubtitle: "Air Charter Services",
  heroDesc: "Experience seamless private aviation with tailored charter solutions, global access, and unmatched operational expertise.",
  heroImage: "",
  sections: [
    { type: "INTRO", title: "Your Private Sky", subtitle: "Bespoke Experience", description: "Every charter is a bespoke experience...", image: "", items: [] }
  ]
};

export default function AdminChartersPage() {
  const [isSaving, setIsSaving] = useState(false);
  
  const [pageData, setPageData] = useState<any>(null);
  const { data: pageResp, isLoading: isPageLoading, mutate: mutatePage } = useSWR(`/api/pages/${SLUG}`, fetcher, { revalidateOnFocus: false });

  const [falconData, setFalconData] = useState({
    content: { title: "DASSAULT FALCON", planeModel: "900EX", subtitle: "LONG-RANGE PRIVATE AIRCRAFT", description: "", leftGridTitle: "FEATURES", rightGridTitle: "NSOP" },
    imagePreview: null as string | null,
    imageFile: null as File | null,
    leftItems: [] as GridItem[],
    rightItems: [] as GridItem[],
  });

  const { data: falconResp, isLoading: isFalconLoading, mutate: mutateFalcon } = useSWR("/api/charter/falcon", fetcher, { revalidateOnFocus: false });

  useEffect(() => {
    if (pageResp?.success && pageResp?.data) {
      setPageData({
        ...pageResp.data, heroImagePreview: pageResp.data.heroImage, newHeroImage: null,
        sections: pageResp.data.sections.map((s: any) => ({ ...s, newImageFile: null }))
      });
    } else if (pageResp && !pageResp.success) setPageData(defaultChartersLayout);
  }, [pageResp]);

  useEffect(() => {
    if (falconResp?.success && falconResp?.data) {
      const d = falconResp.data;
      setFalconData({
        content: {
          title: d.title || "", planeModel: d.planeModel || "", subtitle: d.subtitle || "",
          description: d.description || "", leftGridTitle: d.leftGridTitle || "", rightGridTitle: d.rightGridTitle || "",
        },
        imagePreview: d.backgroundImage || null,
        imageFile: null,
        leftItems: d.leftItems || [],
        rightItems: d.rightItems || []
      });
    }
  }, [falconResp]);

  
  const updatePage = (field: string, value: any) => setPageData({ ...pageData, [field]: value });
  const updateSection = (sIndex: number, field: string, value: any) => {
    const updatedSections = [...pageData.sections];
    updatedSections[sIndex] = { ...updatedSections[sIndex], [field]: value };
    setPageData({ ...pageData, sections: updatedSections });
  };

  const updateFalconContent = (field: string, value: string) => setFalconData(prev => ({ ...prev, content: { ...prev.content, [field]: value } }));
  const updateFalconImage = (file: File | null) => setFalconData(prev => ({ ...prev, imageFile: file, imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview }));
  const updateFalconGrid = (side: "LEFT" | "RIGHT", items: GridItem[]) => setFalconData(prev => side === "LEFT" ? { ...prev, leftItems: items } : { ...prev, rightItems: items });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      //  Prepare Charters Data (Dynamic Schema)
      const chartersFormData = new FormData();
      const cleanDataToSave = {
        heroTitle: pageData.heroTitle, heroSubtitle: pageData.heroSubtitle, heroDesc: pageData.heroDesc, heroImage: pageData.heroImage,
        sections: pageData.sections.map((s: any) => ({
          type: s.type, order: s.order, title: s.title, subtitle: s.subtitle, description: s.description, image: s.image, items: s.items 
        }))
      };
      chartersFormData.append("pageData", JSON.stringify(cleanDataToSave));
      if (pageData.newHeroImage) chartersFormData.append("heroImage", pageData.newHeroImage);
      pageData.sections.forEach((sec: any, sIndex: number) => {
        if (sec.newImageFile) chartersFormData.append(`section_${sIndex}_image`, sec.newImageFile);
      });

      // Prepare Falcon Data (Specific Schema)
      const falconFormData = new FormData();
      Object.entries(falconData.content).forEach(([key, val]) => falconFormData.append(key, val as string));
      if (falconData.imageFile) falconFormData.append("image", falconData.imageFile);
      const formattedGridItems = [
        ...falconData.leftItems.map((item: any, i: number) => ({ side: "LEFT", label: item.label, value: item.value, order: i })),
        ...falconData.rightItems.map((item: any, i: number) => ({ side: "RIGHT", label: item.label, value: item.value, order: i }))
      ];
      falconFormData.append("gridItems", JSON.stringify(formattedGridItems));

      // Fire both API requests simultaneously
      const [res1, res2] = await Promise.all([
        fetch(`/api/admin/pages/${SLUG}`, { method: "POST", body: chartersFormData }),
        fetch("/api/admin/charter/falcon", { method: "POST", body: falconFormData })
      ]);

      const [result1, result2] = await Promise.all([res1.json(), res2.json()]);

      let hasError = false;

      // Check Charters Page Result
      if (result1.success) {
        mutatePage();
      } else {
        toast.error(`Charters Page Error: ${result1.message || "Failed to save."}`);
        hasError = true;
      }

      // Check Falcon Section Result
      if (result2.success) {
        mutateFalcon();
      } else {
        toast.error(`Falcon Section Error: ${result2.message || "Failed to save."}`);
        hasError = true;
      }

      // Show overall success only if both succeeded
      if (!hasError) {
          toast.success("All settings saved successfully!");
      }

    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred during save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPageLoading || isFalconLoading || !pageData) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#1868A5]" size={32} /></div>;
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8 pb-20">
      <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md pb-4 pt-4 border-b border-slate-200 flex items-center justify-between shadow-sm -mx-6 px-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Charters Page</h1>
          <p className="text-slate-500 text-sm mt-1">Manage luxury charter headings, introductions, and specific aircraft features.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save All Sections
        </button>
      </div>

      <HeroEditor data={pageData} onChange={updatePage} onImageChange={(f) => updatePage("newHeroImage", f)} />

      {pageData.sections.map((section: any, sIndex: number) => {
        if (section.type === "INTRO") {
          return (
            <IntroEditor 
              key={sIndex} sIndex={sIndex} section={section} updateSection={updateSection} 
              onImageChange={(idx, f) => updateSection(idx, "newImageFile", f)} 
              config={{ fields: ['subtitle', 'title', 'description', 'image'] }} 
            />
          );
        }
        return null;
      })}

      {/* Falcon Editor block */}
      <FalconEditor 
        data={falconData}
        updateContent={updateFalconContent}
        updateImage={updateFalconImage}
        updateGrid={updateFalconGrid}
      />
    </div>
  );
}