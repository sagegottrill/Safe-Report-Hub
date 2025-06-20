import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface IntroModalProps {
  open: boolean;
  onClose: () => void;
  region?: string;
}

const ANIMATION_DURATION = 60000; // 60 seconds

const regionMessages: Record<string, string> = {
  'Maiduguri': 'intro_region_maiduguri',
  // Add more region keys as needed
};

export const IntroModal: React.FC<IntroModalProps> = ({ open, onClose, region }) => {
  const { t, i18n } = useTranslation();
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setProgress(0);
      let seconds = 0;
      intervalRef.current = setInterval(() => {
        seconds += 1;
        setProgress((seconds / 60) * 100);
        if (seconds >= 60) {
          clearInterval(intervalRef.current!);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open]);

  // Region-specific message key
  const regionKey = region && regionMessages[region] ? regionMessages[region] : 'intro_default';

  return (
    <Dialog open={open} onOpenChange={onClose} aria-label={t('intro_modal_aria_label', 'App Introduction')}> 
      <DialogContent className="max-w-xl p-6 md:p-8 text-center" aria-modal="true" role="dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">{t('intro_title', 'Welcome to Safety Support Report')}</DialogTitle>
        </DialogHeader>
        <div className="mb-4 text-lg md:text-xl" aria-live="polite">
          {t(regionKey)}
        </div>
        <div className="mb-4 text-base md:text-lg" aria-live="polite">
          {progress < 25 && t('intro_step1', 'Select the type of incident you want to report.')}
          {progress >= 25 && progress < 50 && t('intro_step2', 'Fill out the form with as much detail as possible. Your privacy is protected.')}
          {progress >= 50 && progress < 75 && t('intro_step3', 'Submit your report securely and anonymously if you wish.')}
          {progress >= 75 && t('intro_step4', 'Optionally provide contact for follow-up. Admins will review and respond.')}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4" aria-label={t('intro_progress_aria', 'Intro progress')}>
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <DialogFooter className="flex flex-col gap-2">
          <Button variant="outline" onClick={onClose} aria-label={t('skip_intro', 'Skip Intro')}>{t('skip_intro', 'Skip Intro')}</Button>
          <span className="text-xs text-muted-foreground">{t('intro_footer', 'You can always revisit this introduction from the menu.')}</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntroModal; 