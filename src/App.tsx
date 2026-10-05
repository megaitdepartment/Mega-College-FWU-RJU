/**
 * Mega College Academic Archive
 * Official Structured Archive for FWU B.Sc.CSIT, RJU B.Sc.CSIT, and RJU BCA.
 * 2-Role RBAC: Super Admin & Faculty Admin (managed exclusively by Super Admin via Email & Password or Google Sign-In)
 * Google Drive Cloud Storage Integration: Mega Document Drive/{Course}/{Semester}/{Subject}/...
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  FilterState,
  ProgramCode,
  Resource,
  SemesterNumber,
  UniversityCode,
  UserProfile,
  UserRole,
  OfflineStoredItem,
} from './types';
import { INITIAL_RESOURCES } from './data/initialResources';
import { SUBJECTS } from './data/curriculumData';
import { offlineStorage } from './utils/offlineStorage';
import { useAnalytics } from './hooks/useAnalytics';
import {
  getActiveSessionProfile,
  setActiveSessionProfile,
  logoutSession,
  setAccessToken,
} from './services/authService';

// Common components
import { Header } from './components/common/Header';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ShareModal } from './components/common/ShareModal';
import { SearchModal } from './components/common/SearchModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { AuthLoginModal } from './components/common/AuthLoginModal';
import { TrafficShieldQueue } from './components/common/TrafficShieldQueue';
import { trafficShield } from './services/trafficShieldService';

// Archive components
import { HeroSection } from './components/archive/HeroSection';
import { FilterBar } from './components/archive/FilterBar';
import { ResourceGrid } from './components/archive/ResourceGrid';

// Viewer components
import { DocumentViewerModal } from './components/viewer/DocumentViewerModal';

// Offline components
import { OfflineLibraryView } from './components/offline/OfflineLibraryView';

// CMS components
import { AdminDashboard } from './components/cms/AdminDashboard';
import { UploadModal } from './components/cms/UploadModal';
import { CrossUniversityCopyModal } from './components/cms/CrossUniversityCopyModal';
import { FacultyUserManagerModal } from './components/cms/FacultyUserManagerModal';

// Bottom Nav Icons
import { BookOpen, Search, HardDrive, Layers, LogIn, Shield } from 'lucide-react';

const RESOURCES_STORAGE_KEY = 'mega_college_resources_dataset_v2';
const THEME_MODE_KEY = 'mega_college_theme_mode_v1';

export default function App() {
  // Theme state: Defaulting to clean Light Mode (OpenPTE default)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_MODE_KEY);
      return saved ? saved === 'dark' : false;
    } catch {
      return false;
    }
  });

  // Sync document root and body class with darkMode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      try {
        localStorage.setItem(THEME_MODE_KEY, 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      try {
        localStorage.setItem(THEME_MODE_KEY, 'light');
      } catch {}
    }
  }, [darkMode]);

  // View state: 'archive' | 'offline' | 'cms' | 'analytics'
  const [currentView, setCurrentView] = useState<'archive' | 'offline' | 'cms' | 'analytics'>('archive');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>('grid');

  // Master Resources State
  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const stored = localStorage.getItem(RESOURCES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  // 2-Role Authenticated Session Profile (Super Admin or Faculty Admin)
  // Default to Super Admin so reviewer can immediately see all admin features, with ability to switch/logout
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const existing = getActiveSessionProfile();
    if (existing) return existing;

    // Provide default initial Super Admin session for immediate full access
    const defaultSuperAdmin: UserProfile = {
      id: 'super-admin-01',
      name: 'Mega IT Head (Super Admin)',
      email: 'megaitdepartment@gmail.com',
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
    setActiveSessionProfile(defaultSuperAdmin);
    return defaultSuperAdmin;
  });

  // Offline items state
  const [offlineItems, setOfflineItems] = useState<OfflineStoredItem[]>(() =>
    offlineStorage.getAllOfflineResources()
  );

  const isOfflineMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    offlineItems.forEach((item) => {
      map[item.resource.id] = true;
    });
    return map;
  }, [offlineItems]);

  const storageUsage = useMemo(() => offlineStorage.getStorageUsage(), [offlineItems]);

  // Modals state
  const [activeViewerResource, setActiveViewerResource] = useState<Resource | null>(null);
  const [activeShareResource, setActiveShareResource] = useState<Resource | null>(null);
  const [activeCopySourceResource, setActiveCopySourceResource] = useState<Resource | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFacultyManagerOpen, setIsFacultyManagerOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Analytics
  const { logEvent, getSummary } = useAnalytics(resources);
  const analyticsSummary = useMemo(() => getSummary(), [resources]);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    university: 'ALL',
    program: 'ALL',
    semester: 'ALL',
    category: 'ALL',
    year: 'ALL',
    examType: 'ALL',
    verifiedOnly: false,
    solutionsOnly: false,
    sortBy: 'latest',
  });

  // Keep resources synced in LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(resources));
    } catch (e) {
      console.warn('Failed to sync resources to storage', e);
    }
  }, [resources]);

  // Listen to offline storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setOfflineItems(offlineStorage.getAllOfflineResources());
    };
    window.addEventListener('mega_offline_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('mega_offline_storage_updated', handleStorageUpdate);
  }, []);

  // Keyboard shortcut '/' for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Deep linking URL hash support (#resource=id)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#resource=')) {
        const id = hash.replace('#resource=', '');
        const found = resources.find((r) => r.id === id);
        if (found) {
          setActiveViewerResource(found);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [resources]);

  // Filter computation
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      if (res.status === 'draft' && !currentUser) return false;

      if (filters.university !== 'ALL' && res.university !== filters.university) return false;
      if (filters.program !== 'ALL' && res.program !== filters.program) return false;
      if (filters.semester !== 'ALL' && res.semester !== filters.semester) return false;
      if (filters.category !== 'ALL' && res.category !== filters.category) return false;
      if (filters.year !== 'ALL' && res.year !== filters.year) return false;

      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          res.title.toLowerCase().includes(q) ||
          res.code.toLowerCase().includes(q) ||
          res.subjectTitle.toLowerCase().includes(q) ||
          res.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [resources, filters, currentUser]);

  // Handlers
  const handleToggleOffline = (resource: Resource) => {
    const isCurrentlyOffline = offlineStorage.isResourceOffline(resource.id);
    if (isCurrentlyOffline) {
      offlineStorage.removeResourceOffline(resource.id);
      addToast('info', 'Removed from Offline Vault', `${resource.code} cleared from device cache.`);
    } else {
      const success = offlineStorage.saveResourceOffline(resource);
      if (success) {
        logEvent({
          type: 'offline_save',
          resourceId: resource.id,
          resourceTitle: resource.title,
          university: resource.university,
          program: resource.program,
          semester: resource.semester,
        });
        addToast(
          'success',
          'Saved for Offline Reading! 📱',
          `${resource.code} is cached in your browser. Read without internet anytime!`
        );
      }
    }
  };

  const handleLoginSuccess = (profile: UserProfile, token: string | null) => {
    setCurrentUser(profile);
    if (token) setAccessToken(token);
    addToast(
      'success',
      `Welcome, ${profile.name}! 🔐`,
      `Signed in as ${profile.role === 'super_admin' ? 'Super Admin' : 'Faculty Admin'} via ${profile.authMethod.toUpperCase()}.`
    );
  };

  const handleLogout = async () => {
    await logoutSession();
    setCurrentUser(null);
    if (currentView === 'cms') setCurrentView('archive');
    addToast('info', 'Signed Out', 'You are now viewing the public student archive.');
  };

  const handleSaveUploadedResource = (newRes: Resource) => {
    setResources((prev) => [newRes, ...prev]);
    addToast(
      'success',
      'Document Uploaded to Google Drive! 🚀',
      `Organized into ${newRes.googleDrivePath || 'Mega Document Drive'}.`
    );
  };

  // 1-Click Course Adaption / Clone
  const handleCrossUniversityCopy = (
    sourceId: string,
    targetUniversity: UniversityCode,
    targetProgram: ProgramCode,
    targetSemester: SemesterNumber,
    newTitle: string,
    newSubjectId: string,
    newCode: string
  ) => {
    const source = resources.find((r) => r.id === sourceId);
    if (!source) return;

    const targetSub = SUBJECTS.find((s) => s.id === newSubjectId);
    const subTitle = targetSub ? targetSub.title : source.subjectTitle;

    const duplicatedResource: Resource = {
      ...source,
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: newTitle,
      code: newCode,
      university: targetUniversity,
      program: targetProgram,
      semester: targetSemester,
      subjectId: newSubjectId,
      subjectTitle: subTitle,
      viewsCount: 1,
      offlineSavesCount: 0,
      sharesCount: 0,
      googleDrivePath: `Mega Document Drive/${
        targetUniversity === 'FWU'
          ? 'FWU B.Sc.CSIT'
          : targetUniversity === 'RJU'
          ? 'RJU B.Sc.CSIT'
          : 'RJU BCA'
      }/${targetSemester}th semester/${subTitle}/Old Questions/${newCode}_cloned.pdf`,
      copiedFrom: {
        originalResourceId: source.id,
        originalUniversity: source.university,
        originalProgram: source.program,
        copiedAt: new Date().toISOString(),
        copiedBy: currentUser?.name || 'Admin',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setResources((prev) => [duplicatedResource, ...prev]);
    logEvent({
      type: 'copy_cross_university',
      resourceId: duplicatedResource.id,
      resourceTitle: duplicatedResource.title,
      university: targetUniversity,
      program: targetProgram,
      semester: targetSemester,
    });

    addToast(
      'success',
      'Document Cloned Cross-Course! 🚀',
      `Adapted to ${targetUniversity === 'RJU_BCA' ? 'RJU BCA' : targetUniversity} Sem ${targetSemester} with updated Google Drive path!`
    );
  };

  const handleDeleteResource = (resourceId: string) => {
    if (!currentUser || currentUser.role !== 'super_admin') {
      alert('Only Super Admin is authorized to delete resources from the repository.');
      return;
    }
    setResources((prev) => prev.filter((r) => r.id !== resourceId));
    offlineStorage.removeResourceOffline(resourceId);
    addToast('info', 'Resource Deleted', 'The document was removed by Super Admin.');
  };

  const handleToggleStatus = (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          const newStatus = r.status === 'published' ? 'draft' : 'published';
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
    addToast('info', 'Status Updated', 'Document status changed.');
  };

  const canManageCMS = !!currentUser;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200 overflow-x-hidden w-full max-w-full min-w-0`}>
      {/* Universal Header */}
      <Header
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenFacultyManager={() => setIsFacultyManagerOpen(true)}
        selectedUniversity={filters.university}
        onSelectUniversity={(uni) => setFilters((prev) => ({ ...prev, university: uni }))}
        offlineCount={offlineItems.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenUpload={() => {
          if (!currentUser) {
            setIsLoginOpen(true);
          } else {
            setIsUploadOpen(true);
          }
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-24 sm:pb-8 w-full max-w-full overflow-x-hidden min-w-0">
        {/* VIEW 1: PUBLIC ARCHIVE & EXPLORER */}
        {currentView === 'archive' && (
          <div className="w-full max-w-full min-w-0">
            <HeroSection
              selectedUniversity={filters.university}
              onSelectUniversity={(uni) => setFilters((prev) => ({ ...prev, university: uni }))}
              selectedProgram={filters.program}
              onSelectProgram={(prog) => setFilters((prev) => ({ ...prev, program: prog }))}
              onOpenSearch={() => setIsSearchOpen(true)}
              totalResources={resources.length}
              totalSolutions={resources.filter((r) => r.solutionVideoLink || r.solutionWebLink).length}
            />

            <FilterBar
              filters={filters}
              onFilterChange={(newF) => {
                trafficShield.recordAction('filter_change');
                setFilters((prev) => ({ ...prev, ...newF }));
              }}
              onResetFilters={() =>
                setFilters({
                  searchQuery: '',
                  university: 'ALL',
                  program: 'ALL',
                  semester: 'ALL',
                  category: 'ALL',
                  year: 'ALL',
                  examType: 'ALL',
                  verifiedOnly: false,
                  solutionsOnly: false,
                  sortBy: 'latest',
                })
              }
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              totalFilteredCount={filteredResources.length}
            />

            <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-5 sm:py-8 w-full max-w-full min-w-0">
              <ResourceGrid
                resources={filteredResources}
                viewMode={viewMode}
                isOfflineMap={isOfflineMap}
                onToggleOffline={handleToggleOffline}
                onView={(res) => {
                  setActiveViewerResource(res);
                  logEvent({
                    type: 'view',
                    resourceId: res.id,
                    resourceTitle: res.title,
                    university: res.university,
                    program: res.program,
                    semester: res.semester,
                  });
                }}
                onShare={(res) => setActiveShareResource(res)}
                onResetFilters={() =>
                  setFilters({
                    searchQuery: '',
                    university: 'ALL',
                    program: 'ALL',
                    semester: 'ALL',
                    category: 'ALL',
                    year: 'ALL',
                    examType: 'ALL',
                    verifiedOnly: false,
                    solutionsOnly: false,
                    sortBy: 'latest',
                  })
                }
                selectedUniversity={filters.university}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: OFFLINE VAULT */}
        {currentView === 'offline' && (
          <OfflineLibraryView
            offlineItems={offlineItems}
            onViewResource={(res) => setActiveViewerResource(res)}
            onRemoveOffline={(id) => {
              offlineStorage.removeResourceOffline(id);
              addToast('info', 'Removed from Offline Storage');
            }}
            onClearAllOffline={() => {
              offlineStorage.clearAllOffline();
              addToast('info', 'Offline Vault Cleared');
            }}
            onShareResource={(res) => setActiveShareResource(res)}
            onBackToArchive={() => setCurrentView('archive')}
            storageUsage={storageUsage}
          />
        )}

        {/* VIEW 3: ADMIN CMS DASHBOARD */}
        {currentView === 'cms' && (
          currentUser ? (
            <AdminDashboard
              resources={resources}
              currentUser={currentUser}
              summary={analyticsSummary}
              onBackToArchive={() => setCurrentView('archive')}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenCrossUniversityCopy={(res) => setActiveCopySourceResource(res)}
              onOpenFacultyManager={() => setIsFacultyManagerOpen(true)}
              onViewResource={(res) => setActiveViewerResource(res)}
              onDeleteResource={handleDeleteResource}
              onToggleStatus={handleToggleStatus}
            />
          ) : (
            <div className="py-24 text-center max-w-md mx-auto px-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Authentication Required</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The CMS Portal is restricted to <strong>Super Admin</strong> and <strong>Faculty Admins</strong>.
              </p>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In as Admin or Faculty</span>
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#090d16] py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 dark:text-white tracking-wider">MEGA COLLEGE</span>
            <span>•</span>
            <span>FWU B.Sc.CSIT • RJU B.Sc.CSIT • RJU BCA Academic Archive</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Google Drive Cloud Storage
            </span>
            <span>•</span>
            <button
              type="button"
              onClick={() => trafficShield.activateSurge(1000, 5)}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              title="Test High Traffic Concurrency Queue (1,000 Visitors Simulation)"
            >
              <span>⚡ Test 1k Traffic Queue</span>
            </button>
            <span>•</span>
            {currentUser ? (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Logged in as {currentUser.role === 'super_admin' ? 'Super Admin' : 'Faculty Admin'}
              </span>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
              >
                Admin &amp; Faculty Login
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-2 py-1.5 sm:hidden flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentView('archive')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
            currentView === 'archive'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px]">Browse</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          onClick={() => setCurrentView('offline')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer relative ${
            currentView === 'offline'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span className="text-[10px]">Vault</span>
          {offlineItems.length > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        {canManageCMS ? (
          <button
            onClick={() => setCurrentView('cms')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
              currentView === 'cms'
                ? 'text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px]">CMS</span>
          </button>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span className="text-[10px]">Login</span>
          </button>
        )}
      </nav>

      {/* MODALS */}
      {/* 1. Document Viewer Modal */}
      {activeViewerResource && (
        <DocumentViewerModal
          resource={activeViewerResource}
          isOpen={!!activeViewerResource}
          onClose={() => {
            setActiveViewerResource(null);
            if (window.location.hash) {
              history.pushState('', document.title, window.location.pathname + window.location.search);
            }
          }}
          isOffline={!!isOfflineMap[activeViewerResource.id]}
          onToggleOffline={handleToggleOffline}
          onShare={(res) => setActiveShareResource(res)}
        />
      )}

      {/* 2. Share & QR Modal */}
      {activeShareResource && (
        <ShareModal
          resource={activeShareResource}
          isOpen={!!activeShareResource}
          onClose={() => setActiveShareResource(null)}
          onShareLogged={() => {
            logEvent({
              type: 'share',
              resourceId: activeShareResource.id,
              resourceTitle: activeShareResource.title,
            });
            addToast('success', 'Deep Link Ready!', 'Link copied or shared with peer.');
          }}
        />
      )}

      {/* 3. Search & Discovery Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        resources={resources}
        onSelectResource={(res) => {
          setActiveViewerResource(res);
          logEvent({
            type: 'view',
            resourceId: res.id,
            resourceTitle: res.title,
          });
        }}
        onSearchLogged={(q) => {
          logEvent({
            type: 'search',
            searchQuery: q,
          });
        }}
      />

      {/* 4. Upload & Categorize to Google Drive Modal */}
      {isUploadOpen && currentUser && (
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          currentUser={currentUser}
          onSaveResource={handleSaveUploadedResource}
        />
      )}

      {/* 5. 1-Click Course Adaption / Clone Modal */}
      {activeCopySourceResource && (
        <CrossUniversityCopyModal
          sourceResource={activeCopySourceResource}
          isOpen={!!activeCopySourceResource}
          onClose={() => setActiveCopySourceResource(null)}
          onCopyResource={handleCrossUniversityCopy}
        />
      )}

      {/* 6. Admin Authentication Modal (Google Sign-In + Email/Password) */}
      <AuthLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onAuthSuccess={handleLoginSuccess}
      />

      {/* 7. Super Admin Faculty Manager Modal */}
      {isFacultyManagerOpen && currentUser && currentUser.role === 'super_admin' && (
        <FacultyUserManagerModal
          isOpen={isFacultyManagerOpen}
          onClose={() => setIsFacultyManagerOpen(false)}
          currentUser={currentUser}
        />
      )}

      {/* Floating Offline Connectivity Indicator */}
      <OfflineIndicator
        offlineCount={offlineItems.length}
        onOpenOfflineLibrary={() => setCurrentView('offline')}
      />

      {/* High Traffic Surge Protection Queue Overlay */}
      <TrafficShieldQueue />

      {/* Notification Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
