"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { 
  Plus, Edit2, Trash2, Loader2, CheckCircle2, 
  XCircle, Globe, EyeOff, Search, ChevronLeft, ChevronRight 
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

type TabStatus = "all" | "published" | "draft";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminBlogList() {
  const [actionLoading, setActionLoading] = useState(false);
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

  // Filters & Pagination State
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const queryParams = new URLSearchParams({
    status: activeTab,
    search: debouncedSearch,
    page: currentPage.toString(),
    limit: "10"
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/blog?${queryParams.toString()}`, 
    fetcher,
    { keepPreviousData: true }
  );

  // Derived state from SWR data
  const posts = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalItems = data?.pagination?.total || 0;

  // Actions
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/blog/status", {
        method: "PATCH",
        body: JSON.stringify({ id, published: !currentStatus }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Post ${!currentStatus ? 'published' : 'unpublished'}`);
        mutate(); 
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const deletePost = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Post deleted successfully");
        mutate();
      }
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setActionLoading(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
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

  if (error) {
    toast.error("Failed to load posts");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <ConfirmModal 
        {...modalConfig} 
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))} 
        isLoading={actionLoading}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insights & Blog</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your articles and public updates.</p>
        </div>
        <Link 
          href="/admin/blog/new" 
          className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm shrink-0"
        >
          <Plus size={18} />
          Create New Post
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
          {(['all', 'published', 'draft'] as TabStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                activeTab === tab 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1868A5]"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
        
        {/* Subtle loading indicator overlay when fetching new pages while keeping previous data visible */}
        {isLoading && posts.length > 0 && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
             <Loader2 className="animate-spin text-[#1868A5]" size={32} />
          </div>
        )}

        {isLoading && posts.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-[#1868A5]" size={32} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-24">Thumbnail</th>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.length > 0 ? (
                    posts.map((post: any) => (
                      <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                          <img src={post.thumbnail || "/placeholder.svg"} className="w-16 h-10 object-cover rounded border border-slate-200" alt="thumbnail" />
                        </td>
                        <td className="px-6 py-3">
                          <p className="font-medium text-slate-900 truncate max-w-[250px] sm:max-w-md">{post.title}</p>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No posts found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                <span className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} posts
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isLoading}
                    className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}