/**
 * Authentication Service for Mega College Academic Archive
 * Strictly 2 Roles: 'super_admin' and 'faculty_admin'
 * Google Sign-In with Google Drive OAuth Scope + Email & Password authentication
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { FacultyAdminAccount, UserProfile, UserRole } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Providers
const driveProvider = new GoogleAuthProvider();
driveProvider.addScope('https://www.googleapis.com/auth/drive.file');
driveProvider.setCustomParameters({ prompt: 'select_account' });

const standardProvider = new GoogleAuthProvider();
standardProvider.setCustomParameters({ prompt: 'select_account' });

// In-memory cache for OAuth access token
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Super Admin designated emails
export const SUPER_ADMIN_EMAILS = [
  'megaitdepartment@gmail.com',
  'superadmin@megacollege.edu.np',
  'admin@megacollege.edu.np',
];

const FACULTY_ACCOUNTS_KEY = 'mega_faculty_accounts_v1';
const CURRENT_SESSION_KEY = 'mega_active_session_profile_v1';
const SUPER_ADMIN_PWD_KEY = 'mega_super_admin_custom_pwd_v1';
const RESET_CODES_KEY = 'mega_auth_reset_otps_v1';

export const DEFAULT_SUPER_ADMIN_PASSWORD = 'MegaAdmin@2026';

// Super Admin dynamic/custom password getter and setter
export const getSuperAdminPassword = (): string => {
  try {
    return localStorage.getItem(SUPER_ADMIN_PWD_KEY) || DEFAULT_SUPER_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_SUPER_ADMIN_PASSWORD;
  }
};

export const setSuperAdminPassword = (newPwd: string) => {
  try {
    localStorage.setItem(SUPER_ADMIN_PWD_KEY, newPwd);
  } catch (err) {
    console.error('Failed to save super admin password', err);
  }
};

// Initial pre-configured faculty accounts for Mega College
const INITIAL_FACULTY_ACCOUNTS: FacultyAdminAccount[] = [
  {
    id: 'fac-101',
    name: 'Prof. S. K. Mahato',
    email: 'faculty.csit@megacollege.edu.np',
    passwordHash: 'Faculty@2026', // Plain string for local demo verification
    department: 'Department of Computer Science',
    universityAffiliation: 'RJU',
    status: 'active',
    grantedAt: '2026-01-01T00:00:00Z',
    grantedBy: 'megaitdepartment@gmail.com',
  },
  {
    id: 'fac-102',
    name: 'Er. Sunita Sharma',
    email: 'bca.lead@megacollege.edu.np',
    passwordHash: 'RjuBca@2026',
    department: 'RJU BCA Academic Department',
    universityAffiliation: 'RJU_BCA',
    status: 'active',
    grantedAt: '2026-01-10T00:00:00Z',
    grantedBy: 'megaitdepartment@gmail.com',
  },
];

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
  const currentSuperAdminPwd = getSuperAdminPassword();

  // 1. Check Super Admin accounts
  if (
    (cleanEmail === 'megaitdepartment@gmail.com' && pass === currentSuperAdminPwd) ||
    (cleanEmail === 'superadmin@megacollege.edu.np' && pass === currentSuperAdminPwd) ||
    (cleanEmail === 'admin@megacollege.edu.np' && pass === currentSuperAdminPwd)
  ) {
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
      error: 'Invalid credentials. Faculty accounts are provisioned exclusively by Super Admin.',
    };
  }

  if (match.status === 'suspended') {
    return {
      success: false,
      error: 'Your Faculty Admin account has been suspended by the Super Admin.',
    };
  }

  if (match.passwordHash !== pass) {
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
    console.warn('Failed to store reset code', err);
  }

  return {
    success: true,
    verificationCode: code,
    accountName: isSuper ? 'Super Admin (Mega IT Department)' : facultyMatch?.name,
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
      return { success: false, error: 'No active password reset request found. Please request a new verification code.' };
    }

    const resetData = JSON.parse(raw);
    if (resetData.email !== cleanEmail) {
      return { success: false, error: 'The email address does not match the active reset request.' };
    }

    if (Date.now() > resetData.expiresAt) {
      return { success: false, error: 'The verification code has expired (15 minute validity). Please request a new one.' };
    }

    if (resetData.code !== cleanCode) {
      return { success: false, error: 'Invalid 6-digit security code entered. Please check and try again.' };
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

// Google Sign-In with Google Drive Scope & Fallback
export const googleSignIn = async (): Promise<{
  user: User;
  profile: UserProfile;
  accessToken: string | null;
} | null> => {
  try {
    isSigningIn = true;
    let result: any = null;
    let token: string | null = null;

    try {
      // 1. Try with Google Drive Scope
      result = await signInWithPopup(auth, driveProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      token = credential?.accessToken || null;
    } catch (driveErr: any) {
      const errCode = driveErr?.code || '';
      const errMsg = (driveErr?.message || '').toLowerCase();

      // If user declined the sensitive Drive permission or IdP denied access,
      // fallback to standard Google Auth so the user can still authenticate
      if (
        errCode === 'auth/user-cancelled' ||
        errMsg.includes('idp denied access') ||
        errMsg.includes('user-cancelled')
      ) {
        try {
          result = await signInWithPopup(auth, standardProvider);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          token = credential?.accessToken || null;
        } catch (standardErr: any) {
          const standardCode = standardErr?.code || '';
          if (
            standardCode === 'auth/popup-closed-by-user' ||
            standardCode === 'auth/user-cancelled' ||
            standardCode === 'auth/cancelled-popup-request'
          ) {
            throw new Error(
              'Sign-in was cancelled. Please select your Google account or use Email & Password.'
            );
          }
          throw standardErr;
        }
      } else if (errCode === 'auth/popup-closed-by-user' || errCode === 'auth/cancelled-popup-request') {
        throw new Error(
          'Sign-in window was closed before completion. Please try again or use Email & Password.'
        );
      } else {
        throw driveErr;
      }
    }

    if (!result || !result.user) {
      return null;
    }

    cachedAccessToken = token;
    const email = (result.user.email || '').toLowerCase();

    // Determine Role: Super Admin or Faculty Admin
    const isSuperAdmin =
      SUPER_ADMIN_EMAILS.some((e) => e.toLowerCase() === email) ||
      email.includes('megaitdepartment');

    let role: UserRole = 'faculty_admin';
    let department = 'Academic Department';
    let universityAffiliation: any = 'MEGA';

    if (isSuperAdmin) {
      role = 'super_admin';
      department = 'Mega IT Department (Full Access)';
    } else {
      // Check if faculty admin was authorized by Super Admin
      const facultyAccounts = getFacultyAccounts();
      const match = facultyAccounts.find((f) => f.email.toLowerCase() === email);

      if (!match) {
        // If not pre-authorized, inform the user
        throw new Error(
          `Access restricted: The Google Account (${email}) has not been granted Faculty Admin access by the Super Admin yet.`
        );
      }

      if (match.status === 'suspended') {
        throw new Error('Your Faculty Admin account is suspended by Super Admin.');
      }

      department = match.department;
      universityAffiliation = match.universityAffiliation;
    }

    const profile: UserProfile = {
      id: result.user.uid,
      name: result.user.displayName || (isSuperAdmin ? 'Super Admin' : 'Faculty Admin'),
      email,
      role,
      avatar: result.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      department,
      universityAffiliation,
      authMethod: 'google',
      permissions: {
        canUpload: true,
        canEdit: true,
        canDelete: role === 'super_admin',
        canCopyCrossUniversity: true,
        canManageUsers: role === 'super_admin',
        canViewAnalytics: true,
        canManageGoogleDrive: true,
      },
    };

    setActiveSessionProfile(profile);
    return { user: result.user, profile, accessToken: cachedAccessToken };
  } catch (err: any) {
    console.warn('Google Sign-In notice:', err?.message || err);
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logoutSession = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Sign out error:', err);
  }
  cachedAccessToken = null;
  setActiveSessionProfile(null);
};

export const initAuthListener = (
  onAuthChange: (profile: UserProfile | null, token: string | null) => void
) => {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const storedProfile = getActiveSessionProfile();
      if (storedProfile && cachedAccessToken) {
        onAuthChange(storedProfile, cachedAccessToken);
      }
    } else {
      // If signed out of Google but logged in via password, keep session
      const storedProfile = getActiveSessionProfile();
      if (storedProfile && storedProfile.authMethod === 'password') {
        onAuthChange(storedProfile, null);
      } else {
        onAuthChange(null, null);
      }
    }
  });
};
