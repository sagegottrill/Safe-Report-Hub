    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
    import { useAppContext } from '@/contexts/AppContext';
    import { AlertTriangle, Shield } from 'lucide-react';
    import { useTranslation } from 'react-i18next';
    import { GiWaterDrop, GiHealthNormal, GiHouse, GiFoodChain, GiFamilyHouse, GiFemale, GiRunningNinja } from 'react-icons/gi';
    import { FaUser } from 'react-icons/fa';
    import { MdOutlineLocationOn } from 'react-icons/md';
    import { set as idbSet, get as idbGet, del as idbDel, keys as idbKeys } from 'idb-keyval';
    import { toast } from '@/components/ui/sonner';
    import CryptoJS from 'crypto-js';

    // Google Apps Script Webhook URL - Fallback option
    const GOOGLE_APPS_SCRIPT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwhAguZbDJdRrhXNPM0GcJqTjvYm1QwlfAZbxcwSgy1BvE7B4eKvVcqrafR0Fa9C8ek2Q/exec';

    // Formspree endpoint for email alerts - Replace with your Formspree endpoint
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your_form_id';

    const FORM_TYPES = [
      { value: 'abuse', label: 'Report Abuse' },
      { value: 'help', label: 'Request Help' },
      { value: 'feedback', label: 'Give Feedback' },
    ];

    const ENCRYPTION_KEY = 'safeaid-demo-key'; // In production, use a secure key management system

    const ReportForm: React.FC = () => {
      const { t } = useTranslation();

      const CATEGORY_OPTIONS = [
        {
          value: 'gender_based_violence',
          label: t('Gender-Based Violence'),
          description: t('Incidents of violence or harm based on gender.'),
          icon: <GiFemale className="inline mr-1" />,
        },
        {
        
          value: 'child_protection',
          label: t('Child Protection'),
          description: t('Abuse, neglect, or exploitation of children.'),
          icon: <FaUser className="inline mr-1" />,
        },
        {
          value: 'forced_displacement',
          label: t('Forced Displacement'),
          description: t('People forced to flee homes due to conflict or disaster.'),
          icon: <GiRunningNinja className="inline mr-1" />,
        },
        {
          value: 'food_insecurity',
          label: t('Food Insecurity'),
          description: t('Lack of access to sufficient food.'),
          icon: <GiFoodChain className="inline mr-1" />,
        },
        {
          value: 'water_sanitation',
          label: t('Water/Sanitation'),
          description: t('Issues with clean water or sanitation.'),
          icon: <GiWaterDrop className="inline mr-1" />,
        },
        {
          value: 'shelter_issues',
          label: t('Shelter Issues'),
          description: t('Problems with housing or shelter.'),
          icon: <GiFamilyHouse className="inline mr-1" />,
        },
        {
          value: 'health_emergencies',
          label: t('Health Emergencies'),
          description: t('Medical emergencies or outbreaks.'),
          icon: <GiHealthNormal className="inline mr-1" />,
        },
      ];
  
      const URGENCY_OPTIONS = [
        { value: 'low', label: t('Low') },
        { value: 'medium', label: t('Medium') },
        { value: 'critical', label: t('Critical') },
      ];
  
      const IMPACT_OPTIONS = [
        t('Emotional distress'),
        t('Psychological impact'),
        t('Safety concerns'),
        t('Financial loss'),
        t('Reputational damage'),
      ];

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
      const [showConfirmation, setShowConfirmation] = useState(false);
      const [pendingSubmission, setPendingSubmission] = useState<any>(null);
      const [emailNotifications, setEmailNotifications] = useState(true);
      const [notificationEmail, setNotificationEmail] = useState('');
      const { submitReport, user, setCurrentView } = useAppContext();
      const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing' | 'error'>('online');
      const [formType, setFormType] = useState('abuse');

      const resetForm = () => {
        setFormData({
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
          impact: [],
          perpetrator: '',
          date: new Date().toISOString().split('T')[0],
          type: '',
        });
        setMediaFiles(null);
        const mediaInput = document.getElementById('media') as HTMLInputElement;
        if (mediaInput) {
          mediaInput.value = '';
        }
        window.scrollTo(0, 0);
      };

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
        const selectedCategory = CATEGORY_OPTIONS.find(c => c.value === formData.category);
        if (!formData.category || !formData.description || !formData.platform) {
          toast.error(t('Please fill all required fields.'));
          return;
        }

        // Encrypt the description field
        const encryptedDescription = CryptoJS.AES.encrypt(formData.description, ENCRYPTION_KEY).toString();

        // Generate tags from the message
        const autoTags = generateTagsFromMessage(formData.description);

        // Prepare data for API route
        const webhookData = {
          category: formData.category,
          urgency: formData.urgency,
          message: formData.description, // Using description as message
          location: (formData.latitude && formData.longitude) ? `${formData.latitude},${formData.longitude}` : 'Unknown',
          anonymous: formData.isAnonymous,
          autoGeneratedTags: autoTags, // Add generated tags
          // Additional fields for comprehensive data
          timestamp: formData.timestamp,
          latitude: formData.latitude,
          longitude: formData.longitude,
          platform: formData.platform,
          impact: formData.impact,
          perpetrator: formData.perpetrator,
          date: formData.date,
          type: selectedCategory ? selectedCategory.label : t('Unknown'),
          // Email notification data
          emailNotifications: emailNotifications,
          notificationEmail: emailNotifications ? notificationEmail : '',
        };

        const reportData = {
          ...formData,
          description: encryptedDescription,
          formType,
          type: selectedCategory ? selectedCategory.label : t('Unknown'),
          reporterId: formData.isAnonymous ? undefined : user?.id,
          mediaFiles,
          flagged: false,
        };

        // Store the submission data and show confirmation
        setPendingSubmission({ webhookData, reportData });
        setShowConfirmation(true);
      };

      const handleConfirmSubmission = async () => {
        if (!pendingSubmission) return;
        
        setLoading(true);
        setShowConfirmation(false);
        
        const { webhookData, reportData } = pendingSubmission;

        if (navigator.onLine) {
          try {
            // Send email alert via Formspree
            if (FORMSPREE_ENDPOINT !== 'https://formspree.io/f/your_form_id') {
              const emailData = {
                category: webhookData.category,
                urgency: webhookData.urgency,
                message: webhookData.message,
                location: webhookData.location,
                _to: 'your@email.com', // Should match your Formspree recipient
              };
              fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData),
              }).catch(error => console.error('Formspree error:', error)); // Fire and forget
            }

            // Send to API route instead of Google Apps Script webhook
            try {
              const apiResponse = await fetch("/api/report", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  category: webhookData.category,
                  urgency: webhookData.urgency,
                  message: webhookData.message,
                  location: webhookData.location,
                  anonymous: webhookData.anonymous,
                  tags: webhookData.autoGeneratedTags,
                }),
              });

              if (!apiResponse.ok) {
                const errorText = await apiResponse.text();
                console.error('API response error:', apiResponse.status, errorText);
                throw new Error(`API failed: ${apiResponse.status} - ${errorText}`);
              }

              let apiResult;
              try {
                apiResult = await apiResponse.json();
              } catch (parseError) {
                console.log('API response is not JSON, but that\'s okay');
                apiResult = { status: 'success' };
              }

              if (apiResult.status === 'success') {
                toast.success(t('Report submitted successfully and saved to Google Sheets.'));
              } else {
                console.error('API error:', apiResult.error);
                toast.warning(t('Report submitted but Google Sheets save failed.'));
              }
            } catch (apiError: any) {
              console.error('API submission error:', apiError);
              
              // Fallback to Google Apps Script webhook if API fails
              try {
                const webhookResponse = await fetch(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  mode: 'cors',
                  body: JSON.stringify(webhookData),
                });

                if (webhookResponse.ok) {
                  toast.success(t('Report submitted successfully using fallback method.'));
                } else {
                  throw new Error('Fallback method also failed');
                }
              } catch (fallbackError) {
                console.error('Fallback submission also failed:', fallbackError);
                toast.warning(t('Report submitted locally. Both API and webhook failed.'));
              }
            }

            // Always submit to local system regardless of webhook status
            submitReport(reportData);
            setSyncStatus('online');
            toast.success(t('Thank you for your report. It has been submitted successfully.'));
            resetForm(); // Clear form and scroll to top
          } catch (error: any) {
            console.error('Submission error:', error);
            
            // Provide more specific error messages
            if (error.message.includes('CORS')) {
              toast.error(t('CORS error: Report submitted locally but could not reach external server.'));
            } else if (error.message.includes('Failed to fetch')) {
              toast.error(t('Network error: Please check your internet connection and try again.'));
            } else {
              toast.error(t('Failed to submit report. Please try again.'));
            }
          }
        } else {
          // Save offline
          const offlineKey = `offline-report-${Date.now()}`;
          await idbSet(offlineKey, { ...reportData, webhookData });
          setSyncStatus('offline');
          toast.info(t('You are offline. Your report will be sent when you are back online.'));
          resetForm(); // Clear form and scroll to top
        }
        
        setLoading(false);
        setPendingSubmission(null);
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
                // Submit to local system
                submitReport(report);
                
                // Send email alert if endpoint is set
                if (FORMSPREE_ENDPOINT !== 'https://formspree.io/f/your_form_id' && report.webhookData) {
                  const emailData = {
                    category: report.webhookData.category,
                    urgency: report.webhookData.urgency,
                    message: report.webhookData.message,
                    location: report.webhookData.location,
                    _to: 'your@email.com',
                  };
                  fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData),
                  }).catch(error => console.error('Offline Formspree sync error:', error));
                }

                // Send to API if available
                if (report.webhookData) {
                  try {
                    const apiResponse = await fetch("/api/report", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        category: report.webhookData.category,
                        urgency: report.webhookData.urgency,
                        message: report.webhookData.message,
                        location: report.webhookData.location,
                        anonymous: report.webhookData.anonymous,
                        tags: report.webhookData.autoGeneratedTags,
                      }),
                    });
                    
                    if (apiResponse.ok) {
                      const apiResult = await apiResponse.json();
                      if (apiResult.status === 'success') {
                        console.log('Offline report synced to API successfully');
                      }
                    }
                  } catch (error) {
                    console.error('Failed to sync offline report to API:', error);
                    
                    // Fallback to webhook if API fails
                    try {
                      const webhookResponse = await fetch(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(report.webhookData),
                      });
                      
                      if (webhookResponse.ok) {
                        const webhookResult = await webhookResponse.json();
                        if (webhookResult.success) {
                          console.log('Offline report synced to webhook successfully');
                        }
                      }
                    } catch (webhookError) {
                      console.error('Failed to sync offline report to webhook:', webhookError);
                    }
                  }
                }
                
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

      // Function to generate tags from the message
      const generateTagsFromMessage = (message: string): string[] => {
        const tags = new Set<string>();
        const lowerCaseMessage = message.toLowerCase();

        // Urgent keywords
        if (/\b(rape|abuse|violence)\b/.test(lowerCaseMessage)) {
          tags.add('urgent');
        }

        // Food-related keywords
        if (/\b(hunger|no food|starving)\b/.test(lowerCaseMessage)) {
          tags.add('food');
        }

        // Health-related keywords
        if (/\b(sick|ill|health)\b/.test(lowerCaseMessage)) {
          tags.add('health');
        }

        // Shelter-related keywords
        if (/\b(displaced|homeless|shelter)\b/.test(lowerCaseMessage)) {
          tags.add('shelter');
        }

        return Array.from(tags);
      };

      const handleResetForm = () => {
        resetForm();
        setShowConfirmation(false);
      };

      return (
        <div className="max-w-4xl mx-auto p-2 md:p-6">
          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Shield className="h-4 w-4 md:h-5 md:w-5" />
                {t('Submit Incident Report')}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                {t('All information is handled with strict confidentiality and security')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="formType" className="text-xs md:text-sm">Form Type *</Label>
                  <select
                    id="formType"
                    value={formType}
                    onChange={e => setFormType(e.target.value)}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
                    required
                  >
                    {FORM_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="category" className="text-xs md:text-sm">{t('incidentCategory')} *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                      <SelectTrigger className="h-8 md:h-10 text-xs md:text-sm">
                        <SelectValue placeholder={t('selectIncidentCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map(category => (
                          <SelectItem key={category.value} value={category.value} className="text-xs md:text-sm">{category.icon} {category.label} - <span className="text-gray-500">{category.description}</span></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="date" className="text-xs md:text-sm">{t('dateOfIncident')} *</Label>
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
                    placeholder={t('e.g., Instagram, WhatsApp, Email, etc.')}
                    value={formData.platform}
                    onChange={(e) => setFormData(prev => ({...prev, platform: e.target.value}))}
                    required
                    className="h-8 md:h-10 text-xs md:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs md:text-sm">{t('descriptionOfIncident')} *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder={t('Please provide detailed information about what happened...')}
                    className="text-xs md:text-sm resize-none"
                    rows={4}
                    required
                  />
                  {/* Live tag preview */}
                  {generateTagsFromMessage(formData.description).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2" aria-live="polite">
                      <span className="text-xs text-gray-400 mr-2">Auto-tags:</span>
                      {generateTagsFromMessage(formData.description).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs border border-gray-200 opacity-70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:space-y-3">
                  <Label className="text-xs md:text-sm">Impact Assessment</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                    {IMPACT_OPTIONS.map(impact => (
                      <div key={impact} className="flex items-center space-x-2">
                        <Checkbox
                          id={`impact-${impact}`}
                          checked={formData.impact.includes(impact)}
                          onCheckedChange={(checked) => handleImpactChange(impact, !!checked)}
                          className="h-3 w-3 md:h-4 md:w-4"
                        />
                        <Label htmlFor={`impact-${impact}`} className="text-xs md:text-sm">{impact}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="perpetrator" className="text-xs md:text-sm">Alleged Perpetrator (Optional)</Label>
                  <Input
                    id="perpetrator"
                    placeholder={t('Username, email, or description')}
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
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="anonymous"
                          checked={formData.isAnonymous}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: !!checked }))}
                          className="h-3 w-3 md:h-4 md:w-4"
                        />
                        <Label htmlFor="anonymous" className="text-xs md:text-sm font-medium">
                          Submit anonymously
                        </Label>
                      </div>
                      <p className="text-xs text-gray-600 pl-6">
                        If checked, no personal information or metadata will be captured or stored with your report.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Notification Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-4">
                  <div className="space-y-2 md:space-y-3">
                    <h4 className="font-medium text-blue-800 text-xs md:text-sm">Email Notifications</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailNotifications"
                        checked={emailNotifications}
                        onCheckedChange={(checked) => setEmailNotifications(!!checked)}
                        className="h-3 w-3 md:h-4 md:w-4"
                      />
                      <Label htmlFor="emailNotifications" className="text-xs md:text-sm font-medium">
                        Receive email updates about this report
                      </Label>
                    </div>
                    {emailNotifications && (
                      <div className="pl-6 space-y-2">
                        <Label htmlFor="notificationEmail" className="text-xs md:text-sm">Email Address</Label>
                        <Input
                          id="notificationEmail"
                          type="email"
                          placeholder={t('Enter your email for updates')}
                          value={notificationEmail}
                          onChange={(e) => setNotificationEmail(e.target.value)}
                          className="h-8 md:h-10 text-xs md:text-sm"
                        />
                        <p className="text-xs text-gray-600">
                          You'll receive updates when your report is reviewed or resolved.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full h-8 md:h-10 text-xs md:text-sm" disabled={loading}>
                  {loading ? t('Submitting Report...') : t('Submit Report')}
                </Button>
              </form>
              
              {/* Confirmation Dialog */}
              <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      {t('Confirm Report Submission')}
                    </DialogTitle>
                    <DialogDescription>
                      {t('Please review your report before submitting. This action cannot be undone.')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">{t('Category:')}</span>
                        <p className="text-gray-600">{CATEGORY_OPTIONS.find(c => c.value === formData.category)?.label}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('Date:')}</span>
                        <p className="text-gray-600">{formData.date}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('Platform:')}</span>
                        <p className="text-gray-600">{formData.platform}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('Anonymous:')}</span>
                        <p className="text-gray-600">{formData.isAnonymous ? t('Yes') : t('No')}</p>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-sm">{t('Description:')}</span>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-3">{formData.description}</p>
                    </div>
                  </div>
                  <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                      {t('Cancel')}
                    </Button>
                    <Button onClick={handleConfirmSubmission} disabled={loading}>
                      {loading ? t('Submitting...') : t('Confirm & Submit')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
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
          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={handleResetForm} aria-label="Close">&times;</button>
                <div className="mb-4">
                  <svg className="h-16 w-16 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-green-700 mb-2">Report Submitted!</div>
                <div className="text-sm text-gray-700 mb-4 text-center">Thank you for your report. Our team will review it and respond as needed.</div>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleResetForm}>
                  Submit another report
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };

    export default ReportForm;