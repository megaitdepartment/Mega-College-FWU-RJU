import React from 'react';
import {
  FileText,
  HardDrive,
  Share2,
  CheckCircle,
  Eye,
  Sparkles,
  Copy,
  ArrowUpRight,
  Video,
  Link,
  ExternalLink,
} from 'lucide-react';
import { Resource } from '../../types';

interface ResourceCardProps {
  resource: Resource;
  isOffline: boolean;
  onToggleOffline: (resource: Resource) => void;
  onView: (resource: Resource) => void;
  onShare: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isOffline,
  onToggleOffline,
  onView,
  onShare,
}) => {
  const categoryBadgeColors: Record<string, string> = {
    question_paper: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    model_paper: 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30',
    solution: 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30',
    syllabus: 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    lecture_notes: 'bg-teal-50 dark:bg-teal-500/15 text-teal-800 dark:text-teal-400 border-teal-200 dark:border-teal-500/30',
    lab_manual: 'bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-500/30',
  };

  const getUniversityBadge = (uni: string) => {
    if (uni === 'FWU') {
      return {
        label: 'FWU CSIT',
        color: 'text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40',
      };
    }
    if (uni === 'RJU') {
      return {
        label: 'RJU CSIT',
        color: 'text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-500/40',
      };
    }
    if (uni === 'RJU_BCA') {
      return {
        label: 'RJU BCA',
        color: 'text-indigo-800 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-500/40',
      };
    }
    return {
      label: 'MEGA',
      color: 'text-teal-800 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60 border-teal-300 dark:border-teal-500/40',
    };
  };

  const uniBadge = getUniversityBadge(resource.university);

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 min-w-0 w-full max-w-full">
      {/* Visual Header / Thumbnail */}
      <div
        onClick={() => onView(resource)}
        className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer group-hover:opacity-95 transition"
      >
        {resource.previewImages && resource.previewImages[0] ? (
          <img
            src={resource.previewImages[0]}
            alt={resource.title}
            className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-400 dark:text-slate-600">
            <FileText className="w-10 h-10 mb-2 text-emerald-500/50" />
            <span className="text-xs font-mono">{resource.code}</span>
          </div>
        )}

        {/* Paper format overlay badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Badges on Thumbnail */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm backdrop-blur-sm ${uniBadge.color}`}
          >
            {uniBadge.label}
          </span>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-black/60 text-white border border-white/20 backdrop-blur-sm">
            Sem {resource.semester}
          </span>
        </div>

        {/* Year Pill & Format */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-black/70 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
            {resource.year}
          </span>
        </div>

        {/* Hover View Button prompt */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 text-white dark:text-slate-950 text-xs font-bold shadow-md">
          <Eye className="w-3.5 h-3.5" />
          <span>Read Paper</span>
        </div>

        {/* Google Drive Synced Badge */}
        {resource.googleDrivePath && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold backdrop-blur-sm">
            <HardDrive className="w-3 h-3 text-emerald-400" />
            <span>Google Drive</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Subject & Category info */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                categoryBadgeColors[resource.category] || 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {resource.category.replace('_', ' ')}
            </span>
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
              {resource.code}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onView(resource)}
            className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition cursor-pointer line-clamp-2 leading-snug"
          >
            {resource.title}
          </h3>

          {/* Subtitle / Subject */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {resource.subjectTitle}
          </p>

          {/* Solution & Reference Badges */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-[11px]">
            {resource.solutionVideoLink && (
              <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-500/20">
                <Video className="w-3 h-3 text-rose-600" />
                <span>Video Solution</span>
              </span>
            )}

            {resource.solutionWebLink && (
              <span className="flex items-center gap-1 text-cyan-800 dark:text-cyan-400 font-medium bg-cyan-50 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/20">
                <Link className="w-3 h-3 text-cyan-600" />
                <span>Site Solution</span>
              </span>
            )}

            <span className="text-slate-400 dark:text-slate-500 font-mono">
              {resource.format.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {/* Offline Save Toggle */}
          <button
            onClick={() => onToggleOffline(resource)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs ${
              isOffline
                ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-950/60 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800'
            }`}
            title={isOffline ? 'Saved in Offline Storage' : 'Save for Offline Reading'}
          >
            <HardDrive className={`w-3.5 h-3.5 ${isOffline ? 'text-white dark:text-slate-950' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span>{isOffline ? 'Offline Ready' : 'Save Offline'}</span>
          </button>

          {/* Share & Open Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onShare(resource)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition cursor-pointer shadow-2xs"
              title="Share Link & QR"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onView(resource)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 transition cursor-pointer shadow-2xs"
              title="Open Document Viewer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
