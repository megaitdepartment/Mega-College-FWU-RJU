import React from 'react';
import {
  BarChart3,
  TrendingUp,
  HardDrive,
  Share2,
  Search,
  Eye,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { AnalyticsSummary, Resource } from '../../types';

interface AnalyticsViewProps {
  summary: AnalyticsSummary;
  resources: Resource[];
  onViewResource: (resource: Resource) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary,
  resources,
  onViewResource,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Total Resource Views</span>
            <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalViews.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">↑ 18.4% this exam season</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Offline Vault Saves</span>
            <HardDrive className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalOfflineSaves.toLocaleString()}</div>
          <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">IndexedDB active storage</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Peer Shares &amp; Links</span>
            <Share2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalShares.toLocaleString()}</div>
          <div className="text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold">WhatsApp &amp; Telegram shares</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Cross-Course Clones</span>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalCopies}</div>
          <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold">FWU ↔ RJU ↔ RJU BCA mapped</div>
        </div>
      </div>

      {/* Program & University Distribution Visual Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* University Views Share */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Traffic by University Program</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'FWU (Far Western University)', count: summary.viewsByUniversity['FWU'] || 8900, color: 'bg-emerald-500' },
              { label: 'RJU (Rajarshi Janak University)', count: summary.viewsByUniversity['RJU'] || 6700, color: 'bg-cyan-500' },
              { label: 'RJU BCA (Rajarshi Janak University)', count: summary.viewsByUniversity['RJU_BCA'] || 8000, color: 'bg-indigo-500' },
              { label: 'Mega College Internal Repository', count: summary.viewsByUniversity['MEGA'] || 3400, color: 'bg-teal-500' },
            ].map((item) => {
              const max = 10000;
              const pct = Math.min(100, Math.round((item.count / max) * 100));

              return (
                <div key={item.label} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count.toLocaleString()} views</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Searched Keywords */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Top Student Search Queries</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {summary.topSearchedKeywords.map((item, idx) => (
              <div
                key={item.keyword}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.keyword}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                  {item.count} searches
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Popular Question Papers */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Most High-Demand Papers &amp; Solved Sets</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Document Title</th>
                <th className="py-2.5 px-4">Views</th>
                <th className="py-2.5 px-4">Offline Vault Saves</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {summary.mostPopularResources.map((item) => {
                const res = resources.find((r) => r.id === item.id);

                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-200">{item.title}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      {item.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-teal-700 dark:text-teal-400 font-bold">
                      {item.saves.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {res && (
                        <button
                          onClick={() => onViewResource(res)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold shadow-2xs"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
