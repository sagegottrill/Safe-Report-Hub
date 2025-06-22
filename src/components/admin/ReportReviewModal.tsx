import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Calendar, User, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Report {
  id: string;
  type: string;
  description: string;
  date: string;
  status: string;
  platform: string;
  isAnonymous: boolean;
  riskScore?: number;
  reporterEmail?: string;
  adminNotes?: string;
}

interface ReportReviewModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
}

const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  report,
  isOpen,
  onClose,
  onUpdateReport
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(report?.status || 'new');
  const [adminNotes, setAdminNotes] = useState('');
  const [riskScore, setRiskScore] = useState(report?.riskScore?.toString() || '5');

  if (!report) return null;

  const handleSave = () => {
    onUpdateReport(report.id, {
      status,
      riskScore: parseInt(riskScore),
      adminNotes
    });
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t('reviewReport', { type: report.type })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('dateReported')}
              </Label>
              <p className="text-sm text-gray-600">{new Date(report.date).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('reporter')}
              </Label>
              <p className="text-sm text-gray-600">
                {report.isAnonymous ? t('anonymous') : report.reporterEmail || t('unknown')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('platform')}
            </Label>
            <p className="text-sm text-gray-600">{report.platform}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('currentStatus')}</Label>
            <Badge className={getStatusColor(report.status)}>
              {t(report.status.replace('-', ''))}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('description')}</Label>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">{report.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">{t('updateStatus')}</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t('new')}</SelectItem>
                  <SelectItem value="under-review">{t('underReview')}</SelectItem>
                  <SelectItem value="resolved">{t('resolved')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk">{t('riskScoreLabel')}</Label>
              <Select value={riskScore} onValueChange={setRiskScore}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('adminNotes')}</Label>
            <Textarea
              id="notes"
              placeholder={t('adminNotesPlaceholder')}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportReviewModal;