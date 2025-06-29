import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Shield, CheckCircle, BarChart3, Users, ChevronLeft, Home, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrustIndicator, SecurityBadge, OfficialStamp } from '@/components/ui/trust-indicators';
import MobileReportPage from './MobileReportPage';

const MobileMultiSectoral: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (reportData: any) => {
    try {
      console.log('Submitting report:', reportData);
      
      // Prepare the data for API submission
      const apiData = {
        sector: reportData.sector,
        category: reportData.category,
        urgency: reportData.urgency,
        message: reportData.description || reportData.message,
        location: reportData.location,
        anonymous: reportData.isAnonymous ? 'true' : 'false',
        tags: reportData.tags || '',
        incidentDate: reportData.incidentDate,
        description: reportData.description,
        stakeholder: reportData.stakeholder,
        schoolName: reportData.schoolName,
        communityName: reportData.communityName,
        infrastructureType: reportData.infrastructureType,
        // Add any other fields from the form
        ...reportData
      };

      // Submit to the API
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast.success('Report submitted successfully!', {
        description: `Sector: ${reportData.sector} | Category: ${reportData.category} | Urgency: ${reportData.urgency}`
      });
      
      console.log('API Response:', result);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit report', {
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile')}
            className="p-2 h-auto"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Multi-Sectoral Reports</h1>
            <p className="text-xs text-gray-500">Official Government Platform</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded-full">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Multi-Sectoral Platform</h2>
                <p className="text-sm text-gray-500">Complete reporting system</p>
              </div>
            </div>
            <OfficialStamp>Verified</OfficialStamp>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <TrustIndicator type="security" size="sm">
              Secure
            </TrustIndicator>
            <TrustIndicator type="privacy" size="sm">
              Anonymous
            </TrustIndicator>
            <TrustIndicator type="official" size="sm">
              Official
            </TrustIndicator>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-4">
          <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-600 flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Gender-Based Violence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-green-50 text-green-600 border border-green-200">✅ Complete</Badge>
              <p className="text-sm text-gray-600">
                <strong>Features:</strong>
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Survivor-centered design</li>
                <li>• Privacy & consent management</li>
                <li>• Emergency indicators</li>
                <li>• Form validation</li>
                <li>• Multi-language support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-600 flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-green-50 text-green-600 border border-green-200">✅ Complete</Badge>
              <p className="text-sm text-gray-600">
                <strong>Features:</strong>
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Stakeholder selection</li>
                <li>• School information tracking</li>
                <li>• Student/parent/teacher forms</li>
                <li>• Bullying detection</li>
                <li>• Follow-up coordination</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-600 flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Water & Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-green-50 text-green-600 border border-green-200">✅ Complete</Badge>
              <p className="text-sm text-gray-600">
                <strong>Features:</strong>
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Community mapping</li>
                <li>• Infrastructure tracking</li>
                <li>• Impact assessment</li>
                <li>• Maintenance coordination</li>
                <li>• Population impact analysis</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-gray-700">
            <strong>System Ready!</strong> All modules are operational and ready for report submission.
          </AlertDescription>
        </Alert>

        {/* Enhanced Features */}
        <div className="space-y-4">
          <Card className="bg-white shadow-sm border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-600 flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                Admin Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-blue-50 text-blue-600 border border-blue-200">✅ Complete</Badge>
              <p className="text-sm text-gray-600">
                <strong>Features:</strong>
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Real-time multi-sectoral metrics</li>
                <li>• Interactive charts and trends</li>
                <li>• Sector-specific analytics</li>
                <li>• Report management tools</li>
                <li>• Export and data visualization</li>
              </ul>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin-analytics')}
                className="mt-2 w-full"
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-600 flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Community Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-green-50 text-green-600 border border-green-200">✅ Complete</Badge>
              <p className="text-sm text-gray-600">
                <strong>Features:</strong>
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Public-facing community insights</li>
                <li>• Sector-specific impact metrics</li>
                <li>• Community engagement tools</li>
                <li>• Progress tracking</li>
                <li>• Call-to-action features</li>
              </ul>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/community-dashboard')}
                className="mt-2 w-full"
              >
                View Community Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Form */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900 text-base">
              <Shield className="h-5 w-5 text-green-600" />
              Submit Multi-Sectoral Report
            </CardTitle>
            <CardDescription>
              Choose your sector and submit a detailed report with enhanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/report')}
              className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-green-600 shadow-lg text-lg active:scale-95 transition-all hover:bg-green-700"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Start New Report
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileMultiSectoral; 