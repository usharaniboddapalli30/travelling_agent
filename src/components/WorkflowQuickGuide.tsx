import React, { useState } from 'react';
import { BookOpen, CheckSquare, Square, ChevronRight, Zap, Database, Mail, MessageSquare, Bot } from 'lucide-react';

export const WorkflowQuickGuide: React.FC = () => {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepIdx: number) => {
    setCheckedSteps(prev => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const steps = [
    {
      title: 'Open your n8n workflow editor',
      desc: 'Log in to usharaniboddpalli.app.n8n.cloud and open the workflow containing the Form Trigger node (ID: 65f67766-e9cb-4c83-969d-30ba3d698852).',
    },
    {
      title: 'Click "Execute step" on the Form Trigger',
      desc: 'In test mode, the n8n form trigger enters a 120-second listening window awaiting the incoming request.',
    },
    {
      title: 'Submit test data from this FlowBridge portal',
      desc: 'Use the interactive form above and click "Submit to n8n Workflow". n8n will immediately capture all payload fields.',
    },
    {
      title: 'Configure downstream action nodes',
      desc: 'Add nodes like Send Email (Gmail/Outlook), Slack Notification, Google Sheets append, or CRM lead creation.',
    },
    {
      title: 'Activate the workflow for production',
      desc: 'Flip the "Active" toggle switch in the top right of your n8n editor, then switch this portal to "Production" mode.',
    },
  ];

  return (
    <section className="py-12 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span>Implementation Playbook</span>
            <span aria-hidden="true">·</span>
            <span>n8n Integration Guide</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Connecting your workflow end-to-end
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            Follow this interactive checklist to verify test runs and promote your workflow to live production.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Checklist on left (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-100 flex items-center justify-between">
              <span>Setup Checklist</span>
              <span className="text-zinc-600 font-mono-code font-normal">
                {Object.values(checkedSteps).filter(Boolean).length} of {steps.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isDone = checkedSteps[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isDone
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-500'
                        : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-zinc-400">
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold ${isDone ? 'line-through text-zinc-500' : 'text-zinc-900'}`}>
                        Step {idx + 1}: {step.title}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        {step.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Architecture nodes suggestions on right (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Recommended Downstream Integrations
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/70 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-100 text-red-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Email Dispatcher (Gmail/SendGrid)</div>
                    <div className="text-xs text-zinc-600 mt-0.5">
                      Send instantaneous personalized confirmation emails to form submitters.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/70 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Sheets & PostgreSQL Database</div>
                    <div className="text-xs text-zinc-600 mt-0.5">
                      Log every submission row with timestamp, contact data, and custom attributes.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/70 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Team Alerts (Slack / Discord)</div>
                    <div className="text-xs text-zinc-600 mt-0.5">
                      Push urgent notifications to your team channel when high-priority tickets arrive.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/70 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">AI Enrichment & Auto-Response</div>
                    <div className="text-xs text-zinc-600 mt-0.5">
                      Summarize customer inquiries, score leads, or draft AI responses automatically.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
