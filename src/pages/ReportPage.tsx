import React from 'react';
import EnhancedReportForm from '@/components/report/EnhancedReportForm';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthPage from '@/components/auth/AuthPage';
import { saveReport } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

const ReportPage: React.FC = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  if (!user) return <AuthPage />;

  const handleReportSubmit = async (data: any) => {
    const { error } = await saveReport(data);
    if (error) {
      toast.error('Failed to submit report. Please try again.');
    } else {
      toast.success('Report submitted successfully!');
      navigate('/'); // Redirect to dashboard after submit
    }
  };

  return (
    <div className="min-h-screen bg-background-light py-8 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
        </Button>
      </div>
      <div className="w-full max-w-4xl">
        <EnhancedReportForm onSubmit={handleReportSubmit} />
      </div>
    </div>
  );
};

export default ReportPage; 