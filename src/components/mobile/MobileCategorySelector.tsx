import React from 'react';
import { Shield, GraduationCap, Heart, Droplets, Building2, Users, AlertTriangle, Phone, BookOpen, UserCheck, Wifi, Zap } from 'lucide-react';

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

interface MobileCategorySelectorProps {
  sector: string;
  onSelect: (category: string) => void;
  onClose: () => void;
}

export default function MobileCategorySelector({ sector, onSelect, onClose }: MobileCategorySelectorProps) {
  const getCategories = (sector: string) => {
    switch (sector) {
      case 'gbv':
        return [
          { id: 'domestic_violence', label: 'Domestic Violence', icon: Shield, description: 'Physical, emotional, or psychological abuse in relationships' },
          { id: 'sexual_harassment', label: 'Sexual Harassment', icon: Shield, description: 'Unwanted sexual advances or behavior' },
          { id: 'child_abuse', label: 'Child Abuse', icon: Shield, description: 'Physical, emotional, or sexual abuse of children' },
          { id: 'forced_marriage', label: 'Forced Marriage', icon: Shield, description: 'Marriage without consent or under pressure' },
          { id: 'human_trafficking', label: 'Human Trafficking', icon: Shield, description: 'Exploitation and trafficking of persons' },
        ];
      case 'education':
        return [
          { id: 'school_infrastructure', label: 'School Infrastructure', icon: Building2, description: 'Building conditions, facilities, or equipment' },
          { id: 'teacher_quality', label: 'Teacher Quality', icon: UserCheck, description: 'Teaching standards, qualifications, or behavior' },
          { id: 'access_to_education', label: 'Access to Education', icon: GraduationCap, description: 'Barriers to education enrollment or attendance' },
          { id: 'learning_materials', label: 'Learning Materials', icon: BookOpen, description: 'Textbooks, supplies, or educational resources' },
          { id: 'school_safety', label: 'School Safety', icon: Shield, description: 'Security, bullying, or safety concerns' },
        ];
      case 'health':
        return [
          { id: 'medical_facilities', label: 'Medical Facilities', icon: Building2, description: 'Hospitals, clinics, or healthcare centers' },
          { id: 'medical_staff', label: 'Medical Staff', icon: UserCheck, description: 'Doctors, nurses, or healthcare workers' },
          { id: 'medication_access', label: 'Medication Access', icon: Heart, description: 'Availability of medicines or treatments' },
          { id: 'maternal_health', label: 'Maternal Health', icon: Heart, description: 'Pregnancy care, childbirth, or postnatal services' },
          { id: 'mental_health', label: 'Mental Health', icon: Heart, description: 'Psychological support or mental health services' },
        ];
      case 'water':
        return [
          { id: 'clean_water', label: 'Clean Water Access', icon: Droplets, description: 'Availability of safe drinking water' },
          { id: 'sanitation', label: 'Sanitation Facilities', icon: Building2, description: 'Toilets, sewage systems, or hygiene facilities' },
          { id: 'water_quality', label: 'Water Quality', icon: Droplets, description: 'Water contamination or pollution issues' },
          { id: 'water_infrastructure', label: 'Water Infrastructure', icon: Building2, description: 'Pipes, pumps, or water distribution systems' },
          { id: 'hygiene_education', label: 'Hygiene Education', icon: GraduationCap, description: 'Hygiene awareness or training programs' },
        ];
      case 'infrastructure':
        return [
          { id: 'roads', label: 'Roads & Transport', icon: Building2, description: 'Road conditions, bridges, or transportation' },
          { id: 'electricity', label: 'Electricity', icon: Zap, description: 'Power supply, electrical infrastructure' },
          { id: 'buildings', label: 'Public Buildings', icon: Building2, description: 'Government buildings, community centers' },
          { id: 'waste_management', label: 'Waste Management', icon: Building2, description: 'Garbage collection, recycling, or disposal' },
          { id: 'public_spaces', label: 'Public Spaces', icon: Users, description: 'Parks, markets, or community areas' },
        ];
      case 'community':
        return [
          { id: 'social_services', label: 'Social Services', icon: Users, description: 'Welfare programs, support services' },
          { id: 'youth_programs', label: 'Youth Programs', icon: Users, description: 'Activities, training, or opportunities for youth' },
          { id: 'elderly_care', label: 'Elderly Care', icon: Heart, description: 'Support services for senior citizens' },
          { id: 'disability_support', label: 'Disability Support', icon: Users, description: 'Services for persons with disabilities' },
          { id: 'community_events', label: 'Community Events', icon: Users, description: 'Cultural events, celebrations, or gatherings' },
        ];
      case 'emergency':
        return [
          { id: 'natural_disaster', label: 'Natural Disaster', icon: AlertTriangle, description: 'Floods, earthquakes, or weather emergencies' },
          { id: 'fire_emergency', label: 'Fire Emergency', icon: AlertTriangle, description: 'Fire outbreaks or fire safety issues' },
          { id: 'medical_emergency', label: 'Medical Emergency', icon: AlertTriangle, description: 'Urgent medical situations or accidents' },
          { id: 'security_threat', label: 'Security Threat', icon: AlertTriangle, description: 'Violence, crime, or safety threats' },
          { id: 'evacuation', label: 'Evacuation', icon: AlertTriangle, description: 'Emergency evacuation or shelter needs' },
        ];
      case 'communication':
        return [
          { id: 'phone_services', label: 'Phone Services', icon: Phone, description: 'Mobile networks, landlines, or phone coverage' },
          { id: 'internet_access', label: 'Internet Access', icon: Wifi, description: 'Broadband, WiFi, or internet connectivity' },
          { id: 'postal_services', label: 'Postal Services', icon: Building2, description: 'Mail delivery or postal facilities' },
          { id: 'broadcasting', label: 'Broadcasting', icon: Phone, description: 'Radio, TV, or media services' },
          { id: 'digital_services', label: 'Digital Services', icon: Wifi, description: 'Online government services or digital platforms' },
        ];
      default:
        return [];
    }
  };

  const categories = getCategories(sector);
  const sectorLabels = {
    gbv: 'Gender-Based Violence',
    education: 'Education',
    health: 'Healthcare',
    water: 'Water & Sanitation',
    infrastructure: 'Infrastructure',
    community: 'Community Services',
    emergency: 'Emergency Response',
    communication: 'Communication',
  };

  return (
    <div className="mobile-modal" onClick={onClose}>
      <div className="mobile-modal-content mobile-scale-in" onClick={e => e.stopPropagation()}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1b4332] mb-2">Select Category</h2>
          <p className="text-slate-600 text-sm">
            {sectorLabels[sector as keyof typeof sectorLabels]} - Choose specific issue
          </p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className="w-full rounded-2xl bg-white shadow-md border border-[#e0e0e0] p-4 text-left hover:bg-[#e8f5e9] active:scale-95 transition-all"
                onClick={() => onSelect(category.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 text-[#2ecc71]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1b4332] text-base mb-1">{category.label}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{category.description}</p>
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
          Back to Sectors
        </button>
      </div>
    </div>
  );
} 