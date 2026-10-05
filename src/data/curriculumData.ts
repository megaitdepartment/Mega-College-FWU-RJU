import { ProgramInfo, Subject, UniversityInfo } from '../types';

export const UNIVERSITIES: UniversityInfo[] = [
  {
    id: 'FWU',
    name: 'FWU B.Sc.CSIT',
    fullName: 'Far Western University - B.Sc.CSIT',
    logoText: 'FWU CSIT',
    badgeColor: 'emerald',
    description: 'B.Sc.CSIT syllabus, board examination questions, and curriculum repository for FWU.',
    programs: ['BSc_CSIT'],
  },
  {
    id: 'RJU',
    name: 'RJU B.Sc.CSIT',
    fullName: 'Rajarshi Janak University - B.Sc.CSIT',
    logoText: 'RJU CSIT',
    badgeColor: 'cyan',
    description: 'B.Sc.CSIT model questions, past papers, lab manuals, and syllabus repository for RJU.',
    programs: ['BSc_CSIT'],
  },
  {
    id: 'RJU_BCA',
    name: 'RJU BCA',
    fullName: 'Rajarshi Janak University - Bachelor of Computer Application (RJU BCA)',
    logoText: 'RJU BCA',
    badgeColor: 'indigo',
    description: 'Comprehensive RJU BCA questions, unit tests, model papers, and solved projects repository.',
    programs: ['BCA'],
  },
  {
    id: 'MEGA',
    name: 'Mega College',
    fullName: 'Mega College Academic Repository',
    logoText: 'MEGA IT',
    badgeColor: 'teal',
    description: 'Internal terminal exams, pre-board sets, model solutions, and faculty notes repository.',
    programs: ['BSc_CSIT', 'BCA'],
  },
];

export const PROGRAMS: ProgramInfo[] = [
  {
    id: 'BSc_CSIT',
    name: 'B.Sc. CSIT',
    fullName: 'Bachelor of Science in Computer Science & Information Technology',
    totalSemesters: 8,
    description: '4-year, 8-semester intensive technical degree focused on computational theory and software systems.',
  },
  {
    id: 'BCA',
    name: 'RJU BCA',
    fullName: 'Rajarshi Janak University - Bachelor of Computer Application (RJU BCA)',
    totalSemesters: 8,
    description: '4-year practical computer application, business systems, and enterprise software engineering program.',
  },
];

