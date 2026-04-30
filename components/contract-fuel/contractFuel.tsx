"use client";

import Image from "next/image";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ContractFuel() {
  const { data: response, isLoading } = useSWR("/api/pages/contract-fuel", fetcher, {
    revalidateOnFocus: false,
  });

  // Show a loading state while fetching the API
  if (isLoading || !response?.data) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#F6F4EF]">
        <Loader2 className="animate-spin text-[#1868A5]" size={40} />
      </div>
    );
  }

  const pageData = response.data;
  
  const introSection = pageData.sections.find((s: any) => s.type === "INTRO");
  const gridSections = pageData.sections.filter((s: any) => s.type === "GRID");
  
  // Assuming the first grid is "Why Skyblue" and the second is "The Skyblue Promise"
  const whyUsSection = gridSections[0];
  const promiseSection = gridSections[1];

  return (
    <main className="bg-[#F6F4EF] overflow-hidden">
      {/*  HERO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={pageData.heroImage}
            alt={pageData.heroTitle}
            fill
            priority
            className="object-cover object-center"
          />

          {/* Overlay Layers */}
          <div className="absolute inset-0 bg-[#06111D]/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06111D]/40 via-[#06111D]/50 to-[#06111D]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,163,77,0.25),transparent_40%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,17,29,0.82),rgba(6,17,29,0.28),rgba(6,17,29,0.78))]" />
        </div>

        {/* Grain Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <FadeUpStagger>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-5 py-2 mb-8 shadow-lg shadow-[#D7A34D]/5">
              <span className="h-2 w-2 rounded-full bg-[#D7A34D] animate-pulse" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-white/70 font-medium">
                {pageData.heroSubtitle}
              </span>
            </div>
          </FadeUpStagger>

          <SplitTextReveal
            as="h1"
            className="text-xl md:text-5xl font-display font-bold text-brand-cream"
          >
            {pageData.heroTitle}
          </SplitTextReveal>

          <FadeUpStagger>
            <p className="mt-8 max-w-3xl mx-auto text-base md:text-xl leading-relaxed text-white/75 font-light">
              {pageData.heroDesc}
            </p>
          </FadeUpStagger>
        </div>
      </section>

      {/* INTRO */}
      {introSection && (
        <section className="relative py-12 md:py-24 bg-[#F6F4EF]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <FadeUpStagger>
                <div>
                  <FadeUpStagger>
                    <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 backdrop-blur-md px-5 py-2 mb-8">
                      <span className="h-2 w-2 rounded-full bg-[#ed7e0a] animate-pulse" />
                      <span className="text-[11px] tracking-[0.35em] uppercase text-[#ed7e0a] font-medium">
                        {introSection.subtitle}
                      </span>
                    </div>
                  </FadeUpStagger>
                  <h2 className="text-3xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-[#06111D]">
                    {introSection.title}
                  </h2>
                  
                  {/* Map dynamic description paragraphs */}
                  {introSection.description.split("\n").filter((p: string) => p.trim() !== "").map((paragraph: string, idx: number) => (
                    <p key={idx} className={`mt-8 text-base md:text-lg leading-relaxed text-[#06111D]/70 group`}>
                      {paragraph}
                    </p>
                  ))}

                  {introSection.buttonText && introSection.buttonLink && (
                    <div className="mt-10">
                      <a
                        href={introSection.buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-4 rounded-full bg-[#1671a9] px-7 py-4 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-1 hover:bg-[#11192C] hover:shadow-[0_20px_60px_rgba(6,17,29,0.18)]"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EF7C00]/10 border border-[#EF7C00]/20">
                          <LucideIcons.FileText className="h-5 w-5 text-[#EF7C00]" />
                        </div>

                        <div className="flex flex-col items-start">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                            Download Brochure
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {introSection.buttonText}
                          </span>
                        </div>

                        <LucideIcons.ArrowRight className="h-4 w-4 text-[#EF7C00] transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  )}
                </div>
              </FadeUpStagger>

              <ClipReveal>
                <div className="relative rounded-[40px] overflow-hidden h-[580px] shadow-[0_40px_100px_rgba(6,17,29,0.05)] border border-[#06111D]/5 border-opacity-20 group">
                  <Image
                    src={introSection.image}
                    alt={introSection.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06111D]/90 via-[#06111D]/30 to-transparent" />

                  {/* Floating badge */}
                  {introSection.badgeTitle && (
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="rounded-[24px] border border-white/10 bg-[#06111D]/50 p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          {(() => {
                            const BadgeIcon = (LucideIcons as any)[introSection.badgeIcon || "TrendingDown"] || LucideIcons.TrendingDown;
                            return <BadgeIcon className="h-6 w-6 text-[#D7A34D]" />;
                          })()}
                          <span className="text-xs tracking-[0.25em] uppercase text-white/80 font-semibold">
                            {introSection.badgeTitle}
                          </span>
                        </div>
                        <p className="text-white/85 text-[15px] leading-relaxed">
                          {introSection.badgeDesc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ClipReveal>
            </div>
          </div>
        </section>
      )}

      {/*  WHY SKYBLUE */}
      {whyUsSection && (
        <section className="py-10 md:py-20 bg-[#F6F4EF]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <FadeUpStagger>
              <div className="flex justify-center items-center flex-col mb-10 text-center">
                <FadeUpStagger>
                  <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 backdrop-blur-md px-5 py-2 mb-8">
                    <span className="h-2 w-2 rounded-full bg-[#ed7e0a] animate-pulse" />
                    <span className="text-[11px] tracking-[0.35em] uppercase text-[#ed7e0a] font-medium">
                      {whyUsSection.subtitle}
                    </span>
                  </div>
                </FadeUpStagger>
                <h2 className="text-xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-[#06111D] max-w-4xl">
                  {whyUsSection.title}
                </h2>
              </div>
            </FadeUpStagger>

            <FadeUpStagger>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
                {whyUsSection.items.map((item: any, index: number) => {
                  const Icon = (LucideIcons as any)[item.icon] || LucideIcons.BadgePercent;

                  return (
                    <div
                      key={item.id || index}
                      className="group relative overflow-hidden rounded-[32px] border border-[#06111D]/10 bg-white/90 backdrop-blur-xl p-7 md:p-8 shadow-[0_15px_50px_rgba(6,17,29,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-[#EF7E03]/30 hover:shadow-[0_25px_80px_rgba(6,17,29,0.14)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1671A9]/0 via-transparent to-[#EF7E03]/0 group-hover:from-[#1671A9]/5 group-hover:to-[#EF7E03]/10 transition-all duration-500" />

                      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#EF7E03] blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100" />

                      <div className="absolute right-6 top-5 text-[72px] font-bold leading-none tracking-[-0.05em] text-[#06111D]/5 transition-all duration-500 group-hover:text-[#EF7E03]/10">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-6 flex items-center justify-between gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1671A9] to-[#0F5B88] text-[#EF7E03] shadow-lg shadow-[#1671A9]/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <Icon className="h-7 w-7" strokeWidth={2.2} />
                          </div>

                          {item.subtitle && (
                            <div className="rounded-full border border-[#EF7E03]/20 bg-[#EF7E03]/10 px-3 py-2 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#EF7E03] text-right">
                              {item.subtitle}
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold leading-[1.2] tracking-[-0.01em] text-[#06111D]">
                          {item.title}
                        </h3>

                        <p className="mt-5 text-[15px] leading-7 text-[#06111D]/70">
                          {item.description}
                        </p>
                      </div>

                      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#EF7E03] transition-all duration-500 group-hover:w-full" />
                    </div>
                  );
                })}
              </div>
            </FadeUpStagger>
          </div>
        </section>
      )}

      {/*  THE SKYBLUE PROMISE */}
      {promiseSection && (
        <section className="py-12 md:py-24 bg-brand-navy relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#D7A34D]/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[#06111D]/30 blur-[150px] pointer-events-none" />

          <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <FadeUpStagger>
              <div className="max-w-5xl mb-16 text-center mx-auto">
                <FadeUpStagger>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-5 py-2 mb-8 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[#D7A34D] animate-pulse" />
                    <span className="text-[11px] tracking-[0.35em] uppercase text-[#D7A34D] font-medium">
                      {promiseSection.subtitle}
                    </span>
                  </div>
                </FadeUpStagger>
                <h2 className="text-3xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-white max-w-4xl mx-auto">
                  {promiseSection.title}
                </h2>
              </div>
            </FadeUpStagger>

            <FadeUpStagger>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 max-w-8xl mx-auto">
                {promiseSection.items.map((item: any, index: number) => {
                  const Icon = (LucideIcons as any)[item.icon] || LucideIcons.ShieldCheck;

                  return (
                    <div
                      key={item.id || index}
                      className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 hover:border-brand-gold hover:shadow-[0_32px_80px_rgba(0,0,0,0.25)]"
                    >
                      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#D7A34D]/20 blur-[90px] opacity-0 transition-all duration-700 group-hover:opacity-100" />

                      <div className="relative z-10">
                        <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-brand-navy text-white shadow-lg shadow-black/20 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                          <Icon className="h-7 w-7" strokeWidth={2.2} />
                        </div>

                        <h3 className="text-xl md:text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-5 text-[15px] leading-7 text-gray-700">
                          {item.description}
                        </p>

                        {item.bullets && item.bullets.length > 0 && (
                          <div className="mt-6 space-y-3 border-t border-black/10 pt-6">
                            {item.bullets.map((point: string, pIndex: number) => (
                              <div
                                key={pIndex}
                                className="flex items-start gap-3 text-[14px] md:text-[15px] leading-6 text-gray-700"
                              >
                                <div className="mt-2 h-2 w-2 rounded-full bg-brand-gold shrink-0" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 h-[4px] w-0 bg-gradient-to-r from-[#D7A34D] to-[#EE7D03] transition-all duration-700 group-hover:w-full" />
                    </div>
                  );
                })}
              </div>
            </FadeUpStagger>
          </div>
        </section>
      )}
    </main>
  );
}