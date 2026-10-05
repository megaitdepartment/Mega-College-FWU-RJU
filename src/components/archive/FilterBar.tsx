import React from 'react';
import {
  FileQuestion,
  FileText,
  BookOpen,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  FolderTree,
} from 'lucide-react';
import { FilterState, ResourceCategory, SemesterNumber } from '../../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  viewMode: 'grid' | 'list' | 'tree';
  onChangeViewMode: (mode: 'grid' | 'list' | 'tree') => void;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onChangeViewMode,
  totalFilteredCount,
}) => {
  const categories: { id: ResourceCategory | 'ALL'; label: string; icon: any }[] = [
    { id: 'ALL', label: 'All Resources', icon: SlidersHorizontal },
    { id: 'question_paper', label: 'Old Questions', icon: FileQuestion },
    { id: 'model_paper', label: 'Model Papers', icon: Sparkles },
    { id: 'solution', label: 'Solved Banks', icon: CheckCircle2 },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'lecture_notes', label: 'Notes', icon: FileText },
  ];

  const semesters: (SemesterNumber | 'ALL')[] = ['ALL', 1, 2, 3, 4, 5, 6, 7, 8];
  const years = ['ALL', 2081, 2080, 2079, 2078, 2077, 2076];

  const isFiltered =
    filters.university !== 'ALL' ||
    filters.program !== 'ALL' ||
    filters.semester !== 'ALL' ||
    filters.category !== 'ALL' ||
    filters.year !== 'ALL' ||
    filters.verifiedOnly ||
    filters.solutionsOnly;

  return (
    <div className="bg-white/95 dark:bg-slate-900/90 border-y border-slate-200 dark:border-slate-800/80 sticky top-14 sm:top-16 z-30 backdrop-blur-md transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 space-y-2.5 max-w-full">
        {/* Row 1: Category Chips & View Mode Switcher */}
        <div className="flex items-center justify-between gap-2 w-full max-w-full min-w-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 min-w-0 flex-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ category: cat.id })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-emerald-500 text-white dark:text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-950/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => onChangeViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('tree')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'tree'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Semester Curriculum Tree View"
            >
              <FolderTree className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Course / University Filter & Semester Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-xs w-full max-w-full min-w-0">
          {/* Semester Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0 w-full sm:w-auto min-w-0 max-w-full">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Semester:
            </span>
            {semesters.map((sem) => {
              const isSelected = filters.semester === sem;
              return (
                <button
                  key={String(sem)}
                  onClick={() => onFilterChange({ semester: sem })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/50'
                      : 'bg-slate-100 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-slate-200 dark:border-slate-800/80'
                  }`}
                >
                  {sem === 'ALL' ? 'All' : `Sem ${sem}`}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Year & Reset */}
          <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap w-full sm:w-auto">
            {/* Year selector */}
            <select
              value={filters.year}
              onChange={(e) =>
                onFilterChange({ year: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) })
              }
              className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer shadow-2xs font-mono"
            >
              <option value="ALL">All Exam Years</option>
              {years.filter((y) => y !== 'ALL').map((y) => (
                <option key={String(y)} value={y}>
                  Year {y}
                </option>
              ))}
            </select>

            {/* Reset Filters button */}
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Results count pill */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium ml-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{totalFilteredCount}</span> items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
