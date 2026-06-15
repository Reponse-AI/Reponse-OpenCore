import React, { createContext, useContext, useMemo } from 'react';
import { Reponse, type ReponseOptions } from '@reponseai/sdk';

const ReponseContext = createContext<Reponse | null>(null);

export function ReponseProvider({
  children,
  ...options
}: ReponseOptions & { children: React.ReactNode }) {
  const client = useMemo(
    () => new Reponse(options),
    [options.apiKey, options.baseUrl],
  );

  return (
    <ReponseContext.Provider value={client}>{children}</ReponseContext.Provider>
  );
}

export function useReponse(): Reponse {
  const client = useContext(ReponseContext);
  if (!client) {
    throw new Error('useReponse must be used within a <ReponseProvider>');
  }
  return client;
}
