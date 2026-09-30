export type FormTemplateType = 'inquiry' | 'support' | 'custom';

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
}

export interface SubmissionLog {
  id: string;
  timestamp: string;
  url: string;
  method: string;
  format: 'json' | 'urlencoded';
  status: number;
  statusText: string;
  durationMs: number;
  payload: Record<string, any>;
  responseSnippet: string;
  isStandbyWarning: boolean;
  success: boolean;
  notice?: string;
}

export interface EndpointHealth {
  status: number | null;
  statusText: string;
  triggerState: 'active' | 'standby' | 'not_found' | 'error' | 'checking' | 'idle';
  message: string;
  durationMs?: number;
  lastChecked?: string;
}
