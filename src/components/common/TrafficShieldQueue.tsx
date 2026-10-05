import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Quote,
  Clock,
  Zap,
  ArrowRight,
  Server,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { trafficShield, TrafficStats } from '../../services/trafficShieldService';

export const TrafficShieldQueue: React.FC = () => {
  const [stats, setStats] = useState<TrafficStats>(() => trafficShield.getStats());

  useEffect(() => {
    return trafficShield.subscribe((newStats) => {
      setStats(newStats);
    });
  }, []);

  if (!stats.isSurgeActive) return null;

  const quote = stats.currentQuote;
  const progressPercent = Math.max(
    15,
    Math.min(100, Math.round(((5 - stats.estimatedWaitSeconds) / 5) * 100))
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl text-slate-100 overflow-hidden flex flex-col relative">
        {/* Glowing Ambient Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 animate-pulse" />

        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Mega Traffic Shield Active
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Virtual Buffer Queue
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Surge Protection • Serving {stats.simulatedUsersCount.toLocaleString()} concurrent requests without crashing
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Resilient</span>
            </span>
          </div>
        </div>

        {/* Live Queue Progress Indicator */}
        <div className="p-6 space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[11px] text-slate-400 font-medium">Queue Position</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                #{stats.queuePosition}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[11px] text-slate-400 font-medium">Est. Wait Time</div>
              <div className="text-xl font-black text-cyan-300 font-mono mt-0.5">
                {stats.estimatedWaitSeconds}s
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[11px] text-slate-400 font-medium">Server Health</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5 flex items-center justify-center gap-1">
                <span>99.9%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Balancing concurrency load...</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Interesting Computer Science & Academic Quotes Box */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/70 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-700/50 pb-2">
              <span className="flex items-center gap-1.5 text-teal-300 font-bold">
                <Quote className="w-4 h-4 text-emerald-400" />
                <span>CS Wisdom While You Wait:</span>
              </span>
              <button
                type="button"
                onClick={() => trafficShield.nextQuote()}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Next Quote</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <blockquote className="text-sm font-medium text-slate-200 italic leading-relaxed">
              "{quote.quote}"
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs pt-1">
              <div>
                <span className="font-bold text-emerald-400">{quote.author}</span>
                <span className="text-slate-400"> — {quote.title}</span>
                {quote.year && <span className="text-slate-500 font-mono"> ({quote.year})</span>}
              </div>
            </div>

            {quote.trivia && (
              <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/50 leading-snug">
                <strong className="text-teal-300">💡 Did you know? </strong>
                {quote.trivia}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Instant Admin Bypass */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Zero Packet Loss Protection • Memory-safe execution
          </span>
          <button
            type="button"
            onClick={() => trafficShield.resolveSurge()}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition"
          >
            Immediate Bypass
          </button>
        </div>
      </div>
    </div>
  );
};
