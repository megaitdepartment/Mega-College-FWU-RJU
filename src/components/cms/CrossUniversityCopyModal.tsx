import React, { useState } from 'react';
import {
  X,
  Copy,
  ArrowRight,
  HardDrive,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ProgramCode, Resource, SemesterNumber, UniversityCode } from '../../types';
import { UNIVERSITIES, SUBJECTS } from '../../data/curriculumData';
import { generateGoogleDrivePath } from '../../services/googleDriveService';

interface CrossUniversityCopyModalProps {
  sourceResource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyResource: (
    sourceId: string,
    targetUniversity: UniversityCode,
    targetProgram: ProgramCode,
    targetSemester: SemesterNumber,
    newTitle: string,
    newSubjectId: string,
    newCode: string
  ) => void;
}

export const CrossUniversityCopyModal: React.FC<CrossUniversityCopyModalProps> = ({
  sourceResource,
  isOpen,
  onClose,
  onCopyResource,
}) => {
  if (!isOpen || !sourceResource) return null;

  const [targetUni, setTargetUni] = useState<UniversityCode>(
    sourceResource.university === 'FWU' ? 'RJU' : sourceResource.university === 'RJU' ? 'RJU_BCA' : 'FWU'
  );
  const [targetProgram, setTargetProgram] = useState<ProgramCode>(
    targetUni === 'RJU_BCA' ? 'BCA' : 'BSc_CSIT'
  );
  const [targetSemester, setTargetSemester] = useState<SemesterNumber>(sourceResource.semester);
  
  const availableTargetSubjects = SUBJECTS.filter(
    (s) => s.university === targetUni && s.semester === targetSemester
  );

  const defaultTargetSubject = availableTargetSubjects[0] || null;
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    defaultTargetSubject ? defaultTargetSubject.id : ''
  );
  const [customTitle, setCustomTitle] = useState(
    `${targetUni === 'RJU_BCA' ? 'RJU BCA' : targetUni + ' B.Sc.CSIT'} Sem ${targetSemester} ${sourceResource.subjectTitle} (Cross-Curriculum Adaption)`
  );

  const handleUniversityChange = (uni: UniversityCode) => {
    setTargetUni(uni);
    const prog: ProgramCode = uni === 'RJU_BCA' ? 'BCA' : 'BSc_CSIT';
    setTargetProgram(prog);
    const matchingSubjects = SUBJECTS.filter((s) => s.university === uni && s.semester === targetSemester);
    const uniLabel = uni === 'RJU_BCA' ? 'RJU BCA' : `${uni} B.Sc.CSIT`;

    if (matchingSubjects.length > 0) {
      setSelectedSubjectId(matchingSubjects[0].id);
      setCustomTitle(`${uniLabel} Sem ${targetSemester} ${matchingSubjects[0].title} Board Question Set`);
    } else {
      setCustomTitle(`${uniLabel} Sem ${targetSemester} ${sourceResource.subjectTitle}`);
    }
  };

  const handleSemesterChange = (sem: SemesterNumber) => {
    setTargetSemester(sem);
    const matchingSubjects = SUBJECTS.filter((s) => s.university === targetUni && s.semester === sem);
    const uniLabel = targetUni === 'RJU_BCA' ? 'RJU BCA' : `${targetUni} B.Sc.CSIT`;

    if (matchingSubjects.length > 0) {
      setSelectedSubjectId(matchingSubjects[0].id);
      setCustomTitle(`${uniLabel} Sem ${sem} ${matchingSubjects[0].title} Board Question Set`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSub = SUBJECTS.find((s) => s.id === selectedSubjectId);
    const newCode = targetSub ? targetSub.code : sourceResource.code;

    onCopyResource(
      sourceResource.id,
      targetUni,
      targetProgram,
      targetSemester,
      customTitle,
      selectedSubjectId || sourceResource.subjectId,
      newCode
    );
    onClose();
  };

  const expectedNewDrivePath = generateGoogleDrivePath(
    targetUni,
    targetProgram,
    targetSemester,
    availableTargetSubjects.find((s) => s.id === selectedSubjectId)?.title || sourceResource.subjectTitle,
    sourceResource.category,
    sourceResource.attachedQuestionFile ? sourceResource.attachedQuestionFile.name : `${sourceResource.code}_cloned.pdf`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/15 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 flex items-center justify-center">
            <Copy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1-Click Cross-Course Adaption
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clone materials across FWU B.Sc.CSIT ↔ RJU B.Sc.CSIT ↔ RJU BCA
            </p>
          </div>
        </div>

        {/* Source Resource Information */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4 text-xs shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            Source Document:
          </div>
          <div className="font-bold text-slate-800 dark:text-slate-200">{sourceResource.title}</div>
          <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
            {sourceResource.university === 'RJU_BCA' ? 'RJU BCA' : sourceResource.university} • Sem {sourceResource.semester} • {sourceResource.code}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Course Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              1. Target Academic Program / Course:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleUniversityChange('FWU')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  targetUni === 'FWU'
                    ? 'bg-emerald-500 text-white dark:text-slate-950 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                FWU B.Sc.CSIT
              </button>
              <button
                type="button"
                onClick={() => handleUniversityChange('RJU')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  targetUni === 'RJU'
                    ? 'bg-cyan-500 text-white dark:text-slate-950 border-cyan-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                RJU B.Sc.CSIT
              </button>
              <button
                type="button"
                onClick={() => handleUniversityChange('RJU_BCA')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  targetUni === 'RJU_BCA'
                    ? 'bg-indigo-500 text-white dark:text-slate-950 border-indigo-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                RJU BCA
              </button>
            </div>
          </div>

          {/* Target Semester Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              2. Target Semester:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {([1, 2, 3, 4, 5, 6, 7, 8] as SemesterNumber[]).map((sem) => (
                <button
                  type="button"
                  key={sem}
                  onClick={() => handleSemesterChange(sem)}
                  className={`p-2 rounded-lg border text-center font-bold transition cursor-pointer ${
                    targetSemester === sem
                      ? 'bg-emerald-500 text-white dark:text-slate-950 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Target Subject Mapping */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              3. Map to Equivalent Subject:
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                const sub = availableTargetSubjects.find((s) => s.id === e.target.value);
                const uniLabel = targetUni === 'RJU_BCA' ? 'RJU BCA' : `${targetUni} B.Sc.CSIT`;
                if (sub) {
                  setCustomTitle(`${uniLabel} Sem ${targetSemester} ${sub.title} Exam Archive`);
                }
              }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              {availableTargetSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} - {sub.title} ({sub.creditHours} Cr)
                </option>
              ))}
            </select>
          </div>

          {/* Cloned Title Field */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              4. Cloned Document Title:
            </label>
            <input
              type="text"
              required
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none font-medium"
            />
          </div>

          {/* Google Drive Path Preview */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/20 text-[11px] space-y-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              Target Google Drive Folder:
            </span>
            <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all">
              {expectedNewDrivePath}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Clone to {targetUni === 'RJU_BCA' ? 'RJU BCA' : targetUni}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
