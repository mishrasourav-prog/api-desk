import { useState, useCallback } from 'react';
import type { DeckCardData, HttpMethod, HttpStatus } from '../types/deck';
import { loadEndpoints, saveEndpoints, createNewEndpoint } from '../utils/storage.ts';

export type AppView = 'dashboard' | 'designer';

export interface UseEndpointsReturn {
  endpoints: DeckCardData[];
  selectedEndpoint: DeckCardData | null;
  view: AppView;
  setView: (v: AppView) => void;
  selectEndpoint: (ep: DeckCardData | null) => void;
  addEndpoint: (path: string, method: HttpMethod, status: HttpStatus, body: string, desc: string) => void;
  deleteEndpoint: (id: string) => void;
  clearStorage: () => void;
}

export function useEndpoints(): UseEndpointsReturn {
  const [endpoints, setEndpoints] = useState<DeckCardData[]>(() => loadEndpoints());
  const [selectedEndpoint, setSelectedEndpoint] = useState<DeckCardData | null>(null);
  const [view, setView] = useState<AppView>('dashboard');

  const addEndpoint = useCallback((
    path: string,
    method: HttpMethod,
    status: HttpStatus,
    body: string,
    desc: string,
  ) => {
    const ep = createNewEndpoint(path, method, status, body, desc);
    setEndpoints(prev => {
      const next = [ep, ...prev];
      saveEndpoints(next);
      return next;
    });
  }, []);

  const deleteEndpoint = useCallback((id: string) => {
    setEndpoints(prev => {
      const next = prev.filter(e => e.id !== id);
      saveEndpoints(next);
      return next;
    });
    setSelectedEndpoint(prev => prev?.id === id ? null : prev);
  }, []);

  const selectEndpoint = useCallback((ep: DeckCardData | null) => {
    setSelectedEndpoint(ep);
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem('api_deck_endpoints');
    setEndpoints([]);
    setSelectedEndpoint(null);
  }, []);

  return { endpoints, selectedEndpoint, view, setView, selectEndpoint, addEndpoint, deleteEndpoint, clearStorage };
}