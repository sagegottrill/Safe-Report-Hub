import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';

interface GBVReportFormProps {
  category: string;
  onBack: () => void;
  onSubmit: (data: any) => void;
}

const GBVReportForm: React.FC<GBVReportFormProps> = ({ category, onBack, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    incidentDate: '',
    location: '',
    description: '',
    immediateDanger: false,
    isAnonymous: true,
    consentForSharing: false,
    contactDetails: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const reportData = {
        ...formData,
        sector: 'gbv',
        category: category,
        timestamp: new Date().toISOString(),
        urgency: getUrgencyLevel(category)
      };
      await onSubmit(reportData);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyLevel = (cat: string) => {
    const criticalCategories = ['rape_sexual_assault', 'fgm', 'human_trafficking'];
    return criticalCategories.includes(cat) ? 'critical' : 'high';
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Safety First:</strong> If you are in immediate danger, please call emergency services first.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="incidentDate">Date of Incident *</Label>
          <Input
            id="incidentDate"
            type="date"
            value={formData.incidentDate}
            onChange={(e) => handleInputChange('incidentDate', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location/Area *</Label>
          <Input
            id="location"
            placeholder="e.g., Market area, School compound, Home"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description of Incident *</Label>
        <Textarea
          id="description"
          placeholder="Please describe what happened..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="immediateDanger"
          checked={formData.immediateDanger}
          onCheckedChange={(checked) => handleInputChange('immediateDanger', checked)}
        />
        <Label htmlFor="immediateDanger" className="text-red-600 font-medium">
          I am currently in immediate danger
        </Label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Privacy Options:</strong> You can choose to remain anonymous or provide contact information.
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAnonymous"
          checked={formData.isAnonymous}
          onCheckedChange={(checked) => handleInputChange('isAnonymous', checked)}
        />
        <Label htmlFor="isAnonymous" className="font-medium">
          Submit anonymously
        </Label>
      </div>

      {!formData.isAnonymous && (
        <div className="space-y-2">
          <Label htmlFor="contactDetails">Contact Details (Optional)</Label>
          <Input
            id="contactDetails"
            placeholder="Phone number or email"
            value={formData.contactDetails}
            onChange={(e) => handleInputChange('contactDetails', e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="consentForSharing"
          checked={formData.consentForSharing}
          onCheckedChange={(checked) => handleInputChange('consentForSharing', checked)}
        />
        <Label htmlFor="consentForSharing" className="text-sm">
          I consent to my report being shared with appropriate agencies
        </Label>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Review & Submit:</strong> Please review your report before submitting.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Category</Label>
            <p className="text-sm">{t(category)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Date</Label>
            <p className="text-sm">{formData.incidentDate}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Location</Label>
            <p className="text-sm">{formData.location}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Urgency</Label>
            <Badge className={getUrgencyLevel(category) === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
              {getUrgencyLevel(category)}
            </Badge>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Description</Label>
          <p className="text-sm bg-gray-50 p-3 rounded border">{formData.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.immediateDanger && <Badge variant="destructive">Immediate Danger</Badge>}
          {formData.isAnonymous && <Badge variant="secondary">Anonymous</Badge>}
          {formData.consentForSharing && <Badge variant="outline">Consent Given</Badge>}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return renderStep1();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.incidentDate && formData.location && formData.description;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep > step 
                ? 'bg-green-500 border-green-500 text-white' 
                : currentStep === step
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {currentStep > step ? '✓' : step}
            </div>
            <span className={`ml-2 text-sm ${
              currentStep === step ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              {step === 1 ? 'Incident Details' : step === 2 ? 'Privacy & Consent' : 'Review & Submit'}
            </span>
            {step < 3 && (
              <div className={`w-8 h-0.5 mx-2 ${
                currentStep > step ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      {renderCurrentStep()}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          onClick={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}
          variant="outline"
        >
          {currentStep === 1 ? '← Back to Categories' : '← Previous'}
        </Button>
        
        <div className="space-x-2">
          {currentStep < 3 ? (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Next →
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GBVReportForm; 