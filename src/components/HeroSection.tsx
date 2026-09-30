import React from 'react';
import { ArrowDown, RefreshCw, Sparkles, Check, Copy } from 'lucide-react';
import { EndpointHealth } from '../types/n8n';

interface HeroSectionProps {
  currentUrl: string;
  isTestMode: boolean;
  health: EndpointHealth;
  onRefreshHealth: () => void;
  onScrollToForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUrl,
  isTestMode,
  health,
  onRefreshHealth,
  onScrollToForm,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-10 bg-white border-b border-zinc-200">
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          {/* Subtle text kicker (no pill badge) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            <span>Automated Intake Engine</span>
            <span aria-hidden="true">·</span>
            <span>Cloud Workflow Bridge</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#ea4b71] font-mono-code font-normal lowercase">n8n.cloud</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight leading-[1.15]">
            Seamless web forms powered by your <span className="text-[#ea4b71]">n8n automation</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
            Collect inquiries, service orders, support requests, and structured payloads from this responsive frontend and dispatch them straight into your active n8n execution pipeline.
          </p>

          {/* Connected Endpoint Bar */}
          <div className="mt-6 p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div
                className={`w-2.5 h-2.5 rounded-full mt-1 sm:mt-0 shrink-0 ${
                  health.triggerState === 'active'
                    ? 'bg-emerald-500'
                    : health.triggerState === 'standby'
                    ? 'bg-amber-500 animate-pulse'
                    : health.triggerState === 'checking'
                    ? 'bg-blue-500'
                    : 'bg-zinc-400'
                }`}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <span>Endpoint Target</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-zinc-700">
                    {isTestMode ? 'Form Test Node (Sandbox)' : 'Production Webhook'}
                  </span>
                </div>
                <div className="font-mono-code text-xs text-zinc-800 truncate max-w-[280px] sm:max-w-[420px] md:max-w-[500px]">
                  {currentUrl}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-2.5 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={onRefreshHealth}
                disabled={health.triggerState === 'checking'}
                className="px-2.5 py-1.5 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Ping Endpoint"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${health.triggerState === 'checking' ? 'animate-spin' : ''}`} />
                <span>Ping Status</span>
              </button>
            </div>
          </div>

          {/* Test Mode Note Banner if on standby */}
          {health.triggerState === 'standby' && (
            <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 leading-normal flex items-start gap-2.5">
              <span className="font-bold text-amber-700 shrink-0">n8n Tip:</span>
              <span>
                Your n8n Form trigger is in <strong>test mode</strong>. To capture live submissions in n8n while building, open your n8n workflow editor and click <strong>&quot;Test step&quot;</strong> / <strong>&quot;Execute step&quot;</strong>, then submit the form below. Once satisfied, activate the workflow for permanent live listening!
              </span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onScrollToForm}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg shadow-xs flex items-center gap-2 transition-all hover:translate-y-[-1px]"
            >
              <span>Submit Form Data</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono-code">
              <span>POST application/json</span>
              <span aria-hidden="true">·</span>
              <span>HTTPS Direct & Relay</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
