import React, { useState } from 'react';
import { X, ChevronLeft, Send, AlertCircle } from 'lucide-react';
import MobileSectorSelector from './MobileSectorSelector';
import MobileCategorySelector from './MobileCategorySelector';

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

interface MobileReportFormProps {
  onSubmit: (data: { sector: string; category: string; description: string }) => void;
  onClose: () => void;
}

export default function MobileReportForm({ onSubmit, onClose }: MobileReportFormProps) {
  const [step, setStep] = useState<'sector' | 'category' | 'details'>('sector');
  const [sector, setSector] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSectorSelect = (selectedSector: string) => {
    setSector(selectedSector);
    setCategory('');
    setStep('category');
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setStep('details');
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!sector) newErrors.sector = 'Please select a sector';
    if (!category) newErrors.category = 'Please select a category';
    if (!description.trim()) newErrors.description = 'Please provide a description';
    if (description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ sector, category, description: description.trim() });
  };

  const getStepTitle = () => {
    switch (step) {
      case 'sector': return 'Select Sector';
      case 'category': return 'Select Category';
      case 'details': return 'Report Details';
      default: return 'Submit Report';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'sector': return 'Choose the main category for your report';
      case 'category': return 'Select the specific issue type';
      case 'details': return 'Provide detailed information about the incident';
      default: return '';
    }
  };

  const canGoBack = step !== 'sector';
  const canSubmit = step === 'details' && sector && category && description.trim().length >= 10;

    return (
    <div className="mobile-modal" onClick={onClose}>
      <div className="mobile-modal-content mobile-scale-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {canGoBack && (
              <button
                onClick={() => {
                  if (step === 'category') setStep('sector');
                  if (step === 'details') setStep('category');
                }}
                className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center active:scale-95 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#2ecc71]" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-[#1b4332]">{getStepTitle()}</h2>
              <p className="text-slate-600 text-sm">{getStepDescription()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center active:scale-95 transition-all"
          >
            <X className="w-5 h-5 text-[#2ecc71]" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {['sector', 'category', 'details'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === s 
                    ? 'bg-[#2ecc71] text-white' 
                    : i < ['sector', 'category', 'details'].indexOf(step)
                    ? 'bg-[#a8cbaa] text-[#1b4332]'
                    : 'bg-[#e0e0e0] text-[#2c3e50]'
                }`}
              >
                {i + 1}
        </div>
              {i < 2 && (
                <div 
                  className={`w-8 h-1 mx-1 ${
                    i < ['sector', 'category', 'details'].indexOf(step) ? 'bg-[#a8cbaa]' : 'bg-[#e0e0e0]'
              }`}
            />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        {step === 'sector' && (
          <MobileSectorSelector onSelect={handleSectorSelect} onClose={onClose} />
        )}

        {step === 'category' && (
          <MobileCategorySelector sector={sector} onSelect={handleCategorySelect} onClose={onClose} />
        )}

        {step === 'details' && (
          <div className="space-y-6">
            {/* Selected Options Display */}
            <div className="bg-[#e8f5e9] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#1b4332]">Selected:</span>
                  <button
                  onClick={() => setStep('sector')}
                  className="text-xs text-[#2ecc71] font-medium"
                >
                  Change
                </button>
              </div>
              <div className="text-sm text-[#2c3e50]">
                <div className="mb-1">
                  <span className="font-medium">Sector:</span> {sector.charAt(0).toUpperCase() + sector.slice(1).replace('_', ' ')}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                </div>
                    </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-semibold text-[#1b4332] mb-3">
                Describe the incident or issue
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                placeholder="Provide a detailed description of what happened, when it occurred, and any relevant details that will help address this issue..."
                className={`w-full h-32 p-4 rounded-2xl border-2 resize-none font-sans text-base leading-relaxed ${
                  errors.description 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-[#e0e0e0] bg-white focus:border-[#2ecc71] focus:ring-2 focus:ring-[#e8f5e9]'
                } transition-all`}
              />
              {errors.description && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
            </div>
              )}
              <div className="text-xs text-slate-500 mt-2 text-right">
                {description.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
              <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all ${
                canSubmit
                  ? 'bg-[#2ecc71] text-white shadow-lg active:scale-95 hover:bg-[#27ae60]'
                  : 'bg-[#e0e0e0] text-[#2c3e50] cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Submit Report
              </div>
              </button>
          </div>
        )}
          </div>
    </div>
  );
} 