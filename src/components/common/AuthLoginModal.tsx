import React, { useState } from 'react';
import {
  X,
  Shield,
  KeyRound,
  Mail,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { loginWithEmailPassword } from '../../services/authService';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  if (!isOpen) return null;

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
      setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Admin &amp; Faculty Portal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Restricted to authorized Super Admin &amp; Faculty Admins
                </p>
              </div>
            </div>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span className="flex-1">{successMessage}</span>
            </div>
          )}

          {/* Content Body: Email & Password Login */}
          <div className="p-6">
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email Address
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered official email"
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
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition">
                  <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-none font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white dark:text-slate-950 text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In as Admin'}
              </button>
            </form>
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
          setSuccessMessage('Password updated successfully! Please log in with your new password.');
        }}
      />
    </>
  );
};
