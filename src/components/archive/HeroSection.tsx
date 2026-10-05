import React from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle,
  HardDrive,
  Share2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ProgramCode, UniversityCode } from '../../types';

interface HeroSectionProps {
  selectedUniversity: UniversityCode | 'ALL';
  onSelectUniversity: (uni: UniversityCode | 'ALL') => void;
  selectedProgram: ProgramCode | 'ALL';
  onSelectProgram: (prog: ProgramCode | 'ALL') => void;
  onOpenSearch: () => void;
  totalResources: number;
  totalSolutions: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedUniversity,
  onSelectUniversity,
  onSelectProgram,
  totalResources,
}) => {
  return (
    <div className="relative overflow-hidden pt-6 sm:pt-8 pb-8 sm:pb-10 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 transition-colors w-full max-w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 max-w-full bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-64 sm:w-96 h-64 sm:h-96 max-w-full bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 w-full max-w-full">
        {/* Top Tag */}
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-[11px] sm:text-xs font-semibold shadow-xs text-center">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">Mega College Official Academic Archive &amp; Question Bank</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto px-1">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Past Papers, Syllabi &amp; References for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              FWU, RJU &amp; RJU BCA
            </span>
          </h1>
          <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Curated repository of Far Western University (FWU) B.Sc.CSIT, Rajarshi Janak University (RJU) B.Sc.CSIT, and RJU BCA old questions, model sets, and verified video/web references organized in Google Drive.
          </p>
        </div>

        {/* Primary University Selector Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
          {/* FWU Card */}
          <button
            onClick={() => {
              onSelectUniversity('FWU');
              onSelectProgram('BSc_CSIT');
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
              selectedUniversity === 'FWU'
                ? 'bg-emerald-50/90 dark:bg-gradient-to-br dark:from-emerald-950/60 dark:to-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                : 'bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                FWU CSIT
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
              Far Western University
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              B.Sc.CSIT 1st to 8th Sem board papers, model questions &amp; syllabi.
            </p>
          </button>

          {/* RJU Card */}
          <button
            onClick={() => {
              onSelectUniversity('RJU');
              onSelectProgram('BSc_CSIT');
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
              selectedUniversity === 'RJU'
                ? 'bg-cyan-50/90 dark:bg-gradient-to-br dark:from-cyan-950/60 dark:to-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500'
                : 'bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
                RJU CSIT
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition">
              Rajarshi Janak University
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              B.Sc.CSIT structured curriculum, past questions &amp; Google Drive archives.
            </p>
          </button>

          {/* RJU BCA Card */}
          <button
            onClick={() => {
              onSelectUniversity('RJU_BCA');
              onSelectProgram('BCA');
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
              selectedUniversity === 'RJU_BCA'
                ? 'bg-indigo-50/90 dark:bg-gradient-to-br dark:from-indigo-950/60 dark:to-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                RJU BCA ARCHIVE
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
              RJU BCA
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Rajarshi Janak University BCA semester papers, unit tests &amp; project code.
            </p>
          </button>
        </div>

        {/* Feature Highlights Ribbon */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Structured Archive (Sem 1 to 8)</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Google Drive Structured Hierarchy</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Peer Deep-Linking &amp; QR Sharing</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Super Admin &amp; Faculty Admin RBAC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
