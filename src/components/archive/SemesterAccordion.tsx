import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  HardDrive,
  Share2,
  Eye,
  Video,
  Link,
} from 'lucide-react';
import { Resource, SemesterNumber } from '../../types';
import { SUBJECTS } from '../../data/curriculumData';

interface SemesterAccordionProps {
  resources: Resource[];
  isOfflineMap: Record<string, boolean>;
  onToggleOffline: (resource: Resource) => void;
  onView: (resource: Resource) => void;
  onShare: (resource: Resource) => void;
  selectedUniversity: string;
}

export const SemesterAccordion: React.FC<SemesterAccordionProps> = ({
  resources,
  isOfflineMap,
  onToggleOffline,
  onView,
  onShare,
  selectedUniversity,
}) => {
  const semesters: SemesterNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];
  const [openSemesters, setOpenSemesters] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const toggleSemester = (sem: number) => {
    setOpenSemesters((prev) => ({
      ...prev,
      [sem]: !prev[sem],
    }));
  };

  return (
    <div className="space-y-4">
      {semesters.map((sem) => {
        const semResources = resources.filter((r) => r.semester === sem);
        const semSubjects = SUBJECTS.filter((s) => {
          if (selectedUniversity === 'ALL') return s.semester === sem;
          return s.semester === sem && s.university === selectedUniversity;
        });

        const isOpen = !!openSemesters[sem];

        return (
          <div
            key={sem}
            className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
          >
            {/* Semester Header Accordion Trigger */}
            <button
              onClick={() => toggleSemester(sem)}
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  {sem}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Semester {sem}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {semResources.length} {semResources.length === 1 ? 'Resource' : 'Resources'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {semSubjects.length > 0
                      ? `${semSubjects.length} Core Subjects (C Programming, Math, Architecture...)`
                      : 'Past questions, model sets, and syllabus modules'}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-2xs">
                {isOpen ? <ChevronDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </button>

            {/* Semester Content Tree */}
            {isOpen && (
              <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/50 space-y-4 animate-in fade-in duration-200">
                {semResources.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                    No resources currently loaded for Semester {sem} under this filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {semResources.map((res) => {
                      const isOffline = !!isOfflineMap[res.id];

                      return (
                        <div
                          key={res.id}
                          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/50 transition flex flex-col justify-between group shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                                {res.code}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                {res.university === 'RJU_BCA' ? 'RJU BCA' : res.university} • Year {res.year}
                              </span>
                            </div>

                            <h4
                              onClick={() => onView(res)}
                              className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition cursor-pointer line-clamp-2"
                            >
                              {res.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{res.subjectTitle}</p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              {res.solutionVideoLink && (
                                <span className="text-[10px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-500/20">
                                  Video
                                </span>
                              )}
                              {res.solutionWebLink && (
                                <span className="text-[10px] font-medium text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/20">
                                  Site Link
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                {res.format.toUpperCase()}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onToggleOffline(res)}
                                className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                  isOffline
                                    ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                                }`}
                                title={isOffline ? 'Saved Offline' : 'Save Offline'}
                              >
                                <HardDrive className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onShare(res)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 transition cursor-pointer"
                                title="Share"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onView(res)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold transition cursor-pointer shadow-2xs"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Read</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
