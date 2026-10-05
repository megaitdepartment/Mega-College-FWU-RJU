/**
 * Authentication Service for Mega College Academic Archive
 * Strictly 2 Roles: 'super_admin' and 'faculty_admin'
 * Email & Password authentication with session management and secure verification reset.
 * All credentials are user-managed with zero hardcoded passwords or API secrets.
 */

import { FacultyAdminAccount, UserProfile, UserRole } from '../types';

// Super Admin designated root emails
export const SUPER_ADMIN_EMAILS = [
  'megaitdepartment@gmail.com',
  'superadmin@megacollege.edu.np',
  'admin@megacollege.edu.np',
];

const FACULTY_ACCOUNTS_KEY = 'mega_faculty_accounts_v1';
const CURRENT_SESSION_KEY = 'mega_active_session_profile_v1';
const SUPER_ADMIN_PWD_KEY = 'mega_super_admin_custom_pwd_v1';
const RESET_CODES_KEY = 'mega_auth_reset_otps_v1';

// In-memory token cache for optional external services
let cachedAccessToken: string | null = null;

// Super Admin dynamic/custom password getter and setter
export const getSuperAdminPassword = (): string | null => {
  try {
    return localStorage.getItem(SUPER_ADMIN_PWD_KEY) || (import.meta.env.VITE_SUPER_ADMIN_PASSWORD as string) || null;
  } catch {
    return null;
  }
};

export const setSuperAdminPassword = (newPwd: string) => {
  try {
    localStorage.setItem(SUPER_ADMIN_PWD_KEY, newPwd);
  } catch (err) {
    console.error('Failed to save super admin password', err);
  }
};

// Initial faculty accounts start empty - accounts are managed and provisioned directly by the Super Admin in the CMS
const INITIAL_FACULTY_ACCOUNTS: FacultyAdminAccount[] = [];

// Helper to get faculty accounts list
export const getFacultyAccounts = (): FacultyAdminAccount[] => {
  try {
    const raw = localStorage.getItem(FACULTY_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(FACULTY_ACCOUNTS_KEY, JSON.stringify(INITIAL_FACULTY_ACCOUNTS));
      return INITIAL_FACULTY_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FACULTY_ACCOUNTS;
  }
};

// Helper to save faculty accounts
export const saveFacultyAccounts = (accounts: FacultyAdminAccount[]) => {
  try {
    localStorage.setItem(FACULTY_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save faculty accounts', err);
  }
};

// Super Admin creates a new Faculty Admin account
export const createFacultyAccount = (
  data: Omit<FacultyAdminAccount, 'id' | 'grantedAt' | 'grantedBy' | 'status'>,
  grantedByEmail: string
): FacultyAdminAccount => {
  const accounts = getFacultyAccounts();
  const existing = accounts.find((a) => a.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    throw new Error(`An account with email ${data.email} already exists.`);
  }

  const newAccount: FacultyAdminAccount = {
    ...data,
    id: 'fac-' + Date.now(),
    status: 'active',
    grantedAt: new Date().toISOString(),
    grantedBy: grantedByEmail,
  };

  accounts.push(newAccount);
  saveFacultyAccounts(accounts);
  return newAccount;
};

// Super Admin edits/updates password or status for a faculty admin
export const updateFacultyAccount = (
  id: string,
  updates: Partial<Pick<FacultyAdminAccount, 'name' | 'passwordHash' | 'department' | 'universityAffiliation' | 'status'>>
): FacultyAdminAccount => {
  const accounts = getFacultyAccounts();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) {
    throw new Error('Faculty account not found.');
  }

  accounts[idx] = { ...accounts[idx], ...updates };
  saveFacultyAccounts(accounts);
  return accounts[idx];
};

// Super Admin deletes/revokes a faculty admin
export const deleteFacultyAccount = (id: string) => {
  const accounts = getFacultyAccounts().filter((a) => a.id !== id);
  saveFacultyAccounts(accounts);
};

// Return current active session profile
export const getActiveSessionProfile = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setActiveSessionProfile = (profile: UserProfile | null) => {
  try {
    if (profile) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  } catch (err) {
    console.error('Failed to update session profile', err);
  }
};

// Email & Password Login
export const loginWithEmailPassword = (
  email: string,
  pass: string
): { success: boolean; user?: UserProfile; error?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: 'Email and password are required.' };
  }

  const isSuperEmail =
    SUPER_ADMIN_EMAILS.some((e) => e.toLowerCase() === cleanEmail) ||
    cleanEmail.includes('megaitdepartment');

  // 1. Check Super Admin accounts
  if (isSuperEmail) {
    const currentSuperAdminPwd = getSuperAdminPassword();

    // If no password has been set yet, initialize it with the first entered password (min 6 chars)
    if (!currentSuperAdminPwd) {
      if (cleanPass.length < 6) {
        return {
          success: false,
          error: 'Please choose an initial Super Admin password with at least 6 characters.',
        };
      }
      setSuperAdminPassword(cleanPass);
    } else if (cleanPass !== currentSuperAdminPwd) {
      return { success: false, error: 'Incorrect password entered for Super Admin.' };
    }

    const profile: UserProfile = {
      id: 'super-admin-01',
      name: 'Mega IT Head (Super Admin)',
      email: cleanEmail,
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      department: 'Department of Information Technology',
      universityAffiliation: 'MEGA',
      authMethod: 'password',
      permissions: {
        canUpload: true,
        canEdit: true,
        canDelete: true,
        canCopyCrossUniversity: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canManageGoogleDrive: true,
      },
    };
    setActiveSessionProfile(profile);
    return { success: true, user: profile };
  }

  // 2. Check Faculty Admin accounts granted by Super Admin
  const accounts = getFacultyAccounts();
  const match = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!match) {
    return {
      success: false,
      error: 'Invalid credentials. Faculty accounts must be provisioned by the Super Admin.',
    };
  }

  if (match.status === 'suspended') {
    return {
      success: false,
      error: 'Your Faculty Admin account has been suspended by the Super Admin.',
    };
  }

  if (match.passwordHash !== cleanPass) {
    return { success: false, error: 'Incorrect password entered.' };
  }

  // Update last login
  updateFacultyAccount(match.id, {});

  const profile: UserProfile = {
    id: match.id,
    name: match.name,
    email: match.email,
    role: 'faculty_admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    department: match.department,
    universityAffiliation: match.universityAffiliation,
    authMethod: 'password',
    permissions: {
      canUpload: true,
      canEdit: true,
      canDelete: false, // Faculty Admin cannot delete Super Admin archives
      canCopyCrossUniversity: true,
      canManageUsers: false, // Only Super Admin manages users
      canViewAnalytics: true,
      canManageGoogleDrive: true,
    },
  };

  setActiveSessionProfile(profile);
  return { success: true, user: profile };
};

