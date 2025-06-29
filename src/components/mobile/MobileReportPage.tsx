import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft, Shield, GraduationCap, Droplets, Heart, AlertTriangle, CheckCircle, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import MobileEducationReportForm from './MobileEducationReportForm';
import MobileWaterReportForm from './MobileWaterReportForm';
import MobileHumanitarianReportForm from './MobileHumanitarianReportForm';
import MobileGBVReportForm from './MobileGBVReportForm';

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

type ReportStep = 'sector' | 'category' | 'details';

const sectors = [
  {
    id: 'gbv',
    title: 'Gender-Based Violence',
    description: 'Report gender-based violence incidents and access support services',
    icon: <Shield className="h-7 w-7 text-red-600" />,
    color: 'bg-red-50 border-red-200',
    priority: 'high',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Report educational challenges, safety issues, and infrastructure problems',
    icon: <GraduationCap className="h-7 w-7 text-blue-600" />,
    color: 'bg-blue-50 border-blue-200',
    priority: 'medium',
  },
  {
    id: 'water',
    title: 'Water & Infrastructure',
    description: 'Report water infrastructure issues and access challenges',
    icon: <Droplets className="h-7 w-7 text-cyan-600" />,
    color: 'bg-cyan-50 border-cyan-200',
    priority: 'medium',
  },
  {
    id: 'humanitarian',
    title: 'Humanitarian Crisis',
    description: 'Report general humanitarian crises and emergencies',
    icon: <AlertCircle className="h-7 w-7 text-orange-600" />,
    color: 'bg-orange-50 border-orange-200',
    priority: 'high',
  },
];

const gbvCategories = [
  { id: 'domestic_violence', label: 'Domestic Violence', description: 'Physical, emotional, or psychological abuse' },
  { id: 'sexual_harassment', label: 'Sexual Harassment', description: 'Unwanted sexual advances or behavior' },
  { id: 'rape_sexual_assault', label: 'Rape/Sexual Assault', description: 'Non-consensual sexual acts' },
  { id: 'child_marriage', label: 'Child Marriage', description: 'Marriage involving minors' },
  { id: 'fgm', label: 'Female Genital Mutilation', description: 'Harmful traditional practices' },
  { id: 'human_trafficking', label: 'Human Trafficking', description: 'Forced labor or sexual exploitation' },
  { id: 'online_abuse', label: 'Online Abuse', description: 'Digital harassment or cyberbullying' },
  { id: 'other_gbv', label: 'Other GBV', description: 'Other gender-based violence incidents' },
];

const educationCategories = [
  { id: 'school_safety', label: 'School Safety Issues', description: 'Violence, bullying, or security concerns' },
  { id: 'infrastructure', label: 'Infrastructure Problems', description: 'Building, facilities, or equipment issues' },
  { id: 'teacher_shortage', label: 'Teacher Shortage', description: 'Lack of qualified teachers' },
  { id: 'access_issues', label: 'Access Issues', description: 'Barriers to education access' },
  { id: 'quality_concerns', label: 'Quality Concerns', description: 'Educational quality or curriculum issues' },
  { id: 'other_education', label: 'Other Education Issues', description: 'Other educational challenges' },
];

const waterCategories = [
  { id: 'water_shortage', label: 'Water Shortage', description: 'Lack of access to clean water' },
  { id: 'contamination', label: 'Water Contamination', description: 'Polluted or unsafe water' },
  { id: 'infrastructure_damage', label: 'Infrastructure Damage', description: 'Broken pipes, pumps, or facilities' },
  { id: 'maintenance_issues', label: 'Maintenance Issues', description: 'Poor maintenance of water systems' },
  { id: 'access_problems', label: 'Access Problems', description: 'Difficulty accessing water sources' },
  { id: 'other_water', label: 'Other Water Issues', description: 'Other water-related problems' },
];

