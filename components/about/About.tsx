"use client";

import useSWR from "swr";
import Image from "next/image";
import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const About = () => {
  const { data: response, error, isLoading } = useSWR("/api/about", fetcher);

  if (isLoading) return <div className="min-h-screen bg-brand-cream" />;
  if (error || !response?.success) return <div className="min-h-screen text-center py-20">Failed to load data</div>;

  const aboutData = response.data;

  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={aboutData.heroImage || "/images/jet-aerial.jpg"}
            alt="Aviation crew"
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
            {aboutData.heroSubtitle}
          </p>
          {/* Key forces the animation to re-run if data changes */}
          <SplitTextReveal
            key={aboutData.heroTitle}
            as="h1"
            className="text-fluid-heading font-display font-bold text-brand-cream"
          >
            {aboutData.heroTitle}
          </SplitTextReveal>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="bg-brand-cream py-10 md:py-24">
        <div className="max-w-350 mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUpStagger>
            <p className="font-body text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">
              {aboutData.title}
            </p>
            <h2 className="font-display text-fluid-subheading font-bold text-brand-navy mb-6 whitespace-pre-line">
              {aboutData.storyHeading}
            </h2>
            {aboutData.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="font-body text-brand-navy/70 text-base leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </FadeUpStagger>

          <ClipReveal direction="left">
            <div className="relative w-full aspect-4/3">
              <Image
                src={aboutData.image || "/images/crew.jpg"}
                alt="Our team"
                fill
                className="object-cover"
              />
            </div>
          </ClipReveal>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="bg-brand-cream py-10 border-t border-brand-navy/08">
        <div className="max-w-350 mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="font-body text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">
              Our Values
            </p>
            <SplitTextReveal
              as="h2"
              className="text-fluid-subheading font-display font-bold text-brand-navy"
            >
              The Principles That Guide Us
            </SplitTextReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Map over the live values from the database */}
            {aboutData.values.map((v: any) => (
              <FadeUpStagger key={v.id}>
                <div className="text-center px-6">
                  <div className="w-10 h-px bg-brand-gold mx-auto mb-6" />
                  <h3 className="font-display text-xl font-bold text-brand-navy mb-4">
                    {v.title}
                  </h3>
                  <p className="font-body text-brand-navy/60 text-sm leading-relaxed">
                    {v.description}
                  </p>
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