import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MobileHumanitarianReportFormProps {
  reportData: any;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: () => void;
  loading: boolean;
}

const MobileHumanitarianReportForm: React.FC<MobileHumanitarianReportFormProps> = ({ reportData, handleInputChange, handleSubmit, loading }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#1b4332] mb-2">Humanitarian Report</h2>
        <p className="text-sm text-slate-600">Help improve community support and services.</p>
      </div>
      {/* Community Information */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="communityName">Community Name *</Label>
          <Input
            id="communityName"
            placeholder="Enter community or village name"
            value={reportData.communityName || ''}
            onChange={(e) => handleInputChange('communityName', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="incidentDate">Date Issue Started *</Label>
          <Input
            id="incidentDate"
            type="date"
            value={reportData.incidentDate}
            onChange={(e) => handleInputChange('incidentDate', e.target.value)}
            required
          />
        </div>
      </div>
      {/* Location Details */}
      <div className="space-y-2">
        <Label htmlFor="location">Specific Location *</Label>
        <Input
          id="location"
          placeholder="e.g., Near the market, Behind the school, Main street"
          value={reportData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="landmark">Landmark (Optional)</Label>
        <Input
          id="landmark"
          placeholder="e.g., Near the mosque, Close to the health center"
          value={reportData.landmark || ''}
          onChange={(e) => handleInputChange('landmark', e.target.value)}
        />
      </div>
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description of Issue *</Label>
        <Textarea
          id="description"
          placeholder="Please describe the humanitarian issue, support concern, or service need..."
          value={reportData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          required
        />
      </div>
      {/* Impact Assessment */}
      <div className="space-y-4 p-4 border border-purple-200 rounded-lg bg-purple-50">
        <h3 className="font-medium text-purple-900">Impact Assessment</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="healthImpact"
              checked={reportData.healthImpact || false}
              onCheckedChange={(checked) => handleInputChange('healthImpact', checked)}
            />
            <Label htmlFor="healthImpact" className="text-sm">
              This is affecting people's health (healthcare, nutrition, etc.)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="economicImpact"
              checked={reportData.economicImpact || false}
              onCheckedChange={(checked) => handleInputChange('economicImpact', checked)}
            />
            <Label htmlFor="economicImpact" className="text-sm">
              This is affecting people's livelihoods or economic activities
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="educationImpact"
              checked={reportData.educationImpact || false}
              onCheckedChange={(checked) => handleInputChange('educationImpact', checked)}
            />
            <Label htmlFor="educationImpact" className="text-sm">
              This is affecting children's education (school attendance, etc.)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgentNeed"
              checked={reportData.urgentNeed || false}
              onCheckedChange={(checked) => handleInputChange('urgentNeed', checked)}
            />
            <Label htmlFor="urgentNeed" className="text-sm text-red-600 font-medium">
              This is an urgent need requiring immediate attention
            </Label>
          </div>
        </div>
      </div>
      {/* Maintenance Information */}
      <div className="space-y-4 p-4 border border-purple-200 rounded-lg bg-purple-50">
        <h3 className="font-medium text-purple-900">Maintenance Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="infrastructureType">Type of Infrastructure</Label>
            <Select value={reportData.infrastructureType || ''} onValueChange={(value) => handleInputChange('infrastructureType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borehole">Borehole</SelectItem>
                <SelectItem value="well">Well</SelectItem>
                <SelectItem value="piped_water">Piped Water System</SelectItem>
                <SelectItem value="water_tank">Water Tank</SelectItem>
                <SelectItem value="pump">Water Pump</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastMaintenance">When was last maintenance?</Label>
            <Input
              id="lastMaintenance"
              type="date"
              value={reportData.lastMaintenance || ''}
              onChange={(e) => handleInputChange('lastMaintenance', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maintenanceNotes">Additional Notes</Label>
          <Textarea
            id="maintenanceNotes"
            placeholder="Any additional information about the infrastructure, previous repairs, or maintenance history..."
            value={reportData.maintenanceNotes || ''}
            onChange={(e) => handleInputChange('maintenanceNotes', e.target.value)}
            rows={3}
          />
        </div>
      </div>
      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="consentForSharing"
            checked={reportData.consentForSharing}
            onCheckedChange={(checked) => handleInputChange('consentForSharing', checked)}
          />
          <Label htmlFor="consentForSharing" className="text-sm">
            I consent to my report being shared with community support teams
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="willingToHelp"
            checked={reportData.willingToHelp || false}
            onCheckedChange={(checked) => handleInputChange('willingToHelp', checked)}
          />
          <Label htmlFor="willingToHelp" className="text-sm">
            I am willing to help coordinate with support teams if needed
          </Label>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
        <Input id="email" type="email" value={reportData.email} onChange={e => handleInputChange('email', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-red-600">*</span></Label>
        <Input id="phone" type="tel" value={reportData.phone} onChange={e => handleInputChange('phone', e.target.value)} required />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || !reportData.communityName || !reportData.incidentDate || !reportData.location || !reportData.description || !reportData.email || !reportData.phone}
        className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg active:scale-95 transition-all hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </div>
  );
};

export default MobileHumanitarianReportForm; 