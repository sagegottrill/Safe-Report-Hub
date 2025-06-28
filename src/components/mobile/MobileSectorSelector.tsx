import React from 'react';

const SECTORS = [
  { key: 'gbv', label: 'Gender-Based Violence', color: 'from-pink-600 to-pink-400', icon: '🛡️' },
  { key: 'education', label: 'Education', color: 'from-blue-700 to-blue-400', icon: '🎓' },
  { key: 'water', label: 'Water & Infrastructure', color: 'from-cyan-600 to-cyan-400', icon: '💧' },
  { key: 'humanitarian', label: 'Humanitarian Crisis', color: 'from-green-600 to-green-400', icon: '💚' },
];

export default function MobileSectorSelector({ value, onChange }: { value: string; onChange: (sector: string) => void }) {
  return (
    <div className="mb-6">
      <h2 className="mobile-title mb-4 text-center">Select Sector</h2>
      <div className="grid grid-cols-2 gap-4">
        {SECTORS.map(sector => (
          <button
            key={sector.key}
            className={`mobile-card p-6 bg-gradient-to-br ${sector.color} text-white flex flex-col items-center justify-center mobile-hover-lift mobile-active-scale shadow-xl border-2 ${value === sector.key ? 'border-white/80 scale-105' : 'border-transparent'}`}
            onClick={() => onChange(sector.key)}
            aria-label={sector.label}
          >
            <span className="text-3xl mb-2">{sector.icon}</span>
            <span className="font-bold text-base text-center drop-shadow-lg">{sector.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 