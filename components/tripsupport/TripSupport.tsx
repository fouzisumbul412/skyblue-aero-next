"use client";

import Image from "next/image";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TripSupport() {
  const { data: response, isLoading } = useSWR("/api/pages/trip-support", fetcher, {
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
  
  const introSection = pageData.sections.find((s: any) => s.type === "INTRO");
  const gridSections = pageData.sections.filter((s: any) => s.type === "GRID");
  
  const whyUsSection = gridSections[0];
  const uspSection = gridSections[1];
  const coverageSection = gridSections[2];

  return (
    <main className="bg-[#F6F4EF] overflow-hidden">
      {/* HERO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-[#06111D]/5" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06111D]/20 via-[#06111D]/35 to-[#06111D]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,163,77,0.18),transparent_40%)]" />
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
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-5 py-2 mb-8">
              <span className="h-2 w-2 rounded-full bg-[#D7A34D] animate-pulse" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-white/70 font-medium">
                {pageData.heroSubtitle}
              </span>
            </div>
          </FadeUpStagger>

          <SplitTextReveal
            as="h1"
            className="text-2xl md:text-5xl font-display font-bold text-brand-cream"
          >
            {pageData.heroTitle}
          </SplitTextReveal>

          <FadeUpStagger>
            <p className="mt-8 max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-white/65">
              {pageData.heroDesc}
            </p>
          </FadeUpStagger>
        </div>
      </section>

      {/* INTRO  */}
      {introSection && (
        <section className="relative py-10 md:py-20 bg-[#F6F4EF]">
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
                  <h2 className="text-2xl md:text-4xl leading-[1.2] tracking-[-0.01em] font-bold text-[#06111D]">
                    {introSection.title}
                  </h2>
                  
                  {/* Dynamic description split by newlines */}
                  {introSection.description.split("\n").filter((p: string) => p.trim() !== "").map((paragraph: string, idx: number) => (
                    <p key={idx} className="mt-8 text-base md:text-lg leading-relaxed text-[#06111D]/70">
                      {paragraph}
                    </p>
                  ))}

                  {introSection.tags && introSection.tags.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-3">
                      {introSection.tags.map((m: string) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-2 rounded-full border border-[#06111D]/10 bg-[#06111D]/5 px-5 py-2 text-sm font-medium text-[#06111D]/75"
                        >
                          <LucideIcons.MapPin className="h-3 w-3 text-[#EF7C00]" />
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  {introSection.buttonText && introSection.buttonLink && (
                    <div className="mt-10">
                      <a
                        href={introSection.buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-4 rounded-full bg-[#1671a9] px-7 py-4 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-1 hover:bg-[#11192C] hover:shadow-[0_20px_60px_rgba(6,17,29,0.18)]"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D7A34D]/10 border border-[#D7A34D]/20">
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
                <div className="relative rounded-[40px] overflow-hidden h-[580px] shadow-[0_40px_100px_rgba(6,17,29,0)]">
                  <Image
                    src={introSection.image}
                    alt={introSection.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06111D]/80 via-[#06111D]/20 to-transparent" />

                  {/* Floating badge */}
                  {introSection.badgeTitle && (
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="rounded-[24px] border border-white/15 bg-[#06111D]/50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          {(() => {
                            const BadgeIcon = (LucideIcons as any)[introSection.badgeIcon || "Globe2"] || LucideIcons.Globe2;
                            return <BadgeIcon className="h-5 w-5 text-[#D7A34D]" />;
                          })()}
                          <span className="text-xs tracking-[0.25em] uppercase text-white/70 font-medium">
                            {introSection.badgeTitle}
                          </span>
                        </div>
                        <p className="text-white/85 text-sm leading-relaxed">
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

      {/* WHY SKYBLUE (Standard of Service) */}
      {whyUsSection && (
        <section className="py-10 md:py-20 bg-[#F6F4EF]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <FadeUpStagger>
              <div className="max-w-5xl mb-16">
                <FadeUpStagger>
                  <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 backdrop-blur-md px-5 py-2 mb-8">
                    <span className="h-2 w-2 rounded-full bg-[#ed7e0a] animate-pulse" />
                    <span className="text-[11px] tracking-[0.35em] uppercase text-[#ed7e0a] font-medium">
                      {whyUsSection.subtitle}
                    </span>
                  </div>
                </FadeUpStagger>
                <h2 className="text-2xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-[#06111D]">
                  {whyUsSection.title}
                </h2>
              </div>
            </FadeUpStagger>

            <FadeUpStagger>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyUsSection.items.map((item: any, index: number) => {
                  const Icon = (LucideIcons as any)[item.icon || "Globe2"] || LucideIcons.Globe2;
                  const isLastOdd = whyUsSection.items.length % 2 !== 0 && index === whyUsSection.items.length - 1;

                  return (
                    <div
                      key={item.id || index}
                      className={`group relative overflow-hidden rounded-[36px] border border-[#06111D]/10 bg-white p-8 md:p-10 shadow-[0_20px_60px_rgba(6,17,29,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A34D]/30 hover:shadow-[0_32px_80px_rgba(6,17,29,0.12)] ${
                        isLastOdd ? "md:col-span-2 md:max-w-[720px] md:mx-auto w-full" : ""
                      }`}
                    >
                      {/* Glow */}
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#EF7E03] blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Number */}
                      <div className="absolute right-6 top-5 text-[4rem] font-bold leading-none tracking-[-0.04em] text-[#06111D]/10">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="relative z-10">
                        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1671a9] text-[#EE7D03] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                          <Icon className="h-7 w-7" />
                        </div>

                        <h3 className="text-xl font-bold leading-[1.3] text-[#06111D]">
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

      {/*  USP PROCESS */}
      {uspSection && (
        <section className="relative overflow-hidden bg-brand-navy py-10 md:py-20">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-[#D7A34D]/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#D7A34D]/5 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#D7A34D]/5 blur-[120px] pointer-events-none" />

          <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <FadeUpStagger>
              <div className="text-center max-w-5xl mx-auto mb-14 md:mb-16">
                <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/20 bg-[#D7A34D]/10 backdrop-blur-md px-5 py-2 mb-8">
                  <span className="h-2 w-2 rounded-full bg-[#ffa13c] animate-pulse" />
                  <span className="text-[11px] tracking-[0.35em] uppercase text-[#ed7e0a] font-medium">
                    {uspSection.subtitle}
                  </span>
                </div>

                <h2 className="mx-auto max-w-5xl text-2xl md:text-5xl leading-[1.1] tracking-[-0.02em] font-bold text-white">
                  {uspSection.title}
                </h2>

                <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-gray-300">
                  {uspSection.description}
                </p>
              </div>
            </FadeUpStagger>

            <FadeUpStagger>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {uspSection.items.map((item: any, index: number) => {
                  const isLastOdd = uspSection.items.length % 3 === 1 && index === uspSection.items.length - 1;

                  return (
                    <div
                      key={item.id || index}
                      className={`group relative overflow-hidden rounded-[36px] border border-gray-200 bg-white p-8 md:p-10 min-h-[320px] transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A34D]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] ${
                        isLastOdd ? "xl:col-start-2" : ""
                      }`}
                    >
                      {/* Glow */}
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D7A34D]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Connector */}
                      {index < uspSection.items.length - 1 && (
                        <div className="hidden xl:block absolute top-14 -right-6 z-10 h-[1px] w-12 bg-gradient-to-r from-[#D7A34D]/40 to-transparent" />
                      )}

                      {/* Top */}
                      <div className="relative z-10 mb-8 flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D7A34D]/20 bg-brand-navy text-[#D7A34D] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <LucideIcons.CheckCircle2 className="h-6 w-6 text-white" />
                        </div>

                        {/* We map the subtitle from the backend to the 'Step Number' rendering logic */}
                        <span className="text-[4rem] md:text-[4.5rem] font-bold leading-none tracking-[-0.04em] text-gray-300">
                          {item.subtitle || String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold leading-[1.3] text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-5 text-[15px] leading-7 text-gray-700">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Accent */}
                      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#D7A34D] transition-all duration-500 group-hover:w-full" />
                    </div>
                  );
                })}
              </div>
            </FadeUpStagger>
          </div>
        </section>
      )}

      {/* GLOBAL COVERAGE */}
      {coverageSection && (
        <section className="bg-[#F6F4EF] py-10 md:py-20 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <FadeUpStagger>
              <div className="text-center max-w-6xl mx-auto">
                <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 px-5 py-2 mb-6">
                  <span className="h-2 w-2 rounded-full bg-[#D7A34D] animate-pulse" />
                  <span className="text-[11px] tracking-[0.35em] uppercase text-[#D7A34D] font-medium">
                    {coverageSection.subtitle}
                  </span>
                </div>

                <h2 className="text-2xl md:text-5xl font-bold leading-[1.1] tracking-[-0.02em] text-[#06111D]">
                  {coverageSection.title}
                </h2>

                <p className="mt-5 max-w-3xl mx-auto text-[#06111D]/60 text-base leading-relaxed">
                  {coverageSection.description}
                </p>
              </div>
            </FadeUpStagger>

            {coverageSection.items && coverageSection.items.length > 0 && (
              <div className="mt-16">
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-6">
                  {coverageSection.items.map((item: any, index: number) => (
                    <div
                      key={item.id || index}
                      className="group relative overflow-hidden rounded-[30px] border border-[#E7E7E7] bg-gradient-to-b from-white to-[#F7F7F7] p-3 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A34D]/40 hover:shadow-[0_24px_55px_rgba(0,0,0,0.1)]"
                    >
                      {/* Top Accent */}
                      <div className="absolute left-1/2 top-0 h-[3px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#D7A34D] via-[#F5C66B] to-[#D7A34D] transition-all duration-500 group-hover:w-[70%]" />

                      {/* Blue Image Section */}
                      <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(145deg,#3D7BFF_0%,#0D5BEB_100%)] p-1 shadow-[inset_0_1px_8px_rgba(255,255,255,0.15),0_12px_30px_rgba(32,90,255,0.25)]">
                        <div className="relative flex h-[120px] items-center justify-center overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%),linear-gradient(145deg,#4A84FF_0%,#135AE2_100%)] sm:h-[140px]">
                          {/* Background Glow */}
                          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-white/20" />

                          {/* Subtle Glass Shape */}
                          <div className="absolute inset-x-5 top-4 h-[70%] rounded-[18px] border border-white/10 bg-white/[0.04]" />

                          {/* Shine Effect */}
                          <div className="absolute -left-[120%] top-0 h-full w-[60%] rotate-[20deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] transition-all duration-1000 group-hover:left-[140%]" />

                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={180}
                              height={100}
                              className="relative z-10 h-auto w-full max-w-[115px] object-contain drop-shadow-[0_10px_25px_rgba(255,255,255,0.22)] transition-all duration-500 group-hover:scale-110 sm:max-w-[130px]"
                            />
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <div className="pt-4 text-center">
                        <div className="mx-auto mb-3 h-[2px] w-8 rounded-full bg-gradient-to-r from-transparent via-[#D7A34D] to-transparent transition-all duration-500 group-hover:w-14" />

                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ED7E0A] transition-all duration-300 group-hover:text-[#C96A00] sm:text-[13px]">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}