// ❌ NO "use client"

import "./globals.css";
import Script from "next/script";
import ClientLayout from "./ClientLayout";

/* ✅ SEO + META (SERVER SIDE ONLY) */
export const metadata = {
  title: "SkyBlue Aero | One Stop Solution For All Your Private Aviation Needs",
  description:
    "Experience luxury private aviation with SkyBlue Aero Services. Safe, reliable, and premium charter flights.",
  icons: {
    icon: "/sky-favi.png",
  },
  openGraph: {
    title: "SkyBlue Aero Services",
    description:
      "Experience luxury private aviation with SkyBlue Aero Services.",
    url: "https://www.skyblue.aero/",
    siteName: "SkyBlue Aero",
    images: [
      {
        url: "/logo.png",
        width: 728,
        height: 200,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Zoho Chatbot */}
        <Script id="zoho-init" strategy="afterInteractive">
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
      </head>

      <body>
        {/* ✅ Move all client logic here */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}