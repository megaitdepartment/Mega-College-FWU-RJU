import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Mega College ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 text-slate-900 dark:text-slate-100">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Something unexpected happened
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The Mega College application encountered a minor state exception. Your stored offline papers and data remain safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
              <button
                onClick={this.handleReload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white dark:text-slate-950 text-xs font-bold hover:bg-emerald-600 transition cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
