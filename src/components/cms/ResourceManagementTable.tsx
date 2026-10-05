import React, { useState } from 'react';
import {
  Search,
  CheckSquare,
  Square,
  Trash2,
  Copy,
  Eye,
  FileText,
  HardDrive,
  AlertTriangle,
  X,
  Check,
  Plus,
} from 'lucide-react';
import { Resource, UniversityCode, UserProfile } from '../../types';

interface ResourceManagementTableProps {
  resources: Resource[];
  currentUser: UserProfile;
  onOpenUpload?: () => void;
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
  const [selectedUniFilter, setSelectedUniFilter] = useState<string>('ALL');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isBatchConfirming, setIsBatchConfirming] = useState(false);

  const filtered = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.subjectTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUni = selectedUniFilter === 'ALL' || res.university === selectedUniFilter;
    const matchesSem =
      selectedSemesterFilter === 'ALL' || res.semester.toString() === selectedSemesterFilter;

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

  const handleExecuteBatchDelete = () => {
    selectedIds.forEach((id) => onDeleteResource(id));
    setSelectedIds([]);
    setIsBatchConfirming(false);
  };

  const handleExecuteSingleDelete = (id: string) => {
    onDeleteResource(id);
    setConfirmDeleteId(null);
    setSelectedIds((prev) => prev.filter((i) => i !== id));
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
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
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
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          {onOpenUpload && (
            <button
              type="button"
              onClick={onOpenUpload}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
          )}
        </div>
      </div>

      {/* Batch Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-4 rounded-xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <span className="font-semibold">
            {selectedIds.length} document{selectedIds.length > 1 ? 's' : ''} selected
          </span>

          <div className="flex items-center gap-2">
            {!isBatchConfirming ? (
              <button
                type="button"
                onClick={() => setIsBatchConfirming(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-500/40 p-1 px-2.5 rounded-lg">
                <span className="text-[11px] text-rose-200 font-bold">Confirm delete permanently?</span>
                <button
                  type="button"
                  onClick={handleExecuteBatchDelete}
                  className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsBatchConfirming(false)}
                  className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {selectedIds.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Curriculum / Course</th>
                <th className="py-3 px-4">Storage Path</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No resources found matching the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => {
                  const isSelected = selectedIds.includes(res.id);
                  const isDeletingThis = confirmDeleteId === res.id;

                  return (
                    <tr
                      key={res.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                        isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleSelectOne(res.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div className="font-semibold line-clamp-1">{res.title}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {res.code} • {res.subjectTitle}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
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
                          <span className="text-slate-400">Local Storage</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {res.year}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
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
                        {isDeletingThis ? (
                          <div className="flex items-center justify-end gap-1.5 animate-in fade-in duration-100">
                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                              Delete?
                            </span>
                            <button
                              type="button"
                              onClick={() => handleExecuteSingleDelete(res.id)}
                              className="p-1 px-2 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer shadow-xs"
                              title="Confirm Permanent Deletion"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1 px-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] hover:bg-slate-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1-Click Course Adaption */}
                            <button
                              type="button"
                              onClick={() => onOpenCrossUniversityCopy(res)}
                              className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/15 hover:bg-teal-100 dark:hover:bg-teal-500/25 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 transition cursor-pointer"
                              title="1-Click Adapt / Clone to Another Course"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* View in Document Modal */}
                            <button
                              type="button"
                              onClick={() => onViewResource(res)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                              title="Preview Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Resource */}
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(res.id)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-500 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-400 transition cursor-pointer"
                              title="Delete Resource from Archive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
