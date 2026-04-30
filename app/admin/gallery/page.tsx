"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { 
  UploadCloud, Trash2, Loader2, Image as ImageIcon, 
  Save, ChevronLeft, ChevronRight 
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { MAX_FILE_SIZE } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadOrder, setUploadOrder] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, imageId: "",
  });

  // Local state for editing order numbers in the grid
  const [editOrders, setEditOrders] = useState<Record<string, number>>({});

  const limit = 12;
  const { data, error, isLoading, mutate } = useSWR(
    `/api/gallery?page=${currentPage}&limit=${limit}`,
    fetcher,
    { keepPreviousData: true }
  );

  const images = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalItems = data?.pagination?.total || 0;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image size should be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Upload new image
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("order", uploadOrder.toString());

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Image added successfully!");
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadOrder(0);
        mutate(); // Refresh SWR data
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (error) {
      toast.error("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Update order of an existing image
  const handleUpdateOrder = async (id: string) => {
    const newOrder = editOrders[id];
    if (newOrder === undefined) return; // Nothing changed

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success("Order updated!");
        mutate(); // Refresh the grid to reflect new sorting
      } else {
        toast.error(result.message || "Failed to update order");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete an image
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${modalConfig.imageId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success("Image deleted permanently.");
        mutate();
        // If we delete the last item on a page, go back one page
        if (images.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } else {
        toast.error(result.message || "Failed to delete image.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setActionLoading(false);
      setModalConfig({ isOpen: false, imageId: "" });
    }
  };

  if (error) toast.error("Failed to load gallery images");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title="Delete Image"
        message="Are you sure you want to delete this image? It will be removed from your public gallery permanently."
        confirmText="Delete Image"
        type="danger"
        isLoading={actionLoading}
        onClose={() => setModalConfig({ isOpen: false, imageId: "" })} 
        onConfirm={handleDelete}
      />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gallery Management</h1>
        <p className="text-slate-500 text-sm mt-1">Upload and organize images for your public portfolio.</p>
      </div>

      {/* Upload Section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <UploadCloud size={20} className="text-[#1868A5]" />
          Add New Image
        </h2>
        
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select File</label>
            <div className="relative group rounded-xl overflow-hidden border border-slate-300 bg-slate-50 h-32 flex items-center justify-center">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-100">
                      Change File
                      <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-600">Click to browse</span>
                  <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-2">Display Order</label>
            <input
              type="number"
              value={uploadOrder}
              onChange={(e) => setUploadOrder(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] outline-none"
              placeholder="e.g. 1"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full flex items-center justify-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 h-[46px]"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </form>
      </section>

      {/* Gallery Grid */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative min-h-[400px]">
        {isLoading && images.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#1868A5]" size={32} />
          </div>
        ) : images.length > 0 ? (
          <>
            {/* Subtle loading overlay for pagination */}
            {isLoading && (
               <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-2xl">
                 <Loader2 className="animate-spin text-[#1868A5]" size={32} />
               </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img: any) => (
                <div key={img.id} className="group relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Image Container */}
                  <div className="aspect-square bg-slate-200 relative overflow-hidden">
                    <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                    
                    {/* Delete Button Overlay */}
                    <button 
                      onClick={() => setModalConfig({ isOpen: true, imageId: img.id })}
                      className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 hover:bg-red-600 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Delete Image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Settings / Order Container */}
                  <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Order:</label>
                    <input 
                      type="number"
                      value={editOrders[img.id] ?? img.order}
                      onChange={(e) => setEditOrders(prev => ({ ...prev, [img.id]: Number(e.target.value) }))}
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#1868A5] outline-none"
                    />
                    {/* Show save button only if order was changed locally */}
                    {editOrders[img.id] !== undefined && editOrders[img.id] !== img.order && (
                      <button
                        onClick={() => handleUpdateOrder(img.id)}
                        disabled={actionLoading}
                        className="p-1.5 bg-[#1868A5] text-white rounded hover:bg-[#145a8d] transition-colors disabled:opacity-50"
                        title="Save new order"
                      >
                        <Save size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
                <span className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} images
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
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p>No images found in your gallery.</p>
          </div>
        )}
      </section>
    </div>
  );
}