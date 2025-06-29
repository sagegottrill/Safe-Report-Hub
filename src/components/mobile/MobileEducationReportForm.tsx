import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface MobileEducationReportFormProps {
  reportData: any;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: () => void;
  loading: boolean;
}

const stakeholderOptions = [
  { id: 'student', label: 'Student', icon: '🎓', description: 'Current or former student' },
  { id: 'parent', label: 'Parent/Guardian', icon: '👨‍👩‍👧‍👦', description: 'Parent or legal guardian' },
  { id: 'teacher', label: 'Teacher/Administrator', icon: '👨‍🏫', description: 'School staff or administrator' },
  { id: 'community', label: 'Community Member', icon: '🏘️', description: 'Community resident or observer' }
];

const MobileEducationReportForm: React.FC<MobileEducationReportFormProps> = ({ reportData, handleInputChange, handleSubmit, loading }) => {
  const [educationStakeholder, setEducationStakeholder] = useState(reportData.stakeholder || '');

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#1b4332] mb-2">Education Report Details</h2>
        <p className="text-sm text-slate-600">Help improve educational standards and safety in your community.</p>
      </div>
      {/* Stakeholder Selection */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Who are you reporting as? *</Label>
        <div className="grid grid-cols-2 gap-3">
          {stakeholderOptions.map((stakeholder) => (
            <div
              key={stakeholder.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-left ${
                educationStakeholder === stakeholder.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => { setEducationStakeholder(stakeholder.id); handleInputChange('stakeholder', stakeholder.id); }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stakeholder.icon}</span>
                <div>
                  <div className="font-medium">{stakeholder.label}</div>
                  <div className="text-sm text-gray-600">{stakeholder.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* School Information */}
      {educationStakeholder && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                placeholder="Enter school name"
                value={reportData.schoolName || ''}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incidentDate">Date of Incident *</Label>
              <Input
                id="incidentDate"
                type="date"
                value={reportData.incidentDate}
                onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location/Area *</Label>
            <Input
              id="location"
              placeholder="e.g., Classroom, Playground, School compound"
              value={reportData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description of Issue *</Label>
            <Textarea
              id="description"
              placeholder="Please describe the educational issue, safety concern, or infrastructure problem..."
              value={reportData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>
          {/* Stakeholder-specific fields */}
          {educationStakeholder === 'student' && (
            <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-900">Student-Specific Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentAge">Student Age</Label>
                  <Input
                    id="studentAge"
                    type="number"
                    placeholder="Age"
                    value={reportData.studentAge || ''}
                    onChange={(e) => handleInputChange('studentAge', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentGrade">Grade/Class</Label>
                  <Input
                    id="studentGrade"
                    placeholder="e.g., Primary 5, JSS 2"
                    value={reportData.studentGrade || ''}
                    onChange={(e) => handleInputChange('studentGrade', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="involvesBullying"
                  checked={reportData.involvesBullying || false}
                  onCheckedChange={(checked) => handleInputChange('involvesBullying', checked)}
                />
                <Label htmlFor="involvesBullying" className="text-sm">
                  This involves bullying or harassment
                </Label>
              </div>
            </div>
          )}
          {educationStakeholder === 'parent' && (
            <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-900">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Name (Optional)</Label>
                  <Input
                    id="childName"
                    placeholder="Child's name"
                    value={reportData.childName || ''}
                    onChange={(e) => handleInputChange('childName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childGrade">Child's Grade/Class</Label>
                  <Input
                    id="childGrade"
                    placeholder="e.g., Primary 5, JSS 2"
                    value={reportData.childGrade || ''}
                    onChange={(e) => handleInputChange('childGrade', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="requiresFollowUp"
                  checked={reportData.requiresFollowUp || false}
                  onCheckedChange={(checked) => handleInputChange('requiresFollowUp', checked)}
                />
                <Label htmlFor="requiresFollowUp" className="text-sm">
                  I would like to be contacted for follow-up
                </Label>
              </div>
            </div>
          )}
        </div>
      )}
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
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !educationStakeholder || !reportData.incidentDate || !reportData.location || !reportData.description || !reportData.email || !reportData.phone}
        className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg active:scale-95 transition-all hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </div>
  );
};

export default MobileEducationReportForm; 