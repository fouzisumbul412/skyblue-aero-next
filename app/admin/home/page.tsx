"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { Save, Loader2, LayoutGrid, GripHorizontal } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Default structure to enforce the 5-card rule
const defaultCards = Array(5).fill(null).map((_, i) => ({
  title: "",
  description: "",
  order: i,
}));

export default function AdminHomeServices() {
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState(defaultCards);

  const { data, error, isLoading, mutate } = useSWR("/api/home/services", fetcher, {
    revalidateOnFocus: false,
  });

  // Populate state when data loads
  useEffect(() => {
    if (data?.success && data.data) {
      setTitle(data.data.title || "");
      
      // Ensure we always have exactly 5 cards to satisfy the Zod schema
      const fetchedCards = data.data.cards || [];
      const populatedCards = [...defaultCards];
      
      fetchedCards.forEach((card: any, index: number) => {
        if (index < 5) {
          populatedCards[index] = {
            title: card.title,
            description: card.description,
            order: card.order !== undefined ? card.order : index,
          };
        }
      });
      
      setCards(populatedCards);
    }
  }, [data]);

  const handleCardChange = (index: number, field: "title" | "description", value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = { title, cards };

      const res = await fetch("/api/admin/home/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Services section updated successfully!");
        mutate(); // Revalidate SWR
      } else {
        toast.error(result.message || "Failed to save changes.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    toast.error("Failed to load services configuration.");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Home Services Section</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 bg-[#1868A5] hover:bg-[#145a8d] text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#1868A5]" size={32} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* Main Title Section */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Main Header</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none"
                placeholder="e.g. AVIATION SOLUTIONS, PRECISELY TAILORED TO EVERY JOURNEY"
              />
            </div>
          </section>

          {/* Cards Section */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <LayoutGrid size={20} className="text-[#1868A5]" />
              <h2 className="text-lg font-semibold">Service Cards</h2>
            </div>
            
            <p className="text-sm text-slate-500 mb-4">
              Edit the content for each slot below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card, index) => (
                <div 
                  key={index} 
                  className={`relative bg-slate-50 border border-slate-200 rounded-xl p-5 ${index === 0 ? 'md:col-span-2 bg-blue-50/50 border-blue-100' : ''}`}
                >
                  <div className="absolute top-4 right-4 text-slate-300">
                    <GripHorizontal size={20} />
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Card {index + 1}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Card Title</label>
                      <input
                        required
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCardChange(index, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] focus:outline-none bg-white"
                        placeholder="e.g. Charter Flights"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea
                        required
                        value={card.description}
                        onChange={(e) => handleCardChange(index, "description", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1868A5] resize-none focus:outline-none bg-white"
                        placeholder="Brief description of the service..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </form>
      )}
    </div>
  );
}