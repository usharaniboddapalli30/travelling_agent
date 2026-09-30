import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';

interface FooterProps {
  currentUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ currentUrl }) => {
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-10 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 text-[#ff5d56]" />
            </div>
            <div>
              <span className="font-bold text-white text-base">FlowBridge</span>
              <span className="text-zinc-600 mx-2">/</span>
              <span className="text-xs text-zinc-400">n8n Cloud Automation Hub</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-zinc-400">
            <span>Workflow: 65f67766-e9cb-4c83-969d-30ba3d698852</span>
            <span className="text-zinc-700">·</span>
            <a
              href="https://usharaniboddpalli.app.n8n.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff5d56] hover:underline flex items-center gap-1"
            >
              <span>usharaniboddpalli.app.n8n.cloud</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            Built for seamless autonomous workflow orchestration with n8n.
          </div>
          <div className="flex items-center gap-3">
            <span>End-to-End JSON Payload Transmission</span>
            <span className="text-zinc-700">·</span>
            <span>Zero CORS Interference</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
