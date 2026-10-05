import React from 'react';
import { Resource } from '../../types';
import { ResourceCard } from './ResourceCard';
import { SemesterAccordion } from './SemesterAccordion';
import { FileQuestion, HardDrive, Share2, Eye, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface ResourceGridProps {
  resources: Resource[];
  viewMode: 'grid' | 'list' | 'tree';
  isOfflineMap: Record<string, boolean>;
  onToggleOffline: (resource: Resource) => void;
  onView: (resource: Resource) => void;
  onShare: (resource: Resource) => void;
  onResetFilters: () => void;
  selectedUniversity: string;
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  viewMode,
  isOfflineMap,
  onToggleOffline,
  onView,
  onShare,
  onResetFilters,
  selectedUniversity,
}) => {
  if (resources.length === 0) {
    return (
      <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 max-w-lg mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-7 h-7 text-emerald-600 dark:text-emerald-500/60" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Matching Question Papers Found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Try adjusting your semester, program, or university filter, or reset your search parameters to view all available resources.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white dark:text-slate-950 text-xs font-bold hover:bg-emerald-600 dark:hover:bg-emerald-400 transition cursor-pointer shadow-md shadow-emerald-500/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  // 1. Tree Mode
  if (viewMode === 'tree') {
    return (
      <SemesterAccordion
        resources={resources}
        isOfflineMap={isOfflineMap}
        onToggleOffline={onToggleOffline}
        onView={onView}
        onShare={onShare}
        selectedUniversity={selectedUniversity}
      />
    );
  }

  // 2. List Mode (Compact Table View)
  if (viewMode === 'list') {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Subject &amp; Code</th>
                <th className="py-3 px-4">University &amp; Program</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {resources.map((res) => {
                const isOffline = !!isOfflineMap[res.id];

                return (
                  <tr
                    key={res.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-850/60 transition group cursor-pointer"
                  >
                    <td className="py-3 px-4" onClick={() => onView(res)}>
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                        {res.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {res.code} • {res.subjectTitle}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{res.university}</span>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{res.program}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                      Sem {res.semester}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {res.year}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {res.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {res.solutionWebLink || res.solutionVideoLink ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Solved</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Unsolved</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleOffline(res);
                          }}
                          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                            isOffline
                              ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                          }`}
                          title={isOffline ? 'Saved Offline' : 'Save Offline'}
                        >
                          <HardDrive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare(res);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onView(res)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold transition cursor-pointer"
                        >
                          Read
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. Grid Mode (Default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {resources.map((res) => (
        <ResourceCard
          key={res.id}
          resource={res}
          isOffline={!!isOfflineMap[res.id]}
          onToggleOffline={onToggleOffline}
          onView={onView}
          onShare={onShare}
        />
      ))}
    </div>
  );
};
