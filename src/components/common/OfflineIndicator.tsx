import React from 'react';
import { WifiOff, HardDrive, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  offlineCount?: number;
  onOpenOfflineLibrary?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  offlineCount = 0,
  onOpenOfflineLibrary,
}) => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 z-50 flex items-center justify-between gap-3 rounded-xl bg-amber-500/95 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-slate-950 shadow-2xl border border-amber-400/50 animate-bounce-short">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <WifiOff className="w-4 h-4 text-slate-950" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
        </div>
        <div>
          <span className="font-bold">Offline Mode Active</span>
          <p className="text-[11px] text-slate-900/90 hidden sm:block">
            Using cached IndexedDB storage for seamless reading.
          </p>
        </div>
      </div>

      {onOpenOfflineLibrary && (
        <button
          onClick={onOpenOfflineLibrary}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition cursor-pointer"
        >
          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          <span>Saved ({offlineCount})</span>
        </button>
      )}
    </div>
  );
};
