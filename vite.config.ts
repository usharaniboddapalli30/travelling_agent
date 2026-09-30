import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function n8nApiPlugin(): Plugin {
  return {
    name: 'n8n-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/n8n/')) {
          return next();
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = body ? JSON.parse(body) : {};

            if (req.url === '/api/n8n/health' && req.method === 'POST') {
              const targetUrl = parsed.url;
              if (!targetUrl) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Missing target url' }));
              }
              const start = Date.now();
              const response = await fetch(targetUrl, {
                method: 'GET',
                headers: { 'User-Agent': 'FlowBridge-n8n-Client/1.0' },
              });
              const text = await response.text();
              const duration = Date.now() - start;

              let triggerState: 'active' | 'standby' | 'not_found' | 'error' = 'error';
              let message = '';
              if (text.includes("Form Trigger isn't listening yet") || text.includes("isn't listening yet")) {
                triggerState = 'standby';
                message = 'Workflow is in test mode and waiting for "Execute step" in n8n';
              } else if (response.ok) {
                triggerState = 'active';
                message = 'Workflow trigger is live and listening for submissions';
              } else if (response.status === 404) {
                triggerState = 'not_found';
                message = 'Trigger endpoint returned 404. Check workflow UUID or ensure workflow is active.';
              } else {
                triggerState = 'error';
                message = `HTTP ${response.status}: ${response.statusText}`;
              }

              res.setHeader('Content-Type', 'application/json');
              return res.end(
                JSON.stringify({
                  status: response.status,
                  statusText: response.statusText,
                  triggerState,
                  message,
                  durationMs: duration,
                  hasHtml: text.includes('<html'),
                })
              );
            }

            if (req.url === '/api/n8n/submit' && req.method === 'POST') {
              const { url: targetUrl, payload, format = 'json' } = parsed;
              if (!targetUrl) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Missing target url' }));
              }

              const start = Date.now();
              const fetchHeaders: Record<string, string> = {
                'User-Agent': 'FlowBridge-Web/1.0',
              };
              let fetchBody: string;

              if (format === 'urlencoded') {
                fetchHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
                const searchParams = new URLSearchParams();
                for (const [k, v] of Object.entries(payload || {})) {
                  searchParams.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
                }
                fetchBody = searchParams.toString();
              } else {
                fetchHeaders['Content-Type'] = 'application/json';
                fetchBody = JSON.stringify(payload);
              }

              const response = await fetch(targetUrl, {
                method: 'POST',
                headers: fetchHeaders,
                body: fetchBody,
              });

              const text = await response.text();
              const duration = Date.now() - start;

              let parsedData = null;
              try {
                parsedData = JSON.parse(text);
              } catch {
                // non-json response
              }

              const isStandbyWarning = text.includes("Form Trigger isn't listening yet");

              res.setHeader('Content-Type', 'application/json');
              return res.end(
                JSON.stringify({
                  success: response.ok && !isStandbyWarning,
                  status: response.status,
                  statusText: response.statusText,
                  durationMs: duration,
                  data: parsedData,
                  rawResponse: text.length > 2500 ? text.slice(0, 2500) + '...' : text,
                  isStandbyWarning,
                  notice: isStandbyWarning
                    ? 'Sent to n8n! Notice: n8n Form trigger returned "isn\'t listening yet". In your n8n workflow editor, click "Test step" or "Execute step" (or switch workflow to Active) to record the test run.'
                    : response.ok
                    ? 'Successfully received and processed by n8n workflow!'
                    : `n8n responded with status ${response.status}`,
                })
              );
            }

            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Route not found' }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message || 'Internal proxy error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), n8nApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
