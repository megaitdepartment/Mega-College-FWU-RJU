/**
 * Types for Mega College Academic Question Bank
 * Supporting FWU B.Sc.CSIT, RJU B.Sc.CSIT, and RJU BCA.
 * Restricted 2-role system: Super Admin and Faculty Admin only.
 */

export type UniversityCode = 'FWU' | 'RJU' | 'RJU_BCA' | 'MEGA';

export interface UniversityInfo {
  id: UniversityCode;
  name: string;
  fullName: string;
  logoText: string;
  badgeColor: string;
  description: string;
  programs: ProgramCode[];
}

export type ProgramCode = 'BSc_CSIT' | 'BCA';

export interface ProgramInfo {
  id: ProgramCode;
  name: string;
  fullName: string;
  totalSemesters: number;
  description: string;
}

export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ResourceCategory =
  | 'question_paper'
  | 'model_paper'
  | 'syllabus'
  | 'solution'
  | 'lecture_notes'
  | 'lab_manual';

export type ExamType = 'regular' | 'back' | 'model' | 'pre-board' | 'unit_test';

export interface Subject {
  id: string;
  code: string;
  title: string;
  university: UniversityCode;
  program: ProgramCode;
  semester: SemesterNumber;
  creditHours: number;
  isCommonCourse?: boolean;
  description?: string;
}

export interface AttachedQuestionFile {
  name: string;
  type: 'pdf' | 'image';
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/webp';
  size: string;
  dataUrl?: string;
  googleDriveFileId?: string;
  googleDriveWebViewLink?: string;
}

export interface Resource {
  id: string;
  title: string;
  code: string;
  university: UniversityCode;
  program: ProgramCode;
  semester: SemesterNumber;
  subjectId: string;
  subjectTitle: string;
  category: ResourceCategory;
  year: number; // e.g. 2080, 2079, 2078
  examType: ExamType;
  description: string;
  format: 'pdf' | 'image';
  pageCount: number;
  previewImages: string[];
  fileSize: string;
  uploaderName: string;
  uploaderRole: UserRole;
  viewsCount: number;
  offlineSavesCount: number;
  sharesCount: number;
  isVerified: boolean;
  status: 'published' | 'draft';
  tags: string[];

  // Google Drive Structured Storage Path & Metadata
  googleDrivePath?: string; // e.g. "Mega Document Drive/FWU B.Sc.CSIT/1st semester/C Programming/Old Questions/Paper_2080.pdf"
  googleDriveFileId?: string;
  googleDriveWebViewLink?: string;

  // Attached files (PDF or JPG/JPEG/PNG image only)
  attachedQuestionFile?: AttachedQuestionFile;

  // External Reference & Solution links (No step-by-step generator)
  solutionWebLink?: string; // External verified solution website URL
  solutionVideoLink?: string; // Video tutorial / solution walkthrough (YouTube/Vimeo)
  referenceNotes?: string; // Recommended textbook / reference material notes

  copiedFrom?: {
    originalResourceId: string;
    originalUniversity: UniversityCode;
    originalProgram: ProgramCode;
    copiedAt: string;
    copiedBy: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Strictly 2 Roles: Super Admin and Faculty Admin
export type UserRole = 'super_admin' | 'faculty_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  universityAffiliation: UniversityCode;
  authMethod: 'google' | 'password';
  permissions: {
    canUpload: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canCopyCrossUniversity: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
    canManageGoogleDrive: boolean;
  };
}

// Faculty Admin accounts managed strictly by Super Admin via Email & Password
export interface FacultyAdminAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plain/encrypted storage for local session auth
  department: string;
  universityAffiliation: UniversityCode;
  status: 'active' | 'suspended';
  grantedAt: string;
  grantedBy: string;
  lastLoginAt?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'view' | 'offline_save' | 'share' | 'search' | 'copy_cross_university' | 'google_drive_upload';
  resourceId?: string;
  resourceTitle?: string;
  university?: UniversityCode;
  program?: ProgramCode;
  semester?: SemesterNumber;
  subjectCode?: string;
  searchQuery?: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalOfflineSaves: number;
  totalShares: number;
  totalCopies: number;
  viewsByUniversity: Record<UniversityCode, number>;
  viewsByProgram: Record<ProgramCode, number>;
  viewsBySemester: Record<number, number>;
  topSearchedKeywords: { keyword: string; count: number }[];
  mostPopularResources: { id: string; title: string; views: number; saves: number }[];
}

export interface OfflineStoredItem {
  resource: Resource;
  savedAt: string;
  dataBundleSize: number; // in bytes
}

export interface FilterState {
  searchQuery: string;
  university: UniversityCode | 'ALL';
  program: ProgramCode | 'ALL';
  semester: SemesterNumber | 'ALL';
  category: ResourceCategory | 'ALL';
  year: number | 'ALL';
  examType: ExamType | 'ALL';
  verifiedOnly: boolean;
  solutionsOnly: boolean;
  sortBy: 'latest' | 'popular' | 'year_desc' | 'year_asc' | 'title';
}
