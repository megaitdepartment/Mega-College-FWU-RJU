import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Clock, FileText, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { Resource } from '../../types';
import { offlineStorage } from '../../utils/offlineStorage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  onSelectResource: (resource: Resource) => void;
  onSearchLogged?: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  resources,
  onSelectResource,
  onSearchLogged,
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(offlineStorage.getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? resources.filter((r) => {
        const q = query.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.subjectTitle.toLowerCase().includes(q) ||
          (r.university === 'RJU_BCA' ? 'rju bca bca' : r.university.toLowerCase()).includes(q) ||
          r.program.toLowerCase().includes(q) ||
          r.year.toString().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSelect = (resource: Resource) => {
    offlineStorage.addRecentSearch(query.trim() || resource.title);
    onSearchLogged?.(query.trim() || resource.title);
    onSelectResource(resource);
    onClose();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    onSearchLogged?.(term);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-900 dark:text-slate-100">
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 gap-3">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered.length > 0) {
                handleSelect(filtered[0]);
              }
            }}
            placeholder="Search FWU B.Sc.CSIT, RJU B.Sc.CSIT, RJU BCA questions, subject codes, years..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 border border-slate-200 dark:border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query && (
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Recent Searches
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{term}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Popular Topics */}
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  Popular Courses &amp; Programs
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { title: 'FWU B.Sc.CSIT 1st Sem C Programming', query: 'FWU C Programming 2080' },
                    { title: 'RJU B.Sc.CSIT 3rd Sem DSA', query: 'RJU DSA 2080' },
                    { title: 'RJU BCA 3rd Sem Web Technology', query: 'RJU BCA Web Technology' },
                    { title: 'RJU BCA 2nd Sem C Programming', query: 'RJU BCA C Programming' },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => handleRecentClick(item.query)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                        {item.title}
                      </span>
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If query has matches */}
          {query && filtered.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
                Found {filtered.length} matching resources:
              </div>
              {filtered.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleSelect(res)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/20">
                          {res.university === 'RJU_BCA' ? 'RJU BCA' : res.university}
                        </span>
                        <span>{res.program}</span>
                        <span>•</span>
                        <span>Sem {res.semester}</span>
                        <span>•</span>
                        <span>{res.year}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition truncate">
                        {res.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {res.subjectTitle} ({res.code}) • {res.category.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}

          {/* If query has NO matches */}
          {query && filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No resources found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching for specific subject codes like "CSC102", "BCA151", "C Programming", "2080", or "RJU BCA".
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tip: Papers can be saved for offline reading anytime.</span>
          <span className="hidden sm:inline">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
