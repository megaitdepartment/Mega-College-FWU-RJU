import React, { useState } from 'react';
import {
  X,
  Users,
  Plus,
  Trash2,
  KeyRound,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck,
  AlertCircle,
  Building,
} from 'lucide-react';
import { FacultyAdminAccount, UniversityCode, UserProfile } from '../../types';
import {
  getFacultyAccounts,
  createFacultyAccount,
  updateFacultyAccount,
  deleteFacultyAccount,
  getSuperAdminPassword,
  setSuperAdminPassword,
} from '../../services/authService';

interface FacultyUserManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const FacultyUserManagerModal: React.FC<FacultyUserManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [accounts, setAccounts] = useState<FacultyAdminAccount[]>(() => getFacultyAccounts());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Super Admin password state
  const [isEditingSuperPwd, setIsEditingSuperPwd] = useState(false);
  const [superAdminPwdInput, setSuperAdminPwdInput] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Department of Computer Science');
  const [universityAffiliation, setUniversityAffiliation] = useState<UniversityCode>('RJU');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const created = createFacultyAccount(
        {
          name,
          email,
          passwordHash: password,
          department,
          universityAffiliation,
        },
        currentUser.email
      );

      setAccounts(getFacultyAccounts());
      setIsAdding(false);
      setName('');
      setEmail('');
      setPassword('');
      setSuccess(`Faculty Admin account for ${created.name} (${created.email}) created successfully.`);
    } catch (err: any) {
      setError(err.message || 'Failed to create faculty account.');
    }
  };

  const handleToggleStatus = (account: FacultyAdminAccount) => {
    const newStatus = account.status === 'active' ? 'suspended' : 'active';
    updateFacultyAccount(account.id, { status: newStatus });
    setAccounts(getFacultyAccounts());
  };

  const handleUpdatePassword = (id: string) => {
    if (!newPassword.trim()) return;
    updateFacultyAccount(id, { passwordHash: newPassword.trim() });
    setAccounts(getFacultyAccounts());
    setEditingId(null);
    setNewPassword('');
    setSuccess('Password updated successfully.');
  };

  const handleUpdateSuperAdminPassword = () => {
    if (!superAdminPwdInput.trim() || superAdminPwdInput.trim().length < 6) {
      setError('Super Admin password must be at least 6 characters long.');
      return;
    }
    setSuperAdminPassword(superAdminPwdInput.trim());
    setIsEditingSuperPwd(false);
    setSuperAdminPwdInput('');
    setSuccess('Super Admin master password updated successfully.');
  };

  const handleDelete = (id: string, name: string) => {
    deleteFacultyAccount(id);
    setAccounts(getFacultyAccounts());
    setDeletingId(null);
    setSuccess(`Account for ${name} removed.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Faculty Admin Access &amp; Credential Manager
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Super Admin only: Provision email &amp; password access for Faculty Admins
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

        {/* Notices */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Section 1: Super Admin Master Credentials */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Super Admin Master Account</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-500/30">
                      Root Governance
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Primary System Governance Administrator
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsEditingSuperPwd(!isEditingSuperPwd);
                  setSuperAdminPwdInput('');
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 font-semibold hover:bg-rose-50 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                <span>{isEditingSuperPwd ? 'Cancel' : 'Change Master Password'}</span>
              </button>
            </div>

            {/* Inline Super Admin Password Form */}
            {isEditingSuperPwd && (
              <div className="pt-2 border-t border-rose-200/60 dark:border-rose-500/20 flex items-center gap-2 animate-in fade-in duration-150">
                <span className="font-semibold text-rose-900 dark:text-rose-300 text-[11px]">
                  New Master Password:
                </span>
                <input
                  type="text"
                  value={superAdminPwdInput}
                  onChange={(e) => setSuperAdminPwdInput(e.target.value)}
                  placeholder="Enter new Super Admin password (min 6 chars)"
                  className="flex-1 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/40 rounded-lg px-2.5 py-1 text-xs font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={handleUpdateSuperAdminPassword}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Save Password
                </button>
              </div>
            )}
          </div>

          {/* Top Bar with Add Button */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Active Faculty Admins ({accounts.length})
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Only accounts listed here can access the CMS and manage curriculum resources.
              </p>
            </div>

            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setError(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white dark:text-slate-950 font-bold hover:bg-emerald-600 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Cancel' : 'Add Faculty Admin'}</span>
            </button>
          </div>

          {/* Add Faculty Form */}
          {isAdding && (
            <form
              onSubmit={handleCreate}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-150"
            >
              <div className="font-bold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
                New Faculty Admin Credentials:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Faculty Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter faculty full name"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Official Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter official email address"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Initial Password</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set temporary or permanent password"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Program / University Affiliation</label>
                  <select
                    value={universityAffiliation}
                    onChange={(e) => setUniversityAffiliation(e.target.value as UniversityCode)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  >
                    <option value="FWU">FWU B.Sc.CSIT</option>
                    <option value="RJU">RJU B.Sc.CSIT</option>
                    <option value="RJU_BCA">RJU BCA (Bachelor of Computer Application)</option>
                    <option value="MEGA">Mega College All Programs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Department of Computer Science / RJU BCA Coordinator"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white dark:text-slate-950 font-bold hover:bg-emerald-600 transition"
                >
                  Save &amp; Grant Access
                </button>
              </div>
            </form>
          )}

          {/* Faculty List */}
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{acc.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          acc.status === 'active'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        {acc.status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                        {acc.universityAffiliation === 'RJU_BCA' ? 'RJU BCA' : acc.universityAffiliation}
                      </span>
                    </div>

                    <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 flex items-center gap-2">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{acc.email}</span>
                      <span>•</span>
                      <span>{acc.department}</span>
                    </div>
                  </div>

                  {/* Quick Status and Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      onClick={() => handleToggleStatus(acc)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {acc.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(editingId === acc.id ? null : acc.id);
                        setNewPassword('');
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                      title="Reset Password"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>

                    {deletingId === acc.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 p-1 rounded-lg animate-in fade-in duration-100">
                        <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold px-1">Delete?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(acc.id, acc.name)}
                          className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingId(acc.id)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                        title="Delete Faculty Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Password reset input inline */}
                {editingId === acc.id && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 animate-in fade-in duration-150">
                    <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs">New Password:</span>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono outline-none"
                    />
                    <button
                      onClick={() => handleUpdatePassword(acc.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
