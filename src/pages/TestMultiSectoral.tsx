import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import EnhancedReportForm from '@/components/report/EnhancedReportForm';
import { toast } from '@/components/ui/sonner';
import { Shield, CheckCircle, BarChart3, Users, ArrowLeft, Home } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrustIndicator, SecurityBadge, OfficialStamp } from '@/components/ui/trust-indicators';

const TestMultiSectoral: React.FC = () => {
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
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Official Header */}
        <div className="bg-white rounded-xl shadow-official border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-nigerian-green p-3 rounded-full shadow-official">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-text">Multi-Sectoral Report Form</h1>
                <p className="text-text-light">Official Government Crisis Reporting Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <OfficialStamp>Government Approved</OfficialStamp>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="btn-official-outline flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TrustIndicator type="security" size="md">
              Secure & Encrypted
            </TrustIndicator>
            <TrustIndicator type="privacy" size="md">
              Anonymous Reporting Available
            </TrustIndicator>
            <TrustIndicator type="official" size="md">
              Government Verified
            </TrustIndicator>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-official border-l-4 border-l-success">
            <CardHeader>
              <CardTitle className="text-success flex items-center gap-2">
                <Shield className="h-5 w-5" />
                GBV Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className="bg-success/10 text-success border border-success">✅ Complete</Badge>
                <p className="text-sm text-text-light">
                  <strong>Features:</strong>
                </p>
                <ul className="text-xs text-text-light space-y-1">
                  <li>• Survivor-centered design</li>
                  <li>• Privacy & consent management</li>
                  <li>• Emergency indicators</li>
                  <li>• Form validation</li>
                  <li>• Multi-language support</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-success">
            <CardHeader>
              <CardTitle className="text-success flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Education Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className="bg-success/10 text-success border border-success">✅ Complete</Badge>
                <p className="text-sm text-text-light">
                  <strong>Features:</strong>
                </p>
                <ul className="text-xs text-text-light space-y-1">
                  <li>• Stakeholder selection</li>
                  <li>• School information tracking</li>
                  <li>• Student/parent/teacher forms</li>
                  <li>• Bullying detection</li>
                  <li>• Follow-up coordination</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-success">
            <CardHeader>
              <CardTitle className="text-success flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Water Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className="bg-success/10 text-success border border-success">✅ Complete</Badge>
                <p className="text-sm text-text-light">
                  <strong>Features:</strong>
                </p>
                <ul className="text-xs text-text-light space-y-1">
                  <li>• Community mapping</li>
                  <li>• Infrastructure tracking</li>
                  <li>• Impact assessment</li>
                  <li>• Maintenance coordination</li>
                  <li>• Population impact analysis</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-text">
            <strong>System Ready!</strong> All modules are operational and ready for report submission.
          </AlertDescription>
        </Alert>

        {/* Enhanced Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-official border-l-4 border-l-nigerian-blue">
            <CardHeader>
              <CardTitle className="text-nigerian-blue flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Admin Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className="bg-nigerian-blue/10 text-nigerian-blue border border-nigerian-blue">✅ Complete</Badge>
                <p className="text-sm text-text-light">
                  <strong>Features:</strong>
                </p>
                <ul className="text-xs text-text-light space-y-1">
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
                  className="btn-official-outline mt-2"
                >
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-nigerian-green">
            <CardHeader>
              <CardTitle className="text-nigerian-green flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className="bg-nigerian-green/10 text-nigerian-green border border-nigerian-green">✅ Complete</Badge>
                <p className="text-sm text-text-light">
                  <strong>Features:</strong>
                </p>
                <ul className="text-xs text-text-light space-y-1">
                  <li>• Public-facing community insights</li>
                  <li>• Sector-specific impact metrics</li>
                  <li>• Community engagement tools</li>
                  <li>• Progress tracking</li>
                  <li>• Call-to-action features</li>
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/community')}
                  className="btn-official-outline mt-2"
                >
                  View Community Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Form */}
        <Card className="card-official">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text">
              <Shield className="h-6 w-6 text-nigerian-green" />
              Submit Multi-Sectoral Report
            </CardTitle>
            <CardDescription>
              Choose your sector and submit a detailed report with enhanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedReportForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestMultiSectoral; 