import React from 'react';
import EnhancedReportForm from '@/components/report/EnhancedReportForm';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReportPage: React.FC = () => {
  const { submitReport } = useAppContext();
  const navigate = useNavigate();

  const handleReportSubmit = (data: any) => {
    submitReport(data);
    navigate('/'); // Redirect to dashboard after submit
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