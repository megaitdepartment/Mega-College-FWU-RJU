import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  HardDrive,
  Shield,
  Moon,
  Sun,
  Layers,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LogIn,
  Users,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { ProgramCode, UniversityCode, UserProfile, UserRole } from '../../types';
import { UNIVERSITIES } from '../../data/curriculumData';

interface HeaderProps {
  currentView: 'archive' | 'offline' | 'cms' | 'analytics';
  onChangeView: (view: 'archive' | 'offline' | 'cms' | 'analytics') => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenFacultyManager: () => void;
  selectedUniversity: UniversityCode | 'ALL';
  onSelectUniversity: (uni: UniversityCode | 'ALL') => void;
  offlineCount: number;
  onOpenSearch: () => void;
  onOpenUpload: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onChangeView,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenFacultyManager,
  selectedUniversity,
  onSelectUniversity,
  offlineCount,
  onOpenSearch,
  onOpenUpload,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const canManageCMS = currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'faculty_admin');

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-2 max-w-full">
            {/* Brand & Logo */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <button
                onClick={() => {
                  onChangeView('archive');
                  onSelectUniversity('ALL');
                }}
                className="flex items-center gap-1.5 sm:gap-3 text-left group cursor-pointer min-w-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[1.5px] shadow-sm shadow-emerald-500/15 group-hover:scale-105 transition shrink-0">
                  <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate">
                      MEGA PORTAL
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden lg:block truncate">
                    FWU B.Sc.CSIT • RJU B.Sc.CSIT • RJU BCA
                  </p>
                </div>
              </button>
            </div>

            {/* Quick University Nav Filters */}
            <nav className="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => {
                  onSelectUniversity('ALL');
                  onChangeView('archive');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedUniversity === 'ALL' && currentView === 'archive'
                    ? 'bg-emerald-500 text-white dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All Courses
              </button>
              {UNIVERSITIES.map((uni) => (
                <button
                  key={uni.id}
                  onClick={() => {
                    onSelectUniversity(uni.id);
                    onChangeView('archive');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    selectedUniversity === uni.id && currentView === 'archive'
                      ? 'bg-emerald-500 text-white dark:text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {uni.name}
                </button>
              ))}
            </nav>

            {/* Search Trigger Button */}
            <div className="flex-1 max-w-xs hidden md:block">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 hover:bg-slate-200/80 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs transition cursor-pointer group shadow-2xs"
              >
                <span className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 shrink-0 transition" />
                  <span className="text-slate-600 dark:text-slate-400 truncate">Search FWU, RJU CSIT, RJU BCA...</span>
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                  /
                </kbd>
              </button>
            </div>

            {/* Actions & Utilities */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Search icon mobile */}
              <button
                onClick={onOpenSearch}
                className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
                title="Search Question Papers"
              >
                <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>

              {/* Offline Vault Button (Desktop / Tablet - on mobile it's in bottom bar) */}
              <button
                onClick={() => onChangeView('offline')}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  currentView === 'offline'
                    ? 'bg-emerald-500 text-white dark:text-slate-950 border-emerald-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 shadow-2xs'
                }`}
                title="Offline Saved Questions"
              >
                <HardDrive className={`w-3.5 h-3.5 shrink-0 ${currentView === 'offline' ? 'text-white dark:text-slate-950' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span className="hidden sm:inline">Vault</span>
                {offlineCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    currentView === 'offline'
                      ? 'bg-white text-emerald-700 dark:bg-slate-950 dark:text-emerald-400'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                  }`}>
                    {offlineCount}
                  </span>
                )}
              </button>

              {/* CMS Link for Super Admin & Faculty Admin */}
              {canManageCMS && (
                <button
                  onClick={() => onChangeView('cms')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    currentView === 'cms'
                      ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 border-teal-600 dark:border-teal-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-teal-700 dark:text-teal-400 hover:border-teal-500/40 shadow-2xs'
                  }`}
                  title="Admin CMS & Google Drive Question Manager"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>CMS</span>
                </button>
              )}

              {/* Quick Upload Button for Authenticated Admin/Faculty */}
              {currentUser && currentUser.permissions.canUpload && (
                <button
                  onClick={onOpenUpload}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold transition cursor-pointer shadow-xs"
                  title="Upload Question Paper (PDF or Image)"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              )}

              {/* PWA Install Button */}
              <div className="hidden sm:block">
                <PWAInstallButton />
              </div>

              {/* 2-Role Authenticated Menu or Login Button */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition cursor-pointer shadow-2xs shrink-0 ${
                      currentUser.role === 'super_admin'
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{currentUser.role === 'super_admin' ? 'Super Admin' : 'Faculty Admin'}</span>
                    <span className="sm:hidden text-[10px]">{currentUser.role === 'super_admin' ? 'Admin' : 'Faculty'}</span>
                    <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 shadow-xl z-50 text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {currentUser.email}
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400">
                          {currentUser.role === 'super_admin' ? 'Full Super Admin Access' : 'Faculty Admin Access'}
                        </span>
                      </div>

                      {/* Super Admin Faculty Management Option */}
                      {currentUser.role === 'super_admin' && (
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenFacultyManager();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                        >
                          <Users className="w-4 h-4 text-rose-500" />
                          <span>Manage Faculty Accounts</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onChangeView('cms');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Layers className="w-4 h-4 text-teal-500" />
                        <span>Admin CMS Dashboard</span>
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white dark:text-slate-950 text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                  title="Super Admin & Faculty Admin Portal"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Login</span>
                  <span className="sm:hidden text-[11px]">Login</span>
                </button>
              )}

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition cursor-pointer shadow-2xs shrink-0"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer shrink-0"
                title="Open Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="xl:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
              {/* Courses Switcher on Mobile */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Academic Programs
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      onSelectUniversity('ALL');
                      onChangeView('archive');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl font-semibold text-center border transition ${
                      selectedUniversity === 'ALL' && currentView === 'archive'
                        ? 'bg-emerald-500 text-white dark:text-slate-950 border-emerald-500 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    All Courses
                  </button>
                  {UNIVERSITIES.map((uni) => (
                    <button
                      key={uni.id}
                      onClick={() => {
                        onSelectUniversity(uni.id);
                        onChangeView('archive');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2 rounded-xl font-semibold text-center border transition ${
                        selectedUniversity === uni.id && currentView === 'archive'
                          ? 'bg-emerald-500 text-white dark:text-slate-950 border-emerald-500 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {uni.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons in Mobile Drawer */}
              <div className="pt-2 flex flex-col gap-2 text-xs">
                {currentUser ? (
                  <>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500">{currentUser.role === 'super_admin' ? 'Super Admin' : 'Faculty Admin'}</div>
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-rose-600 font-bold"
                      >
                        Sign Out
                      </button>
                    </div>

                    {currentUser.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          onOpenFacultyManager();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-500/20"
                      >
                        <Users className="w-4 h-4" />
                        <span>Manage Faculty Admin Accounts</span>
                      </button>
                    )}

                    {canManageCMS && (
                      <button
                        onClick={() => {
                          onChangeView('cms');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-500/15 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 font-bold"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Admin CMS Dashboard</span>
                      </button>
                    )}

                    {currentUser.permissions.canUpload && (
                      <button
                        onClick={() => {
                          onOpenUpload();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white dark:text-slate-950 font-bold"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Upload Question / Note</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white dark:text-slate-950 font-bold"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Admin &amp; Faculty Login (Google / Password)</span>
                  </button>
                )}

                <div className="pt-1">
                  <PWAInstallButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
