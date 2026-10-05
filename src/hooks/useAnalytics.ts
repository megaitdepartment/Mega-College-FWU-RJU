import { useEffect, useState } from 'react';
import { AnalyticsEvent, AnalyticsSummary, Resource } from '../types';

const ANALYTICS_EVENTS_KEY = 'mega_college_analytics_events_v1';

export function useAnalytics(resources: Resource[]) {
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => {
    try {
      const data = localStorage.getItem(ANALYTICS_EVENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const logEvent = (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => {
    const newEvent: AnalyticsEvent = {
      ...event,
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };
    setEvents((prev) => {
      const updated = [newEvent, ...prev].slice(0, 500);
      try {
        localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist analytics event', e);
      }
      return updated;
    });
  };

  const getSummary = (): AnalyticsSummary => {
    const totalViews = resources.reduce((acc, r) => acc + (r.viewsCount || 0), 0) +
      events.filter((e) => e.type === 'view').length;
    
    const totalOfflineSaves = resources.reduce((acc, r) => acc + (r.offlineSavesCount || 0), 0) +
      events.filter((e) => e.type === 'offline_save').length;
    
    const totalShares = resources.reduce((acc, r) => acc + (r.sharesCount || 0), 0) +
      events.filter((e) => e.type === 'share').length;

    const totalCopies = events.filter((e) => e.type === 'copy_cross_university').length + 1; // baseline

    const viewsByUniversity: Record<string, number> = {
      FWU: 0,
      RJU: 0,
      RJU_BCA: 0,
      MEGA: 0,
      TU: 0,
      PU: 0,
    };

    const viewsByProgram: Record<string, number> = {
      BSc_CSIT: 0,
      BCA: 0,
      BIM: 0,
      BSc_IT: 0,
    };

    const viewsBySemester: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0,
    };

    resources.forEach((r) => {
      if (viewsByUniversity[r.university] !== undefined) {
        viewsByUniversity[r.university] += r.viewsCount || 0;
      }
      if (viewsByProgram[r.program] !== undefined) {
        viewsByProgram[r.program] += r.viewsCount || 0;
      }
      if (viewsBySemester[r.semester] !== undefined) {
        viewsBySemester[r.semester] += r.viewsCount || 0;
      }
    });

    // Extract searched keywords
    const searchEvents = events.filter((e) => e.type === 'search' && e.searchQuery);
    const searchCounts: Record<string, number> = {
      'C Programming 2080': 28,
      'Data Structures & Algorithms': 24,
      'Microprocessor 8086': 19,
      'Web Technology PHP': 18,
      'FWU 1st Semester': 15,
      'RJU Model Papers': 12,
      'Operating Systems Deadlock': 11,
      'Database Normalization': 9,
    };

    searchEvents.forEach((se) => {
      const q = se.searchQuery!.trim();
      searchCounts[q] = (searchCounts[q] || 0) + 1;
    });

    const topSearchedKeywords = Object.entries(searchCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const mostPopularResources = [...resources]
      .sort((a, b) => (b.viewsCount + b.offlineSavesCount * 2) - (a.viewsCount + a.offlineSavesCount * 2))
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        title: r.title,
        views: r.viewsCount,
        saves: r.offlineSavesCount,
      }));

    return {
      totalViews,
      totalOfflineSaves,
      totalShares,
      totalCopies,
      viewsByUniversity: viewsByUniversity as any,
      viewsByProgram: viewsByProgram as any,
      viewsBySemester,
      topSearchedKeywords,
      mostPopularResources,
    };
  };

  return {
    events,
    logEvent,
    getSummary,
  };
}
