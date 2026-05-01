"use client";

import Image from "next/image";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const About = () => {

  const { data: response, isLoading } = useSWR("/api/pages/about", fetcher, {
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
  
  // Assuming strict order based on your admin panel setup
  const storySection = pageData.sections[0];
  const excellenceSection = pageData.sections[1];
  const valuesSection = pageData.sections[2];

  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={pageData.heroImage}
            alt="About Skyblue Aero"
            fill
            priority
            className="object-cover object-top scale-105"
          />

          <div className="absolute inset-0 bg-[#06111D]/45" />
          <div className="absolute inset-0 bg-linear-to-b from-[#06111D]/20 via-[#06111D]/35 to-[#06111D]/80" />
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

        <div className="relative z-10 max-w-350 mx-auto w-full px-6 md:px-10 pb-16 md:pb-24">
          <p className="font-body text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">
            {pageData.heroSubtitle}
          </p>
          <SplitTextReveal
            as="h1"
            className="text-fluid-heading font-display font-bold text-brand-cream"
          >
            {pageData.heroTitle}
          </SplitTextReveal>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="bg-brand-cream py-10 md:py-24">
        <div className="max-w-350 mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUpStagger>
            <p className="font-body text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">
              {storySection.subtitle}
            </p>
            <h2 className="font-display text-fluid-subheading font-bold text-brand-navy mb-6 whitespace-pre-line">
              {storySection.title}
            </h2>
            
            {/* Split description by newlines to render proper paragraphs */}
            {storySection.description.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => (
              <p key={idx} className="font-body text-brand-navy/70 text-base leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </FadeUpStagger>

          <ClipReveal direction="left">
            <div className="relative w-full aspect-4/3">
              <Image
                src={storySection.image}
                alt={storySection.subtitle}
                fill
                className="object-cover"
              />
            </div>
          </ClipReveal>
        </div>
      </section>

      {/* VISION & MISSION (EXCELLENCE) */}
      <section className="py-10 md:py-20 bg-[#1671a9] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#D7A34D]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[#06111D]/30 blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <FadeUpStagger>
            <div className="max-w-5xl mb-16 text-center mx-auto">
              <FadeUpStagger>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-5 py-2 mb-8 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
                  <span className="text-[14px] tracking-[0.35em] uppercase font-medium text-white">
                    {excellenceSection.subtitle}
                  </span>
                </div>
              </FadeUpStagger>
              <h2 className="text-3xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-white">
                {excellenceSection.title}
              </h2>
            </div>
          </FadeUpStagger>

          <FadeUpStagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {excellenceSection.items.map((item: any) => {
                // Dynamically load the icon from lucide-react based on the database string
                const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Globe2;

                return (
                  <div
                    key={item.id || item.title}
className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white backdrop-blur-md p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A34D]/40 hover:shadow-[0_32px_80px_rgba(0,0,0,0.25)]"                  >
                    {/* Glow Accents */}
                    <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#D7A34D] blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-20" />

                    <div className="relative z-10">
                      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy border border-white/10 text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-lg">
                        <Icon className="h-7 w-7" />
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold leading-[1.3] text-gray-900 tracking-wide">
                        {item.title}
                      </h3>

                      <p className="mt-5 text-[16px] leading-relaxed text-gray-700">
                        {item.description}
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 h-[4px] w-0 bg-gradient-to-r from-brand-gold to-brand-gold transition-all duration-700 ease-out group-hover:w-full" />
                  </div>
                );
              })}
            </div>
          </FadeUpStagger>
        </div>
      </section>

      {/* OUR VALUES SECTION  */}
      <section className="bg-brand-cream py-16 border-t border-brand-navy/08">
        <div className="max-w-350 mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="font-body text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">
              {valuesSection.subtitle}
            </p>
            <SplitTextReveal
              as="h2"
              className="text-fluid-subheading font-display font-bold text-brand-navy"
            >
              {valuesSection.title}
            </SplitTextReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuesSection.items.map((v: any) => (
              <FadeUpStagger key={v.id || v.title}>
                <div className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-brand-gold/40 via-white/10 to-transparent hover:from-brand-gold/70 transition duration-500">
  
  <div className="relative h-full rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg px-8 py-10 text-center transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
    
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-brand-gold/10 to-transparent" />

    <div className="w-12 h-[2px] bg-brand-gold mx-auto mb-6 transition-all duration-300 group-hover:w-16" />

    <h3 className="font-display text-xl font-bold text-brand-navy mb-4">
      {v.title}
    </h3>

    <p className="font-body text-brand-navy/70 text-sm leading-relaxed">
      {v.description}
    </p>
  </div>
</div>
              </FadeUpStagger>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;