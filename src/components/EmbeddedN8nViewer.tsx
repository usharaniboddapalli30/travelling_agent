import React, { useState } from 'react';
import { ExternalLink, RefreshCw, X, ShieldAlert, CheckCircle, Globe } from 'lucide-react';
import { EndpointHealth } from '../types/n8n';

interface EmbeddedN8nViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  health: EndpointHealth;
  onRefreshHealth: () => void;
}

export const EmbeddedN8nViewer: React.FC<EmbeddedN8nViewerProps> = ({
  isOpen,
  onClose,
  url,
  health,
  onRefreshHealth,
}) => {
  const [iframeKey, setIframeKey] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="px-5 py-3.5 bg-zinc-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Globe className="w-4 h-4 text-[#ff5d56] shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                n8n Cloud Webhook Portal
              </div>
              <div className="text-xs font-mono-code text-zinc-200 truncate">
                {url}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIframeKey(k => k + 1);
                onRefreshHealth();
              }}
              className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Refresh Preview"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>Open in Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagnostic Banner */}
        <div className="px-5 py-2.5 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between text-xs text-zinc-700">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                health.triggerState === 'active'
                  ? 'bg-emerald-500'
                  : health.triggerState === 'standby'
                  ? 'bg-amber-500'
                  : 'bg-zinc-400'
              }`}
            />
            <span>
              Trigger Status: <strong>{health.message || 'Waiting for check'}</strong>
            </span>
          </div>

          <div className="text-zinc-500 hidden sm:block font-mono-code text-[11px]">
            Cloudflare SSL Protected
          </div>
        </div>

        {/* Frame & Content Area */}
        <div className="flex-1 bg-zinc-50 relative overflow-hidden min-h-[440px]">
          <iframe
            key={iframeKey}
            src={url}
            title="n8n Live Form Viewer"
            className="w-full h-full border-0"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          />

          {/* Helper overlay for sameorigin/restrictions */}
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-xs border border-zinc-200 rounded-xl shadow-lg flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-600">
              <ShieldAlert className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>
                If n8n displays <em>&quot;isn&apos;t listening yet&quot;</em> or blocks iframe embedding, execute the step in n8n or use our frontend forms directly!
              </span>
            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 shrink-0 flex items-center gap-1"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
