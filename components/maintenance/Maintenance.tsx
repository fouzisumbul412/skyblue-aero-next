"use client";

import { useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Maintenance() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const { data: response, isLoading } = useSWR("/api/pages/maintenance", fetcher, {
    revalidateOnFocus: false,
  });

  if (isLoading || !response?.data) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#F6F4EF]">
        <Loader2 className="animate-spin text-[#1868A5]" size={40} />
      </div>
    );
  }

  const pageData = response.data;
  
  const tabsSection = pageData.sections.find((s: any) => s.type === "TABS");
  
  if (!tabsSection || !tabsSection.items || tabsSection.items.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#F6F4EF]">
        <p className="text-xl text-slate-500 font-medium">No maintenance data available.</p>
      </div>
    );
  }

  // Get the currently active tab based on state
  const activeTab = tabsSection.items[activeTabIndex];
  
  const extraData = typeof activeTab.extraData === "string" 
  ? JSON.parse(activeTab.extraData) 
  : (activeTab.extraData || {});
  const activeBadge = extraData.badge || { title: "", desc: "", icon: "ShieldCheck" };
  const activeFeatures = extraData.features || [];

  return (
    <main className="bg-[#F6F4EF] overflow-hidden">
      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={pageData.heroImage}
            alt={pageData.heroTitle}
            fill
            priority
            className="object-cover object-center scale-105"
          />

          {/* Overlay Layers */}
          <div className="absolute inset-0 bg-[#06111D]/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06111D]/40 via-[#06111D]/50 to-[#06111D]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,163,77,0.25),transparent_40%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <FadeUpStagger>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-5 py-2 mb-8 shadow-[0_0_20px_rgba(215,163,77,0.15)]">
              <span className="h-2 w-2 rounded-full bg-[#D7A34D] animate-pulse" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-white/70 font-medium">
                {pageData.heroSubtitle}
              </span>
            </div>
          </FadeUpStagger>

          <SplitTextReveal
            as="h1"
            className="text-3xl md:text-5xl font-display font-bold text-brand-cream"
          >
            {pageData.heroTitle}
          </SplitTextReveal>

          <FadeUpStagger>
            <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-white/75 font-light">
              {pageData.heroDesc}
            </p>
          </FadeUpStagger>
        </div>
      </section>

      {/* TABS & CONTENT */}
      <section className="relative py-10 md:py-20 bg-[#F6F4EF]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          
          {/* Tabs Navigation */}
          <div className="mb-4 md:mb-10 flex justify-center">
            <div className="inline-flex items-center rounded-full border border-[#06111D]/10 bg-white/80 p-1.5 shadow-[0_20px_50px_rgba(6,17,29,0.06)] backdrop-blur-xl">
              {tabsSection.items.map((tab: any, index: number) => (
                <button
                  key={tab.id || index}
                  onClick={() => setActiveTabIndex(index)}
                  className={`relative flex items-center justify-center rounded-full px-4 md:px-6 py-2.5 md:py-3 text-[10px] md:text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 whitespace-nowrap ${
                    activeTabIndex === index
                      ? "bg-[#1570AA] text-white shadow-[0_10px_30px_rgba(6,17,29,0.18)]"
                      : "text-[#06111D]/65 hover:text-[#06111D]"
                  }`}
                >
                  <span className="relative z-10">{tab.subtitle || `Tab ${index + 1}`}</span>

                  {activeTabIndex === index && (
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center min-h-[600px]">
            
            {/* Image & Badge Column */}
            <div className="relative order-2 lg:order-1">
              <ClipReveal key={`img-${activeTabIndex}`}>
                <div className="relative rounded-[40px] overflow-hidden h-[400px] md:h-[550px] shadow-[0_40px_100px_rgba(6,17,29,0.08)] group border border-[#06111D]/5">
                  {activeTab.image ? (
                    <Image
                      src={activeTab.image}
                      alt={activeTab.title || "Maintenance Image"}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200" /> 
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06111D]/90 via-[#06111D]/20 to-transparent" />

                  {/* Floating Badge (From extraData JSON) */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="rounded-[24px] border border-white/10 bg-[#06111D]/30 p-8 shadow-2xl transition-all duration-500">
                      <div className="flex items-center gap-4 mb-4">
                        {(() => {
                          const BadgeIcon = (LucideIcons as any)[activeBadge.icon] || LucideIcons.ShieldCheck;
                          return <BadgeIcon className="h-8 w-8 text-[#D7A34D]" />;
                        })()}
                        <span className="text-xs tracking-[0.25em] uppercase text-white/80 font-bold">
                          {activeBadge.title}
                        </span>
                      </div>
                      <p className="text-white/85 text-[15px] leading-relaxed">
                        {activeBadge.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </ClipReveal>
            </div>

            {/* Text & Features Column */}
            <div className="order-1 lg:order-2">
              <FadeUpStagger key={`content-${activeTabIndex}`}>
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 backdrop-blur-md px-5 py-2 mb-8">
                    <span className="h-2 w-2 rounded-full bg-[#ed7e0a]" />
                    <span className="text-[11px] tracking-[0.35em] uppercase text-[#ed7e0a] font-bold">
                      {activeTab.title} {/* The Inner Tagline */}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-3xl leading-[1.1] tracking-[-0.01em] font-bold text-[#06111D]">
                    {extraData.mainHeading}
                  </h2>

                  <div className="mt-6 space-y-6">
                    {activeTab.description?.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-base md:text-lg leading-relaxed text-[#06111D]/80">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Highlights/Features Grid (From extraData JSON) */}
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {activeFeatures.map((feature: any, idx: number) => {
                      const FeatureIcon = (LucideIcons as any)[feature.icon] || LucideIcons.Star;
                      
                      return (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl border border-[#06111D]/5 text-[#1671a9] shrink-0">
                            <FeatureIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#06111D] mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-[#06111D]/60 leading-relaxed">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                </div>
              </FadeUpStagger>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}