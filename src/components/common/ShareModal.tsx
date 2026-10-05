import React, { useState } from 'react';
import { X, Check, Copy, Share2, Send, MessageCircle, QrCode } from 'lucide-react';
import { Resource } from '../../types';

interface ShareModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onShareLogged?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  resource,
  isOpen,
  onClose,
  onShareLogged,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.origin + window.location.pathname + '#resource=' + resource.id;
  const uniLabel = resource.university === 'RJU_BCA' ? 'RJU BCA' : resource.university;
  const shareText = `📚 Check out ${resource.title} (${resource.code}) on Mega College Question Bank! Offline accessible: ${currentUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      onShareLogged?.();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleWhatsApp = () => {
    onShareLogged?.();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    onShareLogged?.();
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(resource.title)}`;
    window.open(url, '_blank');
  };

  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=00c288`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-6 shadow-2xl text-slate-900 dark:text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Share with Peers</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Share direct deep-link or scan QR code</p>
          </div>
        </div>

        {/* Resource Mini Summary Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 mb-5 shadow-2xs">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">{uniLabel}</span>
            <span>•</span>
            <span>{resource.program}</span>
            <span>•</span>
            <span>Sem {resource.semester}</span>
            <span>•</span>
            <span>Year {resource.year}</span>
          </div>
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">{resource.title}</div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleTelegram}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-600/20 hover:bg-cyan-100 dark:hover:bg-cyan-600/30 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            <Send className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Telegram</span>
          </button>
        </div>

        {/* Direct Link Copy Input */}
        <div className="space-y-1.5 mb-5">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Direct Link</label>
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 flex-1 outline-none font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                  : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 border border-emerald-300 dark:border-emerald-500/40'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* QR Code toggle */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <span>{showQR ? 'Hide QR Code' : 'Scan on Mobile (QR Code)'}</span>
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              {showQR ? '▲' : '▼'}
            </span>
          </button>

          {showQR && (
            <div className="mt-3 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
              <img
                src={qrSvgUrl}
                alt="QR Code"
                className="w-40 h-40 rounded-lg p-2 bg-white border border-emerald-300 dark:border-emerald-500/30 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Point mobile camera to open &amp; save offline immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
