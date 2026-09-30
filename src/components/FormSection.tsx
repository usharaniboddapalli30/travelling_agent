import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Plus, Trash2, Code2, RotateCcw, Sparkles } from 'lucide-react';
import { CustomField, FormTemplateType, SubmissionLog } from '../types/n8n';

interface FormSectionProps {
  currentUrl: string;
  isTestMode: boolean;
  onSubmit: (payload: Record<string, any>, format: 'json' | 'urlencoded') => Promise<SubmissionLog>;
}

const DEFAULT_INQUIRY_STATE = {
  fullName: 'Alex Vance',
  email: 'alex.vance@enterprise.io',
  company: 'Acro Dynamics',
  phone: '+1 (555) 389-2041',
  service: 'Workflow Automation',
  budget: '$5,000 - $15,000',
  message: 'We are seeking an automated pipeline connected to our n8n instance to route incoming leads directly to Slack and HubSpot.',
};

const DEFAULT_SUPPORT_STATE = {
  customerName: 'Morgan Reid',
  email: 'm.reid@cloudtech.org',
  priority: 'High',
  category: 'Integration Issue',
  subject: 'Webhook trigger latency inspection',
  description: 'Observing sporadic delays when dispatching bulk webhook payloads to our workflow instance. Need log audit.',
};

