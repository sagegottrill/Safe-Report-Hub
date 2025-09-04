import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Shield, CheckCircle, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import SectorSelector from './SectorSelector';
import GBVCategories from './GBVCategories';
import EducationCategories from './EducationCategories';
import WaterCategories from './WaterCategories';
import HumanitarianCategories from './HumanitarianCategories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { TrustIndicator, SecurityBadge, PrivacyNotice, OfficialStamp } from '@/components/ui/trust-indicators';
import { toast } from '@/components/ui/sonner';

type ReportStep = 'sector' | 'category' | 'details' | 'review';

interface EnhancedReportFormProps {
  onSubmit: (reportData: any) => void;
  onClose?: () => void;
}

const EnhancedReportForm: React.FC<EnhancedReportFormProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation();
  const { setCurrentView, user } = useAppContext();
  const [currentStep, setCurrentStep] = useState<ReportStep>('sector');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [reportData, setReportData] = useState<any>({
    incidentDate: '',
    location: '',
    description: '',
    immediateDanger: false,
    consentForSharing: false,
    contactDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSectorSelect = (sector: string) => {
    setSelectedSector(sector);
    setCurrentStep('category');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentStep('details');
  };

  const handleBack = () => {
    if (currentStep === 'category') {
      setCurrentStep('sector');
      setSelectedSector('');
    } else if (currentStep === 'details') {
      setCurrentStep('category');
      setSelectedCategory('');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalReportData = {
        ...reportData,
        sector: selectedSector,
        category: selectedCategory,
        timestamp: new Date().toISOString(),
        urgency: getUrgencyLevel(selectedCategory),
        email: user?.email || '',
        phone: user?.phone || '',
        reporterId: user?.id || '',
        reporterName: user?.name || '',
      };
      await onSubmit(finalReportData);
      setReportData({
        incidentDate: '',
        location: '',
        description: '',
        immediateDanger: false,
        consentForSharing: false,
        contactDetails: '',
        email: '',
        phone: ''
      });
      setCurrentStep('sector');
      setSelectedSector('');
      setSelectedCategory('');
      setLoading(false);
      setShowSuccess(true);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to submit report. Please try again.');
    }
  };

  const getUrgencyLevel = (cat: string) => {
    if (selectedSector === 'gbv') {
      const criticalCategories = ['rape_sexual_assault', 'fgm', 'human_trafficking'];
      return criticalCategories.includes(cat) ? 'critical' : 'high';
    }
    return 'medium';
  };

  const renderGBVForm = () => (
    <div className="space-y-6">
      {/* Official Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-nigerian-green p-2 rounded-full">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">Gender-Based Violence Report</h2>
              <p className="text-sm text-text-light">Official Government Reporting System</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TrustIndicator type="security" size="sm">
            Encrypted
          </TrustIndicator>
          <TrustIndicator type="privacy" size="sm">
            Anonymous Available
          </TrustIndicator>
          <TrustIndicator type="official" size="sm">
            Government Verified
          </TrustIndicator>
        </div>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Safety First:</strong> If you are in immediate danger, please call emergency services first.
          <br />
          <span className="font-semibold">Emergency: 112</span>
        </AlertDescription>
      </Alert>

      {/* Privacy Notice */}
      <PrivacyNotice>
        Your privacy and safety are our top priority. All reports are encrypted and handled with strict confidentiality. 
        You can choose to submit anonymously, and your identity will be protected.
      </PrivacyNotice>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="incidentDate" className="text-sm font-medium text-text">
            Date of Incident <span className="text-danger">*</span>
          </Label>
          <Input
            id="incidentDate"
            type="date"
            value={reportData.incidentDate}
            onChange={(e) => handleInputChange('incidentDate', e.target.value)}
            className="form-official"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-text">
            Location/Area <span className="text-danger">*</span>
          </Label>
          <Input
            id="location"
            placeholder="e.g., Market area, School compound, Home"
            value={reportData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="form-official"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-text">
          Description of Incident <span className="text-danger">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Please describe what happened..."
          value={reportData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="form-official"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Checkbox
            id="immediateDanger"
            checked={reportData.immediateDanger}
            onCheckedChange={(checked) => handleInputChange('immediateDanger', checked)}
            className="text-red-600"
          />
          <Label htmlFor="immediateDanger" className="text-red-700 font-medium">
            I am currently in immediate danger
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Checkbox
            id="consentForSharing"
            checked={reportData.consentForSharing}
            onCheckedChange={(checked) => handleInputChange('consentForSharing', checked)}
          />
          <Label htmlFor="consentForSharing" className="text-sm text-text-light">
            I consent to my report being shared with appropriate agencies for investigation and support
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-danger">*</span></Label>
        <Input id="email" type="email" value={reportData.email} onChange={e => handleInputChange('email', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-danger">*</span></Label>
        <Input id="phone" type="tel" value={reportData.phone} onChange={e => handleInputChange('phone', e.target.value)} required />
      </div>

      <div className="flex justify-between pt-6">
        <Button onClick={handleBack} variant="outline" className="btn-official-outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={loading || !reportData.incidentDate || !reportData.location || !reportData.description || !reportData.email || !reportData.phone}
          className="btn-official"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );

  const renderEducationForm = () => (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Education Reporting:</strong> Help improve educational standards and safety in your community.
        </AlertDescription>
      </Alert>

      {/* Stakeholder Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Who are you reporting as? *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'student', label: 'Student', icon: '🎓', description: 'Current or former student' },
            { id: 'parent', label: 'Parent/Guardian', icon: '👨‍👩‍👧‍👦', description: 'Parent or legal guardian' },
            { id: 'teacher', label: 'Teacher/Administrator', icon: '👨‍🏫', description: 'School staff or administrator' },
            { id: 'community', label: 'Community Member', icon: '🏘️', description: 'Community resident or observer' }
          ].map((stakeholder) => (
            <div
              key={stakeholder.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                reportData.stakeholder === stakeholder.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleInputChange('stakeholder', stakeholder.id)}
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

      {/* Education-specific fields based on stakeholder */}
      {reportData.stakeholder && (
        <div className="space-y-6">
          {/* School Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Location */}
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

          {/* Description */}
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
          {reportData.stakeholder === 'student' && (
            <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-900">Student-Specific Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex items-center space-x-2">
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

          {reportData.stakeholder === 'parent' && (
            <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-900">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex items-center space-x-2">
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

          {reportData.stakeholder === 'teacher' && (
            <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-900">Teacher/Administrator Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherRole">Your Role</Label>
                  <Input
                    id="teacherRole"
                    placeholder="e.g., Teacher, Principal, Administrator"
                    value={reportData.teacherRole || ''}
                    onChange={(e) => handleInputChange('teacherRole', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    placeholder="Years"
                    value={reportData.yearsExperience || ''}
                    onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="systemicIssue"
                  checked={reportData.systemicIssue || false}
                  onCheckedChange={(checked) => handleInputChange('systemicIssue', checked)}
                />
                <Label htmlFor="systemicIssue" className="text-sm">
                  This is a systemic issue affecting multiple students/teachers
                </Label>
              </div>
            </div>
          )}

          {/* Privacy Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consentForSharing"
                checked={reportData.consentForSharing}
                onCheckedChange={(checked) => handleInputChange('consentForSharing', checked)}
              />
              <Label htmlFor="consentForSharing" className="text-sm">
                I consent to my report being shared with appropriate educational authorities
              </Label>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-danger">*</span></Label>
        <Input id="email" type="email" value={reportData.email} onChange={e => handleInputChange('email', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-danger">*</span></Label>
        <Input id="phone" type="tel" value={reportData.phone} onChange={e => handleInputChange('phone', e.target.value)} required />
      </div>

      <div className="flex justify-between pt-6">
        <Button onClick={handleBack} variant="outline">
          ← Back to Categories
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={loading || !reportData.stakeholder || !reportData.incidentDate || !reportData.location || !reportData.description || !reportData.email || !reportData.phone}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );

  const renderWaterForm = () => (
    <div className="space-y-6">
      <Alert className="border-cyan-200 bg-cyan-50">
        <Shield className="h-4 w-4 text-cyan-600" />
        <AlertDescription className="text-cyan-800">
          <strong>Water Infrastructure Reporting:</strong> Help improve community water access and maintenance.
        </AlertDescription>
      </Alert>

      {/* Community Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="space-y-4">
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
      </div>

      {/* Water Issue Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description of Water Issue *</Label>
          <Textarea
            id="description"
            placeholder="Please describe the water infrastructure problem, access issue, or quality concern..."
            value={reportData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="durationOfProblem">How long has this been a problem?</Label>
            <Select value={reportData.durationOfProblem || ''} onValueChange={(value) => handleInputChange('durationOfProblem', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less_than_week">Less than a week</SelectItem>
                <SelectItem value="1_2_weeks">1-2 weeks</SelectItem>
                <SelectItem value="1_month">About 1 month</SelectItem>
                <SelectItem value="2_3_months">2-3 months</SelectItem>
                <SelectItem value="3_6_months">3-6 months</SelectItem>
                <SelectItem value="more_than_6_months">More than 6 months</SelectItem>
                <SelectItem value="years">Several years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affectedPopulation">How many people are affected?</Label>
            <Select value={reportData.affectedPopulation || ''} onValueChange={(value) => handleInputChange('affectedPopulation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select population" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="few_families">Few families (1-10 people)</SelectItem>
                <SelectItem value="small_community">Small community (10-50 people)</SelectItem>
                <SelectItem value="medium_community">Medium community (50-200 people)</SelectItem>
                <SelectItem value="large_community">Large community (200-500 people)</SelectItem>
                <SelectItem value="entire_village">Entire village (500+ people)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Impact Assessment */}
      <div className="space-y-4 p-4 border border-cyan-200 rounded-lg bg-cyan-50">
        <h3 className="font-medium text-cyan-900">Impact Assessment</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="healthImpact"
              checked={reportData.healthImpact || false}
              onCheckedChange={(checked) => handleInputChange('healthImpact', checked)}
            />
            <Label htmlFor="healthImpact" className="text-sm">
              This is affecting people's health (waterborne diseases, etc.)
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
      <div className="space-y-4 p-4 border border-cyan-200 rounded-lg bg-cyan-50">
        <h3 className="font-medium text-cyan-900">Maintenance Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            I consent to my report being shared with water authorities and maintenance teams
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="willingToHelp"
            checked={reportData.willingToHelp || false}
            onCheckedChange={(checked) => handleInputChange('willingToHelp', checked)}
          />
          <Label htmlFor="willingToHelp" className="text-sm">
            I am willing to help coordinate with maintenance teams if needed
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-danger">*</span></Label>
        <Input id="email" type="email" value={reportData.email} onChange={e => handleInputChange('email', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-danger">*</span></Label>
        <Input id="phone" type="tel" value={reportData.phone} onChange={e => handleInputChange('phone', e.target.value)} required />
      </div>

      <div className="flex justify-between pt-6">
        <Button onClick={handleBack} variant="outline">
          ← Back to Categories
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={loading || !reportData.communityName || !reportData.incidentDate || !reportData.location || !reportData.description || !reportData.email || !reportData.phone}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );

  const renderHumanitarianForm = () => (
    <div className="space-y-6">
      <Alert className="border-purple-200 bg-purple-50">
        <Shield className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <strong>Humanitarian Reporting:</strong> Help improve community support and services.
        </AlertDescription>
      </Alert>

      {/* Community Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="space-y-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Label htmlFor="email">Email <span className="text-danger">*</span></Label>
        <Input id="email" type="email" value={reportData.email} onChange={e => handleInputChange('email', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number <span className="text-danger">*</span></Label>
        <Input id="phone" type="tel" value={reportData.phone} onChange={e => handleInputChange('phone', e.target.value)} required />
      </div>

      <div className="flex justify-between pt-6">
        <Button onClick={handleBack} variant="outline">
          ← Back to Categories
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={loading || !reportData.communityName || !reportData.incidentDate || !reportData.location || !reportData.description || !reportData.email || !reportData.phone}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'sector':
        return <SectorSelector onSectorSelect={handleSectorSelect} />;
      
      case 'category':
        switch (selectedSector) {
          case 'gbv':
            return <GBVCategories onCategorySelect={handleCategorySelect} onBack={handleBack} />;
          case 'education':
            return <EducationCategories onCategorySelect={handleCategorySelect} onBack={handleBack} />;
          case 'water':
            return <WaterCategories onCategorySelect={handleCategorySelect} onBack={handleBack} />;
          case 'humanitarian':
            return <HumanitarianCategories onCategorySelect={handleCategorySelect} />;
          default:
            return <SectorSelector onSectorSelect={handleSectorSelect} />;
        }
      
      case 'details':
        switch (selectedSector) {
          case 'gbv':
            return renderGBVForm();
          case 'education':
            return renderEducationForm();
          case 'water':
            return renderWaterForm();
          case 'humanitarian':
            return renderHumanitarianForm();
          default:
            return (
              <div className="text-center text-gray-500">
                <p>Reporting form coming soon...</p>
              </div>
            );
        }
      
      default:
        return <SectorSelector onSectorSelect={handleSectorSelect} />;
    }
  };

  const getStepIndicator = () => {
    const steps = [
      { key: 'sector', label: 'Select Sector', completed: currentStep !== 'sector' },
      { key: 'category', label: 'Choose Category', completed: currentStep === 'details' },
      { key: 'details', label: 'Report Details', completed: false }
    ];

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.completed 
                  ? 'bg-nigerian-green border-nigerian-green text-white' 
                  : currentStep === step.key
                  ? 'bg-nigerian-blue border-nigerian-blue text-white'
                  : 'bg-gray-200 border-gray-300 text-gray-500'
              }`}>
                {step.completed ? <CheckCircle className="h-5 w-5" /> : index + 1}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                currentStep === step.key ? 'text-nigerian-blue' : 'text-text-light'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-3 ${
                  step.completed ? 'bg-nigerian-green' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <PrivacyNotice>
        This is an official government reporting system. All reports are encrypted and handled with strict confidentiality. 
        You can choose to submit anonymously, and your identity will be protected. Your safety and privacy are our top priority.
      </PrivacyNotice>

      {/* Main Form Card */}
      <Card className="card-official">
        <CardContent className="p-6">
          {getStepIndicator()}
          {renderCurrentStep()}
          {onClose && (
            <button type="button" className="mobile-button mobile-button-secondary mb-4" onClick={onClose}>
              Close
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedReportForm; 