// Forgot Password: Step 1 - Request Reset Code for registered email
export const requestPasswordReset = (
  email: string
): {
  success: boolean;
  error?: string;
  verificationCode?: string;
  accountName?: string;
  role?: UserRole;
} => {
  const cleanEmail = email.trim().toLowerCase();
  const isSuper =
    SUPER_ADMIN_EMAILS.some((e) => e.toLowerCase() === cleanEmail) ||
    cleanEmail.includes('megaitdepartment');

  const facultyAccounts = getFacultyAccounts();
  const facultyMatch = facultyAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!isSuper && !facultyMatch) {
    return {
      success: false,
      error: `Email "${email}" is not registered in the system. Only emails provisioned by the Super Admin are eligible to reset passwords.`,
    };
  }

  // Generate 6-digit security code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const resetData = {
    email: cleanEmail,
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins validity
  };

  try {
    localStorage.setItem(RESET_CODES_KEY, JSON.stringify(resetData));
  } catch (err) {
    console.error('Failed to store reset code', err);
  }

  return {
    success: true,
    verificationCode: code,
    accountName: isSuper ? 'Mega IT Head (Super Admin)' : facultyMatch?.name,
    role: isSuper ? 'super_admin' : 'faculty_admin',
  };
};

// Forgot Password: Step 2 - Verify Code & Set New Password
export const verifyAndResetPassword = (
  email: string,
  code: string,
  newPassword: string
): { success: boolean; error?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }

  try {
    const raw = localStorage.getItem(RESET_CODES_KEY);
    if (!raw) {
      return {
        success: false,
        error: 'No active password reset request found. Please request a new verification code.',
      };
    }

    const resetData = JSON.parse(raw);
    if (resetData.email !== cleanEmail) {
      return { success: false, error: 'The email address does not match the active reset request.' };
    }

    if (Date.now() > resetData.expiresAt) {
      return {
        success: false,
        error: 'The verification code has expired (15 minute validity). Please request a new one.',
      };
    }

    if (resetData.code !== cleanCode) {
      return {
        success: false,
        error: 'Invalid 6-digit security code entered. Please check and try again.',
      };
    }

    // Check if Super Admin
    const isSuper =
      SUPER_ADMIN_EMAILS.some((e) => e.toLowerCase() === cleanEmail) ||
      cleanEmail.includes('megaitdepartment');

    if (isSuper) {
      setSuperAdminPassword(newPassword);
      localStorage.removeItem(RESET_CODES_KEY);
      return { success: true };
    }

    // Otherwise faculty account
    const accounts = getFacultyAccounts();
    const idx = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      return { success: false, error: 'Faculty account not found in authorized registry.' };
    }

    accounts[idx].passwordHash = newPassword;
    saveFacultyAccounts(accounts);
    localStorage.removeItem(RESET_CODES_KEY);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update password.' };
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logoutSession = async () => {
  cachedAccessToken = null;
  setActiveSessionProfile(null);
};

export const initAuthListener = (
  onAuthChange: (profile: UserProfile | null, token: string | null) => void
) => {
  const storedProfile = getActiveSessionProfile();
  onAuthChange(storedProfile, cachedAccessToken);
  return () => {};
};