export const FormSection: React.FC<FormSectionProps> = ({
  currentUrl,
  isTestMode,
  onSubmit,
}) => {
  const [template, setTemplate] = useState<FormTemplateType>('inquiry');
  const [format, setFormat] = useState<'json' | 'urlencoded'>('json');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<SubmissionLog | null>(null);

  // Inquiry form fields
  const [inquiryData, setInquiryData] = useState(DEFAULT_INQUIRY_STATE);

  // Support ticket fields
  const [supportData, setSupportData] = useState(DEFAULT_SUPPORT_STATE);

  // Custom Schema fields
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: '1', name: 'clientName', label: 'Client Name', type: 'text', defaultValue: 'Jordan Lee', required: true },
    { id: '2', name: 'emailAddress', label: 'Email Address', type: 'email', defaultValue: 'jordan@innovate.co', required: true },
    { id: '3', name: 'projectType', label: 'Project Type', type: 'select', options: ['AI Integration', 'Data Sync', 'Web Scraping', 'Custom Bot'], defaultValue: 'AI Integration', required: true },
    { id: '4', name: 'notes', label: 'Additional Notes', type: 'textarea', defaultValue: 'Please trigger the n8n execution pipeline once received.', required: false },
  ]);
  const [customData, setCustomData] = useState<Record<string, any>>({
    clientName: 'Jordan Lee',
    emailAddress: 'jordan@innovate.co',
    projectType: 'AI Integration',
    notes: 'Please trigger the n8n execution pipeline once received.',
  });

  // Calculate current payload based on selected template
  const getCurrentPayload = (): Record<string, any> => {
    const baseMeta = {
      _source: 'FlowBridge Web Portal',
      _submittedAt: new Date().toISOString(),
      _mode: isTestMode ? 'test' : 'production',
    };

    if (template === 'inquiry') {
      return { ...inquiryData, ...baseMeta };
    }
    if (template === 'support') {
      return { ...supportData, ...baseMeta };
    }
    return { ...customData, ...baseMeta };
  };

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInquiryData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSupportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSupportData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCustomChange = (name: string, value: any) => {
    setCustomData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomField = () => {
    const id = Date.now().toString();
    const newName = `customField_${customFields.length + 1}`;
    setCustomFields(prev => [
      ...prev,
      {
        id,
        name: newName,
        label: `Field ${customFields.length + 1}`,
        type: 'text',
        defaultValue: '',
        required: false,
      }
    ]);
    setCustomData(prev => ({ ...prev, [newName]: '' }));
  };

  const handleRemoveCustomField = (id: string, name: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
    setCustomData(prev => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleResetToDefaults = () => {
    if (template === 'inquiry') setInquiryData(DEFAULT_INQUIRY_STATE);
    if (template === 'support') setSupportData(DEFAULT_SUPPORT_STATE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = getCurrentPayload();
      const log = await onSubmit(payload, format);
      setLastSubmission(log);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPayload = getCurrentPayload();

  return (
    <section id="form-section" className="py-12 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              <span>Interactive Form Dispatcher</span>
              <span aria-hidden="true">·</span>
              <span>Direct n8n Hook</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Submit Form to your n8n Workflow
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Fill out this responsive form to trigger your n8n workflow. The data is securely routed to your endpoint.
            </p>
          </div>

          {/* Form Template Tabs (Segmented Buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-zinc-200 rounded-xl shadow-xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setTemplate('inquiry')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                template === 'inquiry'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Business Inquiry
            </button>
            <button
              type="button"
              onClick={() => setTemplate('support')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                template === 'support'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Support Ticket
            </button>
            <button
              type="button"
              onClick={() => setTemplate('custom')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                template === 'custom'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Custom Schema Builder
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Box (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl shadow-xs p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ea4b71]" />
                <span className="text-sm font-bold text-zinc-900">
                  {template === 'inquiry' && 'Enterprise Inquiry Form'}
                  {template === 'support' && 'Support & Incident Report'}
                  {template === 'custom' && 'Custom Configurable Schema'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1 transition-colors"
                  title="Reset sample values"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>

                <span className="text-zinc-200">|</span>

                {/* Content Type Selector */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-zinc-400">Encoding:</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'json' | 'urlencoded')}
                    aria-label="Encoding format"
                    className="text-xs font-mono-code bg-zinc-50 border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-700"
                  >
                    <option value="json">JSON</option>
                    <option value="urlencoded">URL Encoded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submission Status Notice */}
            {lastSubmission && (
              <div
                className={`mb-6 p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                  lastSubmission.isStandbyWarning
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : lastSubmission.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                }`}
              >
                {lastSubmission.isStandbyWarning ? (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : lastSubmission.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <span>
                      {lastSubmission.isStandbyWarning
                        ? 'Sent to n8n (Standby Response Received)'
                        : lastSubmission.success
                        ? 'Dispatched Successfully to n8n'
                        : `Response Received: HTTP ${lastSubmission.status}`}
                    </span>
                    <span className="text-zinc-400 font-mono-code font-normal">
                      · {lastSubmission.durationMs}ms
                    </span>
                  </div>
                  <p className="mt-1 text-zinc-600">
                    {lastSubmission.notice || lastSubmission.responseSnippet}
                  </p>
                </div>
              </div>
            )}

            {/* Form Component */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {template === 'inquiry' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={inquiryData.fullName}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                        placeholder="e.g. Jane Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Work Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={inquiryData.email}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={inquiryData.company}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                        placeholder="Company Inc."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={inquiryData.phone}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Service Interest
                      </label>
                      <select
                        name="service"
                        value={inquiryData.service}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                      >
                        <option value="Workflow Automation">Workflow Automation</option>
                        <option value="CRM & ERP Synchronization">CRM & ERP Synchronization</option>
                        <option value="AI Workflow & Extraction">AI Workflow & Extraction</option>
                        <option value="Custom API Webhooks">Custom API Webhooks</option>
                        <option value="Database Ingestion">Database Ingestion</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Budget Range
                      </label>
                      <select
                        name="budget"
                        value={inquiryData.budget}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                      >
                        <option value="Under $5,000">Under $5,000</option>
                        <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                        <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                        <option value="$50,000+">$50,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Project Details / Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      required
                      value={inquiryData.message}
                      onChange={handleInquiryChange}
                      className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors resize-y"
                      placeholder="Describe what you want to automate..."
                    />
                  </div>
                </>
              )}

              {template === 'support' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Submitter Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={supportData.customerName}
                        onChange={handleSupportChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={supportData.email}
                        onChange={handleSupportChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={supportData.priority}
                        onChange={handleSupportChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                      >
                        <option value="Low">Low (General Inquiry)</option>
                        <option value="Medium">Medium (Minor Bug)</option>
                        <option value="High">High (Workflow Degraded)</option>
                        <option value="Urgent">Urgent (Production Down)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        value={supportData.category}
                        onChange={handleSupportChange}
                        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                      >
                        <option value="Integration Issue">Integration Issue</option>
                        <option value="Authentication & Keys">Authentication & Keys</option>
                        <option value="Billing & Tier">Billing & Tier</option>
                        <option value="Webhook Timeout">Webhook Timeout</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={supportData.subject}
                      onChange={handleSupportChange}
                      className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      required
                      value={supportData.description}
                      onChange={handleSupportChange}
                      className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors resize-y"
                    />
                  </div>
                </>
              )}

              {template === 'custom' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                    <span>
                      Add or modify field keys to match the exact input variables expected in your n8n workflow node.
                    </span>
                    <button
                      type="button"
                      onClick={handleAddCustomField}
                      className="px-2.5 py-1 text-xs font-semibold text-zinc-900 bg-white border border-zinc-300 rounded-md hover:bg-zinc-100 flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Field</span>
                    </button>
                  </div>

                  {customFields.map((field) => (
                    <div key={field.id} className="p-3 bg-zinc-50/70 border border-zinc-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setCustomFields(prev => prev.map(f => f.id === field.id ? { ...f, name: newName } : f));
                              setCustomData(prev => {
                                const copy = { ...prev };
                                const val = copy[field.name];
                                delete copy[field.name];
                                copy[newName] = val;
                                return copy;
                              });
                            }}
                            className="font-mono-code text-xs font-semibold text-zinc-900 bg-white border border-zinc-300 rounded px-2 py-0.5 focus:border-zinc-900"
                            placeholder="field_key"
                          />
                          <span className="text-zinc-400 text-xs font-mono-code">({field.type})</span>
                        </div>

                        {customFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(field.id, field.name)}
                            className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {field.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          value={customData[field.name] || ''}
                          onChange={(e) => handleCustomChange(field.name, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                          placeholder={`Enter value for ${field.name}...`}
                        />
                      ) : field.type === 'select' && field.options ? (
                        <select
                          value={customData[field.name] || ''}
                          onChange={(e) => handleCustomChange(field.name, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                        >
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={customData[field.name] || ''}
                          onChange={(e) => handleCustomChange(field.name, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
                          placeholder={`Enter value for ${field.name}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Submit CTA Bar */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100">
                <div className="text-xs text-zinc-500 font-mono-code truncate max-w-xs">
                  <span>Target: </span>
                  <span className="font-semibold text-zinc-700">{isTestMode ? '/form-test' : '/form'}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#ea4b71] hover:bg-[#d93a61] text-white text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-bounce' : ''}`} />
                  <span>{isSubmitting ? 'Transmitting to n8n...' : 'Submit to n8n Workflow'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Payload & Transmission Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Outgoing Payload Box */}
            <div className="bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#ff5d56]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Live Payload Preview
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-zinc-400">
                  {format.toUpperCase()} · POST
                </span>
              </div>

              <pre className="font-mono-code text-xs text-emerald-400/90 overflow-x-auto max-h-[300px] leading-relaxed p-3 bg-zinc-950/80 rounded-lg border border-zinc-800/80">
                {JSON.stringify(currentPayload, null, 2)}
              </pre>

              <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Payload keys: {Object.keys(currentPayload).length}</span>
                <span>Size: ~{JSON.stringify(currentPayload).length} bytes</span>
              </div>
            </div>

            {/* Quick n8n Execution Helper Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ea4b71]" />
                <span>How your n8n workflow works</span>
              </h3>

              <ol className="space-y-2.5 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="font-mono-code font-bold text-zinc-900 bg-zinc-100 rounded px-1.5 py-0.5">1</span>
                  <span><strong>Form Trigger Node:</strong> Receives the request with full schema fields shown above.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono-code font-bold text-zinc-900 bg-zinc-100 rounded px-1.5 py-0.5">2</span>
                  <span><strong>Test vs Live:</strong> In Test Mode, click <em>&quot;Execute step&quot;</em> in n8n before sending.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono-code font-bold text-zinc-900 bg-zinc-100 rounded px-1.5 py-0.5">3</span>
                  <span><strong>Downstream Nodes:</strong> You can route data to Google Sheets, Slack, Gmail, or Postgres.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
