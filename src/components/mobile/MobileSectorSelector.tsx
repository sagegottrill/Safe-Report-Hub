import React from 'react';
import { Shield, GraduationCap, Heart, Droplets, Building2, Users, AlertTriangle, Phone } from 'lucide-react';

const COLORS = {
  emerald: '#2ecc71',
  mint: '#e8f5e9',
  forest: '#1b4332',
  sage: '#a8cbaa',
  jade: '#00a676',
  slate: '#2c3e50',
  gray: '#e0e0e0',
  white: '#fff',
  bg: '#f9fafb',
};

interface MobileSectorSelectorProps {
  onSelect: (sector: string) => void;
  onClose: () => void;
}

export default function MobileSectorSelector({ onSelect, onClose }: MobileSectorSelectorProps) {
  const sectors = [
    {
      id: 'gbv',
      label: 'Gender-Based Violence',
      description: 'Report incidents of domestic violence, harassment, or abuse',
      icon: Shield,
      color: COLORS.emerald,
      bg: COLORS.mint,
    },
    {
      id: 'education',
      label: 'Education',
      description: 'Issues related to schools, teachers, or educational facilities',
      icon: GraduationCap,
      color: COLORS.jade,
      bg: COLORS.sage,
    },
    {
      id: 'health',
      label: 'Healthcare',
      description: 'Medical facilities, services, or health-related concerns',
      icon: Heart,
      color: COLORS.forest,
      bg: COLORS.mint,
    },
    {
      id: 'water',
      label: 'Water & Sanitation',
      description: 'Clean water access, sanitation facilities, or hygiene issues',
      icon: Droplets,
      color: COLORS.sage,
      bg: COLORS.mint,
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      description: 'Roads, buildings, electricity, or public facilities',
      icon: Building2,
      color: COLORS.jade,
      bg: COLORS.sage,
    },
    {
      id: 'community',
      label: 'Community Services',
      description: 'Social services, community programs, or local initiatives',
      icon: Users,
      color: COLORS.emerald,
      bg: COLORS.mint,
    },
    {
      id: 'emergency',
      label: 'Emergency Response',
      description: 'Urgent situations requiring immediate attention',
      icon: AlertTriangle,
      color: '#e74c3c',
      bg: '#fdf2f2',
    },
    {
      id: 'communication',
      label: 'Communication',
      description: 'Phone services, internet access, or communication networks',
      icon: Phone,
      color: COLORS.forest,
      bg: COLORS.mint,
    },
  ];

  return (
    <div className="mobile-modal" onClick={onClose}>
      <div className="mobile-modal-content mobile-scale-in" onClick={e => e.stopPropagation()}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1b4332] mb-2">Select Sector</h2>
          <p className="text-slate-600 text-sm">Choose the category that best describes your report</p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <button
                key={sector.id}
                className="w-full rounded-2xl bg-white shadow-md border border-[#e0e0e0] p-4 text-left hover:bg-[#e8f5e9] active:scale-95 transition-all"
                onClick={() => onSelect(sector.id)}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: sector.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: sector.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1b4332] text-base mb-1">{sector.label}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{sector.description}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#2ecc71]" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button 
          className="mobile-button mobile-button-secondary w-full mt-6" 
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 