const humanitarianCategories = [
  { id: 'natural_disaster', label: 'Natural Disaster', description: 'Floods, earthquakes, or other disasters' },
  { id: 'conflict', label: 'Conflict/Violence', description: 'Armed conflict or community violence' },
  { id: 'displacement', label: 'Displacement', description: 'Forced migration or homelessness' },
  { id: 'food_insecurity', label: 'Food Insecurity', description: 'Lack of access to food' },
  { id: 'health_emergency', label: 'Health Emergency', description: 'Disease outbreaks or health crises' },
  { id: 'other_humanitarian', label: 'Other Humanitarian Issues', description: 'Other crisis situations' },
];

const MobileReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitReport, user } = useAppContext();
  const [currentStep, setCurrentStep] = useState<ReportStep>('sector');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [reportData, setReportData] = useState<any>({
    incidentDate: '',
    location: '',
    description: '',
    immediateDanger: false,
    consentForSharing: false,
    contactDetails: '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [educationStakeholder, setEducationStakeholder] = useState<string>('');

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
        reporterId: user?.id,
      };
      await submitReport(finalReportData);
      toast.success('Report submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyLevel = (cat: string) => {
    if (selectedSector === 'gbv') {
      const criticalCategories = ['rape_sexual_assault', 'fgm', 'human_trafficking'];
      return criticalCategories.includes(cat) ? 'critical' : 'high';
    }
    return 'medium';
  };

  const getCategories = () => {
    switch (selectedSector) {
      case 'gbv': return gbvCategories;
      case 'education': return educationCategories;
      case 'water': return waterCategories;
      case 'humanitarian': return humanitarianCategories;
      default: return [];
    }
  };

  const renderSectorSelector = () => (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#1b4332] font-semibold bg-[#e8f5e9] px-4 py-3 rounded-2xl shadow-md active:scale-95 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>
        <div className="text-right">
          <h3 className="text-sm font-semibold text-[#1b4332]">Step 1 of 3</h3>
          <p className="text-xs text-slate-500">Select Sector</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1b4332] mb-3">Select Sector</h2>
        <p className="text-sm text-slate-600 px-4">Choose the sector that best describes your report</p>
      </div>
      
      <div className="space-y-5">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className={`bg-white rounded-3xl p-6 border-2 shadow-xl transition-all duration-300 active:scale-98 hover:shadow-2xl ${sector.color} cursor-pointer`}
            onClick={() => handleSectorSelect(sector.id)}
          >
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 w-20 h-20 rounded-3xl bg-white shadow-lg flex items-center justify-center border-2 border-gray-100">
                <div className="w-12 h-12 flex items-center justify-center">
                  {sector.icon}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-[#1b4332]">{sector.title}</h3>
                  {sector.priority === 'high' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-full shadow-sm">
                      <AlertTriangle className="h-3 w-3" /> High Priority
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{sector.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategorySelector = () => {
    const categories = getCategories();
    const sector = sectors.find(s => s.id === selectedSector);
    
    return (
      <div className="space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#1b4332] font-semibold bg-[#e8f5e9] px-4 py-3 rounded-2xl shadow-md active:scale-95 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Sectors
          </button>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-[#1b4332]">Step 2 of 3</h3>
            <p className="text-xs text-slate-500">Choose Category</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1b4332] mb-3">Choose Category</h2>
          <p className="text-sm text-slate-600 px-4">{sector?.title} - Select specific category</p>
        </div>
        
        <div className="space-y-5">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#e0e0e0] shadow-xl transition-all duration-300 active:scale-98 hover:shadow-2xl hover:border-[#2ecc71] cursor-pointer"
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="flex items-center gap-5">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1b4332] mb-3">{category.label}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{category.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-3xl bg-[#e8f5e9] flex items-center justify-center shadow-lg border-2 border-[#2ecc71]/20">
                    <div className="w-5 h-5 rounded-full bg-[#2ecc71] shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDetailsForm = () => {
    const sector = sectors.find(s => s.id === selectedSector);
    const category = getCategories().find(c => c.id === selectedCategory);
    
    return (
      <div className="space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#1b4332] font-semibold bg-[#e8f5e9] px-4 py-3 rounded-2xl shadow-md active:scale-95 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Categories
          </button>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-[#1b4332]">Step 3 of 3</h3>
            <p className="text-xs text-slate-500">Fill Report Details</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1b4332] mb-3">Report Details</h2>
          <p className="text-sm text-slate-600 px-4">
            {sector?.title} - {category?.label}
          </p>
        </div>

        <div className="space-y-6">
          {/* Education Stakeholder Selection */}
          {selectedSector === 'education' && (
            <div>
              <Label className="text-sm font-semibold text-[#1b4332] mb-3 block">
                Who are you reporting as? <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-3">
                {[
                  { id: 'student', label: 'Student', icon: '🎓', description: 'Current or former student' },
                  { id: 'parent', label: 'Parent/Guardian', icon: '👨‍👩‍👧‍👦', description: 'Parent or legal guardian' },
                  { id: 'teacher', label: 'Teacher/Administrator', icon: '👨‍🏫', description: 'School staff or administrator' },
                  { id: 'community', label: 'Community Member', icon: '🏘️', description: 'Community resident or observer' }
                ].map((stakeholder) => (
                  <div
                    key={stakeholder.id}
                    className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      reportData.stakeholder === stakeholder.id
                        ? 'border-[#2ecc71] bg-[#e8f5e9]'
                        : 'border-[#e0e0e0] hover:border-[#2ecc71]/50'
                    }`}
                    onClick={() => handleInputChange('stakeholder', stakeholder.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{stakeholder.icon}</span>
                      <div>
                        <div className="font-semibold text-[#1b4332]">{stakeholder.label}</div>
                        <div className="text-sm text-slate-600">{stakeholder.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Information for Water and Humanitarian */}
          {(selectedSector === 'water' || selectedSector === 'humanitarian') && (
            <div>
              <Label htmlFor="communityName" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                Community Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="communityName"
                placeholder="Enter community or village name"
                value={reportData.communityName || ''}
                onChange={(e) => handleInputChange('communityName', e.target.value)}
                className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                required
              />
            </div>
          )}

          {/* Date and Location Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="incidentDate" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                {selectedSector === 'water' || selectedSector === 'humanitarian' ? 'Date Issue Started' : 'Date'} <span className="text-red-600">*</span>
              </Label>
              <Input
                id="incidentDate"
                type="date"
                value={reportData.incidentDate}
                onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                {selectedSector === 'water' || selectedSector === 'humanitarian' ? 'Specific Location' : 'Location'} <span className="text-red-600">*</span>
              </Label>
              <Input
                id="location"
                placeholder={selectedSector === 'education' ? "e.g., Classroom, Playground, School compound" : 
                           selectedSector === 'water' || selectedSector === 'humanitarian' ? "e.g., Near the market, Behind the school" : 
                           "Enter location..."}
                value={reportData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Landmark for Water and Humanitarian */}
          {(selectedSector === 'water' || selectedSector === 'humanitarian') && (
            <div>
              <Label htmlFor="landmark" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                Landmark (Optional)
              </Label>
              <Input
                id="landmark"
                placeholder="e.g., Near the mosque, Close to the health center"
                value={reportData.landmark || ''}
                onChange={(e) => handleInputChange('landmark', e.target.value)}
                className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
              />
            </div>
          )}

          {/* School Information for Education */}
          {selectedSector === 'education' && reportData.stakeholder && (
            <div>
              <Label htmlFor="schoolName" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                School Name
              </Label>
              <Input
                id="schoolName"
                placeholder="Enter school name"
                value={reportData.schoolName || ''}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
              />
            </div>
          )}

          {/* Student-specific fields for Education */}
          {selectedSector === 'education' && reportData.stakeholder === 'student' && (
            <div className="bg-[#e8f5e9] border-2 border-[#2ecc71]/20 rounded-2xl p-4">
              <h3 className="font-semibold text-[#1b4332] mb-3">Student Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentAge" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                    Student Age
                  </Label>
                  <Input
                    id="studentAge"
                    type="number"
                    placeholder="Age"
                    value={reportData.studentAge || ''}
                    onChange={(e) => handleInputChange('studentAge', e.target.value)}
                    className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <Label htmlFor="studentGrade" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                    Grade/Class
                  </Label>
                  <Input
                    id="studentGrade"
                    placeholder="e.g., Primary 5, JSS 2"
                    value={reportData.studentGrade || ''}
                    onChange={(e) => handleInputChange('studentGrade', e.target.value)}
                    className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <Checkbox
                  id="involvesBullying"
                  checked={reportData.involvesBullying || false}
                  onCheckedChange={(checked) => handleInputChange('involvesBullying', checked)}
                  className="w-5 h-5 rounded-lg border-2 border-[#2ecc71]"
                />
                <Label htmlFor="involvesBullying" className="text-sm text-[#1b4332]">
                  This involves bullying or harassment
                </Label>
              </div>
            </div>
          )}

          {/* Parent-specific fields for Education */}
          {selectedSector === 'education' && reportData.stakeholder === 'parent' && (
            <div className="bg-[#e8f5e9] border-2 border-[#2ecc71]/20 rounded-2xl p-4">
              <h3 className="font-semibold text-[#1b4332] mb-3">Child Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childName" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                    Child's Name (Optional)
                  </Label>
                  <Input
                    id="childName"
                    placeholder="Child's name"
                    value={reportData.childName || ''}
                    onChange={(e) => handleInputChange('childName', e.target.value)}
                    className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <Label htmlFor="childGrade" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                    Child's Grade/Class
                  </Label>
                  <Input
                    id="childGrade"
                    placeholder="e.g., Primary 5, JSS 2"
                    value={reportData.childGrade || ''}
                    onChange={(e) => handleInputChange('childGrade', e.target.value)}
                    className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <Checkbox
                  id="requiresFollowUp"
                  checked={reportData.requiresFollowUp || false}
                  onCheckedChange={(checked) => handleInputChange('requiresFollowUp', checked)}
                  className="w-5 h-5 rounded-lg border-2 border-[#2ecc71]"
                />
                <Label htmlFor="requiresFollowUp" className="text-sm text-[#1b4332]">
                  I would like to be contacted for follow-up
                </Label>
              </div>
            </div>
          )}

          {/* Water-specific fields */}
          {selectedSector === 'water' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="durationOfProblem" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                    How long has this been a problem?
                  </Label>
                  <select
                    id="durationOfProblem"
                    value={reportData.durationOfProblem || ''}
                    onChange={(e) => handleInputChange('durationOfProblem', e.target.value)}
                    className="w-full bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300 p-3"
                  >
                    <option value="">Select duration</option>
                    <option value="less_than_week">Less than a week</option>
                    <option value="1_2_weeks">1-2 weeks</option>
                    <option value="1_month">About 1 month</option>
                    <option value="2_3_months">2-3 months</option>
                    <option value="3_6_months">3-6 months</option>
                    <option value="more_than_6_months">More than 6 months</option>
                    <option value="years">Several years</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="affectedPopulation" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                    How many people are affected?
                  </Label>
                  <select
                    id="affectedPopulation"
                    value={reportData.affectedPopulation || ''}
                    onChange={(e) => handleInputChange('affectedPopulation', e.target.value)}
                    className="w-full bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300 p-3"
                  >
                    <option value="">Select population</option>
                    <option value="few_families">Few families (1-10 people)</option>
                    <option value="small_community">Small community (10-50 people)</option>
                    <option value="medium_community">Medium community (50-200 people)</option>
                    <option value="large_community">Large community (200-500 people)</option>
                    <option value="entire_village">Entire village (500+ people)</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#e0f7fa] border-2 border-[#00bcd4]/20 rounded-2xl p-4">
                <h3 className="font-semibold text-[#006064] mb-3">Impact Assessment</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="healthImpact"
                      checked={reportData.healthImpact || false}
                      onCheckedChange={(checked) => handleInputChange('healthImpact', checked)}
                      className="w-5 h-5 rounded-lg border-2 border-[#00bcd4]"
                    />
                    <Label htmlFor="healthImpact" className="text-sm text-[#006064]">
                      This is affecting people's health (waterborne diseases, etc.)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="economicImpact"
                      checked={reportData.economicImpact || false}
                      onCheckedChange={(checked) => handleInputChange('economicImpact', checked)}
                      className="w-5 h-5 rounded-lg border-2 border-[#00bcd4]"
                    />
                    <Label htmlFor="economicImpact" className="text-sm text-[#006064]">
                      This is affecting people's livelihoods or economic activities
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="educationImpact"
                      checked={reportData.educationImpact || false}
                      onCheckedChange={(checked) => handleInputChange('educationImpact', checked)}
                      className="w-5 h-5 rounded-lg border-2 border-[#00bcd4]"
                    />
                    <Label htmlFor="educationImpact" className="text-sm text-[#006064]">
                      This is affecting children's education (school attendance, etc.)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="urgentNeed"
                      checked={reportData.urgentNeed || false}
                      onCheckedChange={(checked) => handleInputChange('urgentNeed', checked)}
                      className="w-5 h-5 rounded-lg border-2 border-red-500"
                    />
                    <Label htmlFor="urgentNeed" className="text-sm text-red-600 font-medium">
                      This is an urgent need requiring immediate attention
                    </Label>
                  </div>
                </div>
              </div>

              <div className="bg-[#e0f7fa] border-2 border-[#00bcd4]/20 rounded-2xl p-4">
                <h3 className="font-semibold text-[#006064] mb-3">Infrastructure Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="infrastructureType" className="text-sm font-semibold text-[#006064] mb-2 block">
                      Type of Infrastructure
                    </Label>
                    <select
                      id="infrastructureType"
                      value={reportData.infrastructureType || ''}
                      onChange={(e) => handleInputChange('infrastructureType', e.target.value)}
                      className="w-full bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300 p-3"
                    >
                      <option value="">Select type</option>
                      <option value="borehole">Borehole</option>
                      <option value="well">Well</option>
                      <option value="piped_water">Piped Water System</option>
                      <option value="water_tank">Water Tank</option>
                      <option value="pump">Water Pump</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="lastMaintenance" className="text-sm font-semibold text-[#006064] mb-2 block">
                      When was last maintenance?
                    </Label>
                    <Input
                      id="lastMaintenance"
                      type="date"
                      value={reportData.lastMaintenance || ''}
                      onChange={(e) => handleInputChange('lastMaintenance', e.target.value)}
                      className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="maintenanceNotes" className="text-sm font-semibold text-[#006064] mb-2 block">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="maintenanceNotes"
                    placeholder="Any additional information about the infrastructure, previous repairs, or maintenance history..."
                    value={reportData.maintenanceNotes || ''}
                    onChange={(e) => handleInputChange('maintenanceNotes', e.target.value)}
                    rows={3}
                    className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Humanitarian-specific fields */}
          {selectedSector === 'humanitarian' && (
            <div className="bg-[#f3e5f5] border-2 border-[#9c27b0]/20 rounded-2xl p-4">
              <h3 className="font-semibold text-[#4a148c] mb-3">Impact Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="healthImpact"
                    checked={reportData.healthImpact || false}
                    onCheckedChange={(checked) => handleInputChange('healthImpact', checked)}
                    className="w-5 h-5 rounded-lg border-2 border-[#9c27b0]"
                  />
                  <Label htmlFor="healthImpact" className="text-sm text-[#4a148c]">
                    This is affecting people's health (healthcare, nutrition, etc.)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="economicImpact"
                    checked={reportData.economicImpact || false}
                    onCheckedChange={(checked) => handleInputChange('economicImpact', checked)}
                    className="w-5 h-5 rounded-lg border-2 border-[#9c27b0]"
                  />
                  <Label htmlFor="economicImpact" className="text-sm text-[#4a148c]">
                    This is affecting people's livelihoods or economic activities
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="educationImpact"
                    checked={reportData.educationImpact || false}
                    onCheckedChange={(checked) => handleInputChange('educationImpact', checked)}
                    className="w-5 h-5 rounded-lg border-2 border-[#9c27b0]"
                  />
                  <Label htmlFor="educationImpact" className="text-sm text-[#4a148c]">
                    This is affecting children's education (school attendance, etc.)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="urgentNeed"
                    checked={reportData.urgentNeed || false}
                    onCheckedChange={(checked) => handleInputChange('urgentNeed', checked)}
                    className="w-5 h-5 rounded-lg border-2 border-red-500"
                  />
                  <Label htmlFor="urgentNeed" className="text-sm text-red-600 font-medium">
                    This is an urgent need requiring immediate attention
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-[#1b4332] mb-2 block">
              {selectedSector === 'education' ? 'Description of Issue' : 
               selectedSector === 'water' ? 'Description of Water Issue' : 
               selectedSector === 'humanitarian' ? 'Description of Issue' : 
               'Description of Incident'} <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder={selectedSector === 'education' ? "Please describe the educational issue, safety concern, or infrastructure problem..." :
                         selectedSector === 'water' ? "Please describe the water infrastructure problem, access issue, or quality concern..." :
                         selectedSector === 'humanitarian' ? "Please describe the humanitarian issue, support concern, or service need..." :
                         "Please describe what happened in detail..."}
              value={reportData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
              className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300 resize-none"
              required
            />
          </div>

          {/* Immediate Danger Checkbox for GBV */}
          {selectedSector === 'gbv' && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-5 shadow-md">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Checkbox
                    id="immediateDanger"
                    checked={reportData.immediateDanger}
                    onCheckedChange={(checked) => handleInputChange('immediateDanger', checked)}
                    className="text-red-600 w-5 h-5 rounded-lg border-2 border-red-300"
                  />
                </div>
                <Label htmlFor="immediateDanger" className="text-red-700 font-semibold text-sm leading-relaxed">
                  I am currently in immediate danger and need urgent assistance
                </Label>
              </div>
            </div>
          )}

          {/* Consent Checkbox */}
          <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-2 border-[#e2e8f0] rounded-2xl p-5 shadow-md">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <Checkbox
                  id="consentForSharing"
                  checked={reportData.consentForSharing}
                  onCheckedChange={(checked) => handleInputChange('consentForSharing', checked)}
                  className="w-5 h-5 rounded-lg border-2 border-[#2ecc71]"
                />
              </div>
              <Label htmlFor="consentForSharing" className="text-sm text-[#1b4332] leading-relaxed">
                I consent to my report being shared with {selectedSector === 'water' ? 'water authorities and maintenance teams' : 
                                                         selectedSector === 'education' ? 'educational authorities and support teams' :
                                                         selectedSector === 'humanitarian' ? 'community support teams' :
                                                         'appropriate agencies'} for investigation and support
              </Label>
            </div>
          </div>

          {/* Willing to Help for Water and Humanitarian */}
          {(selectedSector === 'water' || selectedSector === 'humanitarian') && (
            <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-2 border-[#e2e8f0] rounded-2xl p-5 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Checkbox
                    id="willingToHelp"
                    checked={reportData.willingToHelp || false}
                    onCheckedChange={(checked) => handleInputChange('willingToHelp', checked)}
                    className="w-5 h-5 rounded-lg border-2 border-[#2ecc71]"
                  />
                </div>
                <Label htmlFor="willingToHelp" className="text-sm text-[#1b4332] leading-relaxed">
                  I am willing to help coordinate with {selectedSector === 'water' ? 'maintenance teams' : 'support teams'} if needed
                </Label>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1b4332] mb-4">Contact Information</h3>
            
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                Email Address <span className="text-red-600">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={reportData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-semibold text-[#1b4332] mb-2 block">
                Phone Number <span className="text-red-600">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={reportData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || !reportData.incidentDate || !reportData.location || !reportData.description || !reportData.email || !reportData.phone || 
                     (selectedSector === 'education' && !reportData.stakeholder) ||
                     ((selectedSector === 'water' || selectedSector === 'humanitarian') && !reportData.communityName)}
            className="w-full py-5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-[#2ecc71] to-[#27ae60] shadow-xl text-lg active:scale-98 transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting Report...
              </div>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'sector':
        return renderSectorSelector();
      case 'category':
        return renderCategorySelector();
      case 'details':
        return renderDetailsForm();
      default:
        return renderSectorSelector();
    }
  };

  const getStepIndicator = () => {
    const steps = [
      { key: 'sector', label: 'Sector', completed: currentStep !== 'sector' },
      { key: 'category', label: 'Category', completed: currentStep === 'details' },
      { key: 'details', label: 'Details', completed: false }
    ];

    return (
      <div className="bg-white rounded-3xl shadow-lg border border-[#e0e0e0] p-6 mb-6">
        <div className="flex items-center justify-center space-x-6">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 shadow-md ${
                step.completed 
                  ? 'bg-[#2ecc71] border-[#2ecc71] text-white' 
                  : currentStep === step.key
                  ? 'bg-[#1b4332] border-[#1b4332] text-white'
                  : 'bg-[#f9fafb] border-[#e0e0e0] text-slate-400'
              }`}>
                {step.completed ? <CheckCircle className="h-6 w-6" /> : <span className="text-lg font-bold">{index + 1}</span>}
              </div>
              <span className={`ml-3 text-sm font-semibold ${
                currentStep === step.key ? 'text-[#1b4332]' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-4 rounded-full ${
                  step.completed ? 'bg-[#2ecc71]' : 'bg-[#e0e0e0]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e8f5e9] to-[#f0fdf4]">
      {/* Header with Step Indicator */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#1b4332]">New Report</h1>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1b4332]">
                Step {currentStep === 'sector' ? '1' : currentStep === 'category' ? '2' : '3'} of 3
              </p>
              <p className="text-xs text-slate-500">
                {currentStep === 'sector' && 'Select Sector'}
                {currentStep === 'category' && 'Choose Category'}
                {currentStep === 'details' && 'Fill Report'}
              </p>
            </div>
          </div>
          
          {/* Enhanced Step Indicator */}
          <div className="flex items-center justify-between">
            {[
              { step: 1, value: 'sector' },
              { step: 2, value: 'category' },
              { step: 3, value: 'details' }
            ].map(({ step, value }) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 transition-all duration-300 ${
                  (currentStep === 'sector' && step === 1) ||
                  (currentStep === 'category' && step <= 2) ||
                  (currentStep === 'details' && step <= 3)
                    ? 'bg-[#2ecc71] border-[#2ecc71] text-white shadow-[#2ecc71]/30' 
                    : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {(currentStep === 'category' && step === 1) ||
                   (currentStep === 'details' && step <= 2) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                    (currentStep === 'category' && step === 1) ||
                    (currentStep === 'details' && step <= 2)
                      ? 'bg-[#2ecc71] shadow-sm' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          {currentStep === 'sector' && renderSectorSelector()}
          {currentStep === 'category' && renderCategorySelector()}
          {currentStep === 'details' && renderDetailsForm()}
        </div>
      </div>
    </div>
  );
};

export default MobileReportPage; 