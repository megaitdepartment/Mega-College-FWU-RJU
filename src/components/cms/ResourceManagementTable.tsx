import React, { useState } from 'react';
import {
  Search,
  Copy,
  Trash2,
  CheckCircle,
  Eye,
  Sparkles,
  FileText,
  PlusCircle,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { Resource, UserProfile } from '../../types';

interface ResourceManagementTableProps {
  resources: Resource[];
  currentUser: UserProfile;
  onOpenUpload: () => void;
  onOpenCrossUniversityCopy: (resource: Resource) => void;
  onViewResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
  onToggleStatus: (resourceId: string) => void;
}

export const ResourceManagementTable: React.FC<ResourceManagementTableProps> = ({
  resources,
  currentUser,
  onOpenUpload,
  onOpenCrossUniversityCopy,
  onViewResource,
  onDeleteResource,
  onToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniFilter, setSelectedUniFilter] = useState('ALL');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = resources.filter((r) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subjectTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUni = selectedUniFilter === 'ALL' || r.university === selectedUniFilter;
    const matchesSem = selectedSemesterFilter === 'ALL' || r.semester === Number(selectedSemesterFilter);

    return matchesSearch && matchesUni && matchesSem;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchDelete = () => {
    if (!currentUser.permissions.canDelete) {
      alert('Only Super Admin is authorized to delete resources from the permanent archive.');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected resources?`)) {
      selectedIds.forEach((id) => onDeleteResource(id));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by title, subject code..."
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-none font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={selectedUniFilter}
            onChange={(e) => setSelectedUniFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="ALL">All Courses</option>
            <option value="FWU">FWU B.Sc.CSIT</option>
            <option value="RJU">RJU B.Sc.CSIT</option>
            <option value="RJU_BCA">RJU BCA</option>
            <option value="MEGA">Mega College</option>
          </select>

          <select
            value={selectedSemesterFilter}
            onChange={(e) => setSelectedSemesterFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          {/* Batch Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-500/30">
                {selectedIds.length} Selected
              </span>
              {currentUser.permissions.canDelete && (
                <button
                  onClick={handleBatchDelete}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-500/25 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected</span>
                </button>
              )}
            </div>
          )}

          {/* Upload New Button */}
          {currentUser.permissions.canUpload && (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 font-bold hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-emerald-600"
                  />
                </th>
                <th className="py-3 px-4">Title &amp; Code</th>
                <th className="py-3 px-4">Course &amp; Sem</th>
                <th className="py-3 px-4">Google Drive Storage</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((res) => {
                const isSelected = selectedIds.includes(res.id);

                return (
                  <tr
                    key={res.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-850/70 transition ${isSelected ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(res.id)}
                        className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-emerald-600"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{res.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {res.code} • {res.subjectTitle}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {res.university === 'RJU_BCA' ? 'RJU BCA' : res.university}
                      </span>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {res.program} • Sem {res.semester}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {res.googleDrivePath ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                          <HardDrive className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[200px]" title={res.googleDrivePath}>
                            {res.googleDrivePath.split('/').slice(-2).join('/')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Local Archive</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {res.year}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onToggleStatus(res.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer border ${
                          res.status === 'published'
                            ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/30'
                        }`}
                      >
                        {res.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1-Click Course Adaption */}
                        {currentUser.permissions.canCopyCrossUniversity && (
                          <button
                            onClick={() => onOpenCrossUniversityCopy(res)}
                            className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/15 hover:bg-teal-100 dark:hover:bg-teal-500/25 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 transition cursor-pointer"
                            title="1-Click Adapt / Clone to Another Course"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* View in Document Modal */}
                        <button
                          onClick={() => onViewResource(res)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete (Super Admin Only) */}
                        {currentUser.permissions.canDelete && (
                          <button
                            onClick={() => onDeleteResource(res.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-500 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-400 transition cursor-pointer"
                            title="Delete Resource (Super Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
