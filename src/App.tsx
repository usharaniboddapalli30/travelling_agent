/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FormSection } from './components/FormSection';
import { PayloadInspector } from './components/PayloadInspector';
import { WorkflowQuickGuide } from './components/WorkflowQuickGuide';
import { FeaturesGrid } from './components/FeaturesGrid';
import { Footer } from './components/Footer';
import { EndpointSettingsModal } from './components/EndpointSettingsModal';
import { EmbeddedN8nViewer } from './components/EmbeddedN8nViewer';
import { EndpointHealth, SubmissionLog } from './types/n8n';

const DEFAULT_N8N_URL = 'https://usharaniboddpalli.app.n8n.cloud/form-test/65f67766-e9cb-4c83-969d-30ba3d698852';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>(() => {
    return localStorage.getItem('n8n_target_url') || DEFAULT_N8N_URL;
  });

  const isTestMode = currentUrl.includes('/form-test/') || currentUrl.includes('/webhook-test/');

  const [health, setHealth] = useState<EndpointHealth>({
    status: null,
    statusText: '',
    triggerState: 'idle',
    message: 'Initializing connection check...',
  });

  const [logs, setLogs] = useState<SubmissionLog[]>(() => {
    try {
      const saved = localStorage.getItem('n8n_submission_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'INIT-DEMO',
        timestamp: new Date().toISOString(),
        url: DEFAULT_N8N_URL,
        method: 'POST',
        format: 'json',
        status: 200,
        statusText: 'OK',
        durationMs: 148,
        payload: {
          fullName: 'Alex Vance',
          email: 'alex.vance@enterprise.io',
          service: 'Workflow Automation',
          company: 'Acro Dynamics',
          budget: '$5,000 - $15,000',
          _source: 'FlowBridge Web Portal',
        },
        responseSnippet: 'Trigger in standby or awaiting execution window in n8n Cloud.',
        isStandbyWarning: true,
        success: true,
        notice: 'Welcome to FlowBridge! Ready to capture your live workflow payloads.',
      }
    ];
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEmbeddedOpen, setIsEmbeddedOpen] = useState(false);

  // Save logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('n8n_submission_logs', JSON.stringify(logs.slice(0, 30)));
    } catch {
      // ignore
    }
  }, [logs]);

  // Ping health of the target endpoint
  const checkEndpointHealth = useCallback(async () => {
    setHealth(prev => ({
      ...prev,
      triggerState: 'checking',
      message: 'Pinging n8n cloud endpoint...',
    }));

    try {
      const res = await fetch('/api/n8n/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: currentUrl }),
      });

      if (!res.ok) {
        throw new Error(`Proxy error ${res.status}`);
      }

      const data = await res.json();
      setHealth({
        status: data.status,
        statusText: data.statusText,
        triggerState: data.triggerState,
        message: data.message,
        durationMs: data.durationMs,
        lastChecked: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      // Fallback: direct client-side fetch attempt
      try {
        const start = Date.now();
        const clientRes = await fetch(currentUrl, { method: 'GET', mode: 'no-cors' });
        setHealth({
          status: 200,
          statusText: 'Reachable (Opaque)',
          triggerState: 'active',
          message: 'Endpoint is reachable via direct client request',
          durationMs: Date.now() - start,
          lastChecked: new Date().toLocaleTimeString(),
        });
      } catch {
        setHealth({
          status: 500,
          statusText: 'Unreachable',
          triggerState: 'error',
          message: err.message || 'Failed to reach n8n endpoint. Check internet or workflow ID.',
          lastChecked: new Date().toLocaleTimeString(),
        });
      }
    }
  }, [currentUrl]);

  // Check health on mount or when currentUrl changes
  useEffect(() => {
    checkEndpointHealth();
  }, [checkEndpointHealth]);

  const handleToggleMode = (targetIsTest: boolean) => {
    let nextUrl = currentUrl;
    if (targetIsTest) {
      nextUrl = nextUrl.replace('/form/', '/form-test/').replace('/webhook/', '/webhook-test/');
    } else {
      nextUrl = nextUrl.replace('/form-test/', '/form/').replace('/webhook-test/', '/webhook/');
    }
    setCurrentUrl(nextUrl);
    localStorage.setItem('n8n_target_url', nextUrl);
  };

  const handleSaveUrl = (newUrl: string) => {
    setCurrentUrl(newUrl);
    localStorage.setItem('n8n_target_url', newUrl);
  };

  const handleSubmitPayload = async (
    payload: Record<string, any>,
    format: 'json' | 'urlencoded'
  ): Promise<SubmissionLog> => {
    const startTime = Date.now();
    let newLog: SubmissionLog;

    try {
      const response = await fetch('/api/n8n/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: currentUrl,
          payload,
          format,
        }),
      });

      const result = await response.json();
      const duration = result.durationMs || (Date.now() - startTime);

      newLog = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        url: currentUrl,
        method: 'POST',
        format,
        status: result.status || (response.ok ? 200 : 500),
        statusText: result.statusText || 'OK',
        durationMs: duration,
        payload,
        responseSnippet: typeof result.rawResponse === 'string'
          ? result.rawResponse.slice(0, 300)
          : (result.data ? JSON.stringify(result.data).slice(0, 300) : 'Transmission confirmed'),
        isStandbyWarning: !!result.isStandbyWarning,
        success: !!result.success,
        notice: result.notice,
      };
    } catch (err: any) {
      // Fallback: Direct submit if API proxy encounters unexpected error
      try {
        let body: string;
        let contentType: string;
        if (format === 'urlencoded') {
          contentType = 'application/x-www-form-urlencoded';
          const searchParams = new URLSearchParams();
          for (const [k, v] of Object.entries(payload)) {
            searchParams.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
          }
          body = searchParams.toString();
        } else {
          contentType = 'application/json';
          body = JSON.stringify(payload);
        }

        await fetch(currentUrl, {
          method: 'POST',
          headers: { 'Content-Type': contentType },
          body,
          mode: 'no-cors',
        });

        newLog = {
          id: `TX-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString(),
          url: currentUrl,
          method: 'POST',
          format,
          status: 200,
          statusText: 'Dispatched (Opaque CORS)',
          durationMs: Date.now() - startTime,
          payload,
          responseSnippet: 'Sent directly via client-side fetch. Check your n8n workflow execution log.',
          isStandbyWarning: false,
          success: true,
          notice: 'Dispatched to n8n directly from browser.',
        };
      } catch (clientErr: any) {
        newLog = {
          id: `TX-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString(),
          url: currentUrl,
          method: 'POST',
          format,
          status: 500,
          statusText: 'Failed',
          durationMs: Date.now() - startTime,
          payload,
          responseSnippet: clientErr.message || 'Direct transmission failed',
          isStandbyWarning: false,
          success: false,
          notice: 'Could not send payload to target URL.',
        };
      }
    }

    setLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const handleClearLogs = () => {
    setLogs([]);
    localStorage.removeItem('n8n_submission_logs');
  };

  const handleScrollToForm = () => {
    const el = document.getElementById('form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentUrl={currentUrl}
        isTestMode={isTestMode}
        onToggleMode={handleToggleMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        health={health}
        onOpenEmbedded={() => setIsEmbeddedOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          currentUrl={currentUrl}
          isTestMode={isTestMode}
          health={health}
          onRefreshHealth={checkEndpointHealth}
          onScrollToForm={handleScrollToForm}
        />

        {/* Interactive Form Section */}
        <FormSection
          currentUrl={currentUrl}
          isTestMode={isTestMode}
          onSubmit={handleSubmitPayload}
        />

        {/* Payload Inspector & Activity History */}
        <PayloadInspector
          logs={logs}
          onClearLogs={handleClearLogs}
          onReplaySubmission={handleSubmitPayload}
        />

        {/* Step-by-Step Workflow Guide */}
        <WorkflowQuickGuide />

        {/* Architecture & Features */}
        <FeaturesGrid />
      </main>

      {/* Footer */}
      <Footer currentUrl={currentUrl} />

      {/* Settings Modal */}
      <EndpointSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={currentUrl}
        onSaveUrl={handleSaveUrl}
        health={health}
        onCheckHealth={checkEndpointHealth}
      />

      {/* Live Embedded n8n Viewer Modal */}
      <EmbeddedN8nViewer
        isOpen={isEmbeddedOpen}
        onClose={() => setIsEmbeddedOpen(false)}
        url={currentUrl}
        health={health}
        onRefreshHealth={checkEndpointHealth}
      />
    </div>
  );
}
