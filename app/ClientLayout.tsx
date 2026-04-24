"use client";

import { useState, useEffect } from "react";

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
      {/* Loader */}
      {!isLoadingDone && (
        <FlightLoader
          onComplete={handleLoaderComplete}
          onLogoArrived={() => setShowNavLogo(true)}
        />
      )}

      {/* App */}
      <SmoothScrollProvider>
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

        {children}
      </SmoothScrollProvider>

      <Footer />
    </Providers>
  );
}