"use client";

import React from "react";
import { LayoutGrid, GripHorizontal, Plus, Trash2 } from "lucide-react";

interface CardItem {
  title: string;
  description: string;
  order: number;
}

interface Props {
  cards: CardItem[];
  handleCardChange: (index: number, field: "title" | "description", value: string) => void;
  handleAddCard: () => void;
  handleRemoveCard: (index: number) => void;
}

export default function ServicesCardsSection({ 
  cards, handleCardChange, handleAddCard, handleRemoveCard 
}: Props) {
  const minCards = 5;

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900">
          <LayoutGrid size={20} className="text-[#1868A5]" />
          <h2 className="text-lg font-semibold">Service Cards (Minimum {minCards})</h2>
        </div>
        <button
          type="button"
          onClick={handleAddCard}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Card
        </button>
      </div>
      
      <p className="text-sm text-slate-500 mb-4">
        Edit the content for each slot below. You currently have {cards.length} cards.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`relative bg-slate-50 border border-slate-200 rounded-xl p-5 ${index === 0 ? 'md:col-span-2 bg-blue-50/50 border-blue-100' : ''}`}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {cards.length > minCards && (
                <button
                  type="button"
                  onClick={() => handleRemoveCard(index)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Remove Card"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <div className="text-slate-300 cursor-grab active:cursor-grabbing">
                <GripHorizontal size={20} />
              </div>
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
  );
}