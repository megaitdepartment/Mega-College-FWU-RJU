import React from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  Lock,
  UserCheck,
  Users,
  KeyRound,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface RoleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectRole: (role: UserRole) => void;
  onOpenFacultyManager?: () => void;
}

export const RoleManagerModal: React.FC<RoleManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectRole,
  onOpenFacultyManager,
}) => {
  if (!isOpen) return null;

  // Strictly 2 Roles: Super Admin & Faculty Admin
  const rolesMatrix: {
    id: UserRole;
    title: string;
    badge: string;
    description: string;
    color: string;
    permissions: { label: string; allowed: boolean }[];
  }[] = [
    {
      id: 'super_admin',
      title: 'Super Admin (Mega IT Department)',
      badge: 'Master Governance',
      description:
        'Complete authority over FWU B.Sc.CSIT, RJU B.Sc.CSIT, and RJU BCA curriculum, Google Drive structured folders, faculty admin provisioning via email & password, and analytics.',
      color:
        'border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300',
      permissions: [
        { label: 'Upload Documents & Questions (PDF or Image only)', allowed: true },
        { label: 'Provision Faculty Admins (Email & Password)', allowed: true },
        { label: 'Manage Google Drive Structured Folder Hierarchy', allowed: true },
        { label: '1-Click Cross-University Course Clone', allowed: true },
        { label: 'Direct Publish & Delete Resources', allowed: true },
        { label: 'Access Deep Analytics & Audit Logs', allowed: true },
      ],
    },
    {
      id: 'faculty_admin',
      title: 'Faculty Admin (Subject Coordinator)',
      badge: 'Authorized by Super Admin',
      description:
        'Access is granted by Super Admin only using email & password or verified Google Sign-In. Can upload past questions (PDF or JPG/JPEG/PNG only) to Google Drive, provide reference & solution links, and manage curriculum.',
      color:
        'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
      permissions: [
        { label: 'Upload Documents & Questions (PDF or Image only)', allowed: true },
        { label: 'Attach Solution Links & Video Tutorials', allowed: true },
        { label: 'Sync directly to structured Google Drive folder', allowed: true },
        { label: '1-Click Cross-University Course Clone', allowed: true },
        { label: 'Access Analytics for Courses', allowed: true },
        { label: 'Manage & Provision User Accounts', allowed: false },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Role-Based Access Control (Strictly 2 Roles)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Super Admin &amp; Faculty Admin (Granted by Super Admin via Email &amp; Password)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {rolesMatrix.map((role) => {
            const isActive = currentUser.role === role.id;

            return (
              <div
                key={role.id}
                onClick={() => {
                  onSelectRole(role.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-slate-50 dark:bg-slate-950 ring-2 ring-emerald-500 border-emerald-500 shadow-md'
                    : 'bg-white dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                        {role.title}
                      </h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${role.color}`}>
                        {role.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{role.description}</p>
                  </div>

                  {isActive && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white dark:text-slate-950 text-xs font-bold shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Active Session</span>
                    </div>
                  )}
                </div>

                {/* Permissions Breakdown */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {role.permissions.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      {p.allowed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                      )}
                      <span className={p.allowed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500 line-through'}>
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Quick link for Super Admin to manage Faculty Admin credentials */}
          {currentUser.role === 'super_admin' && onOpenFacultyManager && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 flex items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  <span>Provision Faculty Admin Accounts</span>
                </h5>
                <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">
                  Create, update passwords, or revoke access for faculty coordinators using email and password.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenFacultyManager();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
              >
                Manage Credentials
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
