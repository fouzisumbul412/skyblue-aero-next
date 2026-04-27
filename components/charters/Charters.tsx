"use client";

import Image from "next/image";

import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";
import AnimatedCounter from "@/components/global/AnimatedCounter";
import Falcon900ExperienceSection from "@/components/home/Falcon900ExperienceSection";

const Charters = () => {
  return (
    <main>
      {/* HERO */}
{/* HERO */}
<section className="relative h-[80vh] flex items-center justify-center overflow-hidden">

  {/* Background Image + Layers */}
  <div className="absolute inset-0">
    <Image
      src="/images/chart.jpeg"
      alt="Private jet charter"
      fill
      priority
      className="object-cover object-center scale-105"
    />

    {/* Dark overlays */}
    <div className="absolute inset-0 bg-[#06111D]/45" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#06111D]/20 via-[#06111D]/35 to-[#06111D]/80" />

    {/* Gold radial glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,163,77,0.18),transparent_40%)]" />

    {/* Side cinematic gradient */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,17,29,0.82),rgba(6,17,29,0.28),rgba(6,17,29,0.78))]" />
  </div>

  {/* Noise texture */}
  <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "180px 180px",
    }}
  />

  {/* Content */}
  <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-10 text-center flex flex-col items-center justify-center">
    
    <FadeUpStagger>
      <p className="font-body text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">
        Air Charter Services
      </p>
    </FadeUpStagger>

    <SplitTextReveal
      as="h1"
      className="text-2xl md:text-5xl font-display font-bold text-brand-cream"
    >
      Luxury in Air. Personalised.
    </SplitTextReveal>

    <FadeUpStagger>
      <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-white/70 leading-relaxed">
        Experience seamless private aviation with tailored charter solutions,
        global access, and unmatched operational expertise.
      </p>
    </FadeUpStagger>

  </div>
</section>

      {/* INTRO */}
      <section className="bg-brand-cream py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <FadeUpStagger>
            <h2 className="font-display text-fluid-heading font-bold text-brand-navy mb-6">
              Your Private Sky
            </h2>

            <p className="font-body text-brand-navy/70 text-base md:text-lg leading-relaxed mb-4">
              Every charter is a bespoke experience — from aircraft selection to in-flight services.
            </p>

            <p className="font-body text-brand-navy/60 text-base leading-relaxed">
              Access to 5,000+ aircraft worldwide — tailored to your mission.
            </p>
          </FadeUpStagger>

          <ClipReveal direction="right">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src="/images/jet-interior.jpg"
                alt="Charter cabin"
                fill
                className="object-cover"
              />
            </div>
          </ClipReveal>

        </div>
      </section>
<Falcon900ExperienceSection />


      {/* WHY CHARTER */}
      {/* <section className="bg-brand-navy py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">

          <SplitTextReveal
            as="h2"
            className="text-fluid-heading font-display font-bold text-brand-cream mb-16 text-center"
          >
            Why Charter with Skyblue Aero
          </SplitTextReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Global Access",
                desc: "Fly to 4,000+ airports worldwide.",
              },
              {
                title: "Total Privacy",
                desc: "No queues, no delays, no compromises.",
              },
              {
                title: "24/7 Support",
                desc: "Dedicated charter manager anytime.",
              },
            ].map((item) => (
              <FadeUpStagger key={item.title}>
                <div className="border border-brand-cream/10 p-8 md:p-10">
                  <h3 className="font-display text-xl text-brand-gold mb-4">
                    {item.title}
                  </h3>
                  <p className="font-body text-brand-cream/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeUpStagger>
            ))}
          </div>

        </div>
      </section> */}

      {/* COUNTERS */}
      {/* <section className="bg-brand-cream py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">

          <AnimatedCounter end={5000} suffix="+" label="Aircraft Available" />
          <AnimatedCounter end={4000} suffix="+" label="Destinations" />
          <AnimatedCounter end={98} suffix="%" label="On-Time Departure" />
          <AnimatedCounter end={24} suffix="/7" label="Operations" />

        </div>
      </section> */}
    </main>
  );
};

export default Charters;