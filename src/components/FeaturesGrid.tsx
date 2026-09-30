import React from 'react';
import { Layers, ShieldCheck, Zap, Server, Sliders, Cpu } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Direct Cloud Dispatch',
      desc: 'Submissions are piped directly into your hosted n8n trigger URL without intermediate storage bloat.',
    },
    {
      icon: Sliders,
      title: 'Configurable Dynamic Schemas',
      desc: 'Adapt form fields on the fly to match whatever input variables your n8n workflow nodes require.',
    },
    {
      icon: Server,
      title: 'Dual Mode Sandboxing',
      desc: 'Seamlessly switch between test listening mode for workflow debugging and production mode for 24/7 intake.',
    },
    {
      icon: Layers,
      title: 'Multi-Destination Fanout',
      desc: 'Let n8n distribute intake payloads simultaneously across your CRM, email responder, and internal dashboards.',
    },
    {
      icon: Cpu,
      title: 'Built-in Latency & Header Telemetry',
      desc: 'Monitor execution roundtrip times, HTTP response statuses, and incoming payload signatures in real time.',
    },
    {
      icon: ShieldCheck,
      title: 'CORS-Safe Server Proxying',
      desc: 'Avoid browser cross-origin blocks with our integrated backend relay that guarantees reliable delivery.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            <span>Architectural Strengths</span>
            <span aria-hidden="true">·</span>
            <span>Why Automate with n8n</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Designed for robust, automated intake workflows
          </h2>
          <p className="mt-2 text-base text-zinc-600">
            Combine modern frontend form design with the limitless orchestration capabilities of your n8n automation engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-zinc-50/60 hover:bg-zinc-50 border border-zinc-200 rounded-2xl transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-2xs mb-4">
                  <Icon className="w-5 h-5 text-[#ea4b71]" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
