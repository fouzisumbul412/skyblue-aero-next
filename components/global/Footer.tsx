import React from "react";
import Link from "next/link";
import { Mail, PhoneCall, Pin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden py-16 md:py-24 bg-brand-obsidian">
      {/* VIDEO BACKGROUND */}

      {/* FOOTER CONTENT */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center">
              <img
                src="/logo-white-aero.png"
                alt="SkyblueAero Logo"
                className="h-14 md:h-14 w-auto mb-10"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white max-w-xs font-medium">
              Sky Blue Aero delivers seamless private aviation solutions,
              offering charter services, global trip support, and expert
              aviation management.
            </p>
          </div>
          {/* Services Links */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-[#EF7D05] mb-6 font-semibold">
              Services
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "Contract Fuel", path: "/contract-fuel" },
                { name: "Air Charters", path: "/charters" },
                { name: "Aircraft Brokerage", path: "/brokerage" },
                { name: "Trip Support", path: "/trip-support" },
                { name: "Maintenance", path: "/maintenance" },
                { name: "Crew Leasing", path: "/crew-leasing" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-sm text-white hover:text-[#EF7D05] hover:translate-x-1 transition-all duration-300 w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Company Links */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-[#EF7D05] mb-6 font-semibold">
              Company
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Gallery", path: "/gallery" },
                { name: "Blogs", path: "/blog" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-sm text-white hover:text-[#EF7D05] hover:translate-x-1 transition-all duration-300 w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Contact Info */}
          <div>
            <h4 className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#EF7D05]">
              Contact
            </h4>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-white">
                <div className=" flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Pin className="h-4 w-4 text-[#EF7D05]" />
                </div>

                <div>
                  <p className=" text-sm leading-relaxed text-white/90">
                    Hyderabad, India
                    <span className="mx-2 text-white/30">|</span>
                    Canada
                    <span className="mx-2 text-white/30">|</span>
                    USA
                    <span className="mx-2 text-white/30">|</span>
                    Singapore
                  </p>
                </div>
              </div>

              <a
                href="mailto:ops@skyblue.aero"
                className="group flex items-start gap-3"
              >
                <div className=" flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-[#EF7D05]/30 group-hover:bg-[#EF7D05]/10">
                  <Mail className="h-4 w-4 text-[#EF7D05]" />
                </div>

                <div>
                  <p className=" text-sm text-white/90 transition-colors duration-300 group-hover:text-[#EF7D05]">
                    ops@skyblue.aero
                  </p>
                </div>
              </a>

              <a
                href="tel:+16476946122"
                className="group flex items-center gap-3"
              >
                <div className=" flex h-10 w-10 items-center  justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-[#EF7D05]/30 group-hover:bg-[#EF7D05]/10">
                  <PhoneCall className="h-4 w-4 text-[#EF7D05]" />
                </div>

                <div>
                  <p className=" text-sm text-white/90 transition-colors duration-300 group-hover:text-[#EF7D05]">
                    +1 (647) 694-6122
                  </p>
                </div>
              </a>

              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    {
                      icon: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.17 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.9h-2.32V22c4.78-.76 8.43-4.91 8.43-9.93z" />
                        </svg>
                      ),
                      link: "https://www.facebook.com/Skyblueaero1",
                    },
                    {
                      icon: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.05-1.86-3.05-1.87 0-2.16 1.46-2.16 2.96v5.66H9.33V9h3.41v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.61 0 4.28 2.38 4.28 5.48v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
                        </svg>
                      ),
                      link: "https://www.linkedin.com/company/skyblueaero/posts/?feedView=all",
                    },
                    {
                      icon: (
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M18.244 2H21l-6.5 7.44L22 22h-6.828l-5.35-7.02L3.9 22H1l6.95-7.96L2 2h6.99l4.84 6.33L18.244 2z" />
                        </svg>
                      ),
                      link: "https://x.com/skyblueaero1",
                    },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#EF7D05]/40 hover:bg-[#EF7D05]/10"
                    >
                      <div className="text-white/40 transition-all duration-300 group-hover:scale-110 group-hover:text-[#EF7D05]">
                        {item.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white font-medium tracking-wide">
            © {new Date().getFullYear()} Skyblue Aero. All rights reserved.
            Powered by {"  "}
            <Link
              href="https://www.outrightcreators.com/"
              className="font-medium text-white hover:underline"
            >
              Outright Creators
            </Link>
          </p>
          <div className="flex gap-6 text-xs text-white font-medium tracking-wide">
            <Link
              href="/privacy"
              className="hover:text-[#EF7D05] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#EF7D05] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
