"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Falcon900ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsiveness for internal logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data: response, error, isLoading } = useSWR("/api/charter/falcon", fetcher);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 30,
    restDelta: 0.001,
  });

  // ==========================================
  // 0. BACKGROUND SWITCH
  // ==========================================
  const videoOpacity = useTransform(smoothProgress, [0, 0.54, 0.6, 1], [1, 1, 0, 0]);
  const imageOpacity = useTransform(smoothProgress, [0, 0.54, 0.6, 1], [0, 0, 1, 1]);

  // ==========================================
  // 1. AIRCRAFT POSITIONING (MOBILE OPTIMIZED)
  // ==========================================
  const planeY = useTransform(
    smoothProgress,
    [0, 0.06, 0.24, 0.72],
    isMobile ? ["-15vh", "5vh", "5vh", "12vh"] : ["-25vh", "0vh", "0vh", "10vh"]
  );

  const planeScale = useTransform(
    smoothProgress,
    [0, 0.08, 0.22, 0.42, 0.72],
    isMobile ? [0.8, 0.8, 1.2, 1.2, 0.8] : [1, 1, 1.6, 1.6, 1]
  );

  const planeRotate = 0;

  // ==========================================
  // 2. TEXT TRANSITIONS
  // ==========================================
  const phase1Y = useTransform(smoothProgress, [0.12, 0.26], ["0vh", "-100vh"]);
  const phase1Opacity = useTransform(smoothProgress, [0.12, 0.24], [1, 0]);

  const phase2Y = useTransform(smoothProgress, [0.12, 0.28], ["100vh", "0vh"]);
  const phase2Opacity = useTransform(smoothProgress, [0.16, 0.28], [0, 1]);

  // ==========================================
  // 3. BLUEPRINT REVEAL
  // ==========================================
  const maskPosition = useTransform(smoothProgress, [0.56, 0.84], [0, 100]);

  const planeMask = useTransform(
    maskPosition,
    (p) => `linear-gradient(to bottom, transparent ${p}%, black ${p + 15}%)`
  );

  const blueprintMask = useTransform(
    maskPosition,
    (p) => `linear-gradient(to bottom, black ${p}%, transparent ${p + 15}%)`
  );

  // Handle Loading & Error states gracefully (keep ref attached so scroll doesn't break)
  if (isLoading) {
    return <section ref={sectionRef} className="relative h-[240vh] bg-[#06111D]" />;
  }
  
  if (error || !response?.success) {
    return (
      <section ref={sectionRef} className="relative h-[240vh] bg-[#06111D] flex items-center justify-center text-white">
        Failed to load section data.
      </section>
    );
  }

  // 🔹 Extract and sort dynamic data
  const data = response.data;
  const leftItems = [...(data.leftItems || [])].sort((a: any, b: any) => a.order - b.order);
  const rightItems = [...(data.rightItems || [])].sort((a: any, b: any) => a.order - b.order);

  return (
    <section
      ref={sectionRef}
      className="relative h-[240vh] text-[#fff] drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* BACKGROUND VIDEO - FIRST 2 SLIDES */}
        <motion.div
          style={{ opacity: videoOpacity }}
          className="absolute inset-0 z-0"
        >
          <video
            src="/images/falcon-900ex.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* BACKGROUND IMAGE - STARTS WITH BLUEPRINT REVEAL */}
        <motion.div
          style={{ opacity: imageOpacity }}
          className="absolute inset-0 z-0"
        >
          {/* Dynamically loaded background image */}
          <img
            src={data.backgroundImage || "/images/runway at night.webp"}
            alt="background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* optional overlay for readability */}
        <div className="absolute inset-0 z-[1] bg-black/10" />

        {/* PHASE 1 TEXT (Fly in Luxury - Static) */}
        <motion.div
          style={{ y: phase1Y, opacity: phase1Opacity }}
          className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-16 lg:px-24 pointer-events-none"
        >
          <div className="w-full md:w-1/3 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-[clamp(3.5rem,12vw,5rem)] font-medium leading-[0.85] uppercase text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
              Fly in
            </h2>
            <p className="mt-2 md:mt-4 text-[clamp(1.1rem,4vw,2rem)] font-medium leading-[1.1] tracking-tight max-w-[250px] md:max-w-none mx-auto md:mx-0">
              Luxury that moves with you
            </p>
          </div>

          <div className="w-full md:w-1/3 text-center md:text-right">
            <h2 className="text-[clamp(3.5rem,10vw,5rem)] font-medium leading-[0.85] uppercase">
              Luxury
            </h2>
          </div>
        </motion.div>

        {/* PHASE 2 TEXT (Dynamic Specifications) */}
        <motion.div
          style={{ y: phase2Y, opacity: phase2Opacity }}
          className="absolute inset-0 z-40 flex flex-col justify-between px-4 py-4 md:z-20 md:flex-row md:px-16 md:py-24 lg:px-24 pointer-events-none"
        >
          {/* Top/Left Section: Title & Technical Specs */}
          <div className="flex w-full flex-col justify-start md:justify-between md:max-w-[380px] h-auto md:h-full text-left md:text-left">
            <div className="mx-auto md:mx-0 max-w-[260px] md:max-w-none rounded-xl bg-white/28 px-3 py-2 backdrop-blur-[2px] md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
              <p className="text-[11px] md:text-xl font-medium text-[#fff]/80 uppercase tracking-tight">
                {data.title}
              </p>
              <h3 className="mt-1 text-[clamp(2rem,8vw,6rem)] leading-[0.82] tracking-tighter">
                {data.planeModel}
              </h3>
            </div>

            <div className="mt-3 w-full rounded-xl bg-white/28 px-3 py-3 backdrop-blur-[2px] md:mt-0 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
              <h3 className="text-[14px] md:text-sm font-semibold uppercase mb-2">
                {data.leftGridTitle}
              </h3>
              <div className="h-px w-full bg-[#fff]/70 mb-3 md:mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-2 gap-x-3 gap-y-3 md:gap-8">
                {leftItems.map((item: any) => (
                  <div key={item.id}>
                    <p className="text-[9px] md:text-[14px] font-bold uppercase text-[#fff]/90">
                      {item.label}
                    </p>
                    <p className="text-[11px] md:text-lg font-semibold uppercase leading-[1.2]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom/Right Section */}
          <div className="flex w-full flex-col justify-end md:justify-between md:max-w-[420px] h-auto md:h-full text-left md:text-left mt-3 md:mt-0">
            <div className="mx-auto md:mx-0 max-w-[880px] md:max-w-none rounded-xl bg-white/28 px-3 py-2 backdrop-blur-[2px] md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
              <h3 className="text-[1.35rem] md:text-[2rem] leading-[1.05] tracking-tight mb-2 text-center md:text-left whitespace-pre-line">
                {data.subtitle}
              </h3>

              <p className="text-justify md:text-left whitespace-pre-line">
                {data.description}
              </p>
            </div>

            <div className="mt-3 w-full rounded-xl bg-white/28 px-3 py-3 backdrop-blur-[2px] md:mt-0 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
              <h3 className="text-[14px] md:text-sm font-semibold uppercase mb-2">
                {data.rightGridTitle}
              </h3>

              <div className="h-px w-full bg-[#fff]/70 mb-3 md:mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-2 gap-x-3 gap-y-3 md:gap-8">
                {rightItems.map((item: any) => (
                  <div key={item.id}>
                    <p className="text-[9px] md:text-[14px] font-bold uppercase text-[#fff]/90">
                      {item.label}
                    </p>
                    <p className="text-[11px] md:text-lg font-semibold uppercase leading-[1.2]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* AIRCRAFT LAYER */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-4">
          <motion.div
            style={{
              y: planeY,
              scale: planeScale,
              rotateZ: planeRotate,
            }}
            className="relative flex items-center justify-center w-full"
          >
            <motion.img
              style={{
                WebkitMaskImage: planeMask,
                maskImage: planeMask,
              }}
              src="/images/falcon-900ex-top.png"
              alt={`${data.planeModel} top view`}
              className="w-auto h-[40vh] md:h-[90vh] object-contain"
            />

            <motion.img
              style={{
                WebkitMaskImage: blueprintMask,
                maskImage: blueprintMask,
              }}
              src="/images/falcon-900ex-blueprint.png"
              alt={`${data.planeModel} blueprint`}
              className="absolute w-auto h-[40vh] md:h-[90vh] object-contain mix-blend-multiply opacity-90"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Falcon900ExperienceSection;