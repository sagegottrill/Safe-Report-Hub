import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppContext } from '@/contexts/AppContext';
import { AlertTriangle, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GiWaterDrop, GiHealthNormal, GiHouse, GiFoodChain, GiFamilyHouse, GiFemale, GiRunningNinja } from 'react-icons/gi';
import { FaUser } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { set as idbSet, get as idbGet, del as idbDel, keys as idbKeys } from 'idb-keyval';
import { toast } from '@/components/ui/sonner';

const CATEGORY_OPTIONS = [
  {
    value: 'gender_based_violence',
    label: 'Gender-Based Violence',
    description: 'Incidents of violence or harm based on gender.',
    icon: <GiFemale className="inline mr-1" />,
  },
  {
    value: 'child_protection',
    label: 'Child Protection',
    description: 'Abuse, neglect, or exploitation of children.',
    icon: <FaUser className="inline mr-1" />,
  },
  {
    value: 'forced_displacement',
    label: 'Forced Displacement',
    description: 'People forced to flee homes due to conflict or disaster.',
    icon: <GiRunningNinja className="inline mr-1" />,
  },
  {
    value: 'food_insecurity',
    label: 'Food Insecurity',
    description: 'Lack of access to sufficient food.',
    icon: <GiFoodChain className="inline mr-1" />,
  },
  {
    value: 'water_sanitation',
    label: 'Water/Sanitation',
    description: 'Issues with clean water or sanitation.',
    icon: <GiWaterDrop className="inline mr-1" />,
  },
  {
    value: 'shelter_issues',
    label: 'Shelter Issues',
    description: 'Problems with housing or shelter.',
    icon: <GiFamilyHouse className="inline mr-1" />,
  },
  {
    value: 'health_emergencies',
    label: 'Health Emergencies',
    description: 'Medical emergencies or outbreaks.',
    icon: <GiHealthNormal className="inline mr-1" />,
  },
];

const URGENCY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'critical', label: 'Critical' },
];

const IMPACT_OPTIONS = [
  'Emotional distress',
  'Psychological impact',
  'Safety concerns',
  'Financial loss',
  'Reputational damage',
];

const ReportForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    category: '',
    urgency: 'medium',
    timestamp: new Date().toISOString(),
    latitude: '',
    longitude: '',
    locationError: '',
    description: '',
    isAnonymous: false,
    followUp: '',
    platform: '',
    impact: [] as string[],
    perpetrator: '',
    date: new Date().toISOString().split('T')[0],
    type: '',
  });
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const { submitReport, user, setCurrentView } = useAppContext();
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing' | 'error'>('online');

  const handleImpactChange = (impact: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      impact: checked 
        ? [...prev.impact, impact]
        : prev.impact.filter(i => i !== impact)
    }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const selectedCategory = CATEGORY_OPTIONS.find(c => c.value === formData.category);
    if (!formData.category || !formData.description || !formData.platform) {
      toast.error(t('Please fill all required fields.'));
      setLoading(false);
      return;
    }
    const reportData = {
      ...formData,
      type: selectedCategory ? selectedCategory.label : t('Unknown'),
      reporterId: formData.isAnonymous ? undefined : user?.id,
      mediaFiles,
      flagged: false,
    };
    if (navigator.onLine) {
      const referenceId = submitReport(reportData);
      setSyncStatus('online');
      setLoading(false);
      setCurrentView('dashboard');
      toast.success(t('Report submitted successfully.'));
    } else {
      // Save offline
      const offlineKey = `offline-report-${Date.now()}`;
      await idbSet(offlineKey, reportData);
      setSyncStatus('offline');
      setLoading(false);
      toast.info(t('You are offline. Your report will be sent when you are back online.'));
    }
  };

  useEffect(() => {
    if (!formData.latitude && !formData.longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setFormData((prev) => ({
              ...prev,
              latitude: pos.coords.latitude.toFixed(6),
              longitude: pos.coords.longitude.toFixed(6),
              locationError: '',
            }));
          },
          (err) => {
            // fallback to IP-based geolocation
            fetch('https://ipapi.co/json/')
              .then((res) => res.json())
              .then((data) => {
                setFormData((prev) => ({
                  ...prev,
                  latitude: data.latitude ? data.latitude.toString() : '',
                  longitude: data.longitude ? data.longitude.toString() : '',
                  locationError: t('Could not get precise location, using approximate location.'),
                }));
              });
          },
          { timeout: 5000 }
        );
      }
    }
  }, [formData.latitude, formData.longitude, t]);

  useEffect(() => {
    const syncOfflineReports = async () => {
      if (navigator.onLine) {
        setSyncStatus('syncing');
        const allKeys = await idbKeys();
        const offlineKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('offline-report-'));
        for (const key of offlineKeys) {
          const report = await idbGet(key);
          if (report) {
            submitReport(report);
            await idbDel(key);
          }
        }
        setSyncStatus('online');
      }
    };
    window.addEventListener('online', syncOfflineReports);
    return () => {
      window.removeEventListener('online', syncOfflineReports);
    };
  }, [submitReport]);

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6">
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Shield className="h-4 w-4 md:h-5 md:w-5" />
            Submit Incident Report
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            All information is handled with strict confidentiality and security
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="category" className="text-xs md:text-sm">Incident Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                  <SelectTrigger className="h-8 md:h-10 text-xs md:text-sm">
                    <SelectValue placeholder="Select incident category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(category => (
                      <SelectItem key={category.value} value={category.value} className="text-xs md:text-sm">{category.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="date" className="text-xs md:text-sm">Date of Incident *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                  required
                  className="h-8 md:h-10 text-xs md:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="platform" className="text-xs md:text-sm">Platform/Medium *</Label>
              <Input
                id="platform"
                placeholder="e.g., Instagram, WhatsApp, Email, etc."
                value={formData.platform}
                onChange={(e) => setFormData(prev => ({...prev, platform: e.target.value}))}
                required
                className="h-8 md:h-10 text-xs md:text-sm"
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="description" className="text-xs md:text-sm">Description of Incident *</Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about what happened..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                required
                rows={3}
                className="text-xs md:text-sm resize-none"
              />
            </div>

            <div className="space-y-2 md:space-y-3">
              <Label className="text-xs md:text-sm">Impact Assessment</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                {IMPACT_OPTIONS.map(impact => (
                  <div key={impact} className="flex items-center space-x-2">
                    <Checkbox
                      id={impact}
                      checked={formData.impact.includes(impact)}
                      onCheckedChange={(checked) => handleImpactChange(impact, !!checked)}
                      className="h-3 w-3 md:h-4 md:w-4"
                    />
                    <Label htmlFor={impact} className="text-xs md:text-sm">{impact}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="perpetrator" className="text-xs md:text-sm">Alleged Perpetrator (Optional)</Label>
              <Input
                id="perpetrator"
                placeholder="Username, email, or description"
                value={formData.perpetrator}
                onChange={(e) => setFormData(prev => ({...prev, perpetrator: e.target.value}))}
                className="h-8 md:h-10 text-xs md:text-sm"
              />
              <p className="text-xs text-gray-500">This information is handled with utmost care</p>
            </div>

            {/* Media upload section */}
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="media" className="text-xs md:text-sm">Upload Media (Optional)</Label>
              <Input
                id="media"
                type="file"
                multiple
                accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleMediaChange}
                className="h-8 md:h-10 text-xs md:text-sm"
              />
              <p className="text-xs text-gray-500">You can upload images, videos, or documents. No preview will be shown.</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 md:p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-2 md:space-y-3">
                  <h4 className="font-medium text-yellow-800 text-xs md:text-sm">Privacy Options</h4>
                  <RadioGroup
                    value={formData.isAnonymous ? 'anonymous' : 'confidential'}
                    onValueChange={(value) => setFormData(prev => ({...prev, isAnonymous: value === 'anonymous'}))}
                    className="space-y-1 md:space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="confidential" id="confidential" className="h-3 w-3 md:h-4 md:w-4" />
                      <Label htmlFor="confidential" className="text-xs md:text-sm">
                        <strong>Confidential:</strong> Your identity is protected but known to administrators
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="anonymous" id="anonymous" className="h-3 w-3 md:h-4 md:w-4" />
                      <Label htmlFor="anonymous" className="text-xs md:text-sm">
                        <strong>Anonymous:</strong> No identifying information is stored
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-8 md:h-10 text-xs md:text-sm" disabled={loading}>
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </Button>
          </form>
          {/* Add sync status banner and error message */}
          {syncStatus === 'offline' && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2 text-center text-sm" aria-live="polite">
              {t('You are offline. Reports will be synced when online.')}
            </div>
          )}
          {syncStatus === 'syncing' && (
            <div className="bg-blue-100 text-blue-800 p-2 rounded mb-2 text-center text-sm" aria-live="polite">
              {t('Syncing offline reports...')}
            </div>
          )}
          {syncStatus === 'online' && (
            <div className="bg-green-100 text-green-800 p-2 rounded mb-2 text-center text-sm" aria-live="polite">
              {t('Online. Reports are sent immediately.')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;