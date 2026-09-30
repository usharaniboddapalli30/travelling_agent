import React from 'react';
import { Activity, ExternalLink, Settings, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { EndpointHealth } from '../types/n8n';

interface HeaderProps {
  currentUrl: string;
  isTestMode: boolean;
  onToggleMode: (testMode: boolean) => void;
  onOpenSettings: () => void;
  health: EndpointHealth;
  onOpenEmbedded: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUrl,
  isTestMode,
  onToggleMode,
  onOpenSettings,
  health,
  onOpenEmbedded,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold shadow-xs">
            <Zap className="w-5 h-5 text-[#ff5d56]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 tracking-tight text-lg">FlowBridge</span>
              <span className="text-zinc-300">/</span>
              <span className="text-xs font-medium text-zinc-600">n8n Connected</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono-code truncate max-w-[200px] sm:max-w-[320px]">
              <span>usharaniboddpalli.app.n8n.cloud</span>
            </div>
          </div>
        </div>

        {/* Middle Status Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Target</span>
          <span className="text-zinc-300">·</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                health.triggerState === 'active'
                  ? 'bg-emerald-500'
                  : health.triggerState === 'standby'
                  ? 'bg-amber-500 animate-pulse'
                  : health.triggerState === 'checking'
                  ? 'bg-blue-500 animate-ping'
                  : 'bg-zinc-400'
              }`}
            />
            <span
              className={
                health.triggerState === 'active'
                  ? 'text-emerald-700'
                  : health.triggerState === 'standby'
                  ? 'text-amber-700'
                  : 'text-zinc-700'
              }
            >
              {health.triggerState === 'active'
                ? 'Trigger Active'
                : health.triggerState === 'standby'
                ? 'n8n In Test Standby'
                : health.triggerState === 'checking'
                ? 'Checking...'
                : 'Standby Ready'}
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Segmented Mode Control */}
          <div className="flex items-center p-0.5 bg-zinc-100 rounded-lg border border-zinc-200">
            <button
              type="button"
              onClick={() => onToggleMode(true)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                isTestMode
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Test Mode
            </button>
            <button
              type="button"
              onClick={() => onToggleMode(false)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                !isTestMode
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Production
            </button>
          </div>

          {/* Embedded View Quick Button */}
          <button
            type="button"
            onClick={onOpenEmbedded}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-xs transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-zinc-500" />
            <span>n8n View</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors"
            title="Configure n8n Webhook URL"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Open direct in n8n Cloud */}
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <span>Open URL</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
