"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script"; 
import { Toaster } from "react-hot-toast";

import Providers from "./providers";
import Navigation from "@/components/global/Navigation";
import Footer from "@/components/global/Footer";
import FloatingActions from "@/components/global/FloatingActions";
import QuickQuoteModal from "@/components/global/QuickQuoteModal";
import GrainOverlay from "@/components/global/GrainOverlay";
import FlightLoader from "@/components/global/FlightLoader";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import BookCharterSheet from "@/components/global/BookCharterSheet";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthOrAdmin = pathname.startsWith("/login") || pathname.startsWith("/admin");

  const [quoteOpen, setQuoteOpen] = useState(false);
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [showNavLogo, setShowNavLogo] = useState(false);
  const [isLoadingDone, setIsLoadingDone] = useState(false);

  useEffect(() => {
    const loaderShown = sessionStorage.getItem("loaderShown") === "true";
    if (loaderShown) {
      setIsLoadingDone(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    setIsLoadingDone(true);
    sessionStorage.setItem("loaderShown", "true");
  };

  return (
    <Providers>
      <Toaster position="top-right" />

      {!isLoadingDone && !isAuthOrAdmin && (
        <FlightLoader
          onComplete={handleLoaderComplete}
          onLogoArrived={() => setShowNavLogo(true)}
        />
      )}

      {isAuthOrAdmin ? (
        <main>{children}</main>
      ) : (
        <SmoothScrollProvider>
          <Script key="zoho-init" id="zoho-init" strategy="afterInteractive">
            {`
              window.$zoho = window.$zoho || {};
              $zoho.salesiq = $zoho.salesiq || { ready: function(){} };
            `}
          </Script>
          <Script
            id="zsiqscript"
            src="https://salesiq.zohopublic.com/widget?wc=siqba713578b03d4391f324b487cdd322c66aa0c55dad28ddd6bbbb6aa62012eab3"
            strategy="afterInteractive"
          />

          <GrainOverlay />

          <Navigation
            onOpenQuote={() => setQuoteOpen(true)}
            showLogo={showNavLogo || isLoadingDone}
          />

          <FloatingActions
            onOpenCharter={() => setIsCharterOpen(true)}
          />

          <BookCharterSheet
            isOpen={isCharterOpen}
            onClose={() => setIsCharterOpen(false)}
          />

          <QuickQuoteModal
            open={quoteOpen}
            onClose={() => setQuoteOpen(false)}
          />

          <main>{children}</main>
          
          <Footer />
        </SmoothScrollProvider>
      )}
    </Providers>
  );
}