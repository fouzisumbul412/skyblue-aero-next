"use client";

import Image from "next/image";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CrewLeasing() {
  const { data: response, isLoading } = useSWR("/api/pages/crew-leasing", fetcher, {
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
  const pilotSupportSection = gridSections[1];
  const manufacturersSection = gridSections[2];

  return (
    <main className="bg-[#F6F4EF] overflow-hidden">
      {/* HERO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={pageData.heroImage}
            alt={pageData.heroTitle}
            fill
            priority
            className="object-cover object-center scale-105"
          />

          <div className="absolute inset-0 bg-[#06111D]/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06111D]/20 via-[#06111D]/35 to-[#06111D]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,163,77,0.18),transparent_40%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,17,29,0.82),rgba(6,17,29,0.28),rgba(6,17,29,0.78))]" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
          }}
        />

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
            className="text-2xl md:text-5xl font-display font-bold text-white"
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

      {/* INTRO */}
      {introSection && (
        <section className="relative py-10 md:py-20 bg-[#F6F4EF]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <FadeUpStagger>
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 px-5 py-2 mb-8">
                    <span className="h-2 w-2 rounded-full bg-[#ed7e0a] animate-pulse" />
                    <span className="text-[11px] tracking-[0.35em] uppercase text-[#ed7e0a] font-medium">
                      {introSection.subtitle}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-4xl leading-[1.2] tracking-[-0.01em] font-bold text-[#06111D]">
                    {introSection.title}
                  </h2>

                  {/* map paragraphs */}
                  {introSection.description.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => (
                    <p key={idx} className="mt-6 text-base md:text-lg leading-relaxed text-[#06111D]/70">
                      {paragraph}
                    </p>
                  ))}

                  {/* Market Tags */}
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

                  {/* Brochure Button */}
                  {introSection.buttonText && introSection.buttonLink && (
                    <div className="mt-10">
                      <a
                        href={introSection.buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-4 rounded-full bg-[#1671a9] px-7 py-4 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-1 hover:bg-[#11192C]"
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
                <div className="relative rounded-[40px] overflow-hidden h-[580px]">
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
                      <div className="rounded-[24px] border border-white/15 bg-[#06111D]/50  p-6">
                        <div className="flex items-center gap-3 mb-4">
                          {(() => {
                            const BadgeIcon = (LucideIcons as any)[introSection.badgeIcon || "Users"] || LucideIcons.Users;
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

      {/* WHY SKYBLUE */}
      {whyUsSection && whyUsSection.items.length > 0 && (
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
                  const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Globe2;

                  return (
                    <div
                      key={item.id || index}
                      className="group relative overflow-hidden rounded-[36px] border border-[#06111D]/10 bg-white p-8 md:p-10 shadow-[0_20px_60px_rgba(6,17,29,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#ff8400] hover:shadow-[0_32px_80px_rgba(6,17,29,0.12)]"
                    >
                      {/* Glow */}
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff8400] blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Number */}
                      <div className="absolute right-6 top-5 text-[4rem] font-bold leading-none tracking-[-0.04em] text-[#06111D]/10">
                        0{index + 1}
                      </div>

                      <div className="relative z-10">
                        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1671a9] text-[#EE7D03] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                          <Icon className="h-7 w-7" />
                        </div>

                        <h3 className=" text-xl font-bold leading-[1.3] text-[#06111D]">
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

      {/* PILOT SUPPORT SERVICES */}
      {pilotSupportSection && pilotSupportSection.items.length > 0 && (
        <section className="relative overflow-hidden bg-brand-navy py-10 md:py-20">
          {/* Background Glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-white/10 blur-[140px]" />
            <div className="absolute bottom-[-120px] right-[-80px] h-[460px] w-[460px] rounded-full bg-[#0f5d8b] blur-[160px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.04),transparent,rgba(0,0,0,0.08))]" />
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top_right,white,transparent_45%)]" />
          </div>

          <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <FadeUpStagger>
              <div className="max-w-6xl mx-auto text-center mb-14 md:mb-16">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-2 mb-8 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
                  <span className="text-[11px] tracking-[0.35em] uppercase text-white/80 font-medium">
                    {pilotSupportSection.subtitle}
                  </span>
                </div>

                <h2 className="mx-auto text-2xl md:text-5xl leading-[1.2] tracking-[-0.01em] font-bold text-white">
                  {pilotSupportSection.title}
                </h2>

                <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-white/70">
                  {pilotSupportSection.description}
                </p>
              </div>
            </FadeUpStagger>

            <FadeUpStagger>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {pilotSupportSection.items.map((card: any, index: number) => {
                  const Icon = (LucideIcons as any)[card.icon] || LucideIcons.Plane;

                  return (
                    <FadeUpStagger key={card.id || index}>
                      <div
                        className={`group relative h-full overflow-hidden rounded-[36px] border border-white/15 bg-white backdrop-blur-xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:border-[#F7931E]/30`}
                      >
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F7931E]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#F7931E]/20 bg-brand-navy">
                              <Icon className="h-6 w-6 text-white" />
                            </div>

                            <div>
                              <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-1">
                                {card.subtitle}
                              </p>
                              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                                {card.title}
                              </h3>
                            </div>
                          </div>

                          {/* Dynamic Grid vs List based on order/index for exact layout matching */}
                          <div
                            className={
                              index === 0
                                ? "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
                                : "space-y-4"
                            }
                          >
                            {card.bullets && card.bullets.map((item: string) => (
                              <div key={item} className="flex items-start gap-3">
                                <LucideIcons.CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F7931E]" />
                                <span className="text-sm leading-relaxed text-gray-700">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#F7931E] transition-all duration-500 group-hover:w-full" />
                      </div>
                    </FadeUpStagger>
                  );
                })}
              </div>
            </FadeUpStagger>
          </div>
        </section>
      )}

      {/* AIRCRAFT MANUFACTURERS */}
      {manufacturersSection && manufacturersSection.items.length > 0 && (
        <section className="bg-[#F6F4EF] py-10 md:py-20 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 mb-10">
            <FadeUpStagger>
              <div className="text-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 px-5 py-2 mb-6">
                  <span className="h-2 w-2 rounded-full bg-[#D7A34D] animate-pulse" />
                  <span className="text-[11px] tracking-[0.35em] uppercase text-[#D7A34D] font-medium">
                    {manufacturersSection.subtitle}
                  </span>
                </div>

                <h2 className="text-2xl md:text-5xl font-bold leading-[1.1] tracking-[-0.02em] text-[#06111D]">
                  {manufacturersSection.title}
                </h2>

                <p className="mt-5 max-w-3xl mx-auto text-[#06111D]/60 text-base leading-relaxed">
                  {manufacturersSection.description}
                </p>
              </div>
            </FadeUpStagger>
          </div>

          {/* Auto Scrolling Manufacturers */}
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#F6F4EF] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#F6F4EF] to-transparent" />

            <div className="group overflow-hidden">
              <div className="flex w-max animate-[scroll_30s_linear_infinite] gap-5 group-hover:[animation-play-state:paused]">
                {/* Duplicate the array to create the infinite scroll loop */}
                {[...manufacturersSection.items, ...manufacturersSection.items].map((item: any, index: number) => (
                  <div
                    key={`${item.id || item.title}-${index}`}
                    className="w-[240px] shrink-0 overflow-hidden rounded-[28px] border border-[#06111D]/10 bg-white shadow-[0_20px_60px_rgba(6,17,29,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(6,17,29,0.12)]"
                  >
                    <div className="relative h-[180px] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#06111D]/80 via-[#06111D]/10 to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-4 py-2">
                          <span className="text-sm font-semibold text-white">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}