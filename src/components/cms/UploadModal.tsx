import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  BookOpen,
  Link,
  Video,
  HardDrive,
  AlertCircle,
  FileCheck,
  ExternalLink,
} from 'lucide-react';
import {
  ExamType,
  ProgramCode,
  Resource,
  ResourceCategory,
  SemesterNumber,
  UniversityCode,
  UserProfile,
} from '../../types';
import { UNIVERSITIES, SUBJECTS } from '../../data/curriculumData';
import {
  generateGoogleDrivePath,
  uploadToGoogleDrive,
  validateAllowedFileFormat,
} from '../../services/googleDriveService';
import { getAccessToken } from '../../services/authService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveResource: (newResource: Resource) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveResource,
}) => {
  if (!isOpen) return null;

  const [university, setUniversity] = useState<UniversityCode>('FWU');
  const [program, setProgram] = useState<ProgramCode>('BSc_CSIT');
  const [semester, setSemester] = useState<SemesterNumber>(1);
  const [category, setCategory] = useState<ResourceCategory>('question_paper');
  const [year, setYear] = useState<number>(2080);
  const [examType, setExamType] = useState<ExamType>('regular');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Attached question file (PDF or JPG/JPEG/PNG image ONLY)
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // References and External Solutions
  const [solutionWebLink, setSolutionWebLink] = useState('');
  const [solutionVideoLink, setSolutionVideoLink] = useState('');
  const [referenceNotes, setReferenceNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSubjects = SUBJECTS.filter(
    (s) => s.university === university && s.semester === semester
  );

  const activeSubject = availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];

  const handleUniversityChange = (uni: UniversityCode) => {
    setUniversity(uni);
    const prog: ProgramCode = uni === 'RJU_BCA' ? 'BCA' : 'BSc_CSIT';
    setProgram(prog);
    const subs = SUBJECTS.filter((s) => s.university === uni && s.semester === semester);
    if (subs.length > 0) {
      setSelectedSubjectId(subs[0].id);
      const uniPrefix = uni === 'RJU_BCA' ? 'RJU BCA' : `${uni} B.Sc.CSIT`;
      setTitle(`${uniPrefix} Sem ${semester} ${subs[0].title} Board Paper ${year}`);
    }
  };

  const handleSemesterChange = (sem: SemesterNumber) => {
    setSemester(sem);
    const subs = SUBJECTS.filter((s) => s.university === university && s.semester === sem);
    if (subs.length > 0) {
      setSelectedSubjectId(subs[0].id);
      const uniPrefix = university === 'RJU_BCA' ? 'RJU BCA' : `${university} B.Sc.CSIT`;
      setTitle(`${uniPrefix} Sem ${sem} ${subs[0].title} Board Paper ${year}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAllowedFileFormat(file);
    if (!validation.isValid) {
      setFileError(validation.error || 'Invalid file format. Only PDF and JPG/JPEG/PNG images are allowed.');
      setAttachedFile(null);
      setFilePreviewUrl(null);
      return;
    }

    setFileError(null);
    setAttachedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const currentExpectedDrivePath = generateGoogleDrivePath(
    university,
    program,
    semester,
    activeSubject ? activeSubject.title : 'Subject',
    category,
    attachedFile ? attachedFile.name : `Exam_${year}.pdf`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const sub = activeSubject || {
        id: 'custom-' + Date.now(),
        code: 'CSC-EXAM',
        title: 'Academic Course',
      };

      const token = await getAccessToken();

      let driveResult = null;
      if (attachedFile) {
        driveResult = await uploadToGoogleDrive(
          attachedFile,
          university,
          program,
          semester,
          sub.title,
          category,
          token
        );
      }

      const isImage = attachedFile?.type.startsWith('image/') || false;

      const newResource: Resource = {
        id: 'res-' + Date.now(),
        title: title || `${university} Sem ${semester} ${sub.title} Exam ${year}`,
        code: sub.code,
        university,
        program,
        semester,
        subjectId: sub.id,
        subjectTitle: sub.title,
        category,
        year,
        examType,
        description: description || `Uploaded by ${currentUser.name} into Google Drive archive.`,
        format: isImage ? 'image' : 'pdf',
        pageCount: 3,
        previewImages: filePreviewUrl
          ? [filePreviewUrl]
          : [
              'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
            ],
        fileSize: attachedFile ? `${(attachedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
        uploaderName: currentUser.name,
        uploaderRole: currentUser.role,
        viewsCount: 1,
        offlineSavesCount: 0,
        sharesCount: 0,
        isVerified: true,
        status: 'published',
        tags: [
          university === 'RJU_BCA' ? 'RJU BCA' : university,
          program,
          `Sem ${semester}`,
          sub.title,
          `${year}`,
        ],
        googleDrivePath: driveResult ? driveResult.path : currentExpectedDrivePath,
        googleDriveFileId: driveResult?.fileId,
        googleDriveWebViewLink: driveResult?.webViewLink,
        attachedQuestionFile: attachedFile
          ? {
              name: attachedFile.name,
              type: isImage ? 'image' : 'pdf',
              mimeType: (attachedFile.type as any) || 'application/pdf',
              size: `${(attachedFile.size / (1024 * 1024)).toFixed(1)} MB`,
              dataUrl: filePreviewUrl || undefined,
              googleDriveFileId: driveResult?.fileId,
              googleDriveWebViewLink: driveResult?.webViewLink,
            }
          : undefined,
        solutionWebLink: solutionWebLink.trim() || undefined,
        solutionVideoLink: solutionVideoLink.trim() || undefined,
        referenceNotes: referenceNotes.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSaveResource(newResource);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload resource to archive.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[92vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload &amp; Categorize Document
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                FWU B.Sc.CSIT • RJU B.Sc.CSIT • RJU BCA (Strictly PDF or JPG/JPEG/PNG only)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Target Course / University */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              1. Target Course &amp; University
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleUniversityChange('FWU')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                  university === 'FWU'
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
                  university === 'RJU'
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
                  university === 'RJU_BCA'
                    ? 'bg-indigo-500 text-white dark:text-slate-950 border-indigo-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                RJU BCA
              </button>
            </div>
          </div>

          {/* Semester & Year & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">2. Semester</label>
              <select
                value={semester}
                onChange={(e) => handleSemesterChange(Number(e.target.value) as SemesterNumber)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">3. Exam Year (B.S.)</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none font-mono"
              >
                {[2081, 2080, 2079, 2078, 2077, 2076].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">4. Resource Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="question_paper">Old Question Paper (Board)</option>
                <option value="model_paper">Model Question Paper</option>
                <option value="solution">Solved Paper / Answers</option>
                <option value="syllabus">Syllabus &amp; Outline</option>
                <option value="lecture_notes">Lecture Notes</option>
                <option value="lab_manual">Lab Practical Manual</option>
              </select>
            </div>
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">5. Curriculum Subject</label>
            <select
              value={selectedSubjectId || (activeSubject ? activeSubject.id : '')}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                const sub = availableSubjects.find((s) => s.id === e.target.value);
                if (sub) {
                  const uniPrefix = university === 'RJU_BCA' ? 'RJU BCA' : `${university} B.Sc.CSIT`;
                  setTitle(`${uniPrefix} Sem ${semester} ${sub.title} Exam ${year}`);
                }
              }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} - {sub.title} ({sub.creditHours} Credits)
                </option>
              ))}
            </select>
          </div>

          {/* Resource Title */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">6. Resource Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. RJU BCA Sem 3 Web Technology I Exam 2080"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none font-medium"
            />
          </div>

          {/* Structured Path Indicator */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
              <HardDrive className="w-4 h-4" />
              <span>Storage Folder Hierarchy Target:</span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 break-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              {currentExpectedDrivePath}
            </div>
          </div>

          {/* 7. ATTACH QUESTION PAPER (PDF or JPG/JPEG/PNG ONLY) */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>7. Question Paper Document / Exam Sheet File</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Strictly <strong>PDF or Image format (JPG, JPEG, PNG)</strong> only. All other file formats are restricted.
                </p>
              </div>
            </div>

            {/* File Drag and Drop Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 sm:p-6 rounded-2xl border-2 border-dashed transition cursor-pointer text-center ${
                attachedFile
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 hover:border-emerald-500/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {attachedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-sm">
                      {attachedFile.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {(attachedFile.size / (1024 * 1024)).toFixed(2)} MB • {attachedFile.type || 'Document'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-7 h-7 mx-auto text-slate-400 dark:text-slate-500 mb-1" />
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    Click to select Question Paper (PDF or JPG/JPEG/PNG)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Files upload directly to the structured Google Drive hierarchy
                  </div>
                </div>
              )}
            </div>

            {fileError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          {/* 8. REFERENCE AND SOLUTION LINKS */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>8. Reference &amp; Verified Solution Links</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Provide official site solutions, video lecture walkthroughs, or faculty textbook references.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Site Solution Link */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Website / Article Solution Link (URL)</span>
                </label>
                <input
                  type="url"
                  value={solutionWebLink}
                  onChange={(e) => setSolutionWebLink(e.target.value)}
                  placeholder="https://notes.megacollege.edu.np/solutions/... or https://openpte.com/..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              {/* Video Solution Link */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Video Solution / Walkthrough Lecture Link (YouTube / Vimeo)</span>
                </label>
                <input
                  type="url"
                  value={solutionVideoLink}
                  onChange={(e) => setSolutionVideoLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              {/* Recommended References & Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Recommended Textbooks &amp; Faculty Solution Notes</span>
                </label>
                <textarea
                  rows={2}
                  value={referenceNotes}
                  onChange={(e) => setReferenceNotes(e.target.value)}
                  placeholder="e.g. Standard Board Prescribed Syllabus; Thomas H. Cormen Chapter 4; Faculty Answer Key Vol 2."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {isUploading ? 'Uploading Document...' : 'Upload & Categorize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
