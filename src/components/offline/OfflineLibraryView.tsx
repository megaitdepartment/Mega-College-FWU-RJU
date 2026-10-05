import React from 'react';
import {
  HardDrive,
  Trash2,
  BookOpen,
  ArrowLeft,
  Sparkles,
  WifiOff,
  CheckCircle2,
  Share2,
  Eye,
  FileQuestion,
  Layers,
  Smartphone,
} from 'lucide-react';
import { OfflineStoredItem, Resource } from '../../types';
import { ResourceCard } from '../archive/ResourceCard';

interface OfflineLibraryViewProps {
  offlineItems: OfflineStoredItem[];
  onViewResource: (resource: Resource) => void;
  onRemoveOffline: (resourceId: string) => void;
  onClearAllOffline: () => void;
  onShareResource: (resource: Resource) => void;
  onBackToArchive: () => void;
  storageUsage: { usedMB: string; count: number };
}

export const OfflineLibraryView: React.FC<OfflineLibraryViewProps> = ({
  offlineItems,
  onViewResource,
  onRemoveOffline,
  onClearAllOffline,
  onShareResource,
  onBackToArchive,
  storageUsage,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 w-full max-w-full min-w-0">
      {/* Header & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToArchive}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500/40 transition cursor-pointer shadow-2xs"
            title="Back to Questions"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HardDrive className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Offline Reading Vault</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-300 dark:border-emerald-500/30">
                {offlineItems.length} Papers Saved
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Read all cached questions and verified solutions on mobile or desktop without internet.
            </p>
          </div>
        </div>

        {/* Storage Bar & Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {storageUsage.usedMB} MB / 50 MB
            </div>
            <div className="text-[11px] text-slate-500">Local Cache Quota</div>
          </div>

          {offlineItems.length > 0 && (
            <button
              onClick={onClearAllOffline}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Vault</span>
            </button>
          )}
        </div>
      </div>

      {/* Offline Storage Notice Banner */}
      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-800 dark:text-slate-200">
            <strong className="text-emerald-800 dark:text-emerald-300">Seamless Mobile Offline Consumption:</strong>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              These question papers, solutions, and formulas are stored in your device's persistent cache. You can open them during study sessions, transit, or power cuts with zero connectivity.
            </p>
          </div>
        </div>
      </div>

      {/* Offline Content List */}
      {offlineItems.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 flex items-center justify-center mx-auto mb-4">
            <HardDrive className="w-8 h-8 text-emerald-500/50" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Your Offline Vault is Empty</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Browse the FWU B.Sc.CSIT, RJU B.Sc.CSIT, or RJU BCA collection and click <strong>"Save Offline"</strong> on any question paper or syllabus to access it here anytime.
          </p>
          <button
            onClick={onBackToArchive}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white dark:text-slate-950 text-xs font-bold hover:bg-emerald-600 dark:hover:bg-emerald-400 transition cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Question Bank</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offlineItems.map((item) => (
            <ResourceCard
              key={item.resource.id}
              resource={item.resource}
              isOffline={true}
              onToggleOffline={() => onRemoveOffline(item.resource.id)}
              onView={onViewResource}
              onShare={onShareResource}
            />
          ))}
        </div>
      )}
    </div>
  );
};
