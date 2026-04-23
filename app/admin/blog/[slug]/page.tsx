"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor"; 

export default function AdminBlogEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isNew = slug === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [postId, setPostId] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    author: "Skyblue Aero",
    readTime: "5 min read",
    slug: "",
    published: false,
  });
  
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Fetch data if editing
  useEffect(() => {
    if (!isNew) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/blog/${slug}`); 
          const json = await res.json();
          if (json.success) {
            const data = json.data;
            setPostId(data.id);
            setFormData({
              title: data.title,
              category: data.category,
              excerpt: data.excerpt,
              author: data.author,
              readTime: data.readTime,
              slug: data.slug,
              published: data.published,
            });
            setContent(data.content);
            setThumbnailPreview(data.thumbnail);
          } else {
            toast.error("Post not found");
            router.push("/admin/blog");
          }
        } catch (error) {
          toast.error("Failed to load post");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug, isNew, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => payload.append(key, String(val)));
      payload.append("content", content); // 👈 Tiptap HTML string
      
      if (thumbnail) {
        payload.append("thumbnail", thumbnail);
      } else if (isNew) {
        toast.error("Thumbnail image is required");
        setIsSaving(false);
        return;
      }

      const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${postId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success(isNew ? "Post published successfully!" : "Post updated successfully!");
        router.push("/admin/blog");
      } else {
        toast.error(data.message || "Failed to save post.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1868A5]" size={32} /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isNew ? "Create New Post" : "Edit Post"}</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Editor Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Post Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                  placeholder="e.g. The Future of Aviation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Excerpt</label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] resize-none"
                  placeholder="A brief summary for the blog card..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                {/* 🔹 Our newly created TipTap Editor */}
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* Sidebar Settings Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Publish Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input
                  required
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                  placeholder="e.g. Industry News"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Read Time</label>
                  <input
                    required
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                  <input
                    required
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Custom Slug (Optional)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5]"
                  placeholder="auto-generated-if-empty"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-5 h-5 text-[#1868A5] rounded focus:ring-[#1868A5]"
                  />
                  <span className="text-sm font-medium text-slate-700">Publish Post Immediately</span>
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Thumbnail</h3>
              
              <label className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl relative overflow-hidden bg-slate-50 hover:bg-slate-100 cursor-pointer h-48 transition-all">
                <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-60 transition-opacity" />
                ) : null}
                <div className="space-y-1 text-center relative z-10 flex flex-col items-center justify-center bg-white/80 p-3 rounded-lg backdrop-blur-sm pointer-events-none">
                  <ImageIcon className="mx-auto h-6 w-6 text-slate-500" />
                  <span className="text-sm font-medium text-[#1868A5]">Upload Thumbnail</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isSaving ? "Saving..." : "Save Blog Post"}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}