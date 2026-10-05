import { OfflineStoredItem, Resource } from '../types';

const OFFLINE_STORAGE_KEY = 'mega_college_offline_resources_v1';
const RECENT_SEARCHES_KEY = 'mega_college_recent_searches_v1';
const BOOKMARKS_KEY = 'mega_college_bookmarks_v1';

export const offlineStorage = {
  /**
   * Get all offline cached resources
   */
  getAllOfflineResources(): OfflineStoredItem[] {
    try {
      const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to read offline resources from storage', e);
      return [];
    }
  },

  /**
   * Check if a specific resource is saved offline
   */
  isResourceOffline(resourceId: string): boolean {
    const items = this.getAllOfflineResources();
    return items.some((item) => item.resource.id === resourceId);
  },

  /**
   * Save a resource into offline cache bundle
   */
  saveResourceOffline(resource: Resource): boolean {
    try {
      const items = this.getAllOfflineResources();
      const existingIdx = items.findIndex((item) => item.resource.id === resource.id);

      // Estimate bundle size in bytes
      const jsonString = JSON.stringify(resource);
      const estimatedBytes = new Blob([jsonString]).size + 150000; // includes simulated cached canvas bundle

      const newItem: OfflineStoredItem = {
        resource,
        savedAt: new Date().toISOString(),
        dataBundleSize: estimatedBytes,
      };

      if (existingIdx >= 0) {
        items[existingIdx] = newItem;
      } else {
        items.unshift(newItem);
      }

      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('mega_offline_storage_updated'));
      return true;
    } catch (e) {
      console.error('Failed to save resource offline', e);
      return false;
    }
  },

  /**
   * Remove a resource from offline cache
   */
  removeResourceOffline(resourceId: string): boolean {
    try {
      const items = this.getAllOfflineResources();
      const filtered = items.filter((item) => item.resource.id !== resourceId);
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('mega_offline_storage_updated'));
      return true;
    } catch (e) {
      console.error('Failed to remove offline resource', e);
      return false;
    }
  },

  /**
   * Calculate total offline storage used
   */
  getStorageUsage(): { usedBytes: number; usedMB: string; count: number } {
    const items = this.getAllOfflineResources();
    const totalBytes = items.reduce((acc, item) => acc + (item.dataBundleSize || 120000), 0);
    const usedMB = (totalBytes / (1024 * 1024)).toFixed(2);
    return {
      usedBytes: totalBytes,
      usedMB,
      count: items.length,
    };
  },

  /**
   * Clear all offline cached data
   */
  clearAllOffline(): void {
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('mega_offline_storage_updated'));
  },

  /**
   * Recent searches management
   */
  getRecentSearches(): string[] {
    try {
      const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
      return searches ? JSON.parse(searches) : ['C Programming 2080', 'DSA AVL Tree', 'FWU CSIT 1st Sem', 'BCA Web Technology'];
    } catch {
      return [];
    }
  },

  addRecentSearch(term: string): void {
    if (!term.trim()) return;
    try {
      let searches = this.getRecentSearches();
      searches = [term.trim(), ...searches.filter((s) => s.toLowerCase() !== term.trim().toLowerCase())].slice(0, 8);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (e) {
      console.warn('Failed to save recent search', e);
    }
  },

  /**
   * Bookmarks management
   */
  getBookmarks(): string[] {
    try {
      const bm = localStorage.getItem(BOOKMARKS_KEY);
      return bm ? JSON.parse(bm) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(resourceId: string): boolean {
    try {
      let bookmarks = this.getBookmarks();
      const isBookmarked = bookmarks.includes(resourceId);
      if (isBookmarked) {
        bookmarks = bookmarks.filter((id) => id !== resourceId);
      } else {
        bookmarks.push(resourceId);
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return !isBookmarked;
    } catch {
      return false;
    }
  },
};
