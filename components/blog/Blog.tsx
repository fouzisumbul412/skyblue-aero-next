"use client";

import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Blog = () => {
  const { data: response, error, isLoading } = useSWR("/api/blog", fetcher);

  if (isLoading) return <div className="min-h-screen bg-brand-cream" />;
  
  if (error || response?.success === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream text-brand-navy">
        Failed to load insights.
      </div>
    );
  }

  const posts = response?.data || [];

  return (
    <main className="bg-brand-cream min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/blog.jpg"
            alt="Private jet on tarmac"
            fill
            priority
            className="object-cover object-center scale-105"
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

        <div className="relative z-10 max-w-350 mx-auto px-6 md:px-10 lg:px-16 text-center mt-20">
          <FadeUpStagger>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-5 py-2 mb-8">
              <span className="h-2 w-2 rounded-full bg-[#D7A34D] animate-pulse" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-white/70 font-medium">
                Aircraft Brokerage
              </span>
            </div>
          </FadeUpStagger>

          <SplitTextReveal
            as="h1"
            className="text-fluid-heading font-display font-bold text-white mb-6"
          >
            Insights
          </SplitTextReveal>

          <FadeUpStagger>
            <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-white/65">
              Perspectives on aviation, luxury travel, and the business of
              flight.
            </p>
          </FadeUpStagger>
        </div>
      </section>

      {/* BLOG POSTS GRID */}
      <section className="py-10 md:py-20">
        <div className="max-w-350 mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" }
              );

              return (
                <FadeUpStagger
                  key={post.slug}
                  className="border-t border-brand-navy/10 rounded-lg p-6"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <article className="group cursor-pointer flex flex-col h-full">
                      <div className="overflow-hidden mb-6 relative aspect-3/2 w-full">
                        {/* Mapped to thumbnail from Prisma */}
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/10 transition-colors duration-500" />
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-body text-[10px] text-brand-gold tracking-[0.25em] uppercase font-semibold">
                          {post.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-brand-navy/20" />
                        <span className="font-body text-[11px] text-brand-navy uppercase tracking-wider">
                          {formattedDate}
                        </span>
                      </div>

                      <h2 className="font-display text-2xl text-brand-navy mb-4 group-hover:text-brand-gold transition-colors duration-300 leading-snug">
                        {post.title}
                      </h2>

                      <p className="font-body text-sm leading-relaxed mb-6 grow text-brand-navy/80">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-2 font-body text-[11px] text-brand-navy uppercase tracking-[0.2em] font-bold group-hover:text-brand-gold transition-colors duration-300">
                        Read Article
                        <span className="translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                          →
                        </span>
                      </div>
                    </article>
                  </Link>
                </FadeUpStagger>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;