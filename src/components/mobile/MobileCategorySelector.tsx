import React from 'react';

const CATEGORIES: Record<string, { key: string; label: string; color: string; icon: string }[]> = {
  gbv: [
    { key: 'rape', label: 'Rape / Sexual Assault', color: 'from-pink-500 to-pink-300', icon: '🚨' },
    { key: 'domestic', label: 'Domestic Violence', color: 'from-red-600 to-red-400', icon: '🏠' },
    { key: 'trafficking', label: 'Human Trafficking', color: 'from-purple-700 to-purple-400', icon: '🕸️' },
    { key: 'fgm', label: 'FGM / Harmful Practices', color: 'from-yellow-600 to-yellow-400', icon: '✂️' },
  ],
  education: [
    { key: 'school_attack', label: 'School Attack', color: 'from-blue-700 to-blue-400', icon: '🏫' },
    { key: 'abuse', label: 'Abuse / Bullying', color: 'from-green-600 to-green-400', icon: '👊' },
    { key: 'infrastructure', label: 'Infrastructure Issue', color: 'from-cyan-600 to-cyan-400', icon: '🏗️' },
  ],
  water: [
    { key: 'shortage', label: 'Water Shortage', color: 'from-cyan-600 to-cyan-400', icon: '💧' },
    { key: 'contamination', label: 'Contamination', color: 'from-blue-600 to-blue-300', icon: '🦠' },
    { key: 'infrastructure', label: 'Infrastructure Issue', color: 'from-green-600 to-green-400', icon: '🏗️' },
  ],
  humanitarian: [
    { key: 'displacement', label: 'Displacement', color: 'from-yellow-600 to-yellow-400', icon: '🚶' },
    { key: 'food', label: 'Food Insecurity', color: 'from-orange-600 to-orange-400', icon: '🍚' },
    { key: 'health', label: 'Health Emergency', color: 'from-red-600 to-red-400', icon: '🚑' },
  ],
};

export default function MobileCategorySelector({ sector, value, onChange }: { sector: string; value: string; onChange: (cat: string) => void }) {
  const categories = CATEGORIES[sector] || [];
  return (
    <div className="mb-6">
      <h2 className="mobile-title mb-4 text-center">Select Category</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`mobile-card p-6 bg-gradient-to-br ${cat.color} text-white flex flex-col items-center justify-center mobile-hover-lift mobile-active-scale shadow-xl border-2 ${value === cat.key ? 'border-white/80 scale-105' : 'border-transparent'}`}
            onClick={() => onChange(cat.key)}
            aria-label={cat.label}
          >
            <span className="text-3xl mb-2">{cat.icon}</span>
            <span className="font-bold text-base text-center drop-shadow-lg">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 