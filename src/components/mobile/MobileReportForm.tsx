import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import MobileSectorSelector from './MobileSectorSelector';
import MobileCategorySelector from './MobileCategorySelector';

const REPORT_TYPES = [
  { id: 'gender_based_violence', label: 'Gender-Based Violence', icon: AlertTriangle, color: 'text-red-600' },
  { id: 'child_protection', label: 'Child Protection', icon: AlertTriangle, color: 'text-orange-600' },
  { id: 'food_insecurity', label: 'Food Insecurity', icon: AlertTriangle, color: 'text-yellow-600' },
  { id: 'water_sanitation', label: 'Water & Sanitation', icon: AlertTriangle, color: 'text-blue-600' },
  { id: 'shelter_issues', label: 'Shelter Issues', icon: AlertTriangle, color: 'text-purple-600' },
  { id: 'health_emergencies', label: 'Health Emergencies', icon: AlertTriangle, color: 'text-red-600' },
  { id: 'education_issues', label: 'Education Issues', icon: AlertTriangle, color: 'text-green-600' },
  { id: 'other', label: 'Other', icon: FileText, color: 'text-gray-600' }
];

const URGENCY_LEVELS = [
  { id: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
];

export default function MobileReportForm({ onSubmit, onClose }: { onSubmit: (data: any) => void; onClose?: () => void }) {
  const navigate = useNavigate();
  const { submitReport, user } = useAppContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sector, setSector] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    urgency: 'medium',
    isAnonymous: false,
    perpetrator: '',
    impact: [] as string[]
  });

  const canSubmit = sector && category && description.length > 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await onSubmit({ sector, category, description });
    setSubmitting(false);
    if (onClose) onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="mobile-container py-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your report has been successfully submitted. We'll review it and take appropriate action.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mobile-button-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-lg bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Submit Report</h1>
          <p className="text-sm text-gray-600">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex-1 h-2 rounded-full ${
                stepNumber <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Report Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">What type of incident?</h2>
            <MobileSectorSelector value={sector} onChange={setSector} />
            {sector && <MobileCategorySelector sector={sector} value={category} onChange={setCategory} />}
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Describe the incident</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mobile-input min-h-[120px] resize-none"
                placeholder="Please provide details about what happened..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {URGENCY_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => updateFormData('urgency', level.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.urgency === level.id
                        ? level.color
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mobile-button-secondary flex-1"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!description.trim()}
                className="mobile-button-primary flex-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Additional Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perpetrator (if known)
              </label>
              <input
                type="text"
                value={formData.perpetrator}
                onChange={(e) => updateFormData('perpetrator', e.target.value)}
                className="mobile-input"
                placeholder="Name or description of perpetrator"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => updateFormData('isAnonymous', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Submit anonymously</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mobile-button-secondary flex-1"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !canSubmit || submitting}
                className="mobile-button-primary flex-1 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 