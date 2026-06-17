/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState} from 'react';
import type { ReactNode} from 'react';
import { useNavigate } from 'react-router-dom';
import type { DeckCardData } from '../types/deck';

interface EndpointContextType {
  endpoints: DeckCardData[];
  onCreateNew: () => void;
  onOpenEndpoint: (card: DeckCardData) => void;
  onDeleteEndpoint: (id: string) => void;
}

const EndpointContext = createContext<EndpointContextType | null>(null);

export function EndpointProvider({ children }: { children: ReactNode }) {
  const [endpoints, setEndpoints] = useState<DeckCardData[]>([]);
  const navigate = useNavigate();

  const onCreateNew = () => {
    navigate('/app/designer');
  };

  const onOpenEndpoint = (card: DeckCardData) => {
    navigate('/app/designer', { state: { card } });
  };

  const onDeleteEndpoint = (id: string) => {
    setEndpoints(prev => prev.filter(ep => ep.id !== id));
  };

  return (
    <EndpointContext.Provider value={{ endpoints, onCreateNew, onOpenEndpoint, onDeleteEndpoint }}>
      {children}
    </EndpointContext.Provider>
  );
}

export const useEndpoints = () => {
  const ctx = useContext(EndpointContext);
  if (!ctx) throw new Error('useEndpoints must be used within EndpointProvider');
  return ctx;
};