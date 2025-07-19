import React from 'react';
import { LanguageContext, useLanguageHook } from '../hooks/useLanguage';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const languageValue = useLanguageHook();

  return (
    <LanguageContext.Provider value={languageValue}>
      {children}
    </LanguageContext.Provider>
  );
}