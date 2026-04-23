"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SplitTextReveal from "@/components/motion/SplitTextReveal";
import FadeUpStagger from "@/components/motion/FadeUpStagger";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BlogPost = () => {
  const { slug } = useParams();

  const { data: postRes, isLoading: postLoading, error: postError } = useSWR(
    `/api/blog/${slug}`,
    fetcher
  );

  const post = postRes?.data;

  const { data: relatedRes } = useSWR(
    post ? `/api/blog?related=${encodeURIComponent(post.category)}&exclude=${post.slug}&limit=5` : null,
    fetcher
  );

  if (postLoading) return <div className="min-h-screen bg-brand-cream" />;

  if (postError || !postRes?.success || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <p className="font-display text-2xl text-brand-navy">Post not found.</p>
      </div>
    );
  }

  const relatedPosts = relatedRes?.data || [];

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="bg-brand-cream min-h-screen">
      <header className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#06111D]/45" />
          <div className="absolute inset-0 bg-linear-to-b from-[#06111D]/20 via-[#06111D]/35 to-[#06111D]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,163,77,0.18),transparent_40%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,17,29,0.82),rgba(6,17,29,0.28),rgba(6,17,29,0.78))]" />
        </div>

        <div className="absolute inset-0 bg-brand-navy/40" />
        <div className="absolute inset-0 flex items-end pb-20">
          <div className="max-w-350 mx-auto px-6 md:px-10 w-full">
            <FadeUpStagger>
              <span className="inline-block font-body text-xs text-brand-gold tracking-[0.3em] uppercase mb-6">
                {post.category}
              </span>
              <SplitTextReveal
                as="h1"
                className="text-2xl md:text-4xl font-display font-bold text-white max-w-4xl leading-[1.1]"
              >
                {post.title}
              </SplitTextReveal>
            </FadeUpStagger>
          </div>
        </div>
      </header>

      <section className="py-10 md:py-16">
        <div className="max-w-350 mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <article className="lg:col-span-7">
              <FadeUpStagger>
                <div
                  className="whitespace-pre-line font-body text-lg leading-[1.8] tracking-wide prose prose-lg prose-headings:font-display prose-headings:text-brand-navy prose-p:text-brand-navy/80"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </FadeUpStagger>
            </article>

            <aside className="lg:col-span-3 border-t border-brand-navy/10 pt-8">
              <div className="sticky top-32">
                <div className="mb-8">
                  <p className="font-body text-[15px] text-brand-navy/40 uppercase tracking-widest mb-2">
                    Author
                  </p>
                  <p className="font-display text-lg text-brand-navy">
                    {post.author}
                  </p>
                </div>
                <div className="mb-8">
                  <p className="font-body text-[15px] text-brand-navy/40 uppercase tracking-widest mb-2">
                    Published
                  </p>
                  <p className="font-body text-lg text-brand-navy/70">
                    {formattedDate}
                  </p>
                </div>
                <div className="mb-8">
                  <p className="font-body text-[15px] text-brand-navy/40 uppercase tracking-widest mb-2">
                    Reading Time
                  </p>
                  <p className="font-body text-lg text-brand-navy/70">
                    {post.readTime}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="md:py-20 py-10 bg-white">
          <div className="max-w-350 mx-auto px-6 md:px-10">
            <h3 className="font-display text-3xl text-brand-navy mb-12">
              Related Insights
            </h3>
            {/* Adjusted to handle up to 5 items gracefully */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedPosts.map((related: any) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group"
                >
                  <div className="flex gap-6 items-start md:flex-col flex-col">
                    <div className="relative w-full aspect-3/2 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={related.thumbnail}
                        alt={related.title}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="font-body text-[10px] text-brand-gold uppercase tracking-widest">
                        {related.category}
                      </span>
                      <h4 className="font-display text-lg text-brand-navy mt-2 group-hover:text-brand-gold transition-colors">
                        {related.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default BlogPost;