import type { DeckCardData, HttpMethod, HttpStatus } from '../types/deck';

const STORAGE_KEY = 'api_deck_endpoints';

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function generateTimestamp(): string {
  return new Date().toISOString();
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour12: false }) + ' · ' +
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function generateIp(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

export function generateLatency(): string {
  return `${Math.floor(Math.random() * 120) + 4}ms`;
}

export const INITIAL_MOCK_DATA: DeckCardData[] = [
  {
    id: 'deck-001',
    path: 'users/profile',
    method: 'GET',
    responseStatus: 200,
    responseBody: JSON.stringify({ id: 'usr_9a2f', name: 'Arjun Sharma', email: 'arjun@devhq.io', role: 'admin', verified: true }, null, 2),
    description: 'Returns authenticated user profile object',
    totalCalls: 1420,
    createdAt: '2025-11-10T08:30:00.000Z',
    logs: [
      { id: 'l1', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), method: 'GET', status: 200, latency: '12ms', ipAddress: '192.168.1.42', path: 'users/profile' },
      { id: 'l2', timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), method: 'GET', status: 200, latency: '9ms', ipAddress: '10.0.0.87', path: 'users/profile' },
      { id: 'l3', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), method: 'GET', status: 200, latency: '18ms', ipAddress: '203.0.113.5', path: 'users/profile' },
    ],
  },
  {
    id: 'deck-002',
    path: 'auth/login',
    method: 'POST',
    responseStatus: 200,
    responseBody: JSON.stringify({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOWEyZiJ9.sig', expiresIn: 3600, tokenType: 'Bearer' }, null, 2),
    description: 'Issues JWT access token on valid credentials',
    totalCalls: 3842,
    createdAt: '2025-11-09T14:00:00.000Z',
    logs: [
      { id: 'l4', timestamp: new Date(Date.now() - 1000 * 30).toISOString(), method: 'POST', status: 200, latency: '34ms', ipAddress: '192.168.0.1', path: 'auth/login' },
      { id: 'l5', timestamp: new Date(Date.now() - 1000 * 90).toISOString(), method: 'POST', status: 200, latency: '27ms', ipAddress: '172.16.0.5', path: 'auth/login' },
    ],
  },
  {
    id: 'deck-003',
    path: 'products/:id',
    method: 'PUT',
    responseStatus: 200,
    responseBody: JSON.stringify({ id: 'prod_x8k2', name: 'NeuralKit SDK', price: 49.99, updated: true, version: '2.4.1' }, null, 2),
    description: 'Updates a product record by ID',
    totalCalls: 587,
    createdAt: '2025-11-08T10:15:00.000Z',
    logs: [
      { id: 'l6', timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(), method: 'PUT', status: 200, latency: '22ms', ipAddress: '198.51.100.14', path: 'products/:id' },
    ],
  },
  {
    id: 'deck-004',
    path: 'sessions/:token',
    method: 'DELETE',
    responseStatus: 200,
    responseBody: JSON.stringify({ success: true, message: 'Session revoked', revokedAt: '2025-11-10T12:00:00Z' }, null, 2),
    description: 'Revokes an active session token',
    totalCalls: 214,
    createdAt: '2025-11-07T16:45:00.000Z',
    logs: [
      { id: 'l7', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), method: 'DELETE', status: 200, latency: '8ms', ipAddress: '10.10.10.2', path: 'sessions/:token' },
      { id: 'l8', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), method: 'DELETE', status: 200, latency: '11ms', ipAddress: '10.10.10.9', path: 'sessions/:token' },
    ],
  },
  {
    id: 'deck-005',
    path: 'webhooks/register',
    method: 'POST',
    responseStatus: 201,
    responseBody: JSON.stringify({ id: 'wh_7q9r', url: 'https://example.com/hook', events: ['push', 'pr.merged'], active: true }, null, 2),
    description: 'Registers a new webhook endpoint',
    totalCalls: 98,
    createdAt: '2025-11-06T09:00:00.000Z',
    logs: [],
  },
  {
    id: 'deck-006',
    path: 'admin/users/:id',
    method: 'GET',
    responseStatus: 404,
    responseBody: JSON.stringify({ error: 'UserNotFound', message: 'No user with the given ID exists.', code: 'E_USER_404' }, null, 2),
    description: 'Simulates a not-found admin lookup',
    totalCalls: 33,
    createdAt: '2025-11-05T11:30:00.000Z',
    logs: [
      { id: 'l9', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), method: 'GET', status: 404, latency: '6ms', ipAddress: '185.220.101.44', path: 'admin/users/:id' },
    ],
  },
];

export function loadEndpoints(): DeckCardData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_MOCK_DATA;
    const parsed = JSON.parse(raw) as DeckCardData[];
    return parsed.length > 0 ? parsed : INITIAL_MOCK_DATA;
  } catch {
    return INITIAL_MOCK_DATA;
  }
}

export function saveEndpoints(data: DeckCardData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function buildMockUrl(creator: string, path: string) {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  if (!baseURL) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseURL}/mock/${creator}${cleanPath}`;
}

export function createNewEndpoint(
  path: string,
  method: HttpMethod,
  responseStatus: HttpStatus,
  responseBody: string,
  description: string
): DeckCardData {
  return {
    id: `deck-${generateId()}`,
    path,
    method,
    responseStatus,
    responseBody,
    description,
    totalCalls: 0,
    createdAt: generateTimestamp(),
    logs: [],
  };
}