import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, GraduationCap, Droplets, Heart, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectorSelectorProps {
  onSectorSelect: (sector: string) => void;
  onBack?: () => void;
}

const sectors = [
  {
    id: 'gbv',
    title: 'Gender-Based Violence',
    description: 'Report gender-based violence incidents and access support services',
    icon: <Shield className="h-10 w-10 text-red-600" />, // Big icon
    color: 'bg-red-50 border-l-8 border-red-600',
    priority: 'high',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Report educational challenges, safety issues, and infrastructure problems',
    icon: <GraduationCap className="h-10 w-10 text-blue-600" />,
    color: 'bg-blue-50 border-l-8 border-blue-600',
    priority: 'medium',
  },
  {
    id: 'water',
    title: 'Water & Infrastructure',
    description: 'Report water infrastructure issues and access challenges',
    icon: <Droplets className="h-10 w-10 text-cyan-600" />,
    color: 'bg-cyan-50 border-l-8 border-cyan-600',
    priority: 'medium',
  },
  {
    id: 'humanitarian',
    title: 'Humanitarian Crisis',
    description: 'Report general humanitarian crises and emergencies',
    icon: <Heart className="h-10 w-10 text-green-600" />,
    color: 'bg-green-50 border-l-8 border-green-600',
    priority: 'high',
  },
];

const SectorSelector: React.FC<SectorSelectorProps> = ({ onSectorSelect, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex flex-col bg-background justify-center items-center px-2 py-8">
      {/* Navigation Bar */}
      <div className="w-full max-w-2xl flex items-center mb-8">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-1" /> Back
          </Button>
        )}
        <div className="flex-1 text-center">
          <span className="text-xs uppercase tracking-widest text-nigerian-green font-bold">Official Government Reporting System</span>
        </div>
      </div>
      {/* Header */}
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-nigerian-green mb-3">Select Sector</h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          This is an official government reporting system. All reports are encrypted and handled with strict confidentiality. You can choose to submit anonymously, and your identity will be protected. Your safety and privacy are our top priority.
        </p>
      </div>
      {/* Sectors */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {sectors.map((sector) => (
          <button
            key={sector.id}
            className={`w-full flex items-center gap-6 rounded-xl p-6 text-left shadow-md transition-all duration-150 hover:scale-[1.02] hover:shadow-lg focus:outline-none ${sector.color}`}
            onClick={() => onSectorSelect(sector.id)}
            style={{ minHeight: '120px' }}
          >
            <div className="flex-shrink-0">{sector.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-nigerian-green">{sector.title}</span>
                {sector.priority === 'high' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full ml-2">
                    <AlertTriangle className="h-4 w-4" /> High Priority
                  </span>
                )}
              </div>
              <div className="text-base text-gray-700 mt-1">{sector.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectorSelector; 