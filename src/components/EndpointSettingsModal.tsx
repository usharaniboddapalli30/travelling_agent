import React, { useState } from 'react';
import { X, Check, Save, RotateCcw, HelpCircle, Globe, Zap } from 'lucide-react';
import { EndpointHealth } from '../types/n8n';

interface EndpointSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (newUrl: string) => void;
  health: EndpointHealth;
  onCheckHealth: () => void;
}

const PRESET_TEST = 'https://usharaniboddpalli.app.n8n.cloud/form-test/65f67766-e9cb-4c83-969d-30ba3d698852';
const PRESET_PROD = 'https://usharaniboddpalli.app.n8n.cloud/form/65f67766-e9cb-4c83-969d-30ba3d698852';
const PRESET_WEBHOOK_TEST = 'https://usharaniboddpalli.app.n8n.cloud/webhook-test/65f67766-e9cb-4c83-969d-30ba3d698852';
const PRESET_WEBHOOK_PROD = 'https://usharaniboddpalli.app.n8n.cloud/webhook/65f67766-e9cb-4c83-969d-30ba3d698852';

export const EndpointSettingsModal: React.FC<EndpointSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  health,
  onCheckHealth,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onSaveUrl(urlInput.trim());
      onClose();
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrlInput(presetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ea4b71]" />
            <h3 className="font-bold text-zinc-900 text-base">n8n Connection Configuration</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Endpoint URL (n8n Form / Webhook)
            </label>
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-mono-code bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              placeholder="https://..."
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Form submissions from the portal will be dispatched to this target.
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-xs font-semibold text-zinc-600 mb-2">Preset Routing Options</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset(PRESET_TEST)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                  urlInput === PRESET_TEST
                    ? 'border-zinc-900 bg-zinc-50 font-semibold text-zinc-900'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <div className="font-medium text-xs">Form Test (Sandbox)</div>
                <div className="text-[11px] text-zinc-400 font-mono-code truncate">/form-test/...</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(PRESET_PROD)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                  urlInput === PRESET_PROD
                    ? 'border-zinc-900 bg-zinc-50 font-semibold text-zinc-900'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <div className="font-medium text-xs">Form Production (Live)</div>
                <div className="text-[11px] text-zinc-400 font-mono-code truncate">/form/...</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(PRESET_WEBHOOK_TEST)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                  urlInput === PRESET_WEBHOOK_TEST
                    ? 'border-zinc-900 bg-zinc-50 font-semibold text-zinc-900'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <div className="font-medium text-xs">Webhook Test Node</div>
                <div className="text-[11px] text-zinc-400 font-mono-code truncate">/webhook-test/...</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(PRESET_WEBHOOK_PROD)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                  urlInput === PRESET_WEBHOOK_PROD
                    ? 'border-zinc-900 bg-zinc-50 font-semibold text-zinc-900'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <div className="font-medium text-xs">Webhook Production</div>
                <div className="text-[11px] text-zinc-400 font-mono-code truncate">/webhook/...</div>
              </button>
            </div>
          </div>

          {/* Test Status Check */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs">
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
              <span className="text-zinc-600 truncate max-w-xs">{health.message}</span>
            </div>

            <button
              type="button"
              onClick={onCheckHealth}
              className="text-xs font-semibold text-zinc-800 hover:underline shrink-0"
            >
              Ping Now
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
