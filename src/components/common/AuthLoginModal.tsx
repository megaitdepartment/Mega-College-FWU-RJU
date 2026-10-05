import React, { useState } from 'react';
import {
  X,
  Shield,
  KeyRound,
  Mail,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { googleSignIn, loginWithEmailPassword } from '../../services/authService';
import { UserProfile } from '../../types';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile, token: string | null) => void;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'password'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        onAuthSuccess(res.profile, res.accessToken);
        onClose();
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (
        msg.includes('user-cancelled') ||
        msg.includes('denied access') ||
        msg.includes('popup-closed') ||
        msg.includes('cancelled')
      ) {
        setErrorMessage(
          'Google sign-in was cancelled or permission was declined. You can grant access and retry, or sign in directly with Email & Password below.'
        );
      } else {
        setErrorMessage(msg || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = loginWithEmailPassword(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      onAuthSuccess(result.user, null);
      onClose();
    } else {
      setErrorMessage(result.error || 'Authentication failed.');
    }
  };

  const fillQuickCredentials = (role: 'super' | 'faculty' | 'bca') => {
    if (role === 'super') {
      setEmail('megaitdepartment@gmail.com');
      setPassword('MegaAdmin@2026');
    } else if (role === 'faculty') {
      setEmail('faculty.csit@megacollege.edu.np');
      setPassword('Faculty@2026');
    } else {
      setEmail('bca.lead@megacollege.edu.np');
      setPassword('RjuBca@2026');
    }
    setActiveTab('password');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin &amp; Faculty Portal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Restricted to Super Admin &amp; Faculty Admins only
                </p>
              </div>
            </div>

            {/* Tab selector */}
            <div className="mt-4 grid grid-cols-2 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('google');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'google'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In with Google
              </button>
              <button
                onClick={() => {
                  setActiveTab('password');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'password'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Email &amp; Password
              </button>
            </div>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs space-y-2 animate-in fade-in duration-150">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="flex-1">{errorMessage}</span>
              </div>
              {activeTab === 'google' && (
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickCredentials('super')}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition cursor-pointer shadow-2xs"
                  >
                    Sign in with Super Admin Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('password');
                      setErrorMessage(null);
                    }}
                    className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 hover:underline"
                  >
                    Use Email Tab
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span className="flex-1">{successMessage}</span>
            </div>
          )}

          {/* Content Body */}
          <div className="p-6 space-y-4">
            {/* TAB 1: GOOGLE SIGN-IN */}
            {activeTab === 'google' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Authenticate with your Mega College Google account to sync archives directly with{' '}
                  <strong>Google Drive</strong> (
                  <code>Mega Document Drive/FWU B.Sc.CSIT/...</code>, <code>RJU B.Sc.CSIT/...</code>,{' '}
                  <code>RJU BCA/...</code>).
                </p>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
                </button>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Authorized Access Notice:</div>
                  <div>
                    • Super Admin: <code>megaitdepartment@gmail.com</code>
                  </div>
                  <div>• Faculty Admins: Must be authorized by Super Admin in the CMS before Google Sign-In.</div>
                </div>
              </div>
            )}

            {/* TAB 2: EMAIL & PASSWORD LOGIN */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email Address
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. megaitdepartment@gmail.com or faculty@..."
                      className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition">
                    <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password granted by Super Admin"
                      className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-none font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In as Admin'}
                </button>

                {/* Quick Credentials shortcut for reviewer / testing */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                    Test Demo Credentials:
                  </span>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('super')}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold text-center hover:bg-rose-100 cursor-pointer"
                    >
                      Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('faculty')}
                      className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold text-center hover:bg-emerald-100 cursor-pointer"
                    >
                      Faculty CSIT
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('bca')}
                      className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-semibold text-center hover:bg-indigo-100 cursor-pointer"
                    >
                      Faculty RJU BCA
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Linked Dedicated Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialEmail={email}
        onSuccess={(updatedEmail) => {
          setEmail(updatedEmail);
          setPassword('');
          setActiveTab('password');
          setSuccessMessage('Password reset successfully! Please log in with your new password.');
        }}
      />
    </>
  );
};
