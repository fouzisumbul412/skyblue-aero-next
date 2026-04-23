"use client";

import React, { ElementType, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import AOS from "aos";
import "aos/dist/aos.css";
import { Plane } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const uiConfigs = [
  { delay: 50, link: "/trip-support", cardAos: "fade-right" },
  { delay: 140, link: "/charters", cardAos: "fade-up" },
  { delay: 230, link: "/brokerage", cardAos: "fade-left" },
  { delay: 320, link: "/maintenance", cardAos: "fade-up-right" },
  { delay: 410, link: "/crew-leasing", cardAos: "fade-up-left" },
  { delay: 500, link: "/contract-fuel", cardAos: "fade-up" },
];

type TypewriterTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
};

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  as: Tag = "h2",
  className = "",
  speed = 2,
  startDelay = 0,
  onComplete,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayText("");
          setIsComplete(false);
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setDisplayText("");
          setIsComplete(false);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (displayText.length >= text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setDisplayText(text.slice(0, displayText.length + 1));
      },
      displayText.length === 0 ? startDelay : speed
    );

    return () => window.clearTimeout(timeout);
  }, [displayText, isVisible, speed, startDelay, text, onComplete]);

  return (
    <div ref={wrapperRef}>
      <Tag className={className}>
        {displayText}
        {isVisible && !isComplete && (
          <span className="ml-1 inline-block animate-pulse">|</span>
        )}
      </Tag>
    </div>
  );
};

const MovingPlanes: React.FC = () => {
  return (
    <div className="relative mb-2 h-5 -mt-5 overflow-hidden">
      <div className="flex w-max animate-[planeLoop_6s_linear_infinite] gap-6">
        {[...Array(10)].map((_, i) => (
          <Plane key={"a" + i} className="h-5 w-5 text-white/80 shrink-0" />
        ))}

        {[...Array(10)].map((_, i) => (
          <Plane key={"b" + i} className="h-5 w-5 text-white/80 shrink-0" />
        ))}

        {[...Array(10)].map((_, i) => (
          <Plane key={"c" + i} className="h-5 w-5 text-white/80 shrink-0" />
        ))}
      </div>

      <style>
        {`
          @keyframes planeLoop {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

type ServiceCardProps = {
  title: string;
  description: string;
  className?: string;
  delay?: number;
  link?: string;
  cardAos?: string;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  className = "",
  delay = 0,
  link,
  cardAos = "fade-up",
}) => {
  return (
    <div
      data-aos={cardAos}
      data-aos-delay={delay}
      data-aos-duration="950"
      data-aos-easing="ease-out-cubic"
      data-aos-anchor-placement="top-bottom"
      className={`group relative overflow-hidden rounded-[28px] border border-dashed border-white/70 bg-black/35 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/14 hover:shadow-[0_20px_80px_rgba(0,0,0,0.28)] sm:p-7 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-cyan-300/[0.06] opacity-70" />
      <CornerPlusIcons />

      <div className="relative z-10">
        <h3
          data-aos="fade-up"
          data-aos-delay={delay + 180}
          data-aos-duration="700"
          data-aos-easing="ease-out-cubic"
          className="text-[28px] leading-none font-normal text-white sm:text-[32px]"
        >
          {title}
        </h3>

        <p
          data-aos="fade-up"
          data-aos-delay={delay + 260}
          data-aos-duration="760"
          data-aos-easing="ease-out-cubic"
          className="mt-5 max-w-[32rem] text-base leading-8 text-white/80 sm:text-[17px]"
        >
          {description}
        </p>

        {link && (
          <a
            href={link}
            data-aos="fade-up"
            data-aos-delay={delay + 340}
            data-aos-duration="760"
            data-aos-easing="ease-out-cubic"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white/60 pb-1 transition-all duration-300 hover:gap-3 hover:border-white"
          >
            Learn More
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        )}
      </div>
    </div>
  );
};

const CornerPlusIcons: React.FC = () => {
  return (
    <>
      <PlusIcon className="-left-3 -top-3" />
      <PlusIcon className="-right-3 -top-3" />
      <PlusIcon className="-bottom-3 -left-3" />
      <PlusIcon className="-bottom-3 -right-3" />
    </>
  );
};

const PlusIcon = ({ className = "" }: { className?: string }) => {
  return (
    <span className={`absolute z-10 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-white/80"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5v14M5 12h14"
        />
      </svg>
    </span>
  );
};

const ServicesSection: React.FC = () => {
  const [showCards, setShowCards] = useState(false);

  const { data: response, error, isLoading } = useSWR("/api/home/services", fetcher);

  useEffect(() => {
    AOS.init({
      once: false,
      mirror: true,
      duration: 850,
      easing: "ease-out-cubic",
      offset: 70,
      anchorPlacement: "top-bottom",
    });

    const refresh = () => AOS.refresh();

    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    setTimeout(() => {
      AOS.refreshHard();
    }, 150);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  // Determine title and sort cards
  const sectionTitle = response?.data?.title || "Aviation Solutions, Precisely Tailored to Every Journey";
  const apiCards = response?.data?.cards || [];
  const sortedCards = [...apiCards].sort((a: any, b: any) => a.order - b.order);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 min-h-screen">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/images/sky.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/15 bg-black/10 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.18)] sm:p-5 lg:p-8">
          <div className="max-w-4xl">
            <p
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-easing="ease-out-cubic"
              className="mb-3 text-sm font-medium uppercase tracking-[0.26em] text-white/80"
            >
              Our Services
            </p>

            {/* Wait until loading is done so Typewriter gets the actual fetched text */}
            {!isLoading && (
              <TypewriterText
                as="h2"
                text={sectionTitle}
                className="max-w-4xl text-3xl leading-tight text-white sm:text-4xl lg:text-5xl uppercase"
                speed={1}
                startDelay={0}
                onComplete={() => {
                  setTimeout(() => {
                    setShowCards(true);
                    AOS.refresh(); 
                  }, 1);
                }}
              />
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {showCards &&
              sortedCards.map((service: any, index: number) => {
                // Map the DB item to our UI animation configs
                const uiConfig = uiConfigs[index] || { delay: 0, cardAos: "fade-up", link: "" };

                return (
                  <ServiceCard
                    key={service.id}
                    title={service.title}
                    description={service.description}
                    delay={uiConfig.delay}
                    link={uiConfig.link}
                    cardAos={uiConfig.cardAos}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;