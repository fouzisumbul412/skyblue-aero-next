"use client";

import FadeUpStagger from "@/components/motion/FadeUpStagger";
import SplitTextReveal from "@/components/motion/SplitTextReveal";
import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const [formState, setFormState] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const labelClass = "text-sm font-medium text-[#1470A9]";
  const inputClass =
    "w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#1470A9] transition";

  // 🔹 Social Links (SVG)
  const socialLinks = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.17 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.9h-2.32V22c4.78-.76 8.43-4.91 8.43-9.93z" />
        </svg>
      ),
      link: "https://www.facebook.com/Skyblueaero1",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.05-1.86-3.05-1.87 0-2.16 1.46-2.16 2.96v5.66H9.33V9h3.41v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.61 0 4.28 2.38 4.28 5.48v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
        </svg>
      ),
      link: "https://www.linkedin.com/company/skyblueaero/posts/?feedView=all",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2H21l-6.5 7.44L22 22h-6.828l-5.35-7.02L3.9 22H1l6.95-7.96L2 2h6.99l4.84 6.33L18.244 2z" />
        </svg>
      ),
      link: "https://x.com/skyblueaero1",
    },
  ];

  // 🔹 Handle Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // 🔹 Validation
  const validate = () => {
    let newErrors: any = {};

    if (!formState.fullName) newErrors.fullName = "Name is required";
    if (!formState.phone) newErrors.phone = "Phone is required";
    if (!formState.email) newErrors.email = "Email is required";
    if (!formState.message) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbz7owVzSx_BwRm2MSTn6TYEcrOsev3BaAfutx7yKovCJWq6sAxabn-j8gLVvDwk7ccx/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            ...formState,
            formType: "Contact Page",
            timestamp: new Date().toISOString(),
          }),
        },
      );

      toast.success("Request sent successfully 🚀");

      setFormState({
        fullName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send ❌");
    }

    setSubmitting(false);
  };

  return (
    <main className="bg-[#F6F4EF] overflow-hidden">
      {/* ════════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative h-[40vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/contact.png"
            alt="Private jet on tarmac — Aircraft Brokerage"
            fill
            priority
            className="object-cover object-center "
          />

          {/* Overlay Layers */}
          <div className="absolute inset-0 bg-[#06111D]/20" />
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
                Contact Us
              </span>
            </div>
          </FadeUpStagger>

          <SplitTextReveal
            as="h1"
            className="text-xl md:text-4xl font-display font-bold text-brand-cream"
          >
            Let’s Plan Your Next Journey
          </SplitTextReveal>
        </div>
      </section>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F0] via-white to-[#F8FBFD] px-4 py-12 text-[#0F172A] sm:px-6 lg:px-8 lg:py-20">
        {/* Background Decorative Blurs */}
        <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-[#1470A9]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-[#EF7D05]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10 items-start">
            {/* FORM */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-8">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#1470A9]/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#EF7D05]/10 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-8">
                  <span className="inline-flex rounded-full bg-[#1470A9]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1470A9]">
                    Send Inquiry
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Tell Us About Your Requirement
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Fill out the form and our aviation specialists will get back
                    to you with tailored support and guidance.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      ref={firstInputRef}
                      name="fullName"
                      value={formState.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`${inputClass} h-14 rounded-2xl border-slate-200 bg-slate-50/80 px-5 text-sm shadow-sm transition-all duration-300 focus:border-[#1470A9] focus:bg-white focus:ring-4 focus:ring-[#1470A9]/10`}
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Mobile Number</label>
                    <input
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="+1 647 694 6122"
                      className={`${inputClass} h-14 rounded-2xl border-slate-200 bg-slate-50/80 px-5 text-sm shadow-sm transition-all duration-300 focus:border-[#1470A9] focus:bg-white focus:ring-4 focus:ring-[#1470A9]/10`}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`${inputClass} h-14 rounded-2xl border-slate-200 bg-slate-50/80 px-5 text-sm shadow-sm transition-all duration-300 focus:border-[#1470A9] focus:bg-white focus:ring-4 focus:ring-[#1470A9]/10`}
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Tell us about your aviation requirements..."
                      className={`${inputClass} min-h-[140px] resize-none rounded-2xl border-slate-200 bg-slate-50/80 px-5 py-4 text-sm shadow-sm transition-all duration-300 focus:border-[#1470A9] focus:bg-white focus:ring-4 focus:ring-[#1470A9]/10`}
                    />
                    {errors.message && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group mt-1 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#EF7D05] px-6 text-sm font-semibold text-white shadow-lg shadow-[#EF7D05]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#d96f04] hover:shadow-xl hover:shadow-[#EF7D05]/30 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="flex items-center gap-2">
                      {submitting ? "Sending..." : "Send Request"}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* INFO + SOCIAL */}
            <div className="space-y-8">
              {/* Contact */}
              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#1470A9]/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#D7A34D]/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-8">
                    <span className="mb-3 inline-flex rounded-full border border-[#1470A9]/20 bg-[#1470A9]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1470A9]">
                      Global Offices
                    </span>

                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      Contact Information
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                      Reach our global team for aircraft brokerage, operations
                      support, advisory services, and worldwide aviation
                      solutions.
                    </p>
                  </div>

                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6">
                    <div className="grid gap-5 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Sales
                        </p>
                        <a
                          href="mailto:Sales@skyblue.aero"
                          className="mt-2 block text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-[#1470A9]"
                        >
                          Sales@skyblue.aero
                        </a>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Operations
                        </p>
                        <a
                          href="mailto:Ops@skyblue.aero"
                          className="mt-2 block text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-[#1470A9]"
                        >
                          Ops@skyblue.aero
                        </a>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Phone
                        </p>
                        <a
                          href="tel:+16476946122"
                          className="mt-2 block text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-[#1470A9]"
                        >
                          +1 647 694 6122
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {[
                      {
                        country: "Canada",
                        city: "Toronto",
                        address:
                          "150 King St. West, Suite 200, Toronto, ON M5H 1J9",
                      },
                      {
                        country: "USA",
                        city: "San Francisco",
                        address:
                          "201 Spear Street, Suite 1100, San Francisco, CA 94105",
                      },
                      {
                        country: "Singapore",
                        city: "Singapore",
                        address:
                          "1 Scotts Road, #24-10, Shaw Centre, Singapore – 228208",
                      },
                      {
                        country: "India",
                        city: "Hyderabad",
                        address:
                          "511, KTC Illumination, Mindspace, Madhapur, Hyderabad – 500081",
                      },
                    ].map((office) => (
                      <div
                        key={office.country}
                        className="group rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#1470A9]/30 hover:shadow-xl"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1470A9]">
                              {office.country}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900">
                              {office.city}
                            </h3>
                          </div>

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1470A9]/10 text-lg text-[#1470A9] transition-transform duration-300 group-hover:scale-110">
                            📍
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-600">
                          {office.address}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="mb-6">
                  <span className="inline-flex rounded-full border border-[#1470A9]/20 bg-[#1470A9]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1470A9]">
                    Social Media
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-slate-900">
                    Follow Us
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Stay updated with aviation news, market insights, fleet
                    opportunities, and global activity.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((item, i) => (
                    <a
                      key={i}
                      href={item.link}
                      target="_blank"
                      className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 transition-all duration-300 hover:-translate-y-1 hover:border-[#1470A9]/30 hover:bg-[#1470A9] hover:shadow-lg"
                    >
                      <div className="text-slate-600 transition-all duration-300 group-hover:scale-110 group-hover:text-white">
                        {item.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
