"use client";

import Image from "next/image";
import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";
import { Globe2, Target } from "lucide-react";

const features = [
  {
    icon: Globe2,
    title: "Vision",
    desc: "To emerge as a globally trusted aviation partner, known for excellence, reliability, and world-class service delivery across every touchpoint.",
  },
  {
    icon: Target,
    title: "Mission",
    desc: "To provide exceptional aviation services that exceed client expectations, fostering long-term relationships built on trust, transparency, and mutual success.",
  },
];

const About = () => {
  return (
    <main>
      <section className="relative h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/jet-aerial.jpg"
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
            About Us
          </p>
          <SplitTextReveal
            as="h1"
            className="text-fluid-heading font-display font-bold text-brand-cream"
          >
            Built on Trust. Driven by Excellence.
          </SplitTextReveal>
        </div>
      </section>

      <section className="bg-brand-cream py-10 md:py-24">
        <div className="max-w-350 mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUpStagger>
            <p className="font-body text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">
              Our Story
            </p>
            <h2 className="font-display text-fluid-subheading font-bold text-brand-navy mb-6">
              Aviation Expertise,
              <br />
              Delivered with Precision.
            </h2>
            <p className="font-body text-brand-navy/70 text-base leading-relaxed mb-4">
              SkyBlue Aero is an aviation services company owned by Captain
              Sylvester Vijay Moni, bringing over 15 years of industry
              experience. The company is built on practical expertise, strong
              global connections, and a deep understanding of aviation
              operations. At its core, SkyBlue Aero focuses on simplifying
              aviation for its clients. From international trip support and
              flight planning to fuel coordination, ground handling, and charter
              assistance, the team ensures smooth and reliable operations across
              every stage of a journey.
            </p>
            <p className="font-body text-brand-navy/60 text-base leading-relaxed">
              With a trusted global network of professionals—including pilots,
              engineers, and operational teams—SkyBlue Aero works closely with
              aircraft owners and operators to deliver efficient, compliant, and
              well-coordinated aviation solutions. With a commitment to
              professionalism, compliance, and operational excellence, SkyBlue
              Aero simplifies the complexities of aviation, allowing clients to
              focus on what matters most—flying with confidence and efficiency..
            </p>
          </FadeUpStagger>

          <ClipReveal direction="left">
            <div className="relative w-full aspect-4/3">
              <Image
                src="/images/crew.jpg"
                alt="Our team"
                fill
                className="object-cover"
              />
            </div>
          </ClipReveal>
        </div>
      </section>

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
                  <span className="text-[14px] tracking-[0.35em] uppercase font-medium">
                    The Standard of Excellence
                  </span>
                </div>
              </FadeUpStagger>
              <h2 className="text-3xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-white">
                Uncompromising Reliability, Unparalleled Value
              </h2>
            </div>
          </FadeUpStagger>

          <FadeUpStagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {features.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-md p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A34D]/40 hover:bg-white/[0.06] hover:shadow-[0_32px_80px_rgba(0,0,0,0.25)]"
                  >
                    {/* Glow Accents */}
                    <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#D7A34D] blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-20" />

                    <div className="relative z-10">
                      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff]/50 border border-white/10 text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-lg">
                        <Icon className="h-7 w-7" />
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold leading-[1.3] text-white tracking-wide">
                        {item.title}
                      </h3>

                      <p className="mt-5 text-[16px] leading-relaxed text-white/70">
                        {item.desc}
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 h-[4px] w-0 bg-gradient-to-r from-[#D7A34D] to-[#ed7e0a] transition-all duration-700 ease-out group-hover:w-full" />
                  </div>
                );
              })}
            </div>
          </FadeUpStagger>
        </div>
      </section>

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
            {[
              {
                title: "Safety First",
                desc: "Every decision, recommendation, and operation is evaluated through the lens of safety — no exceptions, no compromise.",
              },
              {
                title: "Client Focus",
                desc: "We work as an extension of your team, aligning every solution to your operational priorities and business objectives.",
              },
              {
                title: "Integrity",
                desc: "Transparent communication, honest advice, and ethical operations form the foundation of every client relationship.",
              },
            ].map((v) => (
              <FadeUpStagger key={v.title}>
                <div className="text-center px-6">
                  <div className="w-10 h-px bg-brand-gold mx-auto mb-6" />
                  <h3 className="font-display text-xl font-bold text-brand-navy mb-4">
                    {v.title}
                  </h3>
                  <p className="font-body text-brand-navy/60 text-sm leading-relaxed">
                    {v.desc}
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
