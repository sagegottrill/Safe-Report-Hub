import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Calendar, User, Shield, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

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
  caseId?: string;
  reporterName?: string;
  reporterPhone?: string;
  urgency?: string;
  region?: string;
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
  const { user } = useAppContext();
  const isAdmin = user && user.role && user.role !== 'user';

  if (!report) return null;

  const handleSave = () => {
    onUpdateReport(report.id, {
      status,
      riskScore: parseInt(riskScore),
      adminNotes
    });
    onClose();
  };

  const handleStatusChange = async (newStatus: string) => {
    let updates: any = { status: newStatus };
    if (newStatus === 'resolved') {
      updates.resolvedAt = new Date().toISOString();
    }
    const { error } = await supabase.from('reports').update(updates).eq('id', report.id);
    if (error) {
      toast.error('Failed to update report status');
    } else {
      toast.success('Report status updated');
      onUpdateReport(report.id, updates);
    }
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

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  // Helper to get the best available date
  const getReportDate = (report: any) => {
    return report.date || report.timestamp || report.incidentDate || 'N/A';
  };

  // Helper to get reporter info
  const getReporterInfo = (report: any) => {
    if (report.isAnonymous) return 'Anonymous';
    
    const name = report.reporterName || report.name || '';
    const email = report.reporterEmail || report.email || '';
    const phone = report.reporterPhone || report.phone || '';
    
    if (name && email) return `${name} (${email})`;
    if (email) return email;
    if (name) return name;
    return 'Unknown';
  };

  // Helper to get platform
  const getPlatform = (report: any) => {
    return report.platform || report.source || 'Web Platform';
  };

  // Helper to get urgency
  const getUrgency = (report: any) => {
    return report.urgency || report.priority || 'Medium';
  };

  // Helper to get sector
  const getSector = (report: any) => {
    return report.type || report.sector || 'General';
  };

  // Helper to get region
  const getRegion = (report: any) => {
    return report.region || report.location || 'N/A';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            Review Report - {getSector(report)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Case ID and Date Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Case ID
              </Label>
              <p className="text-base font-mono bg-gray-100 px-3 py-2 rounded-md border">
                {report.caseId || report.id || 'N/A'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                Date Reported
              </Label>
              <p className="text-base bg-gray-100 px-3 py-2 rounded-md border">
                {formatDate(getReportDate(report))}
              </p>
            </div>
          </div>

          {/* Reporter and Platform Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                Reporter
              </Label>
              <p className="text-base bg-gray-100 px-3 py-2 rounded-md border">
                {getReporterInfo(report)}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-600" />
                Platform
              </Label>
              <p className="text-base bg-gray-100 px-3 py-2 rounded-md border">
                {getPlatform(report)}
              </p>
            </div>
          </div>

          {/* Status and Urgency Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Badge className="h-4 w-4" />
                Current Status
              </Label>
              <Badge className={`${getStatusColor(report.status)} text-sm font-medium px-3 py-1`}>
                {t(typeof report.status === 'string' ? report.status.replace('-', '') : 'unknown')}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Badge className="h-4 w-4" />
                Urgency Level
              </Label>
              <Badge className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1">
                {getUrgency(report)}
              </Badge>
            </div>
          </div>

          {/* Sector and Region Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Badge className="h-4 w-4" />
                Sector
              </Label>
              <Badge className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1">
                {getSector(report)}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Badge className="h-4 w-4" />
                Region
              </Label>
              <Badge className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1">
                {getRegion(report)}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Description</Label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-base leading-relaxed text-gray-800">{report.description}</p>
            </div>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800">Admin Actions</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Update Status</Label>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk" className="text-sm font-semibold text-gray-700">Risk Score</Label>
                  <Select value={riskScore} onValueChange={setRiskScore}>
                    <SelectTrigger className="border-gray-300">
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
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Admin Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add admin notes here..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="border-gray-300"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-6">
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancel
          </Button>
          {isAdmin && (
            <Button onClick={handleSave} className="px-6">
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportReviewModal;