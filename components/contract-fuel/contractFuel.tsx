"use client";

import Image from "next/image";
import {
  Globe2,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  DollarSign,
  Fuel,
  TrendingDown,
  ArrowRight,
  FileText,
  Building2,
  Truck,
  WalletCards,
  BadgePercent,
  Landmark,
  Wallet,
  CreditCard,
  BadgeDollarSign,
} from "lucide-react";

import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";
import ClipReveal from "@/components/motion/ClipReveal";

/* ─── DATA ──────────────────────────────────────────────────── */

export const features = [
  {
    icon: ShieldCheck,
    title: "UNIVERSAL ACCEPTANCE",
    desc: "Accepted across major fuel networks including HP, BP, Reliance, Shell, and Essar depots nationwide. Businesses benefit from seamless cashless transactions and a wider fuel access network without operational interruptions.",
    points: [
      "Accepted at HP, BP, Reliance, Shell and Essar",
      "Cashless transactions nationwide",
      "Reliable fuel access across India",
    ],
  },
  {
    icon: BadgeDollarSign,
    title: "SIGNIFICANT COST SAVINGS & REBATES",
    desc: "Skyblue helps businesses reduce fuel expenses through discounted pricing, freight savings, and volume-based rebates. Savings begin from the first uplift with no minimum usage requirement.",
    points: [
      "Savings from first uplift",
      "No volume commitment required",
      "Tiered volume discounts",
      "Freight charge savings",
    ],
  },
  {
    icon: CreditCard,
    title: "CREDIT & PREPAYMENT OPTIONS",
    desc: "The Skyblue Fuel Card is powered by VISA and HDFC Bank, giving businesses access to flexible payment options including prepaid cards and credit facilities for eligible customers.",
    points: [
      "Powered by VISA and HDFC Bank",
      "Credit facility for eligible customers",
      "Prepaid and flexible payment options",
    ],
  },
  {
    icon: Wallet,
    title: "COMPLIMENTARY SERVICES",
    desc: "Enjoy transparent pricing with no setup costs, no transaction charges, and no annual fees. Skyblue keeps your fuel management simple and cost-effective from day one.",
    points: [
      "No setup fees",
      "No transaction charges",
      "No annual maintenance costs",
    ],
  },
  {
    icon: Landmark,
    title: "TRUSTED BANKING & PAYMENT BACKING",
    desc: "With support from established financial institutions and fuel partners, businesses gain a secure and dependable payment ecosystem for all fuel-related transactions.",
    points: [
      "Secure payment infrastructure",
      "Reliable financial partnerships",
      "Better transaction transparency",
    ],
  },
  {
    icon: Building2,
    title: "BUILT FOR BUSINESS OPERATIONS",
    desc: "Designed for fleet operators, logistics companies, industrial businesses, and commercial transport operators who need efficient fuel access, better control, and reduced operating costs.",
    points: [
      "Ideal for fleets and logistics",
      "Supports corporate operations",
      "Improves fuel management efficiency",
    ],
  },
];

