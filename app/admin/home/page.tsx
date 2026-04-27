"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";

import ServicesTitleSection from "@/components/admin/home/ServicesTitleSection";
import ServicesCardsSection from "@/components/admin/home/ServicesCardsSection";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  useEffect(() => {
    if (data?.success && data.data) {
      setTitle(data.data.title || "");
      
      const fetchedCards = data.data.cards || [];
      
      if (fetchedCards.length >= 5) {
        setCards(fetchedCards.map((c: any, index: number) => ({
          title: c.title,
          description: c.description,
          order: c.order !== undefined ? c.order : index,
        })));
      } else {
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
    }
  }, [data]);

  const handleCardChange = (index: number, field: "title" | "description", value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleAddCard = () => {
    setCards([...cards, { title: "", description: "", order: cards.length }]);
  };

  const handleRemoveCard = (index: number) => {
    if (cards.length <= 5) {
      toast.error("You must have a minimum of 5 cards.");
      return;
    }
    const newCards = cards.filter((_, i) => i !== index);
    const reorderedCards = newCards.map((card, i) => ({ ...card, order: i }));
    setCards(reorderedCards);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cards.length < 5) {
      toast.error("You must have a minimum of 5 cards.");
      return;
    }

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
        mutate(); 
      } else {
        toast.error(result.message || "Failed to save changes.");
      }
    } catch {
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
          <p className="text-slate-500 text-sm mt-1">Manage your homepage cards.</p>
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
          <ServicesTitleSection title={title} setTitle={setTitle} />
          
          <ServicesCardsSection 
            cards={cards} 
            handleCardChange={handleCardChange} 
            handleAddCard={handleAddCard}
            handleRemoveCard={handleRemoveCard}
          />
        </form>
      )}
    </div>
  );
}