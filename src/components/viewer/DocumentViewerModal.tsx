import React, { useState, useEffect } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  HardDrive,
  Share2,
  CheckCircle2,
  FileText,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Copy,
  Info,
  Link,
  Video,
  ExternalLink,
  FileCheck,
  Building,
} from 'lucide-react';
import { Resource } from '../../types';

interface DocumentViewerModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  isOffline: boolean;
  onToggleOffline: (resource: Resource) => void;
  onShare: (resource: Resource) => void;
  onViewLogged?: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  resource,
  isOpen,
  onClose,
  isOffline,
  onToggleOffline,
  onShare,
  onViewLogged,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<'paper' | 'solutions' | 'syllabus'>('paper');
  const [paperDarkMode, setPaperDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDownloadExplainer, setShowDownloadExplainer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setZoomLevel(100);
      onViewLogged?.();
    }
  }, [isOpen, resource.id]);

  if (!isOpen) return null;

  const totalPages = resource.pageCount || 3;

  // Extract YouTube embed URL if applicable
  const getEmbedYoutubeUrl = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const youtubeEmbed = getEmbedYoutubeUrl(resource.solutionVideoLink);

  const getUniversityDisplayName = (uni: string) => {
    if (uni === 'FWU') return 'Far Western University';
    if (uni === 'RJU') return 'Rajarshi Janak University';
    if (uni === 'RJU_BCA') return 'Rajarshi Janak University (RJU BCA)';
    return 'Mega College Official Repository';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/90 backdrop-blur-xl sm:p-3 md:p-6 animate-in fade-in duration-200">
      <div
        className={`w-full h-full sm:h-[94vh] sm:max-w-5xl rounded-none sm:rounded-3xl bg-white dark:bg-slate-900 border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 ${
          isFullscreen ? 'sm:max-w-full sm:h-full sm:rounded-none' : ''
        }`}
      >
        {/* Top Control Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90 shrink-0">
          {/* Top Row on Mobile: Code/Title + Close Button */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                {resource.university === 'RJU_BCA' ? 'BCA' : resource.university}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>{resource.code}</span>
                  <span>•</span>
                  <span>{resource.university === 'RJU_BCA' ? 'RJU BCA' : resource.university}</span>
                  <span>•</span>
                  <span>Sem {resource.semester}</span>
                  <span>•</span>
                  <span>{resource.year}</span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                  {resource.title}
                </h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Save Offline */}
              <button
                onClick={() => onToggleOffline(resource)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  isOffline
                    ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold border-emerald-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title={isOffline ? 'Saved in Offline Vault' : 'Save for Offline Reading'}
              >
                <HardDrive className={`w-3.5 h-3.5 ${isOffline ? 'text-white dark:text-slate-950' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span className="hidden md:inline">{isOffline ? 'Saved' : 'Save Offline'}</span>
              </button>

              {/* Share */}
              <button
                onClick={() => onShare(resource)}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Second Row: Tabs Switcher */}
          <div className="flex items-center justify-between sm:justify-start gap-1 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/80 dark:border-slate-800 text-xs overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('paper')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer shrink-0 flex-1 sm:flex-none ${
                activeTab === 'paper'
                  ? 'bg-emerald-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Exam Paper Sheet</span>
            </button>

            <button
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer shrink-0 flex-1 sm:flex-none ${
                activeTab === 'solutions'
                  ? 'bg-emerald-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solutions &amp; References</span>
              {(resource.solutionWebLink || resource.solutionVideoLink) && (
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer shrink-0 flex-1 sm:flex-none ${
                activeTab === 'syllabus'
                  ? 'bg-emerald-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum Blueprint</span>
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Page Selector Rail */}
          {activeTab === 'paper' && (
            <div className="w-full md:w-36 bg-slate-50 dark:bg-slate-950/90 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-2 sm:p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-2 shrink-0 scrollbar-none">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:block mb-1">
                Pages ({totalPages})
              </div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl border text-left transition cursor-pointer shrink-0 md:shrink ${
                    currentPage === p
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="w-6 h-7 sm:w-7 sm:h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {p}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold">Page {p}</div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 hidden md:block">
                      {p === 1 ? 'Section A' : p === 2 ? 'Section B' : 'Section C'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-100/70 dark:bg-slate-950/70 p-2 sm:p-6 flex flex-col items-center justify-start">
            {/* TAB 1: EXAM PAPER SHEET */}
            {activeTab === 'paper' && (
              <div className="w-full max-w-2xl flex flex-col items-center space-y-3 pb-8">
                {/* Floating Toolbar (Zoom & Dark Paper) */}
                <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-md text-xs shadow-md">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                    className="p-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 px-1">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                    className="p-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5" />

                  {/* Dark Mode Inversion Toggle */}
                  <button
                    onClick={() => setPaperDarkMode(!paperDarkMode)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                      paperDarkMode
                        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {paperDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                    <span>{paperDarkMode ? 'Dark' : 'Light'}</span>
                  </button>
                </div>

                {/* High-Fidelity Academic Question Paper Sheet */}
                <div
                  style={{
                    transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                    transformOrigin: 'top center',
                  }}
                  className={`w-full min-h-[500px] p-4 sm:p-8 md:p-10 rounded-2xl transition-all duration-200 border text-xs sm:text-sm select-text break-words ${
                    paperDarkMode
                      ? 'bg-slate-950 text-slate-100 border-slate-800 shadow-2xl'
                      : 'bg-white text-slate-900 border-slate-200 shadow-lg'
                  }`}
                >
                  {/* University Header Crest */}
                  <div className="text-center pb-3 border-b-2 border-slate-900/80 dark:border-slate-300/80 mb-4 space-y-1">
                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      {getUniversityDisplayName(resource.university)}
                    </div>
                    <div className="text-xs sm:text-base font-black tracking-tight uppercase">
                      Office of the Controller of Examinations
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold">
                      {resource.university === 'RJU_BCA'
                        ? 'Bachelor of Computer Application (RJU BCA)'
                        : resource.program === 'BSc_CSIT'
                        ? 'Bachelor of Science in Computer Science & Information Technology (B.Sc.CSIT)'
                        : 'Bachelor of Computer Application (RJU BCA)'}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold pt-0.5">
                      Semester {resource.semester} Examination, {resource.year}
                    </div>
                  </div>

                  {/* Course Details Grid */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] sm:text-xs font-bold pb-2.5 border-b border-dashed border-slate-300 dark:border-slate-700 mb-4">
                    <div>
                      <div>Subject: <span className="font-extrabold">{resource.subjectTitle}</span></div>
                      <div className="font-mono mt-0.5">Code: {resource.code}</div>
                    </div>
                    <div className="sm:text-right">
                      <div>Full Marks: 60 / 80 | Pass Marks: 24 / 32</div>
                      <div className="mt-0.5">Time: 3 Hours</div>
                    </div>
                  </div>

                  {/* Instruction Notice */}
                  <p className="text-[10px] sm:text-[11px] italic text-slate-600 dark:text-slate-400 mb-4 leading-normal">
                    Candidates are required to give their answers in their own words as far as practicable. Figures in margin indicate full marks.
                  </p>

                  {/* Attached File Indicator if present */}
                  {resource.attachedQuestionFile && (
                    <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-emerald-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-bold text-xs">{resource.attachedQuestionFile.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {resource.attachedQuestionFile.type.toUpperCase()} • {resource.attachedQuestionFile.size}
                          </div>
                        </div>
                      </div>
                      {resource.googleDrivePath && (
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                          Sync Ready
                        </span>
                      )}
                    </div>
                  )}

                  {/* Page-Specific Exam Content Representation */}
                  {currentPage === 1 && (
                    <div className="space-y-4">
                      <div className="font-bold uppercase tracking-wide text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-400 pb-1 border-b border-emerald-500/20">
                        Group 'A' - Long Answer Questions (Attempt any TWO) [2 x 10 = 20]
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold">1.</span>
                          <p className="flex-1 font-medium leading-relaxed">
                            Explain the core architecture, memory organization, and computational pipeline of {resource.subjectTitle}. Compare theoretical models with real-world enterprise deployments.
                          </p>
                          <span className="font-bold text-xs shrink-0">[10]</span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold">2.</span>
                          <p className="flex-1 font-medium leading-relaxed">
                            Derive mathematical proofs, state transitions, and pseudocode algorithms for {resource.subjectTitle} optimization.
                          </p>
                          <span className="font-bold text-xs shrink-0">[10]</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="space-y-4">
                      <div className="font-bold uppercase tracking-wide text-[11px] sm:text-xs text-cyan-700 dark:text-cyan-400 pb-1 border-b border-cyan-500/20">
                        Group 'B' - Short Answer Questions (Attempt any EIGHT) [8 x 5 = 40]
                      </div>
                      <div className="space-y-3">
                        {[
                          `Discuss modularization and data abstraction paradigms in ${resource.subjectTitle}.`,
                          `Write an efficient program/pseudocode to demonstrate data validation, error recovery, and unit test cases.`,
                          `Explain indexing, indexing structures, and computational trade-offs.`,
                          `Differentiate between synchronous and asynchronous architectures.`,
                        ].map((text, i) => (
                          <div key={i} className="flex items-start justify-between gap-2">
                            <span className="font-bold">{i + 3}.</span>
                            <p className="flex-1 font-medium leading-relaxed">{text}</p>
                            <span className="font-bold text-xs shrink-0">[5]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentPage >= 3 && (
                    <div className="space-y-4">
                      <div className="font-bold uppercase tracking-wide text-[11px] sm:text-xs text-indigo-700 dark:text-indigo-400 pb-1 border-b border-indigo-500/20">
                        Group 'C' - Practical Application Case Study [10 Marks]
                      </div>
                      <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          Laboratory Scenario &amp; Practical Problem:
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          Design a system architecture diagram and complete working code demonstration for {resource.subjectTitle} based on prescribed university guidelines.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Paper Footer Watermark */}
                  <div className="mt-8 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-mono">
                    <span>Mega College • {resource.university === 'RJU_BCA' ? 'RJU BCA' : resource.university}</span>
                    <span>Page {currentPage} of {totalPages}</span>
                  </div>
                </div>

                {/* Page Navigation Controls */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SOLUTIONS & REFERENCES (No step-by-step text questions) */}
            {activeTab === 'solutions' && (
              <div className="w-full max-w-2xl space-y-4 pb-8 text-xs">
                {/* Location Notice */}
                {resource.googleDrivePath && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                        <HardDrive className="w-4 h-4" />
                        <span>Structured Storage Path</span>
                      </div>
                      {resource.googleDriveWebViewLink && (
                        <a
                          href={resource.googleDriveWebViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] text-cyan-600 hover:underline font-semibold"
                        >
                          <span>Open Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 break-all">
                      {resource.googleDrivePath}
                    </div>
                  </div>
                )}

                {/* 1. Official Web / Site Solution Link */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <Link className="w-4 h-4 text-emerald-600" />
                      <span>Verified Web Solution &amp; Answer Key</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      Faculty Verified
                    </span>
                  </div>

                  {resource.solutionWebLink ? (
                    <div className="space-y-2">
                      <p className="text-slate-600 dark:text-slate-400">
                        Official step-by-step answer key and full documentation hosted on external academic resource portal:
                      </p>
                      <a
                        href={resource.solutionWebLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white dark:text-slate-950 font-bold hover:bg-emerald-600 transition shadow-xs"
                      >
                        <span>Open Verified Solution Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">
                      No external website link provided for this paper yet.
                    </p>
                  )}
                </div>

                {/* 2. Video Walkthrough Solution */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <Video className="w-4 h-4 text-rose-500" />
                      <span>Video Solution &amp; Lecture Walkthrough</span>
                    </div>
                  </div>

                  {youtubeEmbed ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-xs">
                      <iframe
                        src={youtubeEmbed}
                        title="Solution Video Walkthrough"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : resource.solutionVideoLink ? (
                    <a
                      href={resource.solutionVideoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition shadow-xs"
                    >
                      <Video className="w-4 h-4" />
                      <span>Watch Video Solution Walkthrough</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">
                      No video tutorial link currently linked to this question paper.
                    </p>
                  )}
                </div>

                {/* 3. Recommended Textbooks & Reference Citations */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Prescribed Textbook References &amp; Notes</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {resource.referenceNotes || 'Mega College Faculty Compilation & Standard University Prescribed Syllabi.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: CURRICULUM BLUEPRINT */}
            {activeTab === 'syllabus' && (
              <div className="w-full max-w-2xl space-y-4 pb-8">
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-3 shadow-xs">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Curriculum &amp; Exam Blueprint for {resource.subjectTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Course code: <strong className="text-emerald-700 dark:text-emerald-400">{resource.code}</strong>. {getUniversityDisplayName(resource.university)} Semester {resource.semester}.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-500 dark:text-slate-400">Credit Hours:</div>
                      <div className="font-bold text-slate-900 dark:text-white">3 Credit Hours (45 Lecture Hours)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-500 dark:text-slate-400">Assessment Scheme:</div>
                      <div className="font-bold text-slate-900 dark:text-white">Theory: 60/80 Marks | Practical: 20/40 Marks</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
