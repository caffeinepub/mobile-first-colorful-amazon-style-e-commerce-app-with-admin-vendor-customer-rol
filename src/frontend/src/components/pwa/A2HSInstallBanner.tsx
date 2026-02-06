import { X, Download } from 'lucide-react';
import { useState } from 'react';
import { useA2HS } from '@/hooks/useA2HS';
import { Button } from '@/components/ui/button';

export default function A2HSInstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = useA2HS();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if not installable, already installed, or dismissed
  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    await promptInstall();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:bottom-8 md:left-auto md:right-8 md:max-w-sm">
      <div className="marketplace-card bg-gradient-to-r from-primary to-secondary p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm mb-1">Install QuickBazar</h3>
            <p className="text-white/90 text-xs mb-3">
              Add to your home screen for quick access and a better experience
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