const markets = [
  "NORTH AMERICA",
  "EUROPE",
  "MIDDLE EAST",
  "ASIA PACIFIC",
  "AFRICA",
];
export const whyUs = [
  {
    icon: BadgePercent,
    title: "Petro Products - Easy access. Discounted rates",
    desc: "Skyblue brings over 5 years of expertise in aviation and petro product supply, helping businesses access discounted fuel rates across more than 60 cities and 400+ locations nationwide. Through strong partnerships with leading oil companies and high-volume purchasing, customers benefit from better pricing, simplified fuel access, and reduced operational costs.",
    stats: "60+ Cities • 400+ Locations",
  },
  {
    icon: WalletCards,
    title: "Universal Access Through One Fuel Card",
    desc: "With a single Skyblue Fuel Card, businesses can access multiple petro products across India without maintaining separate vendor relationships. This gives teams a seamless and flexible way to manage fuel, lubricants, and related services under one trusted platform.",
    stats: "One Card • Multi-Brand Access",
  },
  {
    icon: Truck,
    title: "One Stop Fulfillment",
    desc: `We offer you a single source supply of all Petro Products. You do not
need to have multiple relationships with different oil companies for
your petro product requirement. With the Skyblue Fuel Card, you can
order and enjoy on demand door delivery service of your specific
Petro Product from strategic locations across the country`,
    stats: "Fast & Strategic Locations",
  },
  {
    icon: FileText,
    title: "Unparalleled Reporting Alleviates Cumbersome Administrative Work",
    desc: `Easy to understand reporting, detailing every transaction on every
card. Get all your Petro Product expenses in one easy-to-read report.
Access all your account informationin real time.`,
    stats: "Real-Time & Better Control",
  },
];
export default function ContractFuel() {
  return (
    <main className="bg-[#F6F4EF] overflow-hidden">
      {/* ════════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/28950.jpg"
            alt="Private Jet Night Operations - Contract Fuel"
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
                Contract Fuel
              </span>
            </div>
          </FadeUpStagger>

          <SplitTextReveal
            as="h1"
            className="text-xl md:text-5xl font-display font-bold text-brand-cream"
          >
            Flexibility, Control and Convenience.
          </SplitTextReveal>

          <FadeUpStagger>
            <p className="mt-8 max-w-3xl mx-auto text-base md:text-xl leading-relaxed text-white/75 font-light">
              We provide you with a single source global fuel supply at over
              4000 world-wide locations, at discounted rates.
            </p>
          </FadeUpStagger>
        </div>
      </section>

      {/* ════════════════════════════════ INTRO ══════════════════════════════ */}
      <section className="relative py-12 md:py-24 bg-[#F6F4EF]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeUpStagger>
              <div>
                <FadeUpStagger>
                  <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 backdrop-blur-md px-5 py-2 mb-8">
                    <span className="h-2 w-2 rounded-full bg-[#ed7e0a] animate-pulse" />
                    <span className="text-[11px] tracking-[0.35em] uppercase text-[#ed7e0a] font-medium">
                      Global Supply
                    </span>
                  </div>
                </FadeUpStagger>
                <h2 className="text-3xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-[#06111D]">
                  Every Uplift Coordinated By Our 24x7 Ops Team
                </h2>
                <p className="mt-8 text-base md:text-lg leading-relaxed text-[#06111D]/70 group">
                  With access to over <strong>4,000 locations worldwide</strong>
                  , our robust fuel supply network ensures that your operations
                  never face disruptions. Every single fuel uplift is
                  coordinated by our 24x7 Operations Team, ensuring prompt
                  service directly at the bay.
                </p>
                <p className="mt-6 text-[1rem] leading-relaxed text-[#06111D]/60 whitespace-pre-line">
                  Avoid hidden fees and excessive premiums. Our contract fuel
                  program focuses on delivering unmatched flexibility, ultimate
                  control over your fuel expenses, and pure convenience built
                  around your flight schedule.
                </p>
                <div className="mt-10">
                  <a
                    href="/pdf/contract-fuel.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-4 rounded-full bg-[#1671a9] px-7 py-4 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-1 hover:bg-[#11192C] hover:shadow-[0_20px_60px_rgba(6,17,29,0.18)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EF7C00]/10 border border-[#EF7C00]/20">
                      <FileText className="h-5 w-5 text-[#EF7C00]" />
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                        Download Brochure
                      </span>
                      <span className="text-sm font-semibold text-white">
                        Contract Fuel PDF
                      </span>
                    </div>

                    <ArrowRight className="h-4 w-4 text-[#EF7C00] transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </FadeUpStagger>

            <ClipReveal>
              <div className="relative rounded-[40px] overflow-hidden h-[580px] shadow-[0_40px_100px_rgba(6,17,29,0.05)] border border-[#06111D]/5 border-opacity-20 group">
                <Image
                  src="/images/contractfuel.jpg"
                  alt="Skyblue Aviation Fuel Services"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06111D]/90 via-[#06111D]/30 to-transparent" />

                {/* Floating badge */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="rounded-[24px] border border-white/10 bg-[#06111D]/50 p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingDown className="h-6 w-6 text-[#D7A34D]" />
                      <span className="text-xs tracking-[0.25em] uppercase text-white/80 font-semibold">
                        Maximum Cost Efficiency
                      </span>
                    </div>
                    <p className="text-white/85 text-[15px] leading-relaxed">
                      Leveraging substantial volume, we negotiate fiercely on
                      your behalf to guarantee high-quality jet fuel at deeply
                      discounted global rates.
                    </p>
                  </div>
                </div>
              </div>
            </ClipReveal>
          </div>
        </div>
      </section>
      {/* ════════════════════════════════ WHY SKYBLUE ════════════════════════ */}
      <section className="py-10 md:py-20 bg-[#F6F4EF]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <FadeUpStagger>
            <div className="flex justify-center items-center flex-col mb-10">
              <FadeUpStagger>
                <div className="inline-flex items-center gap-3 rounded-full border border-[#D7A34D]/15 bg-[#D7A34D]/10 backdrop-blur-md px-5 py-2 mb-8">
                  <span className="h-2 w-2 rounded-full bg-[#ed7e0a] animate-pulse" />
                  <span className="text-[11px] tracking-[0.35em] uppercase text-[#ed7e0a] font-medium">
                    Why Skyblue
                  </span>
                </div>
              </FadeUpStagger>
              <h2 className="text-xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-[#06111D]">
                WHY CHOOSE OUR FUEL CARD
              </h2>
            </div>
          </FadeUpStagger>

          <FadeUpStagger>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
              {whyUs.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
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

                        <div className="rounded-full border border-[#EF7E03]/20 bg-[#EF7E03]/10 px-3 py-2 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#EF7E03] text-right">
                          {item.stats}
                        </div>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold leading-[1.2] tracking-[-0.01em] text-[#06111D]">
                        {item.title}
                      </h3>

                      <p className="mt-5 text-[15px] leading-7 text-[#06111D]/70">
                        {item.desc}
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
      {/* ════════════════════════════════ THE SKYBLUE usp ════════════════════════ */}
      <section className="py-12 md:py-24 bg-[#1671a9] relative overflow-hidden">
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
                    The Skyblue Promise
                  </span>
                </div>
              </FadeUpStagger>
              <h2 className="text-3xl md:text-5xl leading-[1.1] tracking-[-0.01em] font-bold text-white">
                Reliability Meets Incredible Value
              </h2>
            </div>
          </FadeUpStagger>

          <FadeUpStagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A34D]/40 hover:bg-white/[0.07] hover:shadow-[0_32px_80px_rgba(0,0,0,0.25)]"
                  >
                    <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#D7A34D]/20 blur-[90px] opacity-0 transition-all duration-700 group-hover:opacity-100" />

                    <div className="relative z-10">
                      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[#EE7D03] shadow-lg shadow-black/20 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                        <Icon className="h-7 w-7" strokeWidth={2.2} />
                      </div>

                      <h3 className="text-xl md:text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-white">
                        {item.title}
                      </h3>

                      <p className="mt-5 text-[15px] leading-7 text-white/70">
                        {item.desc}
                      </p>

                      <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                        {item.points.map((point) => (
                          <div
                            key={point}
                            className="flex items-start gap-3 text-[14px] md:text-[15px] leading-6 text-white/80"
                          >
                            <div className="mt-2 h-2 w-2 rounded-full bg-[#D7A34D] shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-[4px] w-0 bg-gradient-to-r from-[#D7A34D] to-[#EE7D03] transition-all duration-700 group-hover:w-full" />
                  </div>
                );
              })}
            </div>
          </FadeUpStagger>
        </div>
      </section>
    </main>
  );
}
