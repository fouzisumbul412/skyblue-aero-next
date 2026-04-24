"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { 
  Loader2, Trash2, Mail, Phone, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, CloudOff, PlaneTakeoff, Calendar, Users
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminCharterRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const limit = 10;

  // Zoho Deletion State
  const [deleteFromZoho, setDeleteFromZoho] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, requestId: "", requestName: ""
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/charter?page=${currentPage}&limit=${limit}`,
    fetcher,
    { keepPreviousData: true }
  );

  const requests = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalItems = data?.pagination?.total || 0;

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const url = `/api/admin/charter/${modalConfig.requestId}?removeFromZoho=${deleteFromZoho}`;
      
      const res = await fetch(url, {
        method: "DELETE",
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success(deleteFromZoho ? "Deleted from database and Zoho CRM." : "Request deleted from database.");
        mutate();
        if (requests.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } else {
        toast.error(result.message || "Failed to delete request.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setActionLoading(false);
      setModalConfig({ isOpen: false, requestId: "", requestName: "" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }).format(new Date(dateString));
  };

  const formatTimestamp = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true
    }).format(new Date(dateString));
  };

  if (error) toast.error("Failed to load requests");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-20">
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title="Delete Charter Request"
        message={`Are you sure you want to delete the charter request from "${modalConfig.requestName}"? ${deleteFromZoho ? "This will ALSO delete the record from Zoho CRM." : "This will only remove it from your local database."} This cannot be undone.`}
        confirmText="Delete Request"
        type="danger"
        isLoading={actionLoading}
        onClose={() => setModalConfig({ isOpen: false, requestId: "", requestName: "" })} 
        onConfirm={handleDelete}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Charter Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Review private jet booking inquiries.</p>
        </div>

        {/* Zoho Deletion Toggle */}
        <label className="flex items-center gap-3 cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={deleteFromZoho}
              onChange={(e) => setDeleteFromZoho(e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${deleteFromZoho ? 'bg-red-500' : 'bg-slate-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${deleteFromZoho ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CloudOff size={16} className={deleteFromZoho ? "text-red-500" : "text-slate-400"} />
            Also delete from Zoho CRM
          </div>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        {isLoading && requests.length > 0 && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
             <Loader2 className="animate-spin text-[#1868A5]" size={32} />
          </div>
        )}

        {isLoading && requests.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-[#1868A5]" size={32} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Received</th>
                    <th className="px-6 py-4 font-semibold">Client Details</th>
                    <th className="px-6 py-4 font-semibold">Flight Requirements</th>
                    <th className="px-6 py-4 font-semibold text-center">Zoho Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.length > 0 ? (
                    requests.map((req: any) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap align-top">
                          <span className="text-slate-900 font-medium">{formatTimestamp(req.createdAt).split(',')[0]}</span>
                          <span className="block text-xs text-slate-400 mt-0.5">{formatTimestamp(req.createdAt).split(',')[1]}</span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <p className="font-semibold text-slate-900 mb-1">{req.name}</p>
                          <div className="space-y-1">
                            <a href={`mailto:${req.email}`} className="flex items-center gap-1.5 text-xs text-[#1868A5] hover:underline">
                              <Mail size={12} /> {req.email}
                            </a>
                            <a href={`tel:${req.phone}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700">
                              <Phone size={12} /> {req.phone}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                              <PlaneTakeoff size={14} className="text-[#1868A5]" />
                              {req.departure} <span className="text-slate-400 font-normal mx-1">to</span> {req.arriving}
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-slate-400" />
                                <span>Departs: <span className="font-medium text-slate-700">{formatDate(req.departureDate)}</span></span>
                              </div>
                              {req.returnDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar size={12} className="text-slate-400" />
                                  <span>Returns: <span className="font-medium text-slate-700">{formatDate(req.returnDate)}</span></span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Users size={12} className="text-slate-400" />
                                <span>Pax: <span className="font-medium text-slate-700">{req.passengers}</span></span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center align-top">
                          {req.zohoSynced ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                              <CheckCircle2 size={14} /> Synced
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100" title="Failed to push to Zoho CRM">
                              <AlertCircle size={14} /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <button 
                            onClick={() => setModalConfig({ isOpen: true, requestId: req.id, requestName: req.name })}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Request"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                <span className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} requests
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