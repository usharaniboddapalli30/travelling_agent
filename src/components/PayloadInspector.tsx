import React, { useState } from 'react';
import { History, CheckCircle2, AlertCircle, Copy, Check, Terminal, Trash2, ArrowRight, Clock } from 'lucide-react';
import { SubmissionLog } from '../types/n8n';

interface PayloadInspectorProps {
  logs: SubmissionLog[];
  onClearLogs: () => void;
  onReplaySubmission: (payload: Record<string, any>, format: 'json' | 'urlencoded') => void;
}

export const PayloadInspector: React.FC<PayloadInspectorProps> = ({
  logs,
  onClearLogs,
  onReplaySubmission,
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(logs[0]?.id || null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Sync selected log when logs update if none selected
  const activeLog = logs.find(l => l.id === selectedLogId) || logs[0] || null;

  const generateCurlCommand = (log: SubmissionLog) => {
    const headers = log.format === 'urlencoded'
      ? '-H "Content-Type: application/x-www-form-urlencoded"'
      : '-H "Content-Type: application/json"';
    const data = log.format === 'urlencoded'
      ? new URLSearchParams(log.payload).toString()
      : JSON.stringify(log.payload);

    return `curl -X POST "${log.url}" \\\n  ${headers} \\\n  -d '${data}'`;
  };

  const handleCopyCurl = (log: SubmissionLog) => {
    const cmd = generateCurlCommand(log);
    navigator.clipboard.writeText(cmd);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <section className="py-12 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              <span>Telemetry & Audit Log</span>
              <span aria-hidden="true">·</span>
              <span>Submissions Pipeline</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Execution History & Payload Inspector
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <button
                type="button"
                onClick={onClearLogs}
                className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History ({logs.length})</span>
              </button>
            )}
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl">
            <History className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-700">No submissions recorded yet</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Submit the form above to record request payloads, response statuses, and execution latencies in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left list of submissions (5 cols) */}
            <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {logs.map((log) => {
                const isSelected = activeLog?.id === log.id;
                return (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => setSelectedLogId(log.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {log.isStandbyWarning ? (
                          <AlertCircle className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-amber-600'}`} />
                        ) : log.success ? (
                          <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        ) : (
                          <AlertCircle className={`w-4 h-4 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`} />
                        )}
                        <span className="text-xs font-bold font-mono-code">
                          HTTP {log.status || 200}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono-code opacity-75">
                        <Clock className="w-3 h-3" />
                        <span>{log.durationMs}ms</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="truncate max-w-[200px]">
                        {log.payload.fullName || log.payload.customerName || log.payload.clientName || 'Payload data'}
                      </span>
                      <span className="text-[11px] opacity-70 font-mono-code">
                        {log.timestamp.split('T')[1]?.slice(0, 8)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right log detail (7 cols) */}
            {activeLog && (
              <div className="lg:col-span-7 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span>Transmission Record</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-code">{activeLog.id}</span>
                    </div>
                    <div className="font-bold text-zinc-900 text-sm mt-0.5">
                      Target: <span className="font-mono-code font-normal text-xs text-zinc-600">{activeLog.url}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCurl(activeLog)}
                      className="px-2.5 py-1 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 flex items-center gap-1 shadow-2xs"
                      title="Copy curl command"
                    >
                      {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Terminal className="w-3.5 h-3.5" />}
                      <span>{copiedCurl ? 'Copied cURL' : 'cURL'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onReplaySubmission(activeLog.payload, activeLog.format)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 flex items-center gap-1 shadow-2xs"
                      title="Replay this exact payload"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Re-send</span>
                    </button>
                  </div>
                </div>

                {/* Status Notice */}
                {activeLog.isStandbyWarning && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <strong>n8n Cloud Trigger Standby:</strong> The test node received this request, but n8n returned its standby page. To record it inside n8n, click <em>&quot;Execute step&quot;</em> in your workflow and hit Re-send!
                  </div>
                )}

                {/* Sent Payload */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Sent Payload ({activeLog.format})
                  </label>
                  <pre className="p-3 bg-zinc-900 text-zinc-100 rounded-xl font-mono-code text-xs overflow-x-auto max-h-[160px]">
                    {JSON.stringify(activeLog.payload, null, 2)}
                  </pre>
                </div>

                {/* Response Body Snippet */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    n8n Response Snippet
                  </label>
                  <pre className="p-3 bg-white border border-zinc-200 rounded-xl font-mono-code text-xs text-zinc-700 overflow-x-auto max-h-[140px]">
                    {activeLog.responseSnippet || 'No response body'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
