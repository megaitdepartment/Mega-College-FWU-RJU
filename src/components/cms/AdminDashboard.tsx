import React, { useState } from 'react';
import {
  Layers,
  BarChart3,
  Shield,
  Upload,
  HardDrive,
  Users,
  ArrowLeft,
  FolderTree,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { AnalyticsSummary, Resource, UserProfile } from '../../types';
import { ResourceManagementTable } from './ResourceManagementTable';
import { AnalyticsView } from './AnalyticsView';

interface AdminDashboardProps {
  resources: Resource[];
  currentUser: UserProfile;
  summary: AnalyticsSummary;
  onBackToArchive: () => void;
  onOpenUpload: () => void;
  onOpenCrossUniversityCopy: (resource: Resource) => void;
  onOpenFacultyManager: () => void;
  onViewResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
  onToggleStatus: (resourceId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  resources,
  currentUser,
  summary,
  onBackToArchive,
  onOpenUpload,
  onOpenCrossUniversityCopy,
  onOpenFacultyManager,
  onViewResource,
  onDeleteResource,
  onToggleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'drive' | 'analytics'>('resources');

  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToArchive}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500/40 transition cursor-pointer shadow-2xs"
            title="Back to Public Archive"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Mega College Admin CMS Portal</span>
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] sm:text-xs font-bold border ${
                  isSuperAdmin
                    ? 'bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/30'
                    : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30'
                }`}
              >
                {isSuperAdmin ? 'Super Admin' : 'Faculty Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Google Drive Cloud Storage • FWU B.Sc.CSIT ↔ RJU B.Sc.CSIT ↔ RJU BCA
            </p>
          </div>
        </div>

        {/* Global CMS Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Super Admin Faculty Account Management */}
          {isSuperAdmin && (
            <button
              onClick={onOpenFacultyManager}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <Users className="w-4 h-4" />
              <span>Manage Faculty Admins</span>
            </button>
          )}

          {currentUser.permissions.canUpload && (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Upload className="w-4 h-4" />
              <span>Upload to Google Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'resources'
              ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catalog &amp; Course Cloner ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'drive'
              ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Google Drive Structured Hierarchy</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics &amp; Resource Insights</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'resources' && (
        <ResourceManagementTable
          resources={resources}
          currentUser={currentUser}
          onOpenUpload={onOpenUpload}
          onOpenCrossUniversityCopy={onOpenCrossUniversityCopy}
          onViewResource={onViewResource}
          onDeleteResource={onDeleteResource}
          onToggleStatus={onToggleStatus}
        />
      )}

      {/* Google Drive Structure View */}
      {activeTab === 'drive' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Google Drive Structured Storage Architecture
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                Root: Mega Document Drive
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All question papers, model sets, and syllabi are systematically organized into course-specific and semester-specific folders in Google Drive:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-emerald-700 dark:text-emerald-400">1. FWU B.Sc.CSIT</div>
                <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div>📁 Mega Document Drive</div>
                  <div>&nbsp;↳ 📁 FWU B.Sc.CSIT</div>
                  <div>&nbsp;&nbsp;&nbsp;↳ 📁 1st semester to 8th semester</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ 📁 Subject / Old Questions</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-cyan-700 dark:text-cyan-400">2. RJU B.Sc.CSIT</div>
                <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div>📁 Mega Document Drive</div>
                  <div>&nbsp;↳ 📁 RJU B.Sc.CSIT</div>
                  <div>&nbsp;&nbsp;&nbsp;↳ 📁 1st semester to 8th semester</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ 📁 Subject / Old Questions</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-indigo-700 dark:text-indigo-400">3. RJU BCA</div>
                <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div>📁 Mega Document Drive</div>
                  <div>&nbsp;↳ 📁 RJU BCA</div>
                  <div>&nbsp;&nbsp;&nbsp;↳ 📁 1st semester to 8th semester</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ 📁 Subject / Old Questions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <AnalyticsView
          summary={summary}
          resources={resources}
          onViewResource={onViewResource}
        />
      )}
    </div>
  );
};
