"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, XCircle, Globe, EyeOff } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function AdminBlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    type: "danger" | "info";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "danger",
    onConfirm: () => {},
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/blog/status", {
        method: "PATCH",
        body: JSON.stringify({ id, published: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Post ${!currentStatus ? 'published' : 'unpublished'}`);
        fetchPosts();
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
      setModalConfig({ ...modalConfig, isOpen: false });
    }
  };

  const deletePost = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Post deleted successfully");
        fetchPosts();
      }
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setActionLoading(false);
      setModalConfig({ ...modalConfig, isOpen: false });
    }
  };

  const openConfirm = (type: 'delete' | 'status', post: any) => {
    if (type === 'delete') {
      setModalConfig({
        isOpen: true,
        title: "Delete Post",
        message: `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
        confirmText: "Delete Post",
        type: "danger",
        onConfirm: () => deletePost(post.id),
      });
    } else {
      setModalConfig({
        isOpen: true,
        title: post.published ? "Unpublish Post" : "Publish Post",
        message: post.published 
          ? "This will hide the post from the public website. Continue?" 
          : "This will make the post visible to all visitors. Continue?",
        confirmText: post.published ? "Unpublish" : "Publish Now",
        type: "info",
        onConfirm: () => toggleStatus(post.id, post.published),
      });
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1868A5]" size={32} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <ConfirmModal 
        {...modalConfig} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
        isLoading={actionLoading}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insights & Blog</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your articles and public updates.</p>
        </div>
        <Link 
          href="/admin/blog/new" 
          className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus size={18} />
          Create New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Thumbnail</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <img src={post.thumbnail} className="w-16 h-10 object-cover rounded border border-slate-200" />
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-slate-900 truncate max-w-[250px]">{post.title}</p>
                    <p className="text-xs text-slate-400">{post.category}</p>
                  </td>
                  <td className="px-6 py-3">
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-100">
                        <CheckCircle2 size={12} /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 text-slate-500 text-xs border border-slate-200">
                        <XCircle size={12} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Status Toggle Button */}
                      <button 
                        onClick={() => openConfirm('status', post)}
                        className={`p-2 rounded-md transition-colors ${post.published ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? <EyeOff size={18} /> : <Globe size={18} />}
                      </button>

                      <Link href={`/admin/blog/${post.slug}`} className="p-2 text-slate-400 hover:text-[#1868A5] hover:bg-blue-50 rounded-md">
                        <Edit2 size={18} />
                      </Link>

                      <button onClick={() => openConfirm('delete', post)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}