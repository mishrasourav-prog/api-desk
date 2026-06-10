export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HttpStatus = 200 | 201 | 400 | 404 | 500;

export interface SubCardLog {
  id: string;
  timestamp: string;
  method: HttpMethod;
  status: number;
  latency: string;
  ipAddress: string;
  path: string;
}

export interface DeckCardData {
  id: string;
  path: string;
  method: HttpMethod;
  responseStatus: HttpStatus;
  responseBody: string;
  description?: string;
  totalCalls: number;
  createdAt: string;
  logs: SubCardLog[];
}

export interface NewEndpointForm {
  path: string;
  method: HttpMethod;
  responseStatus: HttpStatus;
  responseBody: string;
  description: string;
}

export const STATUS_LABELS: Record<HttpStatus, string> = {
  200: '200 OK',
  201: '201 Created',
  400: '400 Bad Request',
  404: '404 Not Found',
  500: '500 Server Error',
};

export const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: 'text-[#3fb950] bg-[#3fb950]/10 border border-[#238636]',
  POST: 'text-[#d29922] bg-[#d29922]/10 border border-[#9e6a03]',
  PUT: 'text-[#58a6ff] bg-[#58a6ff]/10 border border-[#1f6feb]',
  DELETE: 'text-[#f85149] bg-[#f85149]/10 border border-[#da3633]',
};

export const STATUS_STYLE = (status: number): string => {
  if (status >= 200 && status < 300) return 'text-[#3fb950] bg-[#3fb950]/10 border border-[#238636]';
  if (status >= 400 && status < 500) return 'text-[#d29922] bg-[#d29922]/10 border border-[#9e6a03]';
  if (status >= 500) return 'text-[#f85149] bg-[#f85149]/10 border border-[#da3633]';
  return 'text-[#8b949e] bg-[#8b949e]/10 border border-[#30363d]';
};

export type DeckMethod = "GET" | "POST" | "DELETE" | "PUT";

export type Deck = {
  creator: string;
  path: string;
  method: DeckMethod;
  responseBody: string;
  responseStatus: number;
  createdAt?: string;
  updatedAt?: string;
  _id: string;
};