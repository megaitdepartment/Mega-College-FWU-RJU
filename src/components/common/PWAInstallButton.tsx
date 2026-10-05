import React, { useState } from 'react';
import { Download, Smartphone, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5" />
        <span>PWA Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer active:scale-95"
        title="Install Mega College App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white">Install on iPhone / iPad</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Enjoy full offline reading and instant access on iOS:
              </p>

              <div className="mt-4 space-y-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Tap the <strong>Share</strong> button in Safari toolbar.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>Launch <strong>Mega Portal</strong> for fast offline access!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