export const SUBJECTS: Subject[] = [
  // FWU B.Sc.CSIT - Semester 1
  { id: 'fwu_csit_101', code: 'CSC101', title: 'Introduction to Information Technology', university: 'FWU', program: 'BSc_CSIT', semester: 1, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_102', code: 'CSC102', title: 'C Programming', university: 'FWU', program: 'BSc_CSIT', semester: 1, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_103', code: 'CSC103', title: 'Digital Logic', university: 'FWU', program: 'BSc_CSIT', semester: 1, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_104', code: 'MTH104', title: 'Mathematics I (Calculus)', university: 'FWU', program: 'BSc_CSIT', semester: 1, creditHours: 3 },
  { id: 'fwu_csit_105', code: 'PHY105', title: 'Physics', university: 'FWU', program: 'BSc_CSIT', semester: 1, creditHours: 3 },

  // FWU B.Sc.CSIT - Semester 2
  { id: 'fwu_csit_201', code: 'CSC151', title: 'Discrete Structures', university: 'FWU', program: 'BSc_CSIT', semester: 2, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_202', code: 'CSC152', title: 'Object-Oriented Programming (C++)', university: 'FWU', program: 'BSc_CSIT', semester: 2, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_203', code: 'CSC153', title: 'Microprocessor & Assembly Language', university: 'FWU', program: 'BSc_CSIT', semester: 2, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_204', code: 'MTH154', title: 'Mathematics II (Linear Algebra)', university: 'FWU', program: 'BSc_CSIT', semester: 2, creditHours: 3 },
  { id: 'fwu_csit_205', code: 'STA155', title: 'Statistics I', university: 'FWU', program: 'BSc_CSIT', semester: 2, creditHours: 3 },

  // FWU B.Sc.CSIT - Semester 3
  { id: 'fwu_csit_301', code: 'CSC201', title: 'Data Structures and Algorithms (DSA)', university: 'FWU', program: 'BSc_CSIT', semester: 3, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_302', code: 'CSC202', title: 'Numerical Method', university: 'FWU', program: 'BSc_CSIT', semester: 3, creditHours: 3 },
  { id: 'fwu_csit_303', code: 'CSC203', title: 'Computer Architecture', university: 'FWU', program: 'BSc_CSIT', semester: 3, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_304', code: 'CSC204', title: 'Computer Graphics', university: 'FWU', program: 'BSc_CSIT', semester: 3, creditHours: 3 },
  { id: 'fwu_csit_305', code: 'STA205', title: 'Statistics II', university: 'FWU', program: 'BSc_CSIT', semester: 3, creditHours: 3 },

  // FWU B.Sc.CSIT - Semester 4
  { id: 'fwu_csit_401', code: 'CSC251', title: 'Theory of Computation', university: 'FWU', program: 'BSc_CSIT', semester: 4, creditHours: 3 },
  { id: 'fwu_csit_402', code: 'CSC252', title: 'Database Management Systems (DBMS)', university: 'FWU', program: 'BSc_CSIT', semester: 4, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_403', code: 'CSC253', title: 'Operating Systems', university: 'FWU', program: 'BSc_CSIT', semester: 4, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_404', code: 'CSC254', title: 'Computer Networks', university: 'FWU', program: 'BSc_CSIT', semester: 4, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_405', code: 'CSC255', title: 'Artificial Intelligence (AI)', university: 'FWU', program: 'BSc_CSIT', semester: 4, creditHours: 3 },

  // FWU B.Sc.CSIT - Semester 5
  { id: 'fwu_csit_501', code: 'CSC314', title: 'Design and Analysis of Algorithms (DAA)', university: 'FWU', program: 'BSc_CSIT', semester: 5, creditHours: 3 },
  { id: 'fwu_csit_502', code: 'CSC315', title: 'System Analysis and Design (SAD)', university: 'FWU', program: 'BSc_CSIT', semester: 5, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_503', code: 'CSC316', title: 'Cryptography', university: 'FWU', program: 'BSc_CSIT', semester: 5, creditHours: 3 },
  { id: 'fwu_csit_504', code: 'CSC317', title: 'Simulation and Modeling', university: 'FWU', program: 'BSc_CSIT', semester: 5, creditHours: 3 },
  { id: 'fwu_csit_505', code: 'CSC318', title: 'Web Technology', university: 'FWU', program: 'BSc_CSIT', semester: 5, creditHours: 3, isCommonCourse: true },

  // FWU B.Sc.CSIT - Semester 6
  { id: 'fwu_csit_601', code: 'CSC364', title: 'Software Engineering', university: 'FWU', program: 'BSc_CSIT', semester: 6, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_602', code: 'CSC365', title: 'Compiler Design and Construction', university: 'FWU', program: 'BSc_CSIT', semester: 6, creditHours: 3 },
  { id: 'fwu_csit_603', code: 'CSC366', title: 'E-Governance', university: 'FWU', program: 'BSc_CSIT', semester: 6, creditHours: 3 },
  { id: 'fwu_csit_604', code: 'CSC367', title: 'NET Centric Computing (C# / .NET)', university: 'FWU', program: 'BSc_CSIT', semester: 6, creditHours: 3 },
  { id: 'fwu_csit_605', code: 'CSC368', title: 'Technical Writing', university: 'FWU', program: 'BSc_CSIT', semester: 6, creditHours: 3 },

  // FWU B.Sc.CSIT - Semester 7
  { id: 'fwu_csit_701', code: 'CSC409', title: 'Advanced Java Programming', university: 'FWU', program: 'BSc_CSIT', semester: 7, creditHours: 3 },
  { id: 'fwu_csit_702', code: 'CSC410', title: 'Data Warehousing and Data Mining', university: 'FWU', program: 'BSc_CSIT', semester: 7, creditHours: 3, isCommonCourse: true },
  { id: 'fwu_csit_703', code: 'CSC411', title: 'Principles of Management', university: 'FWU', program: 'BSc_CSIT', semester: 7, creditHours: 3 },
  { id: 'fwu_csit_704', code: 'CSC412', title: 'Project Work', university: 'FWU', program: 'BSc_CSIT', semester: 7, creditHours: 3 },

  // FWU B.Sc.CSIT - Semester 8
  { id: 'fwu_csit_801', code: 'CSC461', title: 'Advanced Database (NoSQL & Distributed)', university: 'FWU', program: 'BSc_CSIT', semester: 8, creditHours: 3 },
  { id: 'fwu_csit_802', code: 'CSC462', title: 'Internship', university: 'FWU', program: 'BSc_CSIT', semester: 8, creditHours: 6 },
  { id: 'fwu_csit_803', code: 'CSC463', title: 'Cloud Computing & DevOps', university: 'FWU', program: 'BSc_CSIT', semester: 8, creditHours: 3 },

  // RJU B.Sc.CSIT - Key Semesters
  { id: 'rju_csit_101', code: 'RJU-CS101', title: 'Fundamentals of Information Technology', university: 'RJU', program: 'BSc_CSIT', semester: 1, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_102', code: 'RJU-CS102', title: 'Programming in C', university: 'RJU', program: 'BSc_CSIT', semester: 1, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_103', code: 'RJU-CS103', title: 'Digital Logic Circuits', university: 'RJU', program: 'BSc_CSIT', semester: 1, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_104', code: 'RJU-MT104', title: 'Calculus & Analytical Geometry', university: 'RJU', program: 'BSc_CSIT', semester: 1, creditHours: 3 },
  { id: 'rju_csit_201', code: 'RJU-CS201', title: 'Discrete Mathematics', university: 'RJU', program: 'BSc_CSIT', semester: 2, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_202', code: 'RJU-CS202', title: 'Object Oriented Programming with C++', university: 'RJU', program: 'BSc_CSIT', semester: 2, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_203', code: 'RJU-CS203', title: 'Microprocessor Architecture', university: 'RJU', program: 'BSc_CSIT', semester: 2, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_301', code: 'RJU-CS301', title: 'Data Structures and Algorithms', university: 'RJU', program: 'BSc_CSIT', semester: 3, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_302', code: 'RJU-CS302', title: 'Database Management Systems', university: 'RJU', program: 'BSc_CSIT', semester: 3, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_401', code: 'RJU-CS401', title: 'Operating Systems & Linux', university: 'RJU', program: 'BSc_CSIT', semester: 4, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_402', code: 'RJU-CS402', title: 'Computer Networks and Protocols', university: 'RJU', program: 'BSc_CSIT', semester: 4, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_501', code: 'RJU-CS501', title: 'Artificial Intelligence & Neural Nets', university: 'RJU', program: 'BSc_CSIT', semester: 5, creditHours: 3 },
  { id: 'rju_csit_601', code: 'RJU-CS601', title: 'Web Technologies & Frameworks', university: 'RJU', program: 'BSc_CSIT', semester: 6, creditHours: 3, isCommonCourse: true },
  { id: 'rju_csit_701', code: 'RJU-CS701', title: 'Cyber Security & Network Defense', university: 'RJU', program: 'BSc_CSIT', semester: 7, creditHours: 3 },
  { id: 'rju_csit_801', code: 'RJU-CS801', title: 'Mobile Computing (Android & iOS)', university: 'RJU', program: 'BSc_CSIT', semester: 8, creditHours: 3 },

  // RJU BCA (Rajarshi Janak University - Bachelor of Computer Application)
  { id: 'rju_bca_101', code: 'BCA101', title: 'Computer Fundamentals & Applications', university: 'RJU_BCA', program: 'BCA', semester: 1, creditHours: 3 },
  { id: 'rju_bca_102', code: 'BCA102', title: 'Society and Technology', university: 'RJU_BCA', program: 'BCA', semester: 1, creditHours: 3 },
  { id: 'rju_bca_103', code: 'BCA103', title: 'English I', university: 'RJU_BCA', program: 'BCA', semester: 1, creditHours: 3 },
  { id: 'rju_bca_104', code: 'BCA104', title: 'Mathematics I', university: 'RJU_BCA', program: 'BCA', semester: 1, creditHours: 3 },
  { id: 'rju_bca_105', code: 'BCA105', title: 'Digital Logic Systems', university: 'RJU_BCA', program: 'BCA', semester: 1, creditHours: 3, isCommonCourse: true },

  { id: 'rju_bca_201', code: 'BCA151', title: 'C Programming', university: 'RJU_BCA', program: 'BCA', semester: 2, creditHours: 3, isCommonCourse: true },
  { id: 'rju_bca_202', code: 'BCA152', title: 'Financial Accounting', university: 'RJU_BCA', program: 'BCA', semester: 2, creditHours: 3 },
  { id: 'rju_bca_203', code: 'BCA153', title: 'English II', university: 'RJU_BCA', program: 'BCA', semester: 2, creditHours: 3 },
  { id: 'rju_bca_204', code: 'BCA154', title: 'Mathematics II', university: 'RJU_BCA', program: 'BCA', semester: 2, creditHours: 3 },
  { id: 'rju_bca_205', code: 'BCA155', title: 'Microprocessor and Computer Architecture', university: 'RJU_BCA', program: 'BCA', semester: 2, creditHours: 3, isCommonCourse: true },

  { id: 'rju_bca_301', code: 'BCA201', title: 'Data Structures and Algorithms', university: 'RJU_BCA', program: 'BCA', semester: 3, creditHours: 3, isCommonCourse: true },
  { id: 'rju_bca_302', code: 'BCA202', title: 'Probability and Statistics', university: 'RJU_BCA', program: 'BCA', semester: 3, creditHours: 3 },
  { id: 'rju_bca_303', code: 'BCA203', title: 'System Analysis and Design', university: 'RJU_BCA', program: 'BCA', semester: 3, creditHours: 3, isCommonCourse: true },
  { id: 'rju_bca_304', code: 'BCA204', title: 'Object Oriented Programming in Java', university: 'RJU_BCA', program: 'BCA', semester: 3, creditHours: 3, isCommonCourse: true },
  { id: 'rju_bca_305', code: 'BCA205', title: 'Web Technology I (HTML, CSS, JS, PHP)', university: 'RJU_BCA', program: 'BCA', semester: 3, creditHours: 3, isCommonCourse: true },

  { id: 'rju_bca_401', code: 'BCA251', title: 'Operating Systems', university: 'RJU_BCA', program: 'BCA', semester: 4, creditHours: 3, isCommonCourse: true },
  { id: 'rju_bca_402', code: 'BCA252', title: 'Numerical Methods', university: 'RJU_BCA', program: 'BCA', semester: 4, creditHours: 3 },
  { id: 'rju_bca_403', code: 'BCA253', title: 'Software Engineering', university: 'RJU_BCA', program: 'BCA', semester: 4, creditHours: 3, isCommonCourse: true },
  { id: 'rju_bca_404', code: 'BCA254', title: 'Scripting Language (Python & JS)', university: 'RJU_BCA', program: 'BCA', semester: 4, creditHours: 3 },
  { id: 'rju_bca_405', code: 'BCA255', title: 'Database Management System', university: 'RJU_BCA', program: 'BCA', semester: 4, creditHours: 3, isCommonCourse: true },

  { id: 'rju_bca_501', code: 'BCA301', title: 'MIS and E-Business', university: 'RJU_BCA', program: 'BCA', semester: 5, creditHours: 3 },
  { id: 'rju_bca_502', code: 'BCA302', title: 'DotNet Technology', university: 'RJU_BCA', program: 'BCA', semester: 5, creditHours: 3 },
  { id: 'rju_bca_503', code: 'BCA303', title: 'Computer Networking', university: 'RJU_BCA', program: 'BCA', semester: 5, creditHours: 3, isCommonCourse: true },

  { id: 'rju_bca_601', code: 'BCA351', title: 'Mobile Programming (Flutter & Kotlin)', university: 'RJU_BCA', program: 'BCA', semester: 6, creditHours: 3 },
  { id: 'rju_bca_602', code: 'BCA352', title: 'Distributed Systems', university: 'RJU_BCA', program: 'BCA', semester: 6, creditHours: 3 },
  { id: 'rju_bca_603', code: 'BCA353', title: 'Applied Economics', university: 'RJU_BCA', program: 'BCA', semester: 6, creditHours: 3 },

  { id: 'rju_bca_701', code: 'BCA401', title: 'Cyber Law and Professional Ethics', university: 'RJU_BCA', program: 'BCA', semester: 7, creditHours: 3 },
  { id: 'rju_bca_702', code: 'BCA402', title: 'Cloud Computing', university: 'RJU_BCA', program: 'BCA', semester: 7, creditHours: 3 },
  { id: 'rju_bca_703', code: 'BCA403', title: 'Internship / Project II', university: 'RJU_BCA', program: 'BCA', semester: 7, creditHours: 3 },

  { id: 'rju_bca_801', code: 'BCA451', title: 'Operations Research', university: 'RJU_BCA', program: 'BCA', semester: 8, creditHours: 3 },
  { id: 'rju_bca_802', code: 'BCA452', title: 'Network Security', university: 'RJU_BCA', program: 'BCA', semester: 8, creditHours: 3 },
  { id: 'rju_bca_803', code: 'BCA453', title: 'Advanced Database Management', university: 'RJU_BCA', program: 'BCA', semester: 8, creditHours: 3 },
];

export const COMMON_EQUIVALENCIES: Record<string, string[]> = {
  'C Programming': ['fwu_csit_102', 'rju_csit_102', 'rju_bca_201'],
  'Digital Logic': ['fwu_csit_103', 'rju_csit_103', 'rju_bca_105'],
  'Data Structures and Algorithms': ['fwu_csit_301', 'rju_csit_301', 'rju_bca_301'],
  'Database Management Systems': ['fwu_csit_402', 'rju_csit_302', 'rju_bca_405'],
  'Operating Systems': ['fwu_csit_403', 'rju_csit_401', 'rju_bca_401'],
  'Computer Networks': ['fwu_csit_404', 'rju_csit_402', 'rju_bca_503'],
  'Software Engineering': ['fwu_csit_601', 'rju_bca_403'],
  'Web Technology': ['fwu_csit_505', 'rju_csit_601', 'rju_bca_305'],
};
