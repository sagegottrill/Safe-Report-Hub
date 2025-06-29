import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Lock } from 'lucide-react';

interface MobileGBVReportFormProps {
  reportData: any;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: () => void;
  loading: boolean;
}

const MobileGBVReportForm: React.FC<MobileGBVReportFormProps> = ({ reportData, handleInputChange, handleSubmit, loading }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#1b4332] mb-2">Gender-Based Violence Report</h2>
        <p className="text-sm text-slate-600">Official Government Reporting System</p>
      </div>
      {/* Emergency Alert */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-900 mb-1">Safety First</h3>
            <p className="text-sm text-red-800">
              If you are in immediate danger, please call emergency services first.<br />
              <span className="font-semibold">Emergency: 112</span>
            </p>
          </div>
        </div>
      </div>
      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Your Privacy Matters</h3>
            <p className="text-sm text-blue-800">
              All reports are encrypted and handled with strict confidentiality. Your safety and privacy are our top priority.
            </p>
          </div>
        </div>
      </div>
      {/* Form Fields */}
      <div className="space-y-2">
        <Label htmlFor="incidentDate">Date of Incident <span className="text-red-600">*</span></Label>
        <Input
          id="incidentDate"
          type="date"
          value={reportData.incidentDate}
          onChange={(e) => handleInputChange('incidentDate', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location/Area <span className="text-red-600">*</span></Label>
        <Input
          id="location"
          placeholder="e.g., Market area, School compound, Home"
          value={reportData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description of Incident <span className="text-red-600">*</span></Label>
        <Textarea
          id="description"
          placeholder="Please describe what happened..."
          value={reportData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          required
        />
      </div>
      <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl p-3">
        <Checkbox
          id="immediateDanger"
          checked={reportData.immediateDanger}
          onCheckedChange={(checked) => handleInputChange('immediateDanger', checked)}
          className="text-red-600"
        />
        <Label htmlFor="immediateDanger" className="text-red-700 font-medium text-sm">
          I am currently in immediate danger
        </Label>
      </div>
      <div className="flex items-center space-x-3 bg-[#f9fafb] border border-[#e0e0e0] rounded-xl p-3">
        <Checkbox
          id="consentForSharing"
          checked={reportData.consentForSharing}
          onCheckedChange={(checked) => handleInputChange('consentForSharing', checked)}
        />
        <Label htmlFor="consentForSharing" className="text-sm text-[#1b4332]">
          I consent to my report being shared with support teams
        </Label>
      </div>
      {/* Contact Information */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="email" className="text-sm font-semibold text-[#1b4332]">
            Email <span className="text-red-600">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={reportData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-2 bg-white border-[#e0e0e0] rounded-xl"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-semibold text-[#1b4332]">
            Phone Number <span className="text-red-600">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={reportData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="mt-2 bg-white border-[#e0e0e0] rounded-xl"
            required
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || !reportData.incidentDate || !reportData.location || !reportData.description || !reportData.email || !reportData.phone}
        className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg active:scale-95 transition-all hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </div>
  );
};

export default MobileGBVReportForm; 