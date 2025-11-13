'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registado com sucesso:', registration.scope);
          })
          .catch((error) => {
            console.error('Erro ao registar Service Worker:', error);
          });
      });
    }
  }, []);

  return null;
}
