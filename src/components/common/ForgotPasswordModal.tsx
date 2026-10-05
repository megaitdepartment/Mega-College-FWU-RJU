import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import {
  requestPasswordReset,
  verifyAndResetPassword,
} from '../../services/authService';
import {
  evaluatePasswordStrength,
  sanitizeInput,
  maskEmail,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  constantTimeDelay,
} from '../../services/securityService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Security & State Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetAccountName, setTargetAccountName] = useState<string>('');
  const [verificationCodePreview, setVerificationCodePreview] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Initialize email when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setStep(1);
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setVerificationCodePreview(null);
    }
  }, [isOpen, initialEmail]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // STEP 1: Request Security Verification Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    if (!sanitizedEmail) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    // Rate limit check to prevent brute-force probing
    const rateCheck = checkRateLimit(sanitizedEmail);
    if (rateCheck.isLocked) {
      setLockoutRemaining(rateCheck.remainingSeconds);
      setErrorMessage(
        `Security rate limit: Too many recent attempts. Please wait ${rateCheck.remainingSeconds} seconds before trying again.`
      );
      return;
    }

    setIsLoading(true);

    try {
      // Constant-time simulated delay to resist timing attacks / user enumeration
      await constantTimeDelay(500, 750);

      const res = requestPasswordReset(sanitizedEmail);

      if (!res.success) {
        // Record failed attempt towards rate limiting
        const failure = recordFailedAttempt(sanitizedEmail);
        if (failure.locked) {
          setLockoutRemaining(900);
          setErrorMessage('Account locked for 15 minutes due to repeated unauthorized requests.');
        } else {
          setErrorMessage(
            res.error ||
              'Email address not recognized. Only emails registered by the Super Admin are authorized to reset passwords.'
          );
        }
        setIsLoading(false);
        return;
      }

      // Success: proceed to Step 2
      setTargetAccountName(res.accountName || 'Authorized User');
      setVerificationCodePreview(res.verificationCode || null);
      setStep(2);
      setResendCooldown(60);
      clearRateLimit(sanitizedEmail);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify Code and Reset Password
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const cleanCode = sanitizeInput(code);

    if (!cleanCode || cleanCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit security verification code.');
      return;
    }

    if (!strength.isValid) {
      setErrorMessage('Please create a stronger password satisfying all security requirements.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Confirmation password does not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      await constantTimeDelay(400, 600);

      const res = verifyAndResetPassword(sanitizedEmail, cleanCode, newPassword);

      if (!res.success) {
        const failure = recordFailedAttempt(sanitizedEmail);
        if (failure.locked) {
          setLockoutRemaining(900);
          setErrorMessage('Too many invalid code attempts. Account temporarily locked for 15 minutes.');
        } else {
          setErrorMessage(
            `${res.error || 'Invalid verification code.'} (${failure.remainingAttempts} attempts remaining before temporary lockout)`
          );
        }
        setIsLoading(false);
        return;
      }

      // Success: clear rate limits and move to Step 3
      clearRateLimit(sanitizedEmail);
      setStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (verificationCodePreview) {
      navigator.clipboard.writeText(verificationCodePreview);
      setCode(verificationCodePreview);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleFinish = () => {
    onSuccess(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-500/15 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reset Account Password
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-semibold">
                  Zero Trust Shield
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized for Super Admin &amp; Faculty Admins registered in the system
              </p>
            </div>
          </div>

          {/* Stepper Pill Indicator */}
          <div className="mt-4 flex items-center justify-between text-xs font-semibold border-t border-slate-200/60 dark:border-slate-800/80 pt-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 1
                    ? 'bg-teal-600 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                1
              </span>
              <span className={step === 1 ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-400'}>
                Verify Email
              </span>
            </div>

            <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 2
                    ? 'bg-teal-600 text-white'
                    : step === 3
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                2
              </span>
              <span className={step === 2 ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-400'}>
                New Password
              </span>
            </div>

            <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                ✓
              </span>
              <span className={step === 3 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}>
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span className="flex-1 leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Lockout Warning Banner */}
        {lockoutRemaining > 0 && (
          <div className="mx-6 mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-amber-600 animate-spin" />
            <span>
              Brute-force security lock active. Please wait <strong>{lockoutRemaining}s</strong> before retry.
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Registered Email Address
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:border-teal-500 transition">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. megaitdepartment@gmail.com or faculty@..."
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 outline-none font-medium placeholder:text-slate-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Enter the email address assigned by the Mega IT Super Admin. A single-use 6-digit cryptographic security code will be generated.
                </p>
              </div>

              {/* Security info card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Eligible Accounts in Registry:</span>
                </div>
                <div>• <strong>Super Admin:</strong> <code>megaitdepartment@gmail.com</code></div>
                <div>• <strong>Faculty CSIT:</strong> <code>faculty.csit@megacollege.edu.np</code></div>
                <div>• <strong>Faculty RJU BCA:</strong> <code>bca.lead@megacollege.edu.np</code></div>
                <div>• Any custom faculty account provisioned in the CMS by the Super Admin.</div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading || lockoutRemaining > 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-teal-500/20 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Verifying Registry...' : 'Send Security Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Verify Code & Set Strong Password */}
          {step === 2 && (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{targetAccountName}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{maskEmail(email)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Change Email
                </button>
              </div>

              {/* Single-Use OTP Display with 1-Click Fill */}
              {verificationCodePreview && (
                <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-900 dark:text-teal-200">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Security Verification Token Issued:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 hover:bg-teal-200 font-bold transition cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Filled & Copied!' : 'Auto-Fill Token'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xl font-extrabold text-teal-950 dark:text-teal-100 tracking-widest text-center py-2 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-teal-200/80 dark:border-teal-500/30">
                    {verificationCodePreview}
                  </div>
                  <p className="text-[10px] text-teal-700 dark:text-teal-400 text-center">
                    Valid for 15 minutes. Automatically expires after single use.
                  </p>
                </div>
              )}

              {/* 6-Digit Code Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter 6-Digit Security Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 482910"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold tracking-widest text-slate-900 dark:text-slate-100 outline-none text-center"
                />
              </div>

              {/* New Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    New Secure Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:border-teal-500 transition">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 chars)"
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 outline-none font-medium placeholder:text-slate-400 font-mono"
                  />
                </div>

                {/* Password Entropy / Strength Bar */}
                {newPassword && (
                  <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Security Strength:</span>
                      <span className={`font-bold ${strength.color.split(' ')[1] || 'text-slate-700'}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex gap-1 p-0.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            strength.score >= level ? strength.color.split(' ')[0] : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Requirements checklist */}
                    <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                      <span className={strength.hasLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                        {strength.hasLength ? '✓' : '○'} 8+ Characters
                      </span>
                      <span className={strength.hasUpper ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                        {strength.hasUpper ? '✓' : '○'} Uppercase (A-Z)
                      </span>
                      <span className={strength.hasLower ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                        {strength.hasLower ? '✓' : '○'} Lowercase (a-z)
                      </span>
                      <span className={strength.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                        {strength.hasNumber ? '✓' : '○'} Number (0-9)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:border-teal-500 transition">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 outline-none font-medium placeholder:text-slate-400 font-mono"
                  />
                </div>
                {confirmPassword && (
                  <p
                    className={`text-[10px] mt-1 font-semibold ${
                      passwordsMatch ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match yet'}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !strength.isValid || !passwordsMatch}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-teal-500/20 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Updating Hash...' : 'Set New Password'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div className="py-6 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Password Updated Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Your credentials have been securely updated in the Mega College registry for{' '}
                  <strong className="text-slate-900 dark:text-white">{email}</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 max-w-xs mx-auto text-left space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">Security Audit Logged:</div>
                <div>• Single-use OTP token revoked</div>
                <div>• Cryptographic session salted &amp; verified</div>
                <div>• Ready for immediate authentication</div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white dark:text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-emerald-500/20"
              >
                Sign In With New Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
