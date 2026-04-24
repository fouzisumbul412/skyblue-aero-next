"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { 
  Save, ArrowLeft, Image as ImageIcon, Loader2, 
  Trash2, Globe, EyeOff, FileText 
} from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor"; 
import ConfirmModal from "@/components/admin/ConfirmModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminBlogEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isNew = slug === "new";

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

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    type: "danger" | "info";
    onConfirm: () => void;
  }>({
    isOpen: false, title: "", message: "", confirmText: "", type: "info", onConfirm: () => {}
  });

  const { data: postData, isLoading: swrLoading, mutate } = useSWR(
    !isNew ? `/api/blog/${slug}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Populate form when data loads
  useEffect(() => {
    if (postData?.success) {
      const data = postData.data;
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
    } else if (postData && !postData.success) {
      toast.error("Post not found");
      router.push("/admin/blog");
    }
  }, [postData, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Core Save Logic
  const savePost = async (forcePublishState?: boolean) => {
    setIsSaving(true);
    const finalPublishState = forcePublishState !== undefined ? forcePublishState : formData.published;

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => payload.append(key, String(val)));
      payload.append("content", content);
      payload.set("published", String(finalPublishState));
      
      if (thumbnail) {
        payload.append("thumbnail", thumbnail);
      } else if (isNew && !thumbnailPreview) {
        toast.error("Thumbnail image is required");
        setIsSaving(false);
        return;
      }

      const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${postId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, { method, body: payload });
      const data = await res.json();
      
      if (data.success) {
        toast.success(finalPublishState ? "Post published successfully!" : "Post saved successfully!");
        setFormData(prev => ({ ...prev, published: finalPublishState }));
        if (isNew) {
          router.push("/admin/blog");
        } else {
          mutate(); 
        }
      } else {
        toast.error(data.message || "Failed to save post.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Post deleted successfully");
        router.push("/admin/blog");
      }
    } catch (error) {
      toast.error("Failed to delete post");
      setIsSaving(false);
    } finally {
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    }
  };

  // Modal Triggers
  const confirmPublishToggle = () => {
    const willPublish = !formData.published;
    setModalConfig({
      isOpen: true,
      title: willPublish ? "Publish Post" : "Unpublish Post",
      message: willPublish 
        ? "This will make the post visible to all website visitors. Are you sure you want to publish?"
        : "This will hide the post from the public website. It will revert to a draft. Are you sure?",
      confirmText: willPublish ? "Publish Now" : "Unpublish",
      type: "info",
      onConfirm: () => savePost(willPublish)
    });
  };

  const confirmDelete = () => {
    setModalConfig({
      isOpen: true,
      title: "Delete Post",
      message: "Are you sure you want to completely delete this post? This action cannot be undone.",
      confirmText: "Delete Post",
      type: "danger",
      onConfirm: handleDelete
    });
  };

  if (swrLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1868A5]" size={32} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto pb-20 space-y-6">
      
      <ConfirmModal 
        {...modalConfig} 
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} 
        isLoading={isSaving}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isNew ? "Create New Post" : "Edit Post"}</h1>
            <div className="flex items-center gap-2 mt-1">
              {formData.published ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700">Published</span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">Draft</span>
              )}
            </div>
          </div>
        </div>

        {!isNew && (
          <button 
            type="button" 
            onClick={confirmDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Delete Post</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Editor Column (Takes 3/4 of the width) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Post Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xl px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
                placeholder="e.g. The Future of Aviation"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Short Excerpt</label>
              <textarea
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] resize-none focus:outline-none"
                placeholder="A brief summary for the blog card..."
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
              {/* Added CSS wrapper to ensure Tiptap images scale correctly if they render */}
              <div className="min-h-[500px] [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4">
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Column (Takes 1/4 of the width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Actions Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Actions</h3>
            
            <button
              type="button"
              onClick={() => savePost()} 
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isNew ? "Save Draft" : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={confirmPublishToggle}
              disabled={isSaving}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50 border ${
                formData.published 
                  ? "bg-white border-amber-200 text-amber-700 hover:bg-amber-50" 
                  : "bg-white border-green-200 text-green-700 hover:bg-green-50"
              }`}
            >
              {formData.published ? <EyeOff size={18} /> : <Globe size={18} />}
              {formData.published ? "Unpublish Post" : "Publish Now"}
            </button>
          </div>

          {/* Details Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input
                required
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
                placeholder="e.g. Industry News"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Read Time</label>
              <input
                required
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
              <input
                required
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Custom Slug (Optional)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
                placeholder="auto-generated"
              />
            </div>
          </div>

          {/* Thumbnail Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Thumbnail</h3>
            
            <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
              {thumbnailPreview ? (
                <>
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                      <ImageIcon size={16} />
                      Change Cover
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                  <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-600">Upload Thumbnail</span>
                  <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}