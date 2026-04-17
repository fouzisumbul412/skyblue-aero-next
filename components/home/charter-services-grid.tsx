import * as React from "react";
import Image from "next/image";

type CardShellProps = {
  className?: string;
  children: React.ReactNode;
};

type VisualImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

const charterImages = {
  tailored: "/images/charter-services/tailored-charter.jpg",
  scheduling: "/images/charter-services/scheduling.jpg",
  credits: "/images/charter-services/flight-credits.jpg",
  tripHub: "/images/charter-services/trip-hub.jpg",
  concierge: "/images/charter-services/concierge-addons.jpg",
  alerts: "/images/charter-services/flight-alerts.jpg",
};

function CardShell({ className = "", children }: CardShellProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[34px] border border-white/70 p-6 md:p-7 shadow-[0_24px_80px_rgba(20,112,169,0.10)] transition-all duration-500 hover:-translate-y-1 ${className}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/40 blur-3xl" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function SectionTitle({
  title,
  copy,
  titleClassName = "",
  copyClassName = "",
}: {
  title: string;
  copy: string;
  titleClassName?: string;
  copyClassName?: string;
}) {
  return (
    <div>
      <h3
        className={`font-serif text-[clamp(1.75rem,2.4vw,2.55rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1470A9] ${titleClassName}`}
      >
        {title}
      </h3>
      <p className={`mt-3 max-w-sm text-[15px] leading-6 text-[#0F172A]/72 ${copyClassName}`}>
        {copy}
      </p>
    </div>
  );
}

function VisualImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
}: VisualImageProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.14)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}

function TailoredCharterCard() {
  return (
    <CardShell className="bg-[linear-gradient(180deg,#EEF8FD_0%,#E8F1FA_58%,#F9FBFE_100%)] md:row-span-2 xl:col-span-4 xl:row-span-2">
      <div className="flex h-full flex-col">
        <SectionTitle
          title="Tailored Charter"
          copy="Configure every journey around your passengers — cabin mood, dining, transfers, onboard Wi-Fi, and special service requests."
        />

        <div className="mt-6 flex-1">
          <VisualImage
            src={charterImages.tailored}
            alt="Tailored charter visual"
            priority
            className="h-full min-h-[320px] w-full"
            imageClassName="object-cover"
          />
        </div>

        <p className="mt-4 max-w-md text-[15px] leading-6 text-[#0F172A]/72">
          The whole booking experience feels premium, flexible, and built around
          the way private aviation should work.
        </p>
      </div>
    </CardShell>
  );
}

function SchedulingCard() {
  return (
    <CardShell className="bg-[linear-gradient(135deg,#FFF1E5_0%,#FFF8F0_45%,#EAF7FC_100%)] xl:col-span-8">
      <div className="grid h-full gap-6 md:grid-cols-[0.92fr_1.08fr] md:items-center">
        <SectionTitle
          title="Scheduling"
          copy="Lock preferred departure windows, route timing, passenger readiness, and return plans in a smooth private charter workflow."
          titleClassName="text-[#1470A9]"
        />

        <VisualImage
          src={charterImages.scheduling}
          alt="Scheduling visual"
          className="h-[220px] w-full"
          imageClassName="object-cover"
        />
      </div>
    </CardShell>
  );
}

function CreditsCard() {
  return (
    <CardShell className="bg-[linear-gradient(180deg,#F1FAFF_0%,#EEF7FC_45%,#FFF8EE_100%)] xl:col-span-4">
      <div className="flex h-full flex-col">
        <VisualImage
          src={charterImages.credits}
          alt="Flight credits visual"
          className="h-[150px] w-full shrink-0"
          imageClassName="object-cover"
        />

        <div className="mt-5">
          <h3 className="font-serif text-[clamp(1.55rem,2vw,2.1rem)] font-semibold tracking-[-0.03em] text-[#1470A9]">
            Flight Credits
          </h3>
          <p className="mt-3 max-w-sm text-[15px] leading-6 text-[#0F172A]/72">
            Keep track of charter hours, active plans, renewals, and balance
            history in one clean membership view.
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function TripHubCard() {
  return (
    <CardShell className="bg-[linear-gradient(180deg,#FFF7E8_0%,#FFF2DB_48%,#FFF9F0_100%)] xl:col-span-4">
      <div className="flex h-full flex-col">
        <VisualImage
          src={charterImages.tripHub}
          alt="Trip hub visual"
          className="h-[150px] w-full shrink-0"
          imageClassName="object-cover"
        />

        <div className="mt-5">
          <h3 className="font-serif text-[clamp(1.55rem,2vw,2.1rem)] font-semibold tracking-[-0.03em] text-[#1470A9]">
            Trip Hub
          </h3>
          <p className="mt-3 max-w-sm text-[15px] leading-6 text-[#0F172A]/72">
            Follow approvals, crew updates, passenger notes, and trip messages
            without leaving the booking flow.
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function ConciergeCard() {
  return (
    <CardShell className="bg-[linear-gradient(135deg,#FFF0E3_0%,#FFF8F0_38%,#EEF8FD_100%)] xl:col-span-8">
      <div className="grid h-full gap-6 md:grid-cols-[0.92fr_1.08fr] md:items-center">
        <div>
          <h3 className="font-serif text-[clamp(1.75rem,2.2vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1470A9]">
            Concierge Add-ons
          </h3>
          <p className="mt-3 max-w-md text-[15px] leading-6 text-[#0F172A]/72">
            Extend the charter experience with chauffeur pickup, lounge access,
            private dining, security, and stay arrangements.
          </p>
        </div>

        <VisualImage
          src={charterImages.concierge}
          alt="Concierge add-ons visual"
          className="h-[220px] w-full"
          imageClassName="object-cover"
        />
      </div>
    </CardShell>
  );
}

function AlertsCard() {
  return (
    <CardShell className="bg-[linear-gradient(180deg,#ECF7FD_0%,#F4FAFE_52%,#EFF6FB_100%)] xl:col-span-4">
      <div className="flex h-full flex-col">
        <div>
          <h3 className="font-serif text-[clamp(1.55rem,2vw,2.1rem)] font-semibold tracking-[-0.03em] text-[#1470A9]">
            Flight Alerts
          </h3>
          <p className="mt-3 max-w-sm text-[15px] leading-6 text-[#0F172A]/72">
            Get timely notifications for boarding windows, document checks,
            return schedules, and crew-side updates.
          </p>
        </div>

        <div className="mt-5">
          <VisualImage
            src={charterImages.alerts}
            alt="Flight alerts visual"
            className="h-[180px] w-full"
            imageClassName="object-cover object-top"
          />
        </div>
      </div>
    </CardShell>
  );
}

export default function CharterServicesGrid() {
  return (
    <section className="w-full bg-[#FFF9F0] py-8 md:py-10 xl:py-12">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 xl:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12 xl:auto-rows-[230px]">
          <TailoredCharterCard />
          <SchedulingCard />
          <CreditsCard />
          <TripHubCard />
          <ConciergeCard />
          <AlertsCard />
        </div>
      </div>
    </section>
  );